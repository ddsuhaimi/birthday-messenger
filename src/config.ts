export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/birthday-app",
  emailServiceUrl: "https://email-service.digitalenvision.com.au",
  environment: process.env.NODE_ENV || "development",
};
