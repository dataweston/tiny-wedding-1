import { z } from 'zod'

// Booking validations
export const createBookingSchema = z.object({
  eventDate: z.string().min(1, 'Event date is required'),
  packageType: z.enum(['fast', 'custom']),
  clientEmail: z.string().email().optional(),
  clientName: z.string().optional(),
})

export const bookingIdSchema = z.object({
  id: z.string().uuid('Invalid booking ID'),
})

// Dashboard validations
export const updateDashboardSchema = z.object({
  totalCost: z.number().min(0).optional(),
  status: z.enum(['BUILDING', 'SUBMITTED', 'APPROVED']).optional(),
  questionnaireData: z.record(z.string(), z.any()).optional(),
})

export const questionnaireSchema = z.object({
  weddingDate: z.string().min(1),
  venue: z.string().min(1),
  guestCount: z.number().min(1).max(500),
  budget: z.number().min(1000),
  preferences: z.record(z.string(), z.any()).optional(),
})

// Service validations
export const addServiceSchema = z.object({
  vendorId: z.string().uuid('Invalid vendor ID'),
  serviceName: z.string().min(1, 'Service name is required'),
  serviceDescription: z.string().optional(),
  cost: z.number().min(0, 'Cost must be positive'),
})

export const serviceIdSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID'),
})

// Vendor validations
export const createVendorSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  basePrice: z.number().min(0, 'Base price must be positive'),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
})

// Message validations
export const sendMessageSchema = z.object({
  dashboardId: z.string().uuid('Invalid dashboard ID'),
  recipientId: z.string().uuid('Invalid recipient ID'),
  content: z.string().min(1, 'Message content is required').max(5000),
})

// Payment validations
export const processDepositSchema = z.object({
  sourceId: z.string().min(1, 'Payment source is required'),
  bookingId: z.string().uuid('Invalid booking ID'),
})

export const processBalanceSchema = z.object({
  sourceId: z.string().min(1, 'Payment source is required'),
  bookingId: z.string().uuid('Invalid booking ID'),
})

// Auth validations
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(1, 'Full name is required'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
