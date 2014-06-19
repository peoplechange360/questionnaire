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
            compile: {
                files: {
                    'js/main.js': 'source/coffee/source.coffee', // 1:1 compile
                    'js/main.min.js': ['source/coffee/*.coffee'] // compile and concat into single file
                }
            }
        },
        less: {
            style: {
                files: {
                    // target.css file: source.less file
                    "css/main.css": "source/less/vragenlijst.less"
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
            options: {
              stripBanners: true,
              banner: '{# IMPORTANT!! DO NOT EDIT THIS GENERATED FILE. READ "twig/boostrap/README.md" #}\n\n',
            },
            twig: {
              src: ['source/twig/*.twig'],
              dest: 'twig/bootstrap/bootstrap.functions.html.twig'
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
                tasks: ['coffee:compile']
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
    grunt.registerTask('default', ['concat:twig','coffee','less','cssmin']);
};
