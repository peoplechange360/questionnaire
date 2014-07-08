module.exports = function(grunt) {

    grunt.initConfig({
        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    // target.js file: source.js file
                    'web/js/main.min.js': ['web/js/main.js']
                }
            }
        },
        coffee: {
            options: {
              bare: true
            },
            compile: {
                files: {
                    'web/js/main.js': ['source/coffee/*.coffee']
                }
            }
        },
        less: {
            options: {
                sourceMap: true,
                sourceMapURL: './main.css.map',
                sourceMapRootpath: '../../',
                sourceMapFilename: "web/css/main.css.map",
                sourceMapBasepath: "less/"
            },
            style: {
                files: {
                    // target.css file: source.less file
                    "web/css/main.css": "source/less/questionnaire.less"
                }
            }
        },
        cssmin: {
            minify: {
                src: 'web/css/main.css',
                dest: 'web/css/main.min.css'
            }
        },
        concat: {
            twig: {
                options: {
                    stripBanners: true,
                    banner: '{# IMPORTANT!! DO NOT EDIT THIS GENERATED FILE. READ "twig/boostrap/README.md" #}\n\n',
                },
                src: ['source/twig/macros/*.twig'],
                dest: 'source/twig/bootstrap/bootstrap.functions.html.twig'
            },
            js: {
                src: ['web/js/main.js', 'source/vendors/bootstrap/js/collapse.js', 'source/vendors/Sortable/Sortable.js'],
                dest: 'web/js/main.js'
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
