const config = require('../config');

function getHealth(req, res) {
  res.status(200).json({
    is_success: true,
    official_email: config.officialEmail,
  });
}

module.exports = { getHealth };
