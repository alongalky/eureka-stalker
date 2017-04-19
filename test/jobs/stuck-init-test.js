const logger = require('../../logger/logger')
logger.silence = true
const sinon = require('sinon')
const sinonStubPromise = require('sinon-stub-promise')
sinonStubPromise(sinon)
const moment = require('moment')

describe('Jobs', () => {
  describe('stuck-init', () => {
    const alert = sinon.stub()
    const getInitializingTasks = sinon.stub()
    const stuckInInitJob = require('../../jobs/stuck-init')({ getInitializingTasks, alert })

    beforeEach(() => {
      alert.reset()
    })

    it('No alerts on happy flow, no tasks', done => {
      getInitializingTasks.resolves([])
      stuckInInitJob()
        .then(() => {
          sinon.assert.notCalled(alert)
          done()
        })
    })
    it('No alerts on happy flow, tasks not too old', done => {
      const tasks = [
        { timestamp_initializing: moment().subtract(5, 'minutes').toDate() }
      ]
      getInitializingTasks.resolves(tasks)

      stuckInInitJob()
        .then(() => {
          sinon.assert.notCalled(alert)
          done()
        })
    })
    it('Alert when task is old', done => {
      const tasks = [
        { timestamp_initializing: moment().subtract(50, 'minutes').toDate() }
      ]
      getInitializingTasks.resolves(tasks)

      stuckInInitJob()
        .then(() => {
          sinon.assert.calledOnce(alert)
          done()
        })
    })
  })
})
