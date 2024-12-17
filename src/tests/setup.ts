import { setupTestDB, clearTestDB, closeTestDB } from "./helpers/database";

// Handle ES modules mocking
jest.mock("../services/email-service", () => ({
  sendEmail: jest.fn(),
}));

// Setup global test environment
beforeAll(async () => {
  await setupTestDB();
});

// Clear all test data between tests
beforeEach(async () => {
  await clearTestDB();
});

// Cleanup after all tests
afterAll(async () => {
  await closeTestDB();
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});
