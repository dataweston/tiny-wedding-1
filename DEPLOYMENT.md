# Deployment Configuration

This document provides deployment instructions for the Tiny Weddings application.

## Vercel Deployment

### Prerequisites
1. GitHub repository with the codebase
2. Vercel account
3. Supabase project (production database)
4. Square production credentials

### Environment Variables

Set these in Vercel project settings:

```bash
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Square Payments
NEXT_PUBLIC_SQUARE_APP_ID="your-production-app-id"
NEXT_PUBLIC_SQUARE_LOCATION_ID="your-location-id"
SQUARE_ACCESS_TOKEN="your-production-access-token"
SQUARE_ENVIRONMENT="production"
```

### Deployment Steps

1. **Connect GitHub Repository**
   ```bash
   # Push code to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/tiny-wedding.git
   git push -u origin main
   ```

2. **Import Project to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

3. **Set Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add all variables listed above
   - Ensure they're set for Production, Preview, and Development environments

4. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Post-Deployment

1. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

2. **Verify Square Integration**
   - Test deposit payment flow
   - Test balance payment flow
   - Verify webhook endpoints (if configured)

3. **Test Real-time Features**
   - Availability calendar updates
   - Dashboard autosave
   - Messaging system

### Continuous Deployment

- Pushes to `main` branch automatically deploy to production
- Pull requests create preview deployments
- Configure branch protection rules in GitHub

## Custom Domain

1. **Add Domain in Vercel**
   - Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Automatically provisioned by Vercel
   - Enforces HTTPS

## Monitoring

- Use Vercel Analytics for performance monitoring
- Set up error tracking (Sentry recommended)
- Monitor Square payment logs in Square Dashboard

## Database Backups

- Supabase provides automatic daily backups
- Configure additional backup schedule in Supabase dashboard
- Export database periodically for local backups

## Security Checklist

- ✅ All environment variables secured
- ✅ Square production credentials configured
- ✅ Database connection uses SSL
- ✅ API routes protected (add auth middleware)
- ✅ CORS configured properly
- ✅ Rate limiting implemented (recommended)
