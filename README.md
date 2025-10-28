# Tiny Weddings 💒

A modern wedding package sales and client onboarding platform built with Next.js, TypeScript, and Supabase.

## 📋 Project Status

**Status:** In Development  
**Started:** October 28, 2025  
**Target:** MVP in single development session

## 🎯 Purpose

Tiny Weddings helps couples plan their special day by offering:
1. **Fast Package** - Pre-configured $5,000 wedding package
2. **Build Your Own** - Custom package builder with real-time pricing

## 🏗️ Architecture

**Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS  
**Backend:** Next.js Server Actions + Supabase  
**Database:** PostgreSQL (Supabase)  
**Real-time:** Supabase Realtime  
**Deployment:** Vercel + GitHub  
**Payments:** Square

### Why This Stack?

✅ **Vercel-Native** - Zero-config deployment  
✅ **Real-time** - Built-in WebSocket support  
✅ **Type-Safe** - End-to-end TypeScript  
✅ **Fast Development** - Can build MVP in single session  
✅ **Scalable** - Serverless, auto-scaling

## 📁 Documentation

- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Features, tech stack, deployment
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Database schema, folder structure, patterns
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Architecture decision rationale, timeline
- **[DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)** - Code style, patterns, best practices
- **[FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md)** - Complete feature list with checkboxes
- **[FAST_PACKAGE_DETAILS.md](./FAST_PACKAGE_DETAILS.md)** - $5k package service details

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎨 Features

### For Clients
- Browse wedding packages
- Check real-time availability calendar
- Choose $5k fast package or build custom
- Pay $1k deposit to hold date (via Square)
- Interactive dashboard with real-time pricing
- Direct vendor messaging
- Autosave progress

### For Admins
- View all client dashboards (real-time)
- Manage vendors
- Easy vendor onboarding
- Monitor client-vendor communications

### Technical Features
- 🔄 Real-time updates across all users
- 💾 Autosave (debounced 500ms)
- 💬 Live messaging
- 📱 Mobile responsive
- 🔒 Role-based access control
- ⚡ Serverless architecture

## 📦 Project Structure

```
tiny-wedding/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and configurations
│   └── types/           # TypeScript type definitions
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
└── [docs]/              # Documentation files
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API** - Server Actions & API Routes
- **Prisma** - Type-safe ORM
- **Supabase** - PostgreSQL + Realtime + Auth
- **Square** - Payment processing

### DevOps
- **Vercel** - Hosting and deployment
- **GitHub** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🗄️ Database Schema

**Core Tables:**
- `users` - Clients, vendors, admins
- `vendors` - Vendor profiles and services
- `packages` - Pre-configured packages
- `bookings` - Date reservations and payments
- `client_dashboards` - Client package builders
- `dashboard_services` - Selected services
- `messages` - Client-vendor communication

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete schema.

## 🔐 Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Square
SQUARE_ACCESS_TOKEN="..."
SQUARE_LOCATION_ID="..."
NEXT_PUBLIC_SQUARE_APPLICATION_ID="..."
SQUARE_ENVIRONMENT="sandbox"
```

## 📝 Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "Add your feature"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/your-feature
   ```

4. **Vercel creates preview deployment**

5. **Merge to main → Auto-deploy to production**

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## 📈 Deployment

### Automatic Deployment
- **Push to main** → Production deployment
- **Open PR** → Preview deployment
- **Vercel** handles everything automatically

### Manual Deployment
1. Build succeeds locally
2. Push to GitHub
3. Vercel deploys automatically
4. Monitor deployment in Vercel dashboard

## 🎯 MVP Checklist

- [ ] Landing page
- [ ] Package selection
- [ ] Fast package checkout
- [ ] Questionnaire
- [ ] Client dashboard
- [ ] Real-time updates
- [ ] Messaging
- [ ] Admin panel
- [ ] Autosave
- [ ] Authentication
- [ ] Deployment

See [FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md) for complete list.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

1. Follow guidelines in [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)
2. Create feature branch
3. Write clean, typed code
4. Test thoroughly
5. Create PR with clear description

## 📄 License

[To be determined]

## 👥 Team

[To be filled with team information]

---

**Need Help?** Check the documentation files or refer to the implementation plan.

**Built with ❤️ for couples planning their tiny weddings**
# tiny-wedding-1
