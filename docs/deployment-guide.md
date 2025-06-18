# Deployment Guide: Portfolio Blog 2025

This comprehensive guide covers deploying your Payload CMS website template to production using Vercel, Neon (PostgreSQL), and implementing development/production environments.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Database Configuration](#database-configuration)
4. [Environment Setup](#environment-setup)
5. [Vercel Deployment](#vercel-deployment)
6. [Continuous Deployment](#continuous-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Architecture Overview

### Technology Stack

- **Frontend & Backend**: Next.js 15 with Payload CMS 3.43.0
- **Database**: PostgreSQL via Neon (serverless)
- **Hosting**: Vercel (serverless deployment)
- **Media Storage**: Local filesystem (consider cloud storage for production)
- **Authentication**: Payload built-in with JWT

### Why These Technologies?

#### PostgreSQL Instead of MongoDB
While the template includes MongoDB in `docker-compose.yml` for legacy compatibility, this project uses PostgreSQL because:
- **Relational data structure**: Better for structured content relationships
- **ACID compliance**: Ensures data integrity
- **Migrations support**: Type-safe database changes with Drizzle
- **Better Vercel integration**: Neon provides serverless PostgreSQL optimized for edge

#### Neon Database
- **Serverless**: Scales to zero, pay only for what you use
- **Branching**: Create isolated database copies for preview deployments
- **Edge-optimized**: Low latency globally
- **Vercel integration**: Automatic environment variable management

#### Vercel Hosting
- **Native Next.js support**: Created by the Next.js team
- **Edge functions**: Global deployment
- **Preview deployments**: Automatic PR previews
- **Environment management**: Secure secrets handling

## Prerequisites

### Required Accounts
1. **GitHub Account**: For source control
2. **Vercel Account**: For hosting ([signup](https://vercel.com/signup))
3. **Neon Account**: Will be created via Vercel integration

### Local Development Setup
```bash
# Ensure you have Node.js 18+ and pnpm installed
node --version  # Should be 18.20.2 or higher
pnpm --version  # Should be 9.x or 10.x

# Clone and install
git clone <your-repo-url>
cd portfolio-blog-2025
pnpm install
```

## Database Configuration

### Understanding Database Connections

Payload CMS with PostgreSQL requires two connection types:

1. **Pooled Connection** (`DATABASE_URI`): For application queries
   - Uses PgBouncer for connection pooling
   - Prevents connection exhaustion in serverless
   - Format: `postgresql://user:pass@host/db?sslmode=require&pgbouncer=true`

2. **Direct Connection** (`DIRECT_URL`): For migrations
   - Required by Drizzle for schema changes
   - Bypasses connection pooler
   - Format: `postgresql://user:pass@host/db?sslmode=require`

### Local Development Database

For local development, you have two options:

#### Option 1: Local PostgreSQL with Docker
```yaml
# Update docker-compose.yml (remove mongo, keep postgres)
version: '3'
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_DB: portfolio_blog_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

#### Option 2: Neon Development Branch
Create a development branch in Neon Console for isolated development.

### Environment Variables Setup

Create `.env.local` for local development:
```bash
# Database - Local PostgreSQL
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/portfolio_blog_dev
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/portfolio_blog_dev

# Or use Neon development branch
# DATABASE_URI=postgresql://[user]:[password]@[host]/[database]?sslmode=require&pgbouncer=true
# DIRECT_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Payload
PAYLOAD_SECRET=your-very-long-random-string-here

# URLs
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Optional
PREVIEW_SECRET=another-random-string
CRON_SECRET=yet-another-random-string
```

## Environment Setup

### Development vs Production Strategy

We'll implement a three-environment strategy:

1. **Local Development**: Your machine
2. **Preview/Staging**: Vercel preview deployments with Neon branches
3. **Production**: Main Vercel deployment with production Neon database

### Neon Database Branching

Neon's branching feature creates isolated database copies for each environment:

```mermaid
graph TD
    A[Production Database] --> B[Main Branch]
    B --> C[Preview Branch 1]
    B --> D[Preview Branch 2]
    B --> E[Development Branch]
```

Benefits:
- **Isolation**: Changes in preview don't affect production
- **Real data**: Test with production-like data
- **Instant**: Branches created via copy-on-write
- **Clean slate**: Delete branch to reset environment

## Vercel Deployment

### Step 1: Prepare Your Repository

1. Ensure your code is pushed to GitHub
2. Remove sensitive files from tracking:
   ```bash
   # Ensure .gitignore includes
   .env
   .env.local
   .env.production
   ```

### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next` (default)

### Step 3: Install Neon Integration

1. In Vercel project, go to "Storage" tab
2. Click "Connect Database" → "Neon"
3. Choose "Create New Neon Account"
4. Configure integration:
   - ✅ Enable for: Production, Preview, Development
   - ✅ Create database branches for preview deployments
   
This automatically sets:
- `DATABASE_URL` (pooled)
- `DATABASE_URL_UNPOOLED` (direct)
- `POSTGRES_*` variables

### Step 4: Configure Environment Variables

In Vercel Project Settings → Environment Variables:

#### Production Environment
```bash
# Payload (Generate secure random strings)
PAYLOAD_SECRET=<generate-64-char-random-string>
PREVIEW_SECRET=<generate-32-char-random-string>
CRON_SECRET=<generate-32-char-random-string>

# URLs (Vercel provides these automatically)
# NEXT_PUBLIC_SERVER_URL is set by Vercel
# VERCEL_URL is available at runtime
```

#### Development Environment
Same as production, but consider different values for testing.

### Step 5: Database Migration Strategy

Update `package.json` for Vercel builds:
```json
{
  "scripts": {
    "build": "payload migrate && next build",
    "migrate": "payload migrate",
    "migrate:create": "payload migrate:create"
  }
}
```

For production migrations, you have options:

1. **Automatic on deploy** (shown above)
2. **Manual via Vercel CLI**:
   ```bash
   vercel env pull .env.production.local
   pnpm migrate
   ```

### Step 6: Configure Payload for Production

Update `src/payload.config.ts` for production:

```typescript
export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000',
  
  // Ensure CORS is configured
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    'http://localhost:3000',
  ].filter(Boolean),
  
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    debug: false,
  }),
})
```

## Continuous Deployment

### GitHub Integration

Vercel automatically deploys:
- **Production**: Push to `main` branch
- **Preview**: Open PR or push to any branch

### Preview Deployments with Database Branches

With Neon integration, each PR gets:
1. Unique preview URL: `https://[project]-[hash].vercel.app`
2. Isolated database branch: `preview/[branch-name]`
3. Environment variables pointing to branch

### Deployment Workflow

```mermaid
graph LR
    A[Push to GitHub] --> B{Branch?}
    B -->|main| C[Production Deploy]
    B -->|feature| D[Preview Deploy]
    D --> E[Create Neon Branch]
    E --> F[Run Migrations]
    F --> G[Deploy App]
    C --> H[Use Production DB]
    H --> I[Run Migrations]
    I --> J[Deploy App]
```

### Build Optimization

For faster builds, configure caching:

```javascript
// next.config.js
module.exports = withPayload({
  // ... other config
  
  // Standalone output for smaller deployments
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['your-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
})
```

## Media Storage Configuration

### Development: Local Storage
Default configuration uses `public/media/` directory.

### Production: Cloud Storage
For production, implement cloud storage:

1. Install storage adapter:
   ```bash
   pnpm add @payloadcms/storage-s3
   ```

2. Configure in `payload.config.ts`:
   ```typescript
   import { s3Storage } from '@payloadcms/storage-s3'
   
   plugins: [
     s3Storage({
       collections: {
         media: true,
       },
       bucket: process.env.S3_BUCKET,
       config: {
         credentials: {
           accessKeyId: process.env.S3_ACCESS_KEY,
           secretAccessKey: process.env.S3_SECRET_KEY,
         },
         region: process.env.S3_REGION,
       },
     }),
   ]
   ```

## Monitoring and Maintenance

### Vercel Analytics
Enable in Vercel dashboard for:
- Performance metrics
- Error tracking
- Usage analytics

### Database Monitoring
In Neon Console:
- Query performance
- Connection metrics
- Storage usage

### Logs
Access via Vercel dashboard or CLI:
```bash
vercel logs [deployment-url]
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```
Error: Can't reach database server
```
**Solution**: Ensure environment variables are set correctly in Vercel.

#### 2. Migration Failures
```
Error: Migration failed
```
**Solution**: Use direct connection URL for migrations:
```typescript
// payload.config.ts
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URI,
  },
  migrationDir: './src/migrations',
  // For migrations, use direct connection
  ...(process.env.DIRECT_URL && {
    directUrl: process.env.DIRECT_URL,
  }),
}),
```

#### 3. CORS Issues
```
Error: CORS policy blocked
```
**Solution**: Add Vercel URLs to CORS config in `payload.config.ts`.

#### 4. Build Timeouts
**Solution**: Optimize build:
- Use `output: 'standalone'` in Next.js config
- Implement incremental static regeneration
- Consider build caching

### Debug Mode

Enable detailed logging:
```typescript
// payload.config.ts
export default buildConfig({
  debug: process.env.NODE_ENV !== 'production',
  // ... rest of config
})
```

## Best Practices

### Security
1. **Environment Variables**:
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security**:
   - Use connection pooling
   - Enable SSL/TLS
   - Implement row-level security if needed

3. **Access Control**:
   - Review Payload access control functions
   - Implement proper authentication
   - Use HTTPS everywhere

### Performance
1. **Database Optimization**:
   - Index frequently queried fields
   - Use connection pooling
   - Monitor query performance

2. **Next.js Optimization**:
   - Implement ISR for dynamic content
   - Use Image component for optimization
   - Enable compression

3. **Caching Strategy**:
   - Use Vercel Edge Cache
   - Implement proper cache headers
   - Use revalidation wisely

### Development Workflow
1. **Branch Strategy**:
   - `main`: Production
   - `develop`: Staging
   - `feature/*`: New features

2. **Testing**:
   - Test migrations locally first
   - Use preview deployments for QA
   - Implement E2E tests

3. **Monitoring**:
   - Set up error alerting
   - Monitor performance metrics
   - Track user analytics

## Conclusion

This deployment setup provides:
- ✅ Scalable infrastructure with Vercel + Neon
- ✅ Isolated development environments
- ✅ Automatic preview deployments
- ✅ Secure environment management
- ✅ Production-ready configuration

Remember to:
1. Test thoroughly in preview before production
2. Monitor your application post-deployment
3. Keep dependencies updated
4. Follow security best practices

For additional support:
- [Payload Documentation](https://payloadcms.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Documentation](https://nextjs.org/docs)
