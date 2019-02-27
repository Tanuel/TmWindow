const nodeSass = require('node-sass');

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        src: 'src',
        dst: 'dist',
        bin: 'bin',
        docs: 'build',
        projectName: 'TmWindow',
        clean: {
            dist: {
                src: ['<%=dst%>/*']
            },
            docs: {
                src: ['<%=docs%>/*']
            },
            bin: {
                src: ['<%=bin%>/*']
            }
        },
        browserify: {
            vendor: {
                options: {
                    browserifyOptions: {
                        debug: true,
                    },
                },
                src: '<%=src%>/js/index.js',
                dest: 'public/js/<%=projectName%>/*.js',
            },
            docs: {
                files: {
                    '<%=docs%>/js/<%=projectName%>.js': '<%=src%>/js/index.js',
                    '<%=docs%>/js/example.js':'<%=src%>/docs/js/example.js'
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
                sourceMap: false
            },
            vendor: {
                options: {
                    sourceMap: true
                },
                files: {
                    'public/css/<%=projectName%>.css': '<%=src%>/scss/main.scss',
                },
            },
            docs: {
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
            }
        },
        watch: {
            dev: {
                files: ['<%=src%>/**/*.js', '<%=src%>/**/*.scss'],
                tasks: ['dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    // Default task(s).
    grunt.registerTask('dev', [
        'clean:docs',
        'browserify:docs',
        'sass:docs',
    ]);

    grunt.registerTask('buildDist', [
        'browserify:dist',
        'sass:dist',
    ]);

    grunt.registerTask('buildDocs', [
        'clean:docs',
        'browserify:docs',
        'sass:docs',
        'copy:docs'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'browserify:dist',
        'sass:dist'
    ]);
};