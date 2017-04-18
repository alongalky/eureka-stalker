const winston = require('winston')
const moment = require('moment')

const graceTimeInMinutes = 5
const maximumLegalDurationInMinutes = 20

module.exports = ({ getInitializingTasks, alert }) => () =>
  getInitializingTasks()
    .then(tasks => {
      const oldEnoughFilter = task => moment().diff(task.timestamp_initializing, 'seconds') > graceTimeInMinutes * 60
      const addDurationMap = task => {
        const start = moment(task.timestamp_initializing)
        task.durationInSeconds = moment().diff(start, 'seconds')
        return task
      }
      const badTaskFilter = task => task.durationInSeconds * 60 > maximumLegalDurationInMinutes

      const badTasks = tasks
        .filter(oldEnoughFilter)
        .map(addDurationMap)
        .filter(badTaskFilter)

      for (let task of badTasks) {
        const message = `Task ${task.task_id} is stuck with status Initializing for ${Math.floor(task.durationInSeconds / 60)} minutes!`
        alert(new Error(message))
      }
    }).catch(err => {
      winston.error(err.toString())
    })
