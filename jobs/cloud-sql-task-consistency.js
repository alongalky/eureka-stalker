const logger = require('../logger/logger')()
const moment = require('moment')

const gracePeriodInMinutes = 5

module.exports = ({ database, cloud, alert }) => () => {
  return Promise.all([database.tasks.getUnfinishedTasks(), cloud.getTaskIds()])
    .then(([dbTasks, cloudVMTaskIds]) => {
      logger.info(`Beginning consistency checks for ${dbTasks.length} ongoing db tasks and ${cloudVMTaskIds.length} cloud VMs`)
      const dbTasksByTaskId = dbTasks.reduce((dict, task) => Object.assign(dict, { [task.task_id]: task }), {})
      const cloudVMsByTaskId = cloudVMTaskIds.reduce((dict, taskId) => Object.assign(dict, { [taskId]: taskId }), {})

      for (let vmTaskId of cloudVMTaskIds) {
        if (!dbTasksByTaskId[vmTaskId]) {
          alert(`VM with taskId ${vmTaskId} does not appear in database as an ongoing task`)
        }
      }
      for (let dbTask of dbTasks) {
        const vmTaskId = cloudVMsByTaskId[dbTask.task_id]

        switch (dbTask.status) {
          case 'Initializing':
            const taskAgeInMinutes = moment().diff(dbTask.timestamp_initializing, 'minutes')
            if (!vmTaskId && taskAgeInMinutes > gracePeriodInMinutes) {
              alert(`Task with ID ${dbTask.task_id} has been in Initializing state for ${taskAgeInMinutes} minutes ` +
                'but does not have a cloud VM running')
            }
            break
          case 'Running':
            if (!vmTaskId) {
              alert(`Task with ID ${dbTask.task_id} is in Running state, but does not have a cloud VM`)
            }
            break
          default:
        }
      }
      logger.info(`Finished consistency checks.`)
    }).catch(err => {
      logger.error(err)
    })
}
