 const isAuthenticated = async (req, res, next) => {
  console.log(req.session);
  // Check if the request path is "/login" or if the user is authenticated
  if (req.path === "/login" || req.session.isAuthenticated) {
    return next();
  } else {
    // Redirect to the login page for unauthenticated users
    res.redirect("/login");
  }
};


module.exports={isAuthenticated}