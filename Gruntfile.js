module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * PostBoot v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',

    babel: {
      options: {
        presets: ['es2015'],
        plugins: ['transform-es2015-modules-strip']
      },
      core: {
        files: {
          'src/js/dist/util.js': 'src/js/util.js',
          'src/js/dist/dropdown.js': 'src/js/dropdown.js',
          'src/js/dist/dropdown-hover.js': 'src/js/dropdown-hover.js',
          'src/js/dist/scrollspy.js': 'src/js/scrollspy.js'
        }
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>'
      },
      core: {
        src: [
          'src/js/dist/util.js',
          'src/js/dist/dropdown.js',
          'src/js/dist/dropdown-hover.js',
          'src/js/dist/scrollspy.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      core: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': '<%= concat.core.dest %>'
        }
      }
    },

    sass: {
      options: {
        sourcemap: 'none'
      },
      core: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'src/scss/main.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          'Chrome >= 35',
          'Firefox >= 38',
          'Edge >= 12',
          'Explorer >= 10',
          'iOS >= 8',
          'Safari >= 8',
          'Android 2.3',
          'Android >= 4',
          'Opera >= 12'
        ]
      },
      core: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'dist/css/<%= pkg.name %>.css'
        }
      }
    },

    cssmin: {
      core: {
        src: 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.min.css'
      }
    },

    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: 'dist/css/*.css'
      }
    }
  });

  // JS distribution task.
  grunt.registerTask('dist-js', ['babel:core', 'concat:core', 'uglify:core']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['sass:core', 'autoprefixer:core', 'usebanner', 'cssmin:core']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js']);

  // Default task(s).
  grunt.registerTask('default', 'dist');
};
