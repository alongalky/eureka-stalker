const logger = require('../../logger/logger')()

// module.exports = ({ config, gce }) => ({
module.exports = ({ config, gce }) => ({
  controls: 'google',
  getTaskIds: () => {
    return gce.getVMs().then(([vms]) => {
      logger.info(`Found ${vms.length} VMs on google cloud. Extracting types and taskIds`)
      return vms
        .map(vm => vm.metadata.tags.items)
        .filter(tags => tags && tags.includes('type-runner'))
        .map(tags => tags.find(tag => tag.startsWith('task-')))
        .map(fullTag => fullTag.substr('task-'.length))
    })
  }
})
