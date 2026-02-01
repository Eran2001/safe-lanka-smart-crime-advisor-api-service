import app from './app.js';
import { config } from './config/env.js';
import db from './db/knex.js';

const startServer = async () => {
  try {
    // Test database connection
    await db.raw('SELECT 1');
    console.log('✅ Database connected successfully');
    
    // Start server
    const server = app.listen(config.port, () => {
      console.log(`🚀 SafeLanka API running on port ${config.port}`);
      console.log(`📚 Documentation: ${config.appUrl}/docs`);
      console.log(`🏥 Health check: ${config.appUrl}/api/v1/health/live`);
      console.log(`🌍 Environment: ${config.env}`);
    });
    
    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('HTTP server closed');
        
        try {
          await db.destroy();
          console.log('Database connections closed');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();