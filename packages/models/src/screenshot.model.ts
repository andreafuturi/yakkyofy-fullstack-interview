import { Schema, model } from 'mongoose'
import { IScreenshot } from '@interview/types/models/screenshot'

/**
 * Schema for storing webpage screenshots and their processing status
 */
const screenshotSchema = new Schema<IScreenshot>(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },
    file: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'done'],
      default: 'queued',
      required: true
    },
    mimeType: {
      type: String,
      required: false,
      trim: true
    },
    error: {
      type: String,
      required: false
    },
    metadata: {
      width: { type: Number },
      height: { type: Number },
      size: { type: Number },
      takenAt: { type: Date }
    }
  },
  { timestamps: true }
)

export default model<IScreenshot>('Screenshot', screenshotSchema)
