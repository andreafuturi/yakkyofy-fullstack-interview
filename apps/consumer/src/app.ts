import { Connection } from 'rabbitmq-client'
import config from './config'
import { connection } from './database'
import { takeScreenshot } from './services/takeScreenshot'

const rabbit = new Connection(config.RABBIT_MQ)
rabbit.on('error', err => console.error('RabbitMQ connection error', err))
rabbit.on('connection', () => console.info('RabbitMQ Connection successfully (re)established'))

rabbit
  .createConsumer({ queue: 'screenshots' }, async msg => {
    console.log('Connection state:', connection.readyState)
    console.log('Received message:', msg.body)

    try {
      await takeScreenshot(msg.body.id)
    } catch (error) {
      console.error('❌ Processing error:', error)
    }
  })
  .on('error', err => console.error('❌ Consumer error:', err))

async function onShutdown() {
  console.info('SIGTERM signal received: closing RabbitMQ connections')
  await rabbit.close()
}

process.on('SIGINT', onShutdown)
process.on('SIGTERM', onShutdown)
