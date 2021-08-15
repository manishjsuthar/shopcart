const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

const mongoose = require('mongoose');

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/adminhp',
  branding: {
            companyName: 'Laxmi Gaytri Masala',
            softwareBrothers: false,   // if Software Brothers logos should be shown in the sidebar footer
            logo: '/images/masalapic2.jpg',
            // favicon: jsTalkFavico,
            theme: {
              colors: {
                primary100: '#28BC92',
                primary80: '#52C8A7',
                primary60: '#7CD5BC',
                primary40: '#A5E0CF',
                primary20: '#CFEDE4',
                // accent
                accent: '#5DF02E',
                hoverBg: '#59bda0',
                // filter
                filterBg: '#003024',
              },
            },
          },
});

const router = AdminBroExpress.buildRouter(adminBro)
// const ADMIN = {
//   email: 'test@example.com',
//   password: 'password',
// }

// const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
//   authenticate: async (email, password) => {
//     if (ADMIN.password === password && ADMIN.email === email) {
//       return ADMIN
//     }
//     return null
//   },
//   cookieName: 'adminbro',
//   cookiePassword: 'someLongAndStrongPassword',
// })

module.exports = router;