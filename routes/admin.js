const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const mongoose = require('mongoose');


const connect = mongoose.connect('mongodb://localhost:27017/shopcart',
    {
      useNewUrlParser: true, useUnifiedTopology: true,
      useCreateIndex: true, useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

AdminBro.registerAdapter(AdminBroMongoose)

const Product = require('../models/product')



const adminBro = new AdminBro({
  databases: [mongoose],
  resources: [{
    resource: Product,
    options: {
        parent: {
            name: 'Admin Content',
            icon: 'fas fa-cogs',
        },
        properties: {
            imageUpload: {
                components: {
                   
                },
            },
        },
    },
  }],
  rootPath: '/admin',
  branding: {
      companyName: 'Sparekart',
  },
})

const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 's123',
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: process.env.ADMIN_COOKIE_NAME || 'admin',
    cookiePassword: process.env.ADMIN_COOKIE_PASS || 'supersecretpassword',
    authenticate: async( email,password) => {
        if(email=== ADMIN.email && password === ADMIN.password){
            return ADMIN
        }
        return null
    },
},null, {	
    resave: false,	
    saveUninitialized: true,	
});


module.exports = router;