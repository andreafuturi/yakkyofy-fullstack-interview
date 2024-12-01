import { exec } from 'child_process'
import { promisify } from 'util'
import { Screenshot } from '@interview/models'
import fs from 'fs/promises'
import { IScreenshot } from '@interview/types/models/screenshot'

const execAsync = promisify(exec)

// Screenshot dimensions
const SCREENSHOT_WIDTH = 1280
const SCREENSHOT_HEIGHT = 800

// Timeout for screenshot processing
const SCREENSHOT_TIMEOUT = 30000

/**
 * Process a screenshot request
 * @param id Screenshot document ID
 */
export const takeScreenshot = async (id: string): Promise<void> => {
  const screenshot = await Screenshot.findOne({ _id: id })
  console.log('🔍 Processing screenshot:', screenshot)

  if (!screenshot) {
    throw new Error('❌ Screenshot document not found')
  }

  // Validate URL before processing
  try {
    const url = new URL(screenshot.url)
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid URL protocol')
    }
  } catch {
    await screenshot.updateOne({ status: 'error', error: '❌ Invalid URL format' })
    throw new Error('Invalid URL format')
  }

  // Type the update operations
  const updateData: Partial<IScreenshot> = {
    status: 'processing'
  }
  await screenshot.updateOne(updateData)

  const tempPath = `/tmp/screenshot-${id}.png`

  try {
    await screenshot.updateOne(updateData)

    console.log('📸 Taking screenshot...')

    // Add timeout of 30 seconds
    await Promise.race([
      execAsync([
        'chromium-browser',
        '--headless',
        '--disable-gpu',
        `--screenshot="${tempPath}"`,
        `--window-size=${SCREENSHOT_WIDTH},${SCREENSHOT_HEIGHT}`,
        `"${screenshot.url}"`
      ].join(' ')),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Screenshot timeout')), SCREENSHOT_TIMEOUT)
      )
    ])

    console.log('📸 Screenshot taken successfully')
    // Read the screenshot file
    const screenshotBuffer = await fs.readFile(tempPath)
    const screenshotBase64 = screenshotBuffer.toString('base64')

    // Type the success update
    const successUpdate: Partial<IScreenshot> = {
      file: `data:image/png;base64,${screenshotBase64}`,
      status: 'done',
      mimeType: 'image/png',
      metadata: {
        width: SCREENSHOT_WIDTH,
        height: SCREENSHOT_HEIGHT,
        size: screenshotBuffer.byteLength,
        takenAt: new Date()
      }
    }
    await screenshot.updateOne(successUpdate)

    console.log('✅ Screenshot processed successfully')
  } catch (error) {
    console.error('❌ Error processing screenshot:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Detailed error:', errorMessage)

    // Type the error update
    const errorUpdate: Partial<IScreenshot> = {
      error: errorMessage
    }
    await screenshot.updateOne(errorUpdate)
    throw error
  } finally {
    // Clean up temp file regardless of success/failure
    try {
      await fs.unlink(tempPath)
    } catch (unlinkError) {
      console.error("❌ Failed to clean up temp file, maybe it wasn't created yet:", unlinkError)
    }
  }
}
