import { Router } from 'express'
import screenshotController from '../controllers/screenshot.controller'

const router = Router()

/**
 * Create screenshot request
 * @route POST /screenshot-request
 */
router.post('/screenshot-request', screenshotController.createScreenshot)

/**
 * Get screenshot by ID
 * @route GET /screenshot/:id
 */
router.get('/screenshot/:id', screenshotController.getScreenshot)

export default router