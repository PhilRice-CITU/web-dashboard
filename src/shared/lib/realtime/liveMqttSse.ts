import { supabase } from '#/shared/lib/supabase'

type LiveMqttPayload = {
  channel?: string
  device_id?: string
  payload?: {
    session_id?: string
    frame_base64?: string
    content_type?: string
  }
}

type LiveMqttListener = (event: LiveMqttPayload) => void
export type LiveMqttConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'

type LiveMqttStatusListener = (status: LiveMqttConnectionStatus) => void

const listeners = new Set<LiveMqttListener>()
const statusListeners = new Set<LiveMqttStatusListener>()
let eventSource: EventSource | null = null
let reconnectTimer: number | null = null
let reconnectAttempt = 0
let connecting = false
let authUnsubscribe: (() => void) | null = null
let connectionStatus: LiveMqttConnectionStatus = 'idle'

const RECONNECT_BASE_DELAY_MS = 1000
const RECONNECT_MAX_DELAY_MS = 15000

function setConnectionStatus(nextStatus: LiveMqttConnectionStatus) {
  if (connectionStatus === nextStatus) {
    return
  }
  connectionStatus = nextStatus
  statusListeners.forEach((listener) => listener(connectionStatus))
}

function cleanupEventSource() {
  if (!eventSource) {
    return
  }
  eventSource.close()
  eventSource = null
}

function teardownConnectionState() {
  clearReconnectTimer()
  reconnectAttempt = 0
  cleanupEventSource()
  setConnectionStatus('idle')
}

function setupAuthWatcher() {
  if (authUnsubscribe) {
    return
  }

  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      teardownConnectionState()
      return
    }

    if (
      event === 'TOKEN_REFRESHED' ||
      event === 'SIGNED_IN' ||
      event === 'INITIAL_SESSION'
    ) {
      if (listeners.size === 0) {
        return
      }
      // Force new EventSource URL with latest access token.
      cleanupEventSource()
      void ensureConnected()
    }
  })

  authUnsubscribe = () => {
    data.subscription.unsubscribe()
  }
}

function cleanupAuthWatcher() {
  if (!authUnsubscribe) {
    return
  }
  authUnsubscribe()
  authUnsubscribe = null
}

function clearReconnectTimer() {
  if (reconnectTimer === null) {
    return
  }
  window.clearTimeout(reconnectTimer)
  reconnectTimer = null
}

function scheduleReconnect() {
  if (listeners.size === 0 || reconnectTimer !== null) {
    return
  }

  setConnectionStatus('reconnecting')

  const delay = Math.min(
    RECONNECT_BASE_DELAY_MS * 2 ** reconnectAttempt,
    RECONNECT_MAX_DELAY_MS,
  )
  reconnectAttempt += 1

  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null
    void ensureConnected()
  }, delay)
}

async function ensureConnected() {
  if (connecting || eventSource || listeners.size === 0) {
    return
  }

  connecting = true
  if (reconnectAttempt > 0) {
    setConnectionStatus('reconnecting')
  } else {
    setConnectionStatus('connecting')
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      scheduleReconnect()
      return
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
    const url = `${apiBase}/live/events?token=${encodeURIComponent(session.access_token)}`
    const source = new EventSource(url)
    eventSource = source

    source.onopen = () => {
      reconnectAttempt = 0
      setConnectionStatus('connected')
    }

    source.onerror = () => {
      cleanupEventSource()
      scheduleReconnect()
    }

    source.addEventListener('mqtt', (event) => {
      if (!(event instanceof MessageEvent)) {
        return
      }

      try {
        const parsed = JSON.parse(event.data) as LiveMqttPayload
        listeners.forEach((listener) => listener(parsed))
      } catch {
        // Ignore malformed payloads.
      }
    })
  } finally {
    connecting = false
  }
}

export function subscribeToLiveMqttEvents(
  listener: LiveMqttListener,
): () => void {
  setupAuthWatcher()
  listeners.add(listener)
  if (listeners.size === 1) {
    void ensureConnected()
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size > 0) {
      return
    }

    teardownConnectionState()
    cleanupAuthWatcher()
  }
}

export function subscribeToLiveMqttStatus(
  listener: LiveMqttStatusListener,
): () => void {
  statusListeners.add(listener)
  listener(connectionStatus)

  return () => {
    statusListeners.delete(listener)
  }
}
