const schedule = require('node-schedule')
const fs = require('fs')
const config = require('./config/config')(fs, require)
const { getInitializingTasks } = require('./database/tasks')
const alert = require('./alert/alert')
const stuckInInitJob = require('./jobs/stuck-init')({ getInitializingTasks, alert })

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

// Schedule jobs
schedule.scheduleJob('*/5 * * * *', () => {
  logger.info('Scanning for machines stuck in Initializing status')
  stuckInInitJob()
})
