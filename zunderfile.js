const zunder = require('zunder')
const { browserifyOptions } = zunder.config

// enable sourcemaps
browserifyOptions.debug = true

zunder.setConfig({
  browserifyOptions,
  deployBranch: 'gh-pages',
  staticGlobs: {
    'static/**': '',
    'vendor/fonts/**': '/fonts',
  },
  stylesheets: {
    'src/main.styl': {
      watch: ['src/**/*.styl'],
      output: 'app.css',
    },
  },
})
