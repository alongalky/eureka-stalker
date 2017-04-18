const instanceName = 'dotted-vim-164110:us-east1:eureka-dev'

module.exports = {
  database: {
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'roboto',
    password: '5ffc78b9830ece36adb672e80c54789c',
    database: 'eureka_dev',
    socketPath: `/cloudsql/${instanceName}`
  },
  applicationInsights: {
    iKey: '775d8777-d33c-427f-ab5a-1bb5845e595b'
  }
}
