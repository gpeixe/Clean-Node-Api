module.exports = {
  config: {
    mongodbMemoryServer: {
      version: 'latest'
    }
  },
  mongodbMemoryServerOptions: {
    binary: {
      version: 'latest',
      skipMD5: true
    },
    instance: {},
    autoStart: false
  }
}
