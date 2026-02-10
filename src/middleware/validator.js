const xss = require('xss');
const config = require('../config');

function validateBfhlInput(req, res, next) {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: 'Request body must be a valid JSON object.' });
    }

    const validKeys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
    const presentKeys = Object.keys(body).filter((k) => validKeys.includes(k));

    if (presentKeys.length === 0) {
      return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: `Request body must contain exactly one key from: ${validKeys.join(', ')}` });
    }

    if (presentKeys.length > 1) {
      return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: 'Request body must contain exactly ONE key.' });
    }

    const key = presentKeys[0];
    const value = body[key];

    if (key === 'fibonacci') {
      if (typeof value !== 'number' || !Number.isInteger(value))
        return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: '"fibonacci" must be an integer.' });
      if (value < 0)
        return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: '"fibonacci" must be a non-negative integer.' });
      if (value > 1000)
        return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: '"fibonacci" must not exceed 1000.' });
    }

    if (key === 'prime' || key === 'lcm' || key === 'hcf') {
      if (!Array.isArray(value))
        return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: `"${key}" must be an array of integers.` });
      if (value.length === 0)
        return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: `"${key}" array must not be empty.` });
      if (value.length > 1000)
        return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: `"${key}" array must not exceed 1000 elements.` });
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] !== 'number' || !Number.isInteger(value[i]))
          return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: `"${key}" array must contain only integers. Invalid value at index ${i}.` });
      }
    }

    if (key === 'AI') {
      if (typeof value !== 'string')
        return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: '"AI" must be a string question.' });
      const sanitized = xss(value.trim());
      if (sanitized.length === 0)
        return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: '"AI" question must not be empty.' });
      if (sanitized.length > 500)
        return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: '"AI" question must not exceed 500 characters.' });
      req.body.AI = sanitized;
    }

    req.operation = key;
    next();
  } catch (err) {
    return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: 'Invalid request body.' });
  }
}

module.exports = { validateBfhlInput };
