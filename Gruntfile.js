module.exports = function (grunt) {
  var themeColorNames = [	
    "primary",	
    "secondary",	
    "success",	
    "info",	
    "warning",	
    "danger",	
    "light",	
    "dark"	
  ];	
  var customColorNames = [	
    "black",	
    "indigo",	
    "orange",	
    "pink",	
    "purple",	
    "teal",	
    "white"	
  ];	
  var colorNames = themeColorNames.concat(customColorNames);	
  var customColors = {};	
  var colors = {};	

  colorNames.forEach(function (color) {	
    colors[color] = color.charAt(0).toUpperCase() + color.substr(1);	
  });	

  customColorNames.forEach(function (color) {	
    customColors[color] = color.charAt(0).toUpperCase() + color.substr(1);	
  });

  var title = 'PostBoot';

  var pkg = grunt.file.readJSON('package.json');

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    banner: '/*!\n' +
            ' * ' + title + ' v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2016-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',

    concat: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: [
          'src/js/dropdown-hover.js',
          'src/js/dropdown-mega.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      docs: {
        src: [
          'docs/assets/js/vendor/jquery.min.js',
          'docs/assets/js/vendor/bootstrap.bundle.min.js',
          'docs/assets/js/vendor/prism.js',
          'docs/assets/js/vendor/fontawesome-all.min.js',
          'dist/js/<%= pkg.name %>.min.js'
        ],
        dest: 'docs/assets/js/app.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': '<%= concat.dist.dest %>'
        }
      },
      docs: {
        files: {
          'docs/assets/js/app.min.js': '<%= concat.docs.dest %>'
        }
      }
    },

    sass: {
      options: {
        sourcemap: 'none'
      },
      dist: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'src/scss/main.scss'
        }
      },
      docs: {	
        files: {	
          'docs/assets/css/main.css': 'docs/assets/scss/main.scss'	
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
      },
      docs: {	
        files: {	
          'docs/assets/css/main.css': 'docs/assets/css/main.css'	
        }	
      }
    },

    cssmin: {
      dist: {
        src: 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.min.css'
      },
      docs: {	
        files: {	
          'docs/assets/css/app.min.css': [
            'docs/assets/css/bootstrap.min.css',
            '<%= cssmin.dist.dest %>',
            'docs/assets/css/prism.css',
            'docs/assets/css/fa-svg-with-js.css',
            'docs/assets/css/main.css'
          ]
        }
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
    },

    pug: {
      options: {
        pretty: true,
        data: function (dest, src) {
          var url = dest.replace('docs', '').replace('index.html', '');
          //return require('./locals.json');

          return {
            colors: colors,
            extraColors: customColors,
            pkg: pkg,
            title: title,
            url: url,
            username: 'tarkhov'
          };
        },
        filters: {
          'encode-pug': function (block) {
            var he = require('he');
            var options = this.data;
            options['pretty'] = true;

            return he.encode(this.pug.render(block, options));
          }
        }
      },
      docs: {
        files: {
          'docs/index.html': 'docs/assets/pug/index.pug'
        }
      }
    }
  });

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat:dist', 'uglify:dist']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['sass:dist', 'autoprefixer:dist', 'usebanner', 'cssmin:dist']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-js', 'dist-css']);

  // JS docs task.
  grunt.registerTask('docs-js', ['concat:docs', 'uglify:docs']);

  // CSS docs task.
  grunt.registerTask('docs-css', ['sass:docs', 'autoprefixer:docs', 'cssmin:docs']);

  // HTML docs task.
  grunt.registerTask('docs-html', 'pug:docs');

  // Docs task.
  grunt.registerTask('docs', ['docs-css', 'docs-js', 'docs-html']);

  // Default task(s).
  grunt.registerTask('default', ['dist', 'docs']);
};
