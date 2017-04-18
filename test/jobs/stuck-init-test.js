const sinon = require('sinon')
const expect = require('chai').expect
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
      getInitializingTasks.returns(Promise.resolve([]))
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

      getInitializingTasks.returns(Promise.resolve(tasks))
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

      getInitializingTasks.returns(Promise.resolve(tasks))
      stuckInInitJob()
        .then(() => {
          sinon.assert.calledOnce(alert)
          done()
        }).catch(err => console.error(err))
    })
  })
})
