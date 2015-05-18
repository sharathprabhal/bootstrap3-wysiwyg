/* jshint maxstatements: false */
/* global __dirname, module */
module.exports = function(grunt) {
  'use strict';

  grunt.registerTask('bowerupdate', 'update the frontend dependencies', function() {
    var exec = require('child_process').exec;
    var cb = this.async();
    exec('bower update', {cwd: '.'}, function(err, stdout, stderr) {
      console.log(stdout);
      console.err(stderr);
      cb();
    });
  });

  grunt.registerTask('npmupdate', 'update the development dependencies', function() {
    var exec = require('child_process').exec;
    var cb = this.async();
    exec('npm update', {cwd: '.'}, function(err, stdout, stderr) {
      console.log(stdout);
      console.err(stderr);
      cb();
    });
  });

  grunt.registerMultiTask('phantomjs', 'execute script with phantomjs', function() {
    var childProcess = require('child_process');
    var phantomjs = require('phantomjs');
    var path = require('path');
    var binPath = phantomjs.path;
    var cb = this.async();

    var childArgs = [
      path.join(__dirname, this.data.script)
    ];

    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
      grunt.log.writeln(stdout);
      if(stderr) {
        grunt.log.error(stderr);
      }
      grunt.log.writeln('Done');
      cb();
    }); 
  });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    handlebars: {
      compile: {
        options: {
          namespace: 'wysihtml5.tpl',
          processName: function(filePath) {
            return filePath.split('/')[2].split('.')[0];
          },
          commonjs: true
        },
        files: {
          'src/generated/templates.js': ['src/templates/*.hbs']
        }
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      minify: {
        files: {
          'dist/bootstrap3-wysihtml5.min.css': ['src/bootstrap3-wysihtml5.css']
        }
      }
    },
    clean: {
      build: ['dist'],
      'parser_rules': ['src/parser_rules'],
      'generated': ['src/generated']
    },
    copy: {
      'parser_rules': {
        files: [
          {expand: true, cwd: 'src/parser_rules', src: ['*.json'], dest: 'dist/parser_rules'}
        ]
      }
    },
    'http-server': {
      'dev': {
        // the server root directory
        root: '.',
        port: 8282,
        host: '127.0.0.1',
        cache: 0,
        showDir : true,
        autoIndex: true,
        ext: 'html',
        runInBackground: false
      }
    },
    browserify: {
      example: {
        src: ['examples/browserify-index.js'],
        dest: 'examples/bundle.js'
      }
    },
    phantomjs: {
      'parser_rules': {
        script: 'generator/print_parser_rules.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('parser_rules', ['clean:parser_rules', 'phantomjs:parser_rules', 'copy:parser_rules']);
  grunt.registerTask('build', ['clean', 'handlebars', 'cssmin', 'copy:parser_rules', 'parser_rules', 'browserify']);
  grunt.registerTask('with-update', ['bowerupdate', 'npmupdate', 'build']);
  grunt.registerTask('default', ['build']);

};
