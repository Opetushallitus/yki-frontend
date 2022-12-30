const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    NODE_ENV: 'production',
  },
  viewportWidth: 1440,
  retries: 1,
  defaultCommandTimeout: 8000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000/yki/',
  },
})
