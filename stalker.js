const fs = require('fs')
const config = require('./config/config')(fs, require)

// Set up Application Insights for logging exceptions
const appInsights = require('applicationinsights')
appInsights.setup(config.applicationInsights.iKey)
  .setAutoCollectRequests(false)
  .setAutoCollectPerformance(false)
  .start()
const AppInsightsStream = require('./logger/appInsightsStream')(appInsights.client)
const logger = require('./logger/logger')()
logger.addStream({
  name: 'aiStream',
  stream: new AppInsightsStream()
})

const schedule = require('node-schedule')
const database = require('./database/database')
const alert = require('./alert/alert')

const gce = require('@google-cloud/compute')()
const googleController = require('./cloud/google/controller')({ gce })
const controller = [googleController].find(c => c.controls === config.cloud_provider)
if (!controller) {
  throw new Error(`Could not find a cloud controller to handle ${config.cloud_provider}`)
}
const cloud = require('./cloud/agnostic')({ controller })

// Initialize jobs with dependencies
const stuckInInitJob = require('./jobs/stuck-init')({ database, alert })
const runningTasksConsistency = require('./jobs/cloud-sql-task-consistency')({ database, cloud, alert })

// Schedule jobs
schedule.scheduleJob('*/5 * * * *', () => {
  logger.info('Scanning for machines stuck in Initializing status')
  stuckInInitJob()
})
schedule.scheduleJob('*/5 * * * *', () => {
  logger.info('Verifying consistency of Running tasks between the cloud and the db')
  runningTasksConsistency()
})
