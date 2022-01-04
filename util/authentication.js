function createUserSession(req, user, action){
    req.session.uid = user._id.toString(); //MongoDB id is a special object id. It needs to be converted
    req.session.isAdmin = user.isAdmin;
    req.session.save(action);
}

function destroyUserAuthSession(req){
    req.session.uid = null; 
}

module.exports ={
    createUserSession : createUserSession,
    destroyUserAuthSession : destroyUserAuthSession
}