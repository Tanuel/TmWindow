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
            code: {
                src: [
                    '<%=src%>/ts/**/*.js',
                    '<%=src%>/ts/**/*.js.map',
                    '<%=src%>/ts/**/*.d.ts'
                ]
            },
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
                configure: function (bundler) {
                    bundler.plugin(require('tsify'));
                },
                browserifyOptions: {
                    standalone: 'TmWindow',
                    extensions: ['.js', '.ts'],
                },
            },
            dev: {
                options: {
                    browserifyOptions: {
                        debug: true,
                        standalone: 'TmWindow',
                        extensions: ['.js', '.ts'],
                    },
                },
                files: {
                    '<%=dev%>/js/<%=projectName%>.js': '<%=src%>/ts/index.ts',
                },
            },
            docs: {
                files: {
                    '<%=docs%>/js/<%=projectName%>.js': '<%=src%>/ts/index.ts',
                },
            },
            dist: {
                files: {
                    '<%=dst%>/js/<%=projectName%>.js': '<%=src%>/ts/index.ts',
                },
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
                    '<%=dst%>/css/<%=projectName%>.css': '<%=src%>/scss/main.scss',
                }
            }
        },
        copy: {
            docs: {
                files: {
                    '<%=docs%>/index.html': '<%=src%>/docs/index.html',
                    '<%=docs%>/js/example.js': '<%=src%>/docs/js/example.js',
                }
            },
            dev: {
                files: {
                    '<%=dev%>/index.html': '<%=src%>/docs/index.html',
                    '<%=dev%>/js/example.js': '<%=src%>/docs/js/example.js',
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
                    hostname: '127.0.0.1',
                    port: 9001,
                    base: '<%=dev%>',
                    livereload: true,
                    open: true,
                },
            },
        },
        ts: {
            default: {
                tsconfig: './tsconfig.json'
            },
            dist: {
                tsconfig: './tsconfig.json',
                out: 'dist/js/TmWindow.js',
                options: {
                    additionalFlags: '--emitDeclarationOnly true'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-ts');

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
    grunt.registerTask('serve', [
        'serve:dev',
    ]);

    grunt.registerTask('build:dist', [
        'clean:dist',
        'browserify:dist',
        'sass:dist',
        'ts:dist'
    ]);

    grunt.registerTask('build:docs', [
        'clean:docs',
        'browserify:docs',
        'sass:docs',
        'copy:docs'
    ]);
};