var createError = require('http-errors');
var express = require('express');
const formidableMiddleware = require('express-formidable');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var flash = require('connect-flash');
var validator = require('express-validator');
const bcrypt = require('bcryptjs');
require('dotenv').config();
var http = require('http');
var cookieParser = require('cookie-parser');
const qs = require("querystring");
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
const Razorpay = require('razorpay');
const crypto = require("crypto");
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, file.originalname)
  }
});
// checking file type
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
      cb(null, true);
  } else {
      cb(new Error('Not an image! Please upload an image.', 400), false);
  }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6
    },
    fileFilter: fileFilter
});

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var userRoutes = require('./routes/user');

var app = express();

// Connect to db
mongoose.connect('mongodb+srv://suthar123:suthar123@cluster1.r2b2l.mongodb.net/nodejs_shopcart?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// view engine setup
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(parseJson);
app.use(cookieParser());
app.use(parseUrl);
app.use(validator());
app.use(session({
  secret: 'mysupersecret-and-secret-key',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl:'mongodb+srv://suthar123:suthar123@cluster1.r2b2l.mongodb.net/nodejs_shopcart?retryWrites=true&w=majority' }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;

app.use('/', indexRouter);
app.use('/adminhp', adminRouter);
app.use('/user',userRoutes);

app.post("/api/payment/order", (req, res) => {
  params = req.body;
  instance.orders
    .create(params)
    .then((data) => {
      res.send({ sub: data, status: "success" });
    })
    .catch((error) => {
      res.send({ sub: error, status: "failed" });
    });
});

app.post("/api/payment/verify", (req, res) => {
  body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

  var expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log("sig" + req.body.razorpay_signature);
  console.log("sig" + expectedSignature);
  var response = { status: "failure" };
  if (expectedSignature === req.body.razorpay_signature)
    response = { status: "success" };
  res.send(response);
});

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'public/images' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
});


app.get('/upload', (req, res) => {
  res.render("home/upload")
})
app.post('/upload', upload.single("image") ,(req, res) => {
  res.send("Image uploaded")
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port,() => {
  console.log(`listening at port: ${port}`);
})
