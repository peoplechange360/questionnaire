module.exports = function(grunt) {

    grunt.initConfig({
        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    // target.js file: source.js file
                    'js/main.min.js': ['js/main.js']
                }
            }
        },
        coffee: {
            options: {
              bare: true
            },
            compile: {
                files: {
                    'js/main.js': ['source/coffee/*.coffee']
                }
            }
        },
        less: {
            options: {
                sourceMap: true,
                sourceMapFilename: "main.css.map",
                sourceMapBasepath: "source/less/"
            },
            style: {
                files: {
                    // target.css file: source.less file
                    "css/main.css": "source/less/questionnaire.less"
                }
            }
        },
        cssmin: {
            minify: {
                src: 'css/main.css',
                dest: 'css/main.min.css'
            }
        },
        concat: {
            twig: {
              options: {
                stripBanners: true,
                banner: '{# IMPORTANT!! DO NOT EDIT THIS GENERATED FILE. READ "twig/boostrap/README.md" #}\n\n',
              },
              src: ['source/twig/*.twig'],
              dest: 'twig/bootstrap/bootstrap.functions.html.twig'
          },
          js: {
              src: ['js/main.js', 'source/vendors/bootstrap/js/collapse.js'],
              dest: 'js/main.js'
          }
        },
        jshint: {
            all: []
        },
        watch: {
            options: {
                nospawn: true,
                livereload: false
            },
            js: {
                files: ['source/coffee/*.coffee'],
                tasks: ['coffee:compile', 'concat:js']
            },
            css: {
                files: ['source/less/*.less'],
                tasks: ['less:style']
            },
            twig: {
                files: ['source/twig/*.twig'],
                tasks: ['concat:twig']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //grunt.registerTask('watch', ['watch']);
    grunt.registerTask('default', ['concat:twig','coffee','less','cssmin','concat:js']);
};
