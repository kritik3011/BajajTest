const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const apiLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/healthRoutes');
const bfhlRoutes = require('./routes/bfhlRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(apiLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use('/health', healthRoutes);
app.use('/bfhl', bfhlRoutes);

app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    official_email: config.officialEmail,
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

app.use(errorHandler);

module.exports = app;
