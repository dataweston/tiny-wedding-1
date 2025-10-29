const APP_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH && process.env.NEXT_PUBLIC_BASE_PATH !== '/'
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : '/tiny-weddings'

function normalizePath(path: string): string {
  if (!path) return '/'
  return path.startsWith('/') ? path : `/${path}`
}

export function withAppBasePath(path: string): string {
  const normalizedPath = normalizePath(path)

  if (!APP_BASE_PATH || APP_BASE_PATH === '/') {
    return normalizedPath
  }

  return normalizedPath.startsWith(APP_BASE_PATH)
    ? normalizedPath
    : `${APP_BASE_PATH}${normalizedPath === '/' ? '' : normalizedPath}`
}

export function buildAbsoluteAppUrl(path: string): string {
  if (!path) {
    return typeof window !== 'undefined'
      ? new URL(withAppBasePath('/'), window.location.origin).toString()
      : withAppBasePath('/')
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const target = withAppBasePath(path)

  if (typeof window === 'undefined') {
    return target
  }

  return new URL(target, window.location.origin).toString()
}

export { APP_BASE_PATH }

