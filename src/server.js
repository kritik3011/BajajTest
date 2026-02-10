const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
process.on('uncaughtException', (error) => console.error('Uncaught Exception:', error));
