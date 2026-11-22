/**
 * Application Configuration & Environment Variables
 * Centralizes all environment settings for the frontend and backend integration.
 */

export const env = {
  /**
   * Base URL for the backend REST/GraphQL API.
   * Example: http://localhost:8000/api/v1
   */
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",

  /**
   * Application name displayed in titles and navigation
   */
  appName:
    process.env.NEXT_PUBLIC_APP_NAME || "Agbale",

  /**
   * Default organization or library name
   */
  organizationName:
    process.env.NEXT_PUBLIC_ORGANIZATION_NAME || "Bibliothèque Centrale",

  /**
   * Default maximum borrowed books per member
   */
  defaultMaxBooks: Number.parseInt(
    process.env.NEXT_PUBLIC_DEFAULT_MAX_BOOKS || "5",
    10,
  ),

  /**
   * Default loan duration in days
   */
  defaultLoanDurationDays: Number.parseInt(
    process.env.NEXT_PUBLIC_DEFAULT_LOAN_DURATION_DAYS || "21",
    10,
  ),

  /**
   * Key used in LocalStorage to persist JWT auth token
   */
  authTokenKey:
    process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || "agbale:auth_token",

  /**
   * Toggle to use local mock data until backend endpoints are ready.
   * Set to "false" in .env once backend is plugged in.
   */
  useMockData:
    process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false",
} as const;

export type AppConfig = typeof env;

