# Building and Starting in Production Mode

If you want to run in **production mode** (requires building first):

## Backend Production Build

```bash
cd backend
npm run build    # Compiles TypeScript to JavaScript
npm start        # Runs the compiled code
```

## Frontend Production Build

```bash
cd frontend
npm run build    # Builds Next.js application
npm start        # Runs the production server
```

## Development Mode (Recommended)

For development, use `npm run dev` instead - it doesn't require building:

```bash
# From root - runs both
npm run dev

# Or separately:
cd backend && npm run dev
cd frontend && npm run dev
```

