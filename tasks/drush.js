/*
 * grunt-drush
 * https://github.com/nickpack/grunt-drush
 *
 * Copyright (c) 2013 Nick Pack
 * Licensed under the MIT license.
 */

 'use strict';

 module.exports = function(grunt) {

  var _ = require('lodash'),
      fs = require('fs'),
      path = require('path'),
      spawn = require('win-spawn'),
      os = require('os'),
      async = require('async'),
      concurrencyLevel = (os.cpus().length || 1) * 2;

  grunt.registerMultiTask('drush', 'Drush task runner for grunt.', function() {
    var self = this,
        options = self.options({
          cmd: 'drush',
          cwd: false
        }),
        args = self.data.args,
        cb = this.async();

    grunt.verbose.writeflags(options, 'Options');

    var callDrush = function(args) {

      var origCwd = process.cwd(),
          drushResult = null;

      if (options.cwd) {
        grunt.file.setBase(options.cwd);
      }

      var cp = spawn(options.cmd, args, {stdio: 'inherit'});

      cp.on('error', grunt.warn);
      cp.on('close', function (code) {

        switch (code) {
          case 127:
            grunt.fatal(
              'You need to have drush installed in your PATH\n' +
              'or set it in the configuration for this task to work.'
            );
            break;

          case 0:
            grunt.verbose.writeln('Drush completed without error');
            break;

          default:
            grunt.warn('Drush failed: ' + code);
            break;
        }

        drushResult = code === 0 || false;
        grunt.verbose.writeln("Drush returned " + code);

        cb(drushResult);
      });

      grunt.file.setBase(origCwd);

    };

    callDrush(args);
  });

};
