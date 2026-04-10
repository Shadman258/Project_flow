import app from './app';
import { connectDb } from './config/db';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  try {
    await connectDb();
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
