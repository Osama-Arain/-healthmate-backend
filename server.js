require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🏥 HealthMate Server Running        ║
  ║   Port: ${PORT}                         ║
  ║   Environment: ${process.env.NODE_ENV}  ║
  ╚════════════════════════════════════════╝
  `);
});