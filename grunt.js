module.exports = function(grunt) {
  
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
    },
    concat: {
      dist: {
        src: ['src/index.js', 'src/context.js', 'src/id.js', 'src/line.js', 'src/stage.js', 'src/brush.js', 'src/axis.js', 'src/yaxis.js', 'src/util.js'],
        dest: 'quandlism.js'
      }
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    },
    wrap: {
      modules: {
        src: ['quandlism.js'],
        dest: '.',
        wrapper: ['(function(exports) { \n', '\n })(this);']
      }
    }
  });

  // Default task.
  
  grunt.registerTask('default', 'concat wrap');
  
  grunt.registerMultiTask('wrap', 'Wraps file with specified strings', function() {
    var files = grunt.file.expandFiles(this.file.src),
        path = require('path'),
        task = this,
        src;
    if (files) {
      files.map(function(filepath) {
        src = grunt.helper('wrap', filepath, {wrapper: task.data.wrapper});
        grunt.file.write(path.join(task.file.dest, filepath), src);
      });
    } 
    
    if (this.errorCount) {
      return false;
    }
    
    grunt.log.writeln('Wrapped files created');
    
    
  });

  // Helpers
  
  grunt.registerHelper('wrap', function(filepath, options) {
    options = grunt.utils._.defaults(options || {}, {
      wrapper: ['', '']
    });
    return options.wrapper[0] + grunt.task.directive(filepath, grunt.file.read) + options.wrapper[1];
  });
  
  
  

};