```
src/
├── config.ts # Some config needed by the app
│
├── middleware/ # Express middleware
│ ├── error-handler.ts
│ └── validate.ts
│
├── models/ # Database models
│ ├── message.ts
│ └── user.ts
│
├── routes/ # API routes
│ └── user-routes.ts
│
├── schemas/ # Zod validation schemas
│ └── user-schema.ts
│
├── services/
│ ├── email-service.ts
│ ├── message-service.ts
│ ├── scheduler-service.ts
│ └── user-service.ts
│
├── tests/ # Test files
│ ├── helpers/
│ │ └── database.ts # Test database setup
│ ├── services/ # Service tests
│ │ ├── message-service.test.ts
│ │ └── user-service.test.ts
│ └── setup.ts # Test environment setup
│
├── utils/ # Utility functions
│ ├── async-handler.ts # Async error handling
│ └── date-utils.ts
│
├── app.ts # Express setup
└── server.ts # Entry point
```
