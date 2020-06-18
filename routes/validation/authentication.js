exports.validateOnRegister = async (req, res, next) => {
  /* Check if email was provided*/
  if (!req.body.email) {
    return res
      .status(400)
      .json({ success: false, message: "You must provide an e-mail" }); // Return error
  } else {
    /* Check if username was provided*/
    if (!req.body.displayName) {
      return res.status(400).json({
        success: false,
        message: "You must provide a your name",
      }); // Return error
    } else {
      /* Check if password was provided*/
      if (!req.body.password) {
        return res.status(400).json({
          success: false,
          message: "You must provide a password",
        }); // Return error
      } else {
        next();
      }
    }
  }
};
