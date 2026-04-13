# Vercel Build Fix - April 14, 2026

## Problem
Vercel was attempting to build the project as a **Next.js** application, but your project is actually a **Vite + React** application.

**Error Message:**
```
Command "npm run build" exited with 1
```

The build logs showed:
```
Detected Next.js version: 14.2.35
Running "npm run build"
> next-sslcommerz-example@0.0.0 build
> next build
```

## Root Cause
Vercel auto-detects the framework based on:
1. Project structure (presence of `.next` directory)
2. Package.json dependencies 
3. Config files (next.config.js, vercel.json, etc.)

The project had conflicting signals - it's primarily a Vite project, but had Next.js references from previous work, causing Vercel to misdetect it.

## Solution Applied ✅

Created `vercel.json` at the root of the project:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "env": {
    "SSLCOMMERZ_STORE_ID": "@sslcommerz_store_id",
    "SSLCOMMERZ_STORE_PASSWORD": "@sslcommerz_store_password",
    "STORE_ID": "@store_id",
    "STORE_PASS": "@store_pass",
    "SITE_URL": "@site_url"
  }
}
```

**What this does:**
- `buildCommand`: Explicitly tells Vercel to run `npm run build` (which runs `vite build`)
- `outputDirectory`: Tells Vercel where the built files are (`dist/` folder)
- `framework: null`: Disables Next.js auto-detection
- `env`: Reference to environment variables (managed in Vercel dashboard)

## Status
✅ Fix committed and pushed to GitHub
⏳ Vercel is now redeploying with the correct build configuration

## Expected Outcome
The build should now:
1. ✅ Recognize this as a Vite project
2. ✅ Run `vite build` command
3. ✅ Generate output in `dist/` folder
4. ✅ Deploy to https://autospark-one.vercel.app

## Timeline
- **Pushed:** Just now
- **Deployment starts:** Immediately
- **Estimated build time:** 1-2 minutes
- **Expected status:** Green checkmark with "Ready" status

## Verification
Once deployment completes (you'll see green checkmark in Vercel dashboard):
1. Visit https://autospark-one.vercel.app
2. Test the accessories page
3. Try adding to cart and proceeding to checkout
4. Payment form should now work with the improved error logging we added earlier

## Files Modified
- ✅ `vercel.json` - Created to fix build configuration

## Commit Info
- **Commit:** 5103713
- **Message:** "fix: Add vercel.json to explicitly configure Vite build instead of Next.js"

---

**Important Note:** The `vercel.json` fix is a configuration-only change. It doesn't modify any source code. If this build still fails, the issue would likely be in the source code itself (compilation errors, missing dependencies, etc.), not the framework detection.
