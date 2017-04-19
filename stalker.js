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
const { getInitializingTasks } = require('./database/tasks')
const alert = require('./alert/alert')
const stuckInInitJob = require('./jobs/stuck-init')({ getInitializingTasks, alert })

// Schedule jobs
schedule.scheduleJob('*/5 * * * *', () => {
  logger.info('Scanning for machines stuck in Initializing status')
  stuckInInitJob()
})
