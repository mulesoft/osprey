module.exports = (grunt) ->
  grunt.initConfig(
    pkg: grunt.file.readJSON('package.json'),

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

    copy:
      assets:
        expand: true,
        flatten: false,
        cwd: 'src',
        src: 'assets/**/*.*',
        dest: 'dist/'
      license:
        expand: true,
        flatten: false,
        src: 'LICENSE',
        dest: 'dist/'

    watch:
      development:
        files: ['src/**/*.coffee', 'test/**/*.coffee'],
        tasks: ['coffeelint', 'mochaTest'],
        options:
          atBegin: true
  )

  require('load-grunt-tasks') grunt

  #TODO: Add https://github.com/vojtajina/grunt-npm for npm publishing

  grunt.registerTask 'default', ['clean:build', 'watch']
  grunt.registerTask 'release', ['clean:build', 'coffeelint', 'coffee', 'mochaTest', 'copy']
