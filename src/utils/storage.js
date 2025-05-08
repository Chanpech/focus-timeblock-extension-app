// Helper functions for working with chrome.storage or localStorage fallback

// Check if chrome.storage is available
const isExtensionEnvironment = typeof chrome !== "undefined" && typeof chrome.storage !== "undefined"

// Save data to storage
export const saveToStorage = (key, data) => {
  if (isExtensionEnvironment) {
    chrome.storage.local.set({ [key]: data })
  } else {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

// Load data from storage
export const loadFromStorage = (key, defaultValue) => {
  return new Promise((resolve) => {
    if (isExtensionEnvironment) {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] !== undefined ? result[key] : defaultValue)
      })
    } else {
      const data = localStorage.getItem(key)
      resolve(data !== null ? JSON.parse(data) : defaultValue)
    }
  })
}

// Save multiple items to storage
export const saveMultipleToStorage = (items) => {
  if (isExtensionEnvironment) {
    chrome.storage.local.set(items)
  } else {
    Object.entries(items).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value))
    })
  }
}
