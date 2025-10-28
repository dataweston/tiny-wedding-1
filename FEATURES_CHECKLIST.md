# Tiny Weddings - Features Checklist

## Landing Page
- [ ] Hero section with compelling headline
- [ ] Services overview section
- [ ] Team introduction section
- [ ] Testimonials (if available)
- [ ] "Get Started" CTA button
- [ ] Responsive mobile design
- [ ] Smooth scroll navigation
- [ ] Contact information in footer

## Availability Calendar
- [ ] Real-time availability calendar component
  - [ ] Shows available dates
  - [ ] Marks booked dates as unavailable
  - [ ] Updates in real-time when new bookings occur
  - [ ] Supabase Realtime subscription for instant updates
- [ ] Date selection interface
  - [ ] Click to select available date
  - [ ] Shows selected date clearly
  - [ ] Prevents selection of booked dates
- [ ] Calendar integration for both package types

## Package Selection
- [ ] Modal or dedicated page for package selection
- [ ] Fast Package option prominently displayed
  - [ ] Price: $5,000 ($1,000 deposit + $4,000 balance)
  - [ ] Complete service list display
  - [ ] "Choose Fast Package" button
  - [ ] Links to availability calendar
- [ ] Build Your Own option
  - [ ] Description of custom approach
  - [ ] $1,000 deposit requirement shown
  - [ ] "Start Questionnaire" button
  - [ ] Links to availability calendar
- [ ] Clear comparison between options

## Fast Package Flow
- [ ] Display all included services (from FAST_PACKAGE_DETAILS.md)
  - [ ] Event coordination by Soup Sisters
  - [ ] Exclusive Tiny Diner venue use
  - [ ] Ceremony & cocktail furniture/setup
  - [ ] Seasonal hors d'oeuvres by Local Effort
  - [ ] Curated beverage package + bar staff
  - [ ] Seasonal florals (installation, bouquet, boutonniere)
  - [ ] Officiant services
  - [ ] Photography (ceremony, cocktail hour, portraits)
- [ ] Show pricing breakdown
  - [ ] Total: $5,000
  - [ ] Deposit: $1,000
  - [ ] Balance: $4,000
- [ ] Availability calendar integration
- [ ] Terms and conditions
- [ ] Deposit checkout ($1,000)
- [ ] Square payment integration
  - [ ] Square Web Payments SDK
  - [ ] Credit/debit card processing
  - [ ] Payment confirmation
- [ ] Booking confirmation page
  - [ ] Shows selected date
  - [ ] Payment receipt
  - [ ] Next steps
- [ ] Email confirmation
- [ ] Date immediately marked as booked (real-time update)

## Questionnaire (Build Your Own)
- [ ] Availability calendar first
  - [ ] Select date before questionnaire
  - [ ] Pay $1,000 deposit to hold date
  - [ ] Square payment integration
- [ ] Multi-step form
  - [ ] Step 1: Client information
  - [ ] Step 2: Wedding details (confirmed date, venue, guest count)
  - [ ] Step 3: Service preferences
  - [ ] Step 4: Budget and priorities
  - [ ] Step 5: Timeline
- [ ] Progress indicator
- [ ] Form validation
- [ ] Back/Next navigation
- [ ] Save progress
- [ ] Submit button
- [ ] Date held throughout process (deposit paid)

## Client Dashboard
- [ ] Dashboard overview
  - [ ] Total cost display (large, prominent)
  - [ ] Selected services list
  - [ ] Available services to add
- [ ] Vendor cards
  - [ ] Vendor name and category
  - [ ] Service description
  - [ ] Price
  - [ ] Contact button
  - [ ] Add/Remove toggle
- [ ] Real-time cost calculator
  - [ ] Updates immediately on service change
  - [ ] Breakdown by category
  - [ ] Comparison to budget
- [ ] Autosave indicator
  - [ ] "Saving..." feedback
  - [ ] "All changes saved" confirmation
- [ ] Messaging interface
  - [ ] List of vendor conversations
  - [ ] Message thread view
  - [ ] Send message form
  - [ ] Real-time message delivery
  - [ ] Unread message indicators
