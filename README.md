src/
├── config/ # Configuration files
│ └── index.ts # Environment variables and app config
├── middleware/ # Express middleware
│ ├── error-handler.ts # Global error handling
│ └── validate.ts # Request validation using Zod
├── models/ # Database models
│ ├── message.ts # Message schema and model
│ └── user.ts # User schema and model
├── routes/ # API routes
│ └── user-routes.ts # User-related endpoints
├── schemas/ # Validation schemas
│ └── user-schema.ts # User input validation
├── services/ # Business logic
│ ├── email-service.ts # Email sending service
│ ├── message-service.ts # Message processing
│ ├── scheduler-service.ts # Cron job scheduler
│ └── user-service.ts # User operations
├── tests/ # Test files
│ ├── helpers/ # Test helpers
│ │ └── database.ts # Test database setup
│ ├── services/ # Service tests
│ │ ├── message-service.test.ts
│ │ └── user-service.test.ts
│ └── setup.ts # Test environment setup
├── utils/ # Utility functions
│ ├── async-handler.ts # Async error handling
│ └── date-utils.ts # Date manipulation
├── app.ts # Express app setup
└── server.ts # Server entry point
