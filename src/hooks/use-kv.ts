// Mock replacement for @github/spark/hooks useKV
import { useState, useCallback, useEffect } from 'react'

// Global state store for KV pairs
const kvStore = new Map<string, any>()
const kvListeners = new Map<string, Set<(value: any) => void>>()

// Function to initialize data from localStorage
const initializeFromStorage = (key: string, defaultValue: any) => {
  if (kvStore.has(key)) {
    return kvStore.get(key)
  }
  
  try {
    const item = localStorage.getItem(key)
    const value = item ? JSON.parse(item) : defaultValue
    kvStore.set(key, value)
    return value
  } catch {
    kvStore.set(key, defaultValue)
    return defaultValue
  }
}

// Function to notify all listeners of a key change
const notifyListeners = (key: string, value: any) => {
  const listeners = kvListeners.get(key)
  if (listeners) {
    listeners.forEach(listener => listener(value))
  }
}

export function useKV<T = any>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T>(() => initializeFromStorage(key, defaultValue))

  // Set up listener for changes to this key
  useEffect(() => {
    const listener = (newValue: T) => {
      setValue(newValue)
    }

    if (!kvListeners.has(key)) {
      kvListeners.set(key, new Set())
    }
    kvListeners.get(key)!.add(listener)

    // Cleanup listener on unmount
    return () => {
      const listeners = kvListeners.get(key)
      if (listeners) {
        listeners.delete(listener)
        if (listeners.size === 0) {
          kvListeners.delete(key)
        }
      }
    }
  }, [key])

  const set = useCallback((newValue: T) => {
    try {
      kvStore.set(key, newValue)
      localStorage.setItem(key, JSON.stringify(newValue))
      notifyListeners(key, newValue)
    } catch (error) {
      console.error('Failed to set value in localStorage:', error)
    }
  }, [key])

  const remove = useCallback(() => {
    try {
      const resetValue = defaultValue as T
      kvStore.set(key, resetValue)
      localStorage.removeItem(key)
      notifyListeners(key, resetValue)
    } catch (error) {
      console.error('Failed to remove value from localStorage:', error)
    }
  }, [key, defaultValue])

  return { value, set, remove }
}

// Mock for spark.kv global
export const sparkKV = {
  async get<T>(key: string): Promise<T | null> {
    if (kvStore.has(key)) {
      return kvStore.get(key)
    }
    
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  async set<T>(key: string, value: T): Promise<void> {
    try {
      kvStore.set(key, value)
      localStorage.setItem(key, JSON.stringify(value))
      notifyListeners(key, value)
    } catch (error) {
      console.error('Failed to set value in localStorage:', error)
    }
  },
  
  async delete(key: string): Promise<void> {
    try {
      kvStore.delete(key)
      localStorage.removeItem(key)
      notifyListeners(key, undefined)
    } catch (error) {
      console.error('Failed to remove value from localStorage:', error)
    }
  }
}

// Create global spark object for compatibility
declare global {
  var spark: {
    kv: typeof sparkKV
  }
}

if (typeof window !== 'undefined') {
  window.spark = { kv: sparkKV }
}
