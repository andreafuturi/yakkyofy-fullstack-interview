import { reactive } from 'vue'
import { ScreenshotStatusType } from '@interview/types/models/screenshot'
import { api } from '../utils/api'

/**
 * Vue composable that manages website screenshot capture functionality.
 * Handles the entire screenshot lifecycle including request submission,
 * status polling, and result retrieval. Maintains state for loading,
 * progress tracking and error handling. Supports cancellation.
 * 
 * Example: const { capture, cancel, screenshot } = useScreenshotCapturer()
 *
 * To use: Pass a URL string to the capture() function to initiate a screenshot.
 * Monitor screenshot.stauts to know current capturing progress.
 * The resulting image will be stored in screenshot.image when complete.
 * Any error message will be storend in screenshot.url
 * Call cancel() to abort an in-progress capture.
 *
 * Returns reactive screenshot state and control functions for
 * initiating and canceling captures.
 */

/** 
 * 📸 Screenshot capture state management
 * @typedef {Object} ScreenshotClientState
 * @property {string|null} url - Target URL to capture
 * @property {string|null} file - Resulting screenshot file path
 * @property {'initial'|'sending'|ScreenshotStatusType} status - Current capture status
 * @property {string|null} error - Error message if any
 */
interface ScreenshotClientState {
  url: string | null
  file: string | null
  status: 'initial' | 'sending' | ScreenshotStatusType
  error: string | null
}
//⚙️ Configuration constants
const POLL_INTERVAL = 1000 // ms between status checks

export function useScreenshotCapturer() {
  const screenshot = reactive<ScreenshotClientState>({
    url: null,
    status: 'initial',
    file: null,
    error: null
  })

  let pollerId: ReturnType<typeof setInterval> | null = null

  /**
   * 🚀 Polls the server for screenshot status until completion or error
   * @param {string} screenshotId - Screenshot ID to poll for
   */
  function startPolling(screenshotId: string) {
    const checkStatus = async () => {
      try {
        const response = await api('GET', `/api/screenshot/${screenshotId}`)
        const { status, file, error } = response

        // 🔄 Update status based on server response
        Object.assign(screenshot, { status, file, error })

        if (status === 'done') {
          localStorage.removeItem('screenshotId')
          if (pollerId) clearInterval(pollerId)
        }
      } catch (error) {
        handleError(error)
      }
    }

    checkStatus()
    pollerId = setInterval(checkStatus, POLL_INTERVAL)
  }

  /**
   * 🔍 Ensures URL is valid and properly formatted
   * @param {string} urlString - URL to validate
   * @returns {URL} Validated URL object
   * @throws {Error} If URL is invalid
   */
  function validateUrl(urlString: string): URL {
    try {
      return new URL(urlString)
    } catch {
      throw new Error(`Invalid URL: "${urlString}". Please enter a valid website address (e.g., https://example.com).`)
    }
  }

  /**
   * 📸 Sends screenshot request to the server
   * @param {URL} url - Validated URL to capture
   * @returns {Promise<string>} Screenshot ID
   */
  async function sendScreenshotRequest(url: URL): Promise<string> {
    try {
      const { id: screenshotId } = await api('POST', '/api/screenshot-request', {
        url: url.toString()
      })
      return screenshotId
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Request failed')
    }
  }

  /**
   * 🎯 Handles successful screenshot request
   */
  function handleCaptureSuccess(screenshotId: string): void {
    localStorage.setItem('screenshotId', screenshotId)
    screenshot.status = 'queued'
    startPolling(screenshotId)
  }

  /**
   * 📸 Initiates screenshot capture process and starts polling for results
   * @param {string} urlString - The URL to capture
   */
  async function capture(urlString: string) {
    try {
      screenshot.error = null
      screenshot.file = null
      screenshot.status = 'sending' // 🔄 First we're sending

      const url = validateUrl(urlString.trim())
      const screenshotId = await sendScreenshotRequest(url)
      handleCaptureSuccess(screenshotId)
    } catch (error) {
      handleError(error)
    }
  }

  /**
   * 🚨 Centralizes error handling and state cleanup
   * @param {unknown} error - The error to handle
   */
  function handleError(error: unknown) {
    screenshot.error = error instanceof Error ? error.message : 'An unexpected error occurred'
    screenshot.status = 'initial' // 🔄 Reset to starting state
    if (pollerId) clearInterval(pollerId)
  }

  // 🧹 Cleanup function
  function cancel() {
    screenshot.status = 'initial' // 🔄 Reset to starting state
    screenshot.file = null
    screenshot.error = null
    localStorage.removeItem('screenshotId')
    if (pollerId) clearInterval(pollerId)
  }

  // 🔄 Initialize polling if there's an existing screenshot request
  const existingScreenshotId = localStorage.getItem('screenshotId')
  if (existingScreenshotId) {
    screenshot.status = 'queued'
    startPolling(existingScreenshotId)
  }

  return { screenshot, capture, cancel }
}
