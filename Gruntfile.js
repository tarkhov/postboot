module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * PostBoot v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      core: {
        src: [
          'js/dropdown.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      docs: {
        src: [
          'assets/js/jquery.min.js',
          'assets/js/tether.min.js',
          'assets/js/bootstrap.min.js',
          'dist/js/<%= pkg.name %>.min.js',
          'assets/js/prism.js',
          'assets/js/main.js'
        ],
        dest: 'docs/js/app.min.js'
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
        src: '<%= concat.core.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      docs: {
        src: '<%= concat.docs.dest %>',
        dest: '<%= concat.docs.dest %>'
      }
    },

    sass: {
      core: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'scss/<%= pkg.name %>.scss'
        }
      },
      docs: {
        options: {
          sourcemap: 'none'
        },
        files: {
          'assets/css/docs.css': 'assets/scss/docs.scss'
        }
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie9',
        keepSpecialComments: '*',
        advanced: false
      },
      core: {
        src: 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.min.css'
      },
      docs: {
        files: {
          'docs/css/app.min.css': [
            'assets/css/bootstrap.min.css',
            'dist/css/<%= pkg.name %>.min.css',
            'assets/css/prism.css',
            'assets/css/docs.css'
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
        data: {
          pkg: '<%= pkg %>'
        }
      },
      code: {
        files: {
          'pug/sources/start.html': 'pug/sources/start.pug',
          'pug/sources/grid/containers.html': 'pug/sources/grid/containers.pug',
          'pug/sources/grid/fluid-columns.html': 'pug/sources/grid/fluid-columns.pug',
          'pug/sources/badge/colors.html': 'pug/sources/badge/colors.pug',
          'pug/sources/breadcrumb/dividers.html': 'pug/sources/breadcrumb/dividers.pug',
          'pug/sources/breadcrumb/shapes.html': 'pug/sources/breadcrumb/shapes.pug',
          'pug/sources/breadcrumb/transparent.html': 'pug/sources/breadcrumb/transparent.pug',
          'pug/sources/button/colors.html': 'pug/sources/button/colors.pug',
          'pug/sources/button/3d.html': 'pug/sources/button/3d.pug',
          'pug/sources/button/glass.html': 'pug/sources/button/glass.pug',
          'pug/sources/button/striped.html': 'pug/sources/button/striped.pug',
          'pug/sources/button/shapes.html': 'pug/sources/button/shapes.pug',
          'pug/sources/card/colors.html': 'pug/sources/card/colors.pug',
          'pug/sources/card/glass.html': 'pug/sources/card/glass.pug',
          'pug/sources/card/striped.html': 'pug/sources/card/striped.pug',
          'pug/sources/card/shapes.html': 'pug/sources/card/shapes.pug',
          'pug/sources/dropdown/directions.html': 'pug/sources/dropdown/directions.pug',
          'pug/sources/dropdown/hover.html': 'pug/sources/dropdown/hover.pug',
          'pug/sources/dropdown/mega-menu.html': 'pug/sources/dropdown/mega-menu.pug',
          'pug/sources/form/control-shapes.html': 'pug/sources/form/control-shapes.pug',
          'pug/sources/form/control-underlined.html': 'pug/sources/form/control-underlined.pug',
          'pug/sources/list-group/sizes.html': 'pug/sources/list-group/sizes.pug',
          'pug/sources/nav/tabs.html': 'pug/sources/nav/tabs.pug',
          'pug/sources/nav/sizes.html': 'pug/sources/nav/sizes.pug',
          'pug/sources/nav/tree.html': 'pug/sources/nav/tree.pug',
          'pug/sources/navbar/sizes.html': 'pug/sources/navbar/sizes.pug',
          'pug/sources/pagination/unbordered.html': 'pug/sources/pagination/unbordered.pug',
          'pug/sources/progress/colors.html': 'pug/sources/progress/colors.pug',
          'pug/sources/progress/sizes.html': 'pug/sources/progress/sizes.pug',
          'pug/sources/progress/shapes.html': 'pug/sources/progress/shapes.pug',
          'pug/sources/background/colors.html': 'pug/sources/background/colors.pug',
          'pug/sources/background/glass.html': 'pug/sources/background/glass.pug',
          'pug/sources/background/striped.html': 'pug/sources/background/striped.pug',
          'pug/sources/font/sizes.html': 'pug/sources/font/sizes.pug',
          'pug/sources/font/weights.html': 'pug/sources/font/weights.pug',
          'pug/sources/text/colors.html': 'pug/sources/text/colors.pug'
        }
      },
      docs: {
        files: {
          'docs/index.html': 'pug/index.pug'
        }
      }
    },

    htmlentities: {
      files: {
        src: [
          'pug/sources/start.html',
          'pug/sources/grid/containers.html',
          'pug/sources/grid/fluid-columns.html',
          'pug/sources/badge/colors.html',
          'pug/sources/breadcrumb/dividers.html',
          'pug/sources/breadcrumb/shapes.html',
          'pug/sources/breadcrumb/transparent.html',
          'pug/sources/button/colors.html',
          'pug/sources/button/3d.html',
          'pug/sources/button/glass.html',
          'pug/sources/button/striped.html',
          'pug/sources/button/shapes.html',
          'pug/sources/card/colors.html',
          'pug/sources/card/glass.html',
          'pug/sources/card/striped.html',
          'pug/sources/card/shapes.html',
          'pug/sources/dropdown/directions.html',
          'pug/sources/dropdown/hover.html',
          'pug/sources/dropdown/mega-menu.html',
          'pug/sources/form/control-shapes.html',
          'pug/sources/form/control-underlined.html',
          'pug/sources/list-group/sizes.html',
          'pug/sources/nav/tabs.html',
          'pug/sources/nav/sizes.html',
          'pug/sources/nav/tree.html',
          'pug/sources/navbar/sizes.html',
          'pug/sources/pagination/unbordered.html',
          'pug/sources/progress/colors.html',
          'pug/sources/progress/sizes.html',
          'pug/sources/progress/shapes.html',
          'pug/sources/background/colors.html',
          'pug/sources/background/glass.html',
          'pug/sources/background/striped.html',
          'pug/sources/font/sizes.html',
          'pug/sources/font/weights.html',
          'pug/sources/text/colors.html'
        ]
      }
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadTasks('tasks');


  // JS distribution task.
  grunt.registerTask('dist-js', ['concat:core', 'uglify:core']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['sass:core', 'usebanner', 'cssmin:core']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js']);

  // Docs JS task.
  grunt.registerTask('docs-js', ['concat:docs', 'uglify:docs']);

  // Docs CSS task.
  grunt.registerTask('docs-css', ['sass:docs', 'cssmin:docs']);

  // Docs HTML task.
  grunt.registerTask('docs-html', ['pug:code', 'htmlentities', 'pug:docs']);

  // Docs task.
  grunt.registerTask('docs', ['docs-css', 'docs-js', 'docs-html']);

  // Default task(s).
  grunt.registerTask('default', ['dist', 'docs']);
};
