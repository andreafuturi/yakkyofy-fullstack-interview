import { Connection } from 'rabbitmq-client'
import config from './config'

const rabbit = new Connection(config.RABBIT_MQ)
rabbit.on('error', err => console.error('RabbitMQ connection error', err))
rabbit.on('connection', () => console.info('Connection successfully (re)established'))

// Create publisher for screenshots queue
const screenshotPublisher = rabbit.createPublisher({
  confirm: true, // Enable publisher confirms
  maxAttempts: 3, // Retry failed publishes
  exchanges: [
    {
      exchange: 'screenshots',
      type: 'direct'
    }
  ],
  queues: [
    {
      queue: 'screenshots'
    }
  ]
})

async function onShutdown() {
  console.info('SIGTERM signal received: closing RabbitMQ connections')
  await screenshotPublisher.close()
  await rabbit.close()
}
process.on('SIGINT', onShutdown)
process.on('SIGTERM', onShutdown)

export { rabbit, screenshotPublisher }
