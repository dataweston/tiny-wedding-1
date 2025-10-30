// Admin email addresses with full admin privileges
const ADMIN_EMAILS = [
  'dataweston@gmail.com',
  'soupsistersmn@gmail.com'
]

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS]
}
