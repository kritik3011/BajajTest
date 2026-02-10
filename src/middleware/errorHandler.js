const config = require('../config');

function errorHandler(err, req, res, _next) {
  console.error(err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    is_success: false,
    official_email: config.officialEmail,
    error: statusCode === 500 ? 'Internal server error' : err.message,
  });
}

module.exports = errorHandler;
