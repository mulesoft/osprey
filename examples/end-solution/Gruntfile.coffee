path = require 'path'

module.exports = (grunt) ->
  grunt.initConfig(
    pkg: grunt.file.readJSON('package.json'),
    coffee:
      compile:
        expand: true,
        flatten: false,
        cwd: 'src',
        src: ['**/*.coffee']
        dest: './dist',
        ext: '.js'

    coffeelint:
      app: ['src/**/*.coffee']
      options:
        max_line_length:
          level: 'ignore'

    mochaTest:
      test:
        options:
          reporter: 'spec',
          require: 'coffee-script'
        src: ['test/**/*.coffee']

    clean:
      build: ['dist']

    nodemon:
      dev:
        options:
          file: './src/app.coffee'
          watchedFolders: ['src', 'test']
          ignoredFiles: ['node_modules/**', 'src/assets/console']

    concurrent:
      development:
        tasks: ['nodemon', 'watch']
        options:
          logConcurrentOutput: true

    copy:
      assets:
        expand: true
        flatten: false
        cwd: 'src'
        src: 'assets/**/*.*'
        dest: 'dist/'

    watch:
      wait:
        files: ['src/assets/raml/**/*.*', 'src/**/*.coffee']
        tasks: ['wait']
      assets:
        files: ['src/assets/raml/**/*.*']
        tasks: ['copy:assets']
        options:
          livereload: true
          atBegin: true
      development:
        files: ['src/**/*.coffee']
        tasks: ['coffee', 'coffeelint']
        options:
          atBegin: true
      # test:
      #   files: ['src/**/*.coffee', 'test/**/*.coffee']
      #   tasks: ['mochaTest']
      #   options:
      #     atBegin: true
  )

  require('load-grunt-tasks') grunt

  grunt.registerTask 'default', ['concurrent']

  grunt.registerTask 'wait', 'just taking some time', ->
    # Workaround for syncing watch and nodemon
    done = @async()
    setTimeout((() -> done()), 500)