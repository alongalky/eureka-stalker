const schedule = require('node-schedule')
const winston = require('winston')
const aiLogger = require('winston-azure-application-insights').AzureApplicationInsightsLogger
const fs = require('fs')
const config = require('./config/config')(fs, require)
const { getInitializingTasks } = require('./database/tasks')
const alert = require('./alert/alert')
const stuckInInitJob = require('./jobs/stuck-init')({ getInitializingTasks, alert })

// Set up logging through winston
winston.configure({
  transports: [
    new (winston.transports.Console)({
      formatter: (options) =>
        new Date().toISOString() + ' ' + options.level.toUpperCase() + ' ' + (options.message || '')
    })
  ]
})

// Set up Application Insights winston transport
winston.add(aiLogger, {
  key: config.applicationInsights.iKey
})

// Schedule jobs
schedule.scheduleJob('*/5 * * * *', () => {
  winston.info('Scanning for machines stuck in Initializing status')
  stuckInInitJob()
})

