module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: 'inline'
            },

            dist: {
                files: [{
                    expand: true,
                    cwd: 'lib',
                    src: '**/*.js',
                    dest: 'build/lib'
                }]
            }
        },

        watch: {
            watchSrc: {
                files: ['lib/**/*.js'],
                tasks: ['babel']
            }
        },

        clean: ['build/']
    });

    grunt.registerTask('build', ['clean', 'babel']);
};
