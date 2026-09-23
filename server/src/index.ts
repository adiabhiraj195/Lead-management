import app from "./app";
import config from "./config/env";

const server = app.listen(config.port, () => {
  console.log(
    `Server running in ${config.nodeEnv} mode at http://localhost:${config.port}`
  );
});

const handleShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));