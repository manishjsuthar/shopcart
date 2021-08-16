var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var path = require('path');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const auth = require("../middleware/auth");
const Razorpay = require('razorpay');
require('dotenv').config()
const flash = require('connect-flash');
const nodemailer = require("nodemailer");


var Product = require('../models/product');

var Order = require('../models/order');
var Enquiry = require('../models/enquiryform');
var User = require('../models/user');
var DeliveryAddress  = require('../models/deliveryaddress');

router.get('/enquiry', function (req, res, next) {
  res.render('home/enquiry', { title: 'Sparekart' });
});

router.post('/enquiry', async (req, res) => {
  try {
    "use strict";
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MY_EMAIL, // generated ethereal user
          pass: process.env.MY_PASS, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: req.body.eemail, // sender address
        to: "sutharm80@gmail.com", // list of receivers
        subject: "Message from contact Form ✔", // Subject line
        text: "From: " + req.body.efname +" "+ req.body.elname + "\n" + "Phone no.: "+ req.body.ephone +"\n" + "Message : " + req.body.emessage, // plain text body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    main().catch(console.error);

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


router.get('/contact', function (req, res, next) {
  res.render('home/contact', { title: 'Sparekart' });
});

router.get('/shipping-detail', function (req, res, next) {
  res.render('home/shipping-detail', { title: 'Sparekart' });
});

router.get('/', function (req, res, next) {
  try {
    res.render('home/index');
  } catch (error) {
    res.status(400).send("something went wrong")
  }
});


/* GET home page. */
router.get('/spare', function (req, res, next) {
  
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 4;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('home/spare', { title: 'Shopping Cart', products: productChunks});
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
  res.render('home/shopping-cart', { products: cart.generateArray(), totalQty: cart.totalQty , totalPrice: cart.totalPrice, totalsp: cart.totalsp, shippingprice:cart.shippingprice });
});


router.get('/checkout', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  
  res.render('home/checkout', { key: process.env.KEY_ID , products: cart.generateArray(), totalQty: cart.totalQty, total: cart.totalPrice, totalsp: cart.totalsp, shippingprice:cart.shippingprice});
});

router.post('/checkout', async (req, res) => {
  // try {
    const SaveAddress = new DeliveryAddress({
      aname: req.body.aname,
      aemail: req.body.aemail,
      aphone: req.body.aphone,
      aaddress: req.body.aaddress,
      acountry: req.body.acountry,
      astate: req.body.astate,
      apincode: req.body.apincode,
      oproduct1:{oproduct: req.body.oproduct,
      oproductqty: req.body.oproductqty,
      oproducttprice: req.body.oproducttprice}
    });
        
    const SaveDAddress = await SaveAddress.save();
    res.status(201).redirect('/pay')
  // } catch (error) {
  //   res.status(400).send('error');
  // }
});

router.get('/pay', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  res.render('home/pay', { key: process.env.KEY_ID , products: cart.generateArray(), totalQty: cart.totalQty, total: cart.totalPrice, totalsp: cart.totalsp, shippingprice:cart.shippingprice});
});

router.get("/ordersuccess", (req,res) => {
  res.status(200).render("home/ordersuccess")
})
router.get("/ordercancel", (req,res) => {
  res.status(200).render("home/ordercancel")
})


//user part

router.get('/profile', auth, (req, res) => {
  res.render('user/profile', {layout: 'dashlayout'});
});

router.get('/userorder',  function (req, res, next) {
  try {
    var cart = new Cart(req.session.cart);
    res.render('user/userorder', { products: cart.generateArray(), totalPrice: cart.totalPrice, layout:"dashlayout" , totalsp: cart.totalsp});
  } catch (error) {
    res.status(500).send("something went wrong")
  }
});

router.get('/useraccount', auth,  (req, res) => {
  
  res.render('user/useraccount');
});


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

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 500000),
        httpOnly: true
      });

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
    console.log("token part: " + token);

    // The res.cookie() function is used to set cookie name to value
    // The value parameter may be string or object converted to JSON.

    res.cookie("jwt", token, {
       expires: new Date(Date.now() + 5000000),
       httpOnly: true
    });
   

    if(isMatch) {
      res.status(201).redirect("/profile");
    }
    else {
      res.send("invalid password");
    }
  } catch (error) {
    res.status(400).send('invalid login details');
  }
});

router.get("/logout", auth,  async(req,res) => {
  try {
    
    console.log(req.userr);
    req.userr.tokens = req.userr.tokens.filter((currElement) => {
        return currElement.token !== req.token;
    })
    res.clearCookie("jwt");
    console.log("logged out successfully");
    await req.userr.save();
    res.render('home/index')
  } catch (error) {
    res.status(500).send(error);
  }
})


module.exports = router;

