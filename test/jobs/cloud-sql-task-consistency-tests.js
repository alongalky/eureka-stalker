const logger = require('../../logger/logger')
logger.silence = true
const sinon = require('sinon')
require('sinon-stub-promise')(sinon)
const moment = require('moment')

const gracePeriodInMinutes = 5

describe('Cloud-SQL task consistency', () => {
  const database = {
    tasks: {
      getUnfinishedTasks: sinon.stub()
    }
  }
  const cloud = {
    getTaskIds: sinon.stub()
  }
  const alert = sinon.stub()
  const consistencyCheck = require('../../jobs/cloud-sql-task-consistency')({ database, cloud, alert })
  const [ InitializingStatus, RunningStatus ] = ['Initializing', 'Running']

  beforeEach(() => {
    database.tasks.getUnfinishedTasks.reset()
    cloud.getTaskIds.reset()
    alert.reset()
  })
  it('does not alert on happy flow', done => {
    database.tasks.getUnfinishedTasks.resolves([{
      task_id: 'task1',
      status: RunningStatus
    }])
    cloud.getTaskIds.resolves(['task1'])

    consistencyCheck().then(() => {
      sinon.assert.notCalled(alert)
      done()
    })
  })

  describe('VMs => DB', () => {
    it('alerts if there is a VM without a database task', done => {
      database.tasks.getUnfinishedTasks.resolves([])
      cloud.getTaskIds.resolves(['task1'])

      consistencyCheck().then(() => {
        sinon.assert.calledOnce(alert)
        done()
      })
    })
    it('does not alert if there is a VM with a database task in Running state', done => {
      database.tasks.getUnfinishedTasks.resolves([{ task_id: 'task1', status: RunningStatus }])
      cloud.getTaskIds.resolves(['task1'])

      consistencyCheck().then(() => {
        sinon.assert.notCalled(alert)
        done()
      })
    })
  })
  describe('DB => VMs', () => {
    it('alerts if there is a database task in Initializing without a matching VM, with timestamp_initializing older than grace period', done => {
      database.tasks.getUnfinishedTasks.resolves([{
        task_id: 'task1',
        status: InitializingStatus,
        timestamp_initializing: moment().subtract(gracePeriodInMinutes + 1, 'minutes')
      }])
      cloud.getTaskIds.resolves([])

      consistencyCheck().then(() => {
        sinon.assert.calledOnce(alert)
        done()
      })
    })
    it('does not alert if there is a database task in Initializing without a VM, with timestamp_initializing newer than grace period', done => {
      database.tasks.getUnfinishedTasks.resolves([{
        task_id: 'task1',
        status: InitializingStatus,
        timestamp_initializing: moment().subtract(gracePeriodInMinutes - 1, 'minutes')
      }])
      cloud.getTaskIds.resolves([])

      consistencyCheck().then(() => {
        sinon.assert.notCalled(alert)
        done()
      })
    })
    it('alerts if there is a database task in Running without a VM', done => {
      database.tasks.getUnfinishedTasks.resolves([{ task_id: 'task1', status: RunningStatus }])
      cloud.getTaskIds.resolves([])

      consistencyCheck().then(() => {
        sinon.assert.calledOnce(alert)
        done()
      })
    })
  })
})
