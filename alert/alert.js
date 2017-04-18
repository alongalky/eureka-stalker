const appInsights = require('applicationinsights')
const fs = require('fs')
const config = require('./config/config')(fs, require)
const client = appInsights.getClient(config.applicationInsights.iKey)

module.exports = error => {
  client.trackException(error)
}
