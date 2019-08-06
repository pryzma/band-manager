/*
* app/auth.js
*/
const render = require('../app/render');
const authController = require('../controllers/authcontroller.js');
const passportStrategy = 'local'
function auth(){
    app.get('/signin', authController.signin);
    
    app.post("/signin", passport.authenticate(passportStrategy, {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    }), function(req, res, info){
        console.log(req)
        //res.render('signin',{'message' :req.flash('message')});
        render(res,'signin',{'message' :req.flash('message')})
    });

    app.get('/logout', authController.logout);
}

module.exports = auth;