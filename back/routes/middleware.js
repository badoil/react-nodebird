exports.isLoggedIn = (req, res, next) => {
    console.log('req:', req.isAuthenticated())
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(401).send('No user');
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    }else{
        res.status(401).send('No access');
    }
}