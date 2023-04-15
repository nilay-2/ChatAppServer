const globalErrHandler = (err, req, res, next) => {
  console.log(err);
  res.status(400).json({
    status: "failed",
    message: err,
  });
};

module.exports = globalErrHandler;
