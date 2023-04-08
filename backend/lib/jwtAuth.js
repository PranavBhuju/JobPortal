const passport = require("passport");

const jwtAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json(info);
      return;
    }
    req.user = user;
    const { io, socket } = req.app.get('socket.io');
    console.log('join', user._id.toString())
    socket.join(user._id.toString())
    next();
  })(req, res, next);
};

module.exports = jwtAuth;
