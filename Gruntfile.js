module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: 'inline',
                optional: ['runtime']
            },

            build: {
                files: [{
                    expand: true,
                    cwd: 'lib',
                    src: '**/*.js',
                    dest: 'build/lib'
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

    grunt.registerTask('build', ['clean:build', 'babel']);
    grunt.registerTask('dist', ['build', 'clean:dist', 'copy:dist']);
};
