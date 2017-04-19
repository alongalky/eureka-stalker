const database = require('./database')

module.exports = {
  getInitializingTasks: () => {
    const query =
      'SELECT tasks.task_id, tasks.status, tasks.timestamp_initializing ' +
      'FROM tasks ' +
      'WHERE tasks.status = ?'

    return database().query(query, ['Initializing'])
      .then(([rows, fields]) => rows)
  }
}
