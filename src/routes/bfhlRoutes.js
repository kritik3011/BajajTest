const express = require('express');
const router = express.Router();
const { postBfhl } = require('../controllers/bfhlController');
const { validateBfhlInput } = require('../middleware/validator');

router.post('/', validateBfhlInput, postBfhl);

module.exports = router;
