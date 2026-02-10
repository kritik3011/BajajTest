const config = require('../config');
const mathService = require('../services/mathService');
const aiService = require('../services/aiService');

async function postBfhl(req, res, next) {
  try {
    const operation = req.operation;
    let data;

    switch (operation) {
      case 'fibonacci': data = mathService.generateFibonacci(req.body.fibonacci); break;
      case 'prime': data = mathService.filterPrimes(req.body.prime); break;
      case 'lcm': data = mathService.computeLCM(req.body.lcm); break;
      case 'hcf': data = mathService.computeHCF(req.body.hcf); break;
      case 'AI': data = await aiService.answerQuestion(req.body.AI); break;
      default:
        return res.status(400).json({ is_success: false, official_email: config.officialEmail, error: 'Unsupported operation.' });
    }

    return res.status(200).json({ is_success: true, official_email: config.officialEmail, data });
  } catch (error) {
    if (error.message.includes('AI service')) {
      return res.status(502).json({ is_success: false, official_email: config.officialEmail, error: error.message });
    }
    next(error);
  }
}

module.exports = { postBfhl };
