module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
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
        banner: '<%= banner %>',
        stripBanners: false
      },
      core: {
        src: [
          'src/js/dist/util.js',
          'src/js/dist/dropdown.js',
          'src/js/dist/dropdown-hover.js',
          'src/js/dist/scrollspy.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      docs: {
        src: [
          'dist/js/<%= pkg.name %>.min.js',
          'docs/assets/js/prism.js'
        ],
        dest: 'docs/assets/js/app.js'
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
      },
      docs: {
        files: {
          '<%= concat.docs.dest %>': '<%= concat.docs.dest %>'
        }
      }
    },

    sass: {
      options: {
        sourcemap: 'none'
      },
      core: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'src/scss/<%= pkg.name %>.scss'
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
      core: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'dist/css/<%= pkg.name %>.css'
        }
      },
      docs: {
        files: {
          'docs/assets/css/app.css': 'docs/assets/css/app.css'
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
      },
      docs: {
        files: {
          'docs/assets/css/app.css': [
            'docs/assets/css/bootstrap.min.css',
            '<%= cssmin.core.dest %>',
            'docs/assets/css/prism.css',
            'docs/assets/css/font-awesome.min.css',
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
          var url = dest.replace('docs', '').replace('index.html','');
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
          var extraColorNames = [
            "black",
            "indigo",
            "orange",
            "pink",
            "purple",
            "teal",
            "white"
          ];
          var colorNames = themeColorNames.concat(extraColorNames);
          var extraColors = {};
          var colors = {};

          colorNames.forEach(function (color) {
            colors[color] = color.charAt(0).toUpperCase() + color.substr(1);
          });

          extraColorNames.forEach(function (color) {
            extraColors[color] = color.charAt(0).toUpperCase() + color.substr(1);
          });

          var downloadUrl = "https://github.com/tarkhov/" + pkg.name + "/releases/download/v" + pkg.version + "/" + pkg.name + "-" + pkg.version + ".zip";

          return {
            colors: colors,
            extraColors: extraColors,
            downloadUrl: downloadUrl,
            url: url,
            pkg: pkg
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
          'docs/index.html': 'docs/assets/pug/index.pug',
          'docs/1.0/index.html': 'docs/assets/pug/index.pug'
        }
      }
    }
  });

  // JS distribution task.
  grunt.registerTask('dist-js', ['babel:core', 'concat:core', 'uglify:core']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['sass:core', 'autoprefixer:core', 'usebanner', 'cssmin:core']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js']);

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
