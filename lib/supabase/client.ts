import { createClient, type SupabaseClient, type RealtimeChannel } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null | undefined

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient !== undefined) {
    return cachedClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'Supabase environment variables are missing. Real-time features will be disabled.'
      )
    }
    cachedClient = null
    return null
  }

  cachedClient = createClient(url, anonKey)
  return cachedClient
}

function createRealtimeFallback(): SupabaseClient {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'Supabase client unavailable - real-time features disabled. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable.'
    )
  }

  const noopChannel = {
    on() {
      return noopChannel
    },
    subscribe() {
      return noopChannel
    },
    unsubscribe() {
      return { error: null }
    },
    presenceState() {
      return {}
    },
    track() {
      return { error: null }
    },
    untrack() {
      return { error: null }
    },
    send() {
      return { error: null }
    },
    updateJoinConfig() {
      return { error: null }
    },
    onBroadcast() {
      return noopChannel
    },
    onPresenceSync() {
      return noopChannel
    },
    onPresenceState() {
      return noopChannel
    },
    onPresenceDiff() {
      return noopChannel
    },
    onClose() {
      return noopChannel
    },
    onError() {
      return noopChannel
    },
    get key() {
      return 'noop'
    },
    get state() {
      return 'closed'
    },
    get topic() {
      return 'noop'
    },
    get params() {
      return {}
    },
    get socket() {
      return undefined
    }
  } as unknown as RealtimeChannel

  const noopClient: Partial<SupabaseClient> = {
    channel() {
      return noopChannel
    },
    removeChannel() {
      return Promise.resolve('ok' as const)
    },
    from() {
      const result = Promise.resolve({ data: [], error: null })
      const queryChain: any = {
        select() {
          return queryChain
        },
        neq() {
          return result
        },
        then: result.then.bind(result),
        catch: result.catch.bind(result),
        finally: result.finally.bind(result)
      }
      return queryChain
    },
    auth: {
      signInWithOAuth: async () => {
        throw new Error('Supabase client unavailable: missing environment variables. OAuth sign-in is disabled.')
      },
      // Add other auth methods as needed
    }
  }

  return noopClient as SupabaseClient
}

const client = getSupabaseClient()

export const supabase: SupabaseClient = client ?? createRealtimeFallback()
