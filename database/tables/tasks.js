const connection = require('../connection')

module.exports = {
  getInitializingTasks: () => {
    const query =
      'SELECT tasks.task_id, tasks.status, tasks.timestamp_initializing ' +
      'FROM tasks ' +
      'WHERE tasks.status = ?'

    return connection().query(query, ['Initializing'])
      .then(([rows, fields]) => rows)
  },
  getUnfinishedTasks: () => {
    const query =
      'SELECT tasks.task_id, tasks.status, tasks.timestamp_initializing ' +
      'FROM tasks ' +
      'WHERE tasks.status <> "Done" AND tasks.status <> "Error"'

    return connection().query(query, ['Initializing'])
      .then(([rows, fields]) => rows)
  }
}
