module.exports.setFlash = (req, res, next) => {
  // Flash message keys
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  next();
};
