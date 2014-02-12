module.exports = (grunt) ->
  grunt.initConfig(
    pkg: grunt.file.readJSON('package.json'),

    bower:
      install:
        options:
          install: true
          copy: false

    coffee:
      compile:
        expand: true,
        flatten: false,
        cwd: 'src',
        src: ['**/*.coffee'],
        dest: 'dist/',
        ext: '.js'

    coffeelint:
      app: ['src/**/*.coffee'],
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
      bower: ['bower_components']

    copy:
      assets:
        expand: true,
        flatten: false,
        cwd: 'src',
        src: 'assets/console/index.html',
        dest: 'dist/'
      console:
        expand: true,
        flatten: true,
        files: [
          {
            expand: true,
            flatten: true,
            src: 'bower_components/api-console/dist/authentication/*.*',
            dest: 'dist/assets/console/authentication/'
          },
          {
            expand: true,
            flatten: true,
            src: 'bower_components/api-console/dist/font/*.*',
            dest: 'dist/assets/console/font/'
          },
          {
            expand: true,
            flatten: true,
            src: 'bower_components/api-console/dist/scripts/app.js',
            dest: 'dist/assets/console/scripts/'
          },
          {
            expand: true,
            flatten: true,
            src: 'bower_components/api-console/dist/scripts/vendor.js',
            dest: 'dist/assets/console/scripts/'
          },
          {
            expand: true,
            flatten: true,
            src: 'bower_components/api-console/dist/styles/app.css',
            dest: 'dist/assets/console/styles/'
          }
        ]
      license:
        expand: true,
        flatten: false,
        src: 'LICENSE',
        dest: 'dist/'

    watch:
      development:
        files: ['src/**/*.coffee', 'test/**/*.coffee', 'test/**/*.raml'],
        tasks: ['coffeelint', 'mochaTest'],
        options:
          atBegin: true
  )

  require('load-grunt-tasks') grunt

  #TODO: Add https://github.com/vojtajina/grunt-npm for npm publishing
  grunt.registerTask 'default', ['clean:build', 'watch']
  grunt.registerTask 'release', ['clean', 'bower:install', 'coffeelint', 'coffee', 'mochaTest', 'copy', 'clean:bower']
