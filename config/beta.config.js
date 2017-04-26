const instanceName = 'eureka-beta:us-east1:eureka-beta-sql'

module.exports = {
  database: {
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'roboto',
    password: 'tHMu4ZXuMJHuT8hFccEZVmZ6',
    database: 'eureka_beta',
    socketPath: `/cloudsql/${instanceName}`
  },
  applicationInsights: {
    iKey: '1545834d-4b46-4869-b3db-a227850f46f0'
  }
}
