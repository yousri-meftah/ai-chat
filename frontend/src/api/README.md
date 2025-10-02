# API Schemas

This folder contains TypeScript interface definitions for API requests and responses.

## Purpose

These schemas serve as contracts between the frontend and backend, defining:
- Request payload structures
- Response data formats
- Error handling patterns
- Type safety for API communication

## Files

- `auth.ts` - Authentication-related API schemas
- `chat.ts` - Chat and conversation API schemas



## Backend Integration

When implementing the backend:
1. Use these schemas to validate incoming requests
2. Ensure responses match the defined response types
3. Handle errors according to the ErrorResponse interfaces
4. Maintain consistency between frontend expectations and backend implementation

## Note

This is a frontend-only implementation. These schemas define the expected API structure but do not implement actual backend functionality.
