module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        browserify: {
            options: {
                transform: ['babelify'],

                browserifyOptions: {
                    standalone: 'relatedjs',
                    plugin: ['browserify-derequire']
                }
            },

            srcBuild: {
                files: {'build/lib/index.js': 'lib/index.js'}
            },

            testBuild: {
                files: [{
                    expand: true,
                    cwd: 'test',
                    src: '**/*-test.js',
                    dest: 'build/test'
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'build/lib',
                    src: '**/*',
                    dest: 'dist'
                }]
            }
        },

        watch: {
            watchSrc: {
                files: ['lib/**/*.js'],
                tasks: ['babel']
            }
        },

        clean: {
            build: ['build'],
            dist: ['dist']
        }
    });

    grunt.registerTask('build', ['clean:build', 'browserify']);
    grunt.registerTask('dist', ['build', 'clean:dist', 'copy:dist']);
};
