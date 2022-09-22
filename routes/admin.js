var express = require('express');
var router = express.Router();
const { response } = require('express');
const { render } = require('../app')


const adminHelpers =require('../helpers/admin-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/view',{admin:true})
});
// router.get('/showuser',(req,res)=>{
//   console.log("api call");
//    adminHelpers.showUser().then((users)=>{
//     console.log(users);
//     res.render('admin/users')
//    })
// })

module.exports = router;
