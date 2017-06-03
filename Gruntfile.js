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
          'js/dist/util.js': 'js/util.js',
          'js/dist/dropdown.js': 'js/dropdown.js',
          'js/dist/dropdown-hover.js': 'js/dropdown-hover.js',
          'js/dist/dropdown-fluid.js': 'js/dropdown-fluid.js'
        }
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      core: {
        src: [
          'js/dist/util.js',
          'js/dist/dropdown.js',
          'js/dist/dropdown-hover.js',
          'js/dist/dropdown-fluid.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: 'some'
      },
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
          'dist/css/<%= pkg.name %>.css': 'scss/<%= pkg.name %>.scss'
        }
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: '*',
        advanced: false
      },
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

  // Load tasks

  // JS distribution task.
  grunt.registerTask('dist-js', ['babel:core', 'concat:core', 'uglify:core']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['sass:core', 'usebanner', 'cssmin:core']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js']);

  // Default task(s).
  grunt.registerTask('default', 'dist');
};
