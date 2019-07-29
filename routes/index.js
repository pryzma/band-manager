
const express = require('express');
const router = express.Router();

  router.get('/', isAuthenticated, function(req, res, next) {
    const config = require('../assets/json/config.json')
    const cdns = require('../cdns')(config.cdns)
   
    /* GET user information after login */
    const username   = req.session.user.username;
    const full_name  = req.session.user.full_name;
  
    res.render('index', { 
      username: username, 
      full_name: full_name, 
      js : cdns.js, 
      css : cdns.css 
    });
  
  });




function isAuthenticated(req, res, next) {
  if (req.session.user)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SIGNIN PAGE
  res.redirect('/signin');
}

module.exports = router;
