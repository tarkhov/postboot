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

  var templates = {
    'docs/index.html': 'src/docs/pug/index.pug',
    'docs/templates/menu-bar/index.html': 'src/docs/pug/templates/menu-bar.pug'
  };
  var contents = grunt.file.readJSON('./src/docs/json/contents.json');
  for (var c in contents) {
    var component = contents[c];
    templates['docs/' + component.url + '/index.html'] = 'src/docs/pug/' + component.template + '.pug';
    for (var e in component.examples) {
      var article = contents[c].examples[e];
      templates['docs/' + component.url + '/' + article.url + '/index.html'] = 'src/docs/pug/' + component.template + '/' + article.template + '.pug';
    }
  }

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    banner: '/*!\n' +
            ' * ' + title + ' v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2016-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n',

    concat: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: [
          'src/js/dropdown-hover.js',
          'src/js/dropdown-mega.js',
          'src/js/scrollspy-tree.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      docs: {
        src: [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
          'node_modules/prismjs/prism.js',
          'node_modules/@fortawesome/fontawesome-free/js/all.min.js',
          'dist/js/<%= pkg.name %>.min.js',
        ],
        dest: 'docs/assets/js/app.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
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
          'dist/css/<%= pkg.name %>.css': 'src/scss/main.scss',
          'dist/css/<%= pkg.name %>-grid.css': 'src/scss/grid/main.scss',
          'dist/css/<%= pkg.name %>-light.css': 'src/scss/light/main.scss'
        }
      },
      docs: {	
        files: {	
          'docs/assets/css/main.css': 'src/docs/scss/main.scss'	
        }
      }
    },

    autoprefixer: {
      dist: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'dist/css/<%= pkg.name %>.css',
          'dist/css/<%= pkg.name %>-grid.css': 'dist/css/<%= pkg.name %>-grid.css',
          'dist/css/<%= pkg.name %>-light.css': 'dist/css/<%= pkg.name %>-light.css'
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
        files: {
          'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css',
          'dist/css/<%= pkg.name %>-grid.min.css': 'dist/css/<%= pkg.name %>-grid.css',
          'dist/css/<%= pkg.name %>-light.min.css': 'dist/css/<%= pkg.name %>-light.css'
        }
      },
      docs: {	
        files: {	
          'docs/assets/css/app.min.css': [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'dist/css/<%= pkg.name %>.min.css',
            'node_modules/prismjs/themes/prism.css',
            'node_modules/@fortawesome/fontawesome-free/css/svg-with-js.min.css',
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

          return {
            colors: colors,
            extraColors: customColors,
            customColors: customColors,
            pkg: pkg,
            contents: contents,
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
        files: templates
      }
    },

    watch: {
      dist_js: {
        files: 'src/js/*.js',
        tasks: 'dist-js'
      },
      dist_css: {
        files: 'src/scss/*.scss',
        tasks: 'dist-css'
      },
      docs_css: {
        files: 'src/docs/scss/*.scss',
        tasks: 'docs-css'
      },
      docs_html: {
        files: 'src/docs/pug/*.pug',
        tasks: 'docs-html'
      }
    },

    notify: {
      dist_css: {
        options: {
          message: 'CSS distribution task completed.'
        }
      },
      dist_js: {
        options: {
          message: 'JS distribution task completed.'
        }
      },
      docs_css: {
        options: {
          message: 'CSS docs task completed.'
        }
      },
      docs_js: {
        options: {
          message: 'JS docs task completed.'
        }
      },
      docs_html: {
        options: {
          message: 'HTML docs task completed.'
        }
      }
    }
  });

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat:dist', 'uglify:dist', 'notify:dist_js']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['sass:dist', 'autoprefixer:dist', 'usebanner', 'cssmin:dist', 'notify:dist_css']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-js', 'dist-css']);

  // JS docs task.
  grunt.registerTask('docs-js', ['concat:docs', 'uglify:docs', 'notify:docs_js']);

  // CSS docs task.
  grunt.registerTask('docs-css', ['sass:docs', 'autoprefixer:docs', 'cssmin:docs', 'notify:docs_css']);

  // HTML docs task.
  grunt.registerTask('docs-html', ['pug:docs', 'notify:docs_html']);

  // Docs task.
  grunt.registerTask('docs', ['docs-css', 'docs-js', 'docs-html']);

  // Default task(s).
  grunt.registerTask('default', ['dist', 'docs']);
};
