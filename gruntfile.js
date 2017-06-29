module.exports = function(grunt) {
  require('jit-grunt')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        browserifyOptions: {
          noparse: 'jquery'
        }
      },
      js: {
        src: 'js/src/main.js',
        dest: 'js/build.js'
      }
    },
    uglify: {
      my_target: {
        files: {
          'js/build.min.js': ['js/build.js']
        }
      }
    },
    less: {
      development: {
        options: {
          plugins: [
            require('less-plugin-group-css-media-queries'),
            new(require('less-plugin-autoprefix'))({ browsers: ["last 2 versions"] }),
            new(require('less-plugin-clean-css'))({ advanced: true })
          ],
          compress: false,
          cleancss: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "css/styles.min.css": "css/src/main.less" // destination file and source file
        }
      }
    },
    watch: {
      styles: {
        files: ['css/src/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      },
      js: {
        files: ['js/src/**/*.js', 'js/src/**/*.vue', 'js/src/**/*.json'],
        tasks: ['browserify']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('build', ['less:production', 'browserify', 'uglify']);
  grunt.registerTask('default', ['less:development', 'browserify', 'watch']);
};