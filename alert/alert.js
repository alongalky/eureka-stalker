const appInsights = require('applicationinsights')
const fs = require('fs')
const config = require('../config/config')(fs, require)
const client = appInsights.getClient(config.applicationInsights.iKey)
const logger = require('../logger/logger')()

module.exports = error => {
  client.trackException(error)
  // TODO: remove when we trust the trackException line enough
  logger.error(error)
}
