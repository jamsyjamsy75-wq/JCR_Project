# Fix Authentication Error on Vercel

## Problem
NextAuth v5 requires `AUTH_SECRET` environment variable, but you only have `NEXTAUTH_SECRET` (old v4 name).

## Solution

### Update Vercel Environment Variables

1. Go to https://vercel.com/jamsyjamsy75-wqs-projects/project-xburncrust/settings/environment-variables

2. **Delete these old variables** (if they exist):
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

3. **Add these new variables**:

   **AUTH_SECRET** (Production)
   ```
   gFXxvlD7CJp/L6D2jltr5GOTsorrJIV0txRq+4/BlZk=
   ```
   - Environment: Production, Preview, Development
   
   **AUTH_URL** (Production only)
   ```
   https://project-xburncrust.vercel.app
   ```
   - Environment: Production only

4. **Verify these exist**:
   - `TURSO_DATABASE_URL`: `libsql://xburncrust-prod-jamsyjamsy75-wq.aws-eu-west-1.turso.io`
   - `TURSO_AUTH_TOKEN`: (your long JWT token)
   - `CLOUDINARY_CLOUD_NAME`: `dbtuww2ie`
   - `CLOUDINARY_API_KEY`: `337515722783775`
   - `CLOUDINARY_API_SECRET`: (your secret)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: `dbtuww2ie`
   - `NEXT_PUBLIC_USE_LOCAL_MEDIA`: `false` (for production)

5. **Redeploy** your application:
   - Click "Redeploy" button in Vercel Dashboard
   - OR push any commit to trigger new deployment

## Expected Result
After adding `AUTH_SECRET` and redeploying, the error should be fixed and login should work.

## Local Changes Already Done ✅
- Updated `.env.local` from `NEXTAUTH_*` to `AUTH_*` variable names
- Added backup at `.env.local.backup`
