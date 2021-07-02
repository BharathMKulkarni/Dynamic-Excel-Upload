
const isAuth = (req, res, next) => {
    
    if(req.isAuthenticated()) {
        next();
    }
    else {
        res.render('loginPage', {
            documentTitle:"Login",
            cssPage: "style"
        });
    }
}

module.exports = {isAuth}