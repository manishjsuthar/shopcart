var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var path = require('path');
var bcrypt = require('bcryptjs')


var Product = require('../models/product');

var Order = require('../models/order');
var Enquiry = require('../models/enquiryform');
var User = require('../models/user')

router.get('/enquiry', function (req, res, next) {
  res.render('home/enquiry', { title: 'Sparekart' });
});

router.post('/enquiry', async (req, res) => {
  try {
    const sendedEnquiry = new Enquiry({
      efname: req.body.efname,
      elname: req.body.elname,
      ephone: req.body.ephone,
      eemail: req.body.eemail,
      emessage: req.body.emessage
    });
    
    const sendEnquiry = await sendedEnquiry.save();
    res.status(201).render('home/index');
  } catch (error) {
    res.status(400).send('error');
  }
});

router.get('/profile', isLoggedIn, function (req, res, next) {
  var cart = new Cart(req.session.cart);
  res.render('user/profile', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/contact', function (req, res, next) {
  res.render('home/contact', { title: 'Sparekart' });
});

router.get('/shipping-detail', function (req, res, next) {
  res.render('home/shipping-detail', { title: 'Sparekart' });
});

router.get('/', function (req, res, next) {
  res.render('home/index', { title: 'Sparekart' });
});


/* GET home page. */
router.get('/spare', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('home/spare', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  }).lean();
});

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/spare');
  });
});

router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('home/shopping-cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('home/shopping-cart', { products: cart.generateArray(), totalQty: cart.totalQty , totalPrice: cart.totalPrice });
});


router.get('/checkout', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('home/checkout', { products: cart.generateArray(), total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});

router.post('/checkout', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_51IgG50SCImLsYbQXHhnEZYRB9cv7HdWmLToM7aw6MQtwXBm3fNyOLeavYxmCUFKry5EIW6PPbmFurZO78ofdYhnd00WL2vuNjf"
  );

  stripe.charges.create({
    amount: cart.totalPrice,
    currency: "inr",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function (err, charge) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function (err, result) {
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/spare');
    });
  });
});


//user part

/* GET and POST : user signup page. */
router.get('/signup', function (req, res, next) {
  res.render('user/signup');
});

router.post('/signup', async(req, res, next) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      const registerEmployee = new User({
        username: req.body.username,
        email: req.body.email,
        password: password,
        cpassword: cpassword,
        phone: req.body.phone,
        gender: req.body.gender
      });

      const token = await registerEmployee.generateAuthToken();  //middleware
      console.log("token part: " + token)
      const registered = await registerEmployee.save();
      console.log("token part: " + registered)
      res.status(201).render('user/profile');
    }
    else {
      res.send('password are not matching');
    }
  }catch (error) {
    res.status(400).send('error');
  }
});

/* GET and POST : user signin page. */
router.get('/signin', function (req, res, next) {
  res.render('user/signin');
});

router.post('/signin', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    // console.log(`${email} and passsword is ${password}`);

    const useremail = await User.findOne({ email: email });

    const isMatch = await bcrypt.compare(password , useremail.password); // to compare bcrypt entered password vs uploaded password

    const token = await useremail.generateAuthToken();  //middleware
    console.log("token part: " + token)

    if(isMatch) {
      res.status(201).render("user/profile");
    }
    else {
      res.send("invalid login details");
    }
  } catch (error) {
    res.status(400).send('invalid Email');
  }
});

/* GET : user profile page. */
// router.get('/profile',  function(req, res, next){
//   res.render('user/profile');
// });

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.use('/', isNotLoggedIn, function (req, res, next) {
  next();
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}


module.exports = router;

