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
    iKey: 'baf55979-59e5-4aa3-9f4f-7fcefa2ec6ec'
  }
}
