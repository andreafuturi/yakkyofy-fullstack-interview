import { Request, Response } from 'express'
import { Screenshot } from '@interview/models'
import { screenshotPublisher } from '../amqp'

/**
 * Create new screenshot request
 */
export const createScreenshot = async (req: Request, res: Response) => {
  const { url } = req.body
  if (!url) {
    return res.status(400).json({ message: 'URL is required ❌' })
  }
  // Validate URL
  try {
    new URL(url)
  } catch (error) {
    return res.status(400).json({ message: 'Invalid URL format ❌' })
  }

  try {
    // Create screenshot in DB
    const screenshot = await Screenshot.create({
      url,
      status: 'queued'
    })

    try {
      // Publish message to RabbitMQ queue
      await screenshotPublisher.send('screenshots', {
        id: screenshot._id.toString(),
        url: screenshot.url
      })
    } catch (error) {
      // Remove the screenshot entry if queue operation fails
      await Screenshot.findByIdAndDelete(screenshot._id)
      console.error('❌ Failed to queue screenshot:', error)
      return res.status(500).json({ message: 'Failed to queue screenshot request on server ❌' })
    }

    return res.status(201).json({
      message: 'Screenshot request queued successfully',
      id: screenshot._id
    })
  } catch (error) {
    console.error('❌ Failed to create screenshot:', error)
    return res.status(500).json({ message: 'Failed to create screenshot in database ❌' })
  }
}

/**
 * Get screenshot by ID
 */
export const getScreenshot = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const screenshot = await Screenshot.findById(id)
    if (!screenshot) {
      return res.status(404).json({ message: 'Screenshot not found ❌' })
    }
    return res.json(screenshot)
  } catch (error) {
    console.error('Failed to get screenshot:', error)
    return res.status(500).json({ message: 'Failed to get screenshot ❌' })
  }
}

export default {
  createScreenshot,
  getScreenshot
}