- [ ] Export/Print package summary
- [ ] Finalize package button

## Admin Panel
- [ ] Dashboard overview
  - [ ] Total clients
  - [ ] Active dashboards
  - [ ] Revenue metrics
- [ ] Client dashboards list
  - [ ] Search/filter clients
  - [ ] View any client dashboard
  - [ ] Real-time updates from client changes
  - [ ] Status indicators
- [ ] Vendor management
  - [ ] List all vendors
  - [ ] Edit vendor details
  - [ ] Activate/deactivate vendors
  - [ ] View vendor assignments
- [ ] Vendor onboarding
  - [ ] Simple onboarding form
    - [ ] Business name
    - [ ] Service category
    - [ ] Description
    - [ ] Pricing
    - [ ] Contact details
  - [ ] One-click add to system
  - [ ] Welcome email automation
- [ ] Message oversight
  - [ ] View all conversations
  - [ ] Join conversations if needed
- [ ] Analytics (nice to have)
  - [ ] Popular services
  - [ ] Average package cost
  - [ ] Conversion rates

## Real-time Features
- [ ] Dashboard updates
  - [ ] Client adds service → Admin sees immediately
  - [ ] Admin updates vendor → Client sees immediately
  - [ ] Cost recalculates in real-time
- [ ] Messaging
  - [ ] Messages appear instantly
  - [ ] Typing indicators (nice to have)
  - [ ] Read receipts
- [ ] Status synchronization
  - [ ] Dashboard status changes sync across users

## Autosave System
- [ ] Debounced save (500ms after last change)
- [ ] Save indicator in UI
- [ ] No data loss on browser refresh
- [ ] Conflict resolution (if needed)
- [ ] Save queue for offline support (nice to have)

## Authentication & Authorization
- [ ] User registration
- [ ] Email/password login
- [ ] Password reset
- [ ] Role-based access control
  - [ ] Client role
  - [ ] Vendor role
  - [ ] Admin role
- [ ] Protected routes
- [ ] Session management
- [ ] Logout functionality

## Database
- [ ] Schema design complete
  - [ ] bookings table with event_date (unique)
  - [ ] Real-time triggers for availability updates
  - [ ] Payment tracking (deposit_paid, balance_paid)
- [ ] Migrations set up
- [ ] Row-level security policies
- [ ] Indexes on foreign keys and event_date
- [ ] Backup strategy

## UI/UX Polish
- [ ] Loading states for all async operations
- [ ] Error messages (user-friendly)
- [ ] Success notifications
- [ ] Skeleton loaders
- [ ] Empty states
- [ ] 404 page
- [ ] Mobile responsive (all breakpoints)
- [ ] Accessible (WCAG AA)
- [ ] Dark mode (nice to have)

## Performance
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading components
- [ ] Database query optimization
- [ ] Caching strategy
- [ ] Lighthouse score > 90

## SEO
- [ ] Meta tags
- [ ] Open Graph tags
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] Structured data

## Deployment
- [ ] GitHub repository created
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Custom domain (if applicable)
- [ ] SSL certificate
- [ ] Analytics integration (Google Analytics, etc.)
- [ ] Error monitoring (Sentry, etc.)

## Documentation
- [ ] README.md with setup instructions
- [ ] API documentation
- [ ] Component documentation
- [ ] Environment variables documentation
- [ ] Deployment guide

## Testing
- [ ] Unit tests for utilities
- [ ] Integration tests for critical flows
- [ ] E2E tests for user journeys
- [ ] Manual testing checklist
- [ ] Cross-browser testing
- [ ] Mobile device testing

## Security
- [ ] Input validation on all forms
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting on API routes
- [ ] Secure environment variables
- [ ] Security headers configured

## Compliance
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie consent (if applicable)
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policy

## Nice to Have (Future Enhancements)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Calendar integration
- [ ] Contract signing (e-signature)
- [ ] Invoice generation
- [ ] Payment plans
- [ ] Vendor reviews/ratings
- [ ] Photo gallery
- [ ] Wedding timeline builder
- [ ] Guest list management
- [ ] Mobile app
