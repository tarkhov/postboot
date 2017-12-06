module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * Bootstrap features v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',

    sass: {
      options: {
        sourcemap: 'none'
      },
      dist: {
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
      dist: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'dist/css/<%= pkg.name %>.css'
        }
      }
    },

    cssmin: {
      dist: {
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

  // CSS distribution task.
  grunt.registerTask('dist-css', ['sass:dist', 'autoprefixer:dist', 'usebanner', 'cssmin:dist']);

  // Full distribution task.
  grunt.registerTask('dist', 'dist-css');

  // Default task(s).
  grunt.registerTask('default', 'dist');
};
