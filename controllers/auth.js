const controller = module.exports = {}
const render = require('../app/render');
controller.signin = (req, res) => {
    render(res,'signin',{'message' :req.flash('message')});
}

controller.logout = (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
}
controller.isAuthenticated = (req, res, next) => {
    if (req.session.user)
        return next();
    res.status(403).end();
}