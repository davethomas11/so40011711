module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        parseAndIndexHtmlFiles : {

            options : {
                output: "index.html",
                directoryToParse: "design",
                jadeTemplate: "index.jade",
                parseHtmlTags: ["title"],
                parseAttributes: ["data-details", "data-status"]
            }
		}
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', [ "parseAndIndexHtmlFiles" ]);

};