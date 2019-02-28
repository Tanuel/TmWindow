const nodeSass = require('node-sass');

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        src: 'src',
        dst: 'dist',
        dev: 'dev',
        docs: 'public',
        projectName: 'TmWindow',
        clean: {
            dist: {
                src: ['<%=dst%>/*']
            },
            docs: {
                src: ['<%=docs%>/*']
            },
            dev: {
                src: ['<%=dev%>/*']
            }
        },
        browserify: {
            options: {
                browserifyOptions: {
                    standalone: '<%=projectName%>',
                },
            },
            dev: {
                options: {
                    browserifyOptions: {
                        debug: true,
                    },
                },
                files: {
                    '<%=dev%>/js/<%=projectName%>.js': '<%=src%>/js/index.js',
                    '<%=dev%>/js/example.js': '<%=src%>/docs/js/example.js'
                },
            },
            docs: {
                files: {
                    '<%=docs%>/js/<%=projectName%>.js': '<%=src%>/js/index.js',
                    '<%=docs%>/js/example.js': '<%=src%>/docs/js/example.js'
                },
            },
            dist: {
                src: '<%=src%>/js/index.js',
                dest: '<%=dist%>/*/js/<%=projectName%>/*.js'
            },
        },
        sass: {
            options: {
                implementation: nodeSass,
                sourceMap: true,
            },
            dev: {
                options: {
                    outputStyle: 'expanded',
                },
                files: {
                    '<%=dev%>/css/<%=projectName%>.css': '<%=src%>/scss/main.scss',
                    '<%=dev%>/css/docs.css': '<%=src%>/docs/scss/docs.scss',
                },
            },
            docs: {
                options: {
                    sourceMap: false,
                    outputStyle: 'compressed',
                },
                files: {
                    '<%=docs%>/css/<%=projectName%>.css': '<%=src%>/scss/main.scss',
                    '<%=docs%>/css/docs.css': '<%=src%>/docs/scss/docs.scss',
                },
            },
            dist: {
                files: {
                    '<%=dist%>/*/css/<%=projectName%>/*.css': '<%=src%>/scss/main.scss',
                }
            }
        },
        copy: {
            docs: {
                files: {
                    '<%=docs%>/index.html': '<%=src%>/docs/index.html'
                }
            },
            dev: {
                files: {
                    '<%=dev%>/index.html': '<%=src%>/docs/index.html'
                }
            }
        },
        watch: {
            dev: {
                files: ['<%=src%>/**/*'],
                tasks: ['build:dev'],
                options: {
                    livereload: true,
                },
            },
        },
        connect: {
            dev: {
                options: {
                    port: 9001,
                    base: '<%=dev%>',
                    livereload: true,
                    open: true,
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    // Default task(s).
    grunt.registerTask('build:dev', [
        'clean:dev',
        'browserify:dev',
        'sass:dev',
        'copy:dev',
    ]);

    grunt.registerTask('serve:dev', [
        'build:dev',
        'connect:dev',
        'watch:dev',
    ]);

    grunt.registerTask('build:dist', [
        'browserify:dist',
        'sass:dist',
    ]);

    grunt.registerTask('build:docs', [
        'clean:docs',
        'browserify:docs',
        'sass:docs',
        'copy:docs'
    ]);

    grunt.registerTask('build', [
        'build:docs',
    ]);
};