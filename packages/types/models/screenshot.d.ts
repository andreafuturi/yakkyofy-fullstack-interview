import { ITimestamps } from './base'

/** Status of the screenshot processing pipeline */
export const ScreenshotStatus = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  DONE: 'done'
} as const

/** Screenshot status type */
export type ScreenshotStatusType = (typeof ScreenshotStatus)[keyof typeof ScreenshotStatus]

/** Screenshot document interface */
export interface IScreenshot extends ITimestamps {
  /** URL of the webpage to capture */
  url: string
  /** Base64 encoded image data */
  file: string
  /** Current status of the screenshot */
  status: ScreenshotStatusType
  /** MIME type of the image (e.g., 'image/png') */
  mimeType: string
  /** Error message if screenshot capture failed */
  error?: string
  /** Additional metadata about the screenshot */
  metadata?: {
    /** Width of the image in pixels */
    width?: number
    /** Height of the image in pixels */
    height?: number
    /** Size of the file in bytes */
    size?: number
    /** When the screenshot was captured */
    takenAt?: Date
  }
}