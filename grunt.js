module.exports = function(grunt) {
  
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
    },
    concat: {
      dist: {
        src: [
          'src/index.coffee', 
          'src/context.coffee', 
          'src/id.coffee', 
          'src/line.coffee', 
          'src/time_scale.coffee',
          'src/stage.coffee', 
          'src/brush.coffee', 
          'src/xaxis.coffee', 
          'src/yaxis.coffee', 
          'src/legend.coffee', 
          'src/util.coffee'
        ],
        dest: 'build/quandlism.coffee'
      }
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    coffee: {
      compile: {
        files: {
          'quandlism.js': 'build/quandlism.coffee'
        },
        bare: true
      }
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
    },
    min: {
      dist: {
        src: 'quandlism.js',
        dest: 'quandlism.min.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-wrap');
  
  // Default task.
  grunt.registerTask('default', 'concat coffee wrap');
  grunt.registerTask('production', 'concat wrap min');
  grunt.registerTask('all', 'concat coffee wrap min');
  

};