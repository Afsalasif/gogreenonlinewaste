const { response } = require('express');
var express = require('express');
var router = express.Router();
var router = express.Router();
const userHelpers = require('../helpers/user-helpers')
const adminHelpers = require('../helpers/admin-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()

  } else {
    res.redirect('/login')
  }
}
const verifyCart = (req, res, next) => {
  if ({ cartStatus: false })
    res.redirect('/homepage')
}


/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user);
  res.render('index', { user });
});
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  res.render('user/login')
})
router.get('/signup', (req, res) => {
  res.render('user/signup')
})
router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn = true
    req.session.user = response
    res.redirect('/')
  })
})
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response, rea) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req = rea
      res.redirect('/login')
      // console.log(rea.reason);
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
router.get('/homepage', verifyLogin, (req, res) => {
  userHelpers.checkCart(req.session.user._id).then((response) => {
    if (response) {
      res.redirect('/cart')
    }
    else {
      res .render('user/homepage')
    }
  })

})
router.post('/pickup', verifyLogin, (req, res) => {
  userHelpers.doPickup(req.body, req.session.user._id).then((response) => {
    if ({ status: false }) {
      res.render('user/cart')
      res.redirect('/cart')
      console.log("you have done a great job");
    } else {

      res.redirect('/homepage')
    }
  })
})
router.get('/cart', verifyLogin, (req, res) => {
  userHelpers.addTocart(req.session.user._id).then((response) => {

    res.render('user/cart', { response })
  })
})
router.get('/delete', (req, res) => {
  userHelpers.deletePickup(req.session.user._id).then((response) => {
    res.redirect('/')
  })
})
router.get('/place-order',verifyLogin,(req,res)=>{
  userHelpers.placeOrder(req.session.user._id).then((response)=>{
    console.log("sucs");
    res.redirect('/')
  })
})
router.get('/view-order',verifyLogin,(req,res)=>{
  userHelpers.showOrder(req.session.user._id).then((orders)=>{
    console.log(orders[0].data);
    dta=orders[0].data
    res.render('user/orders',{ dta })
    
  })
})



//admin router//
router.get('/showuser', (req, res) => {
  console.log("call is in user");
  adminHelpers.showUser().then((users) => {

    res.render('admin/users', { users })
  })

})
router.get('/view-detail/:id', (req, res) => {
  adminHelpers.viewOrder(req.params.id).then((response)=>{
    console.log(response);
    res.render('admin/order-of-user',{response})
  })
 
})


module.exports = router;
