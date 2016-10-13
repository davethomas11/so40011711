var DOMParser = require('xmldom').DOMParser;
var xpath = require('xpath');
var Promise = require("bluebird");
var pug = require('pug');
var tidy = require('htmltidy').tidy;
var fs = Promise.promisifyAll(require("fs"));

var options, done, globalGrunt = null;
var fileIndex = [];

module.exports = function(grunt) {

	globalGrunt = grunt;
	grunt.registerTask('parseAndIndexHtmlFiles', function () {

		done = this.async();
		options = this.options({
			output : "",
			directoryToParse : "",
			jadeTemplate : "",
			parseHtmlTags : [ ],
			parseAttributes : [ ]
		});
	
		parseHtmlFiles(options.directoryToParse);
	});
};

function parseHtmlFiles(directory) {


	fs.readdirAsync(directory).map(function (filename) {
		
		if (filename.match(/.html$/)) {

			return readFile(directory + "/" + filename);
		}
	
	}).then(function (results) {

		var contents = [];
		for(var i = 0; i < results.length; i++){
			if(results[i]){
				contents.push(results[i]);
			}
		}

		var html = pug.renderFile(options.jadeTemplate , {
			files : contents
		});

		tidy(html, {
			indent: true
		}, function (err, result) {

			if (err) {
				globalGrunt.fail.fatal(err);
			}

			fs.writeFile(options.output, result, function (err) {

				if (err) {
					globalGrunt.fail.fatal(err);
				}

				done();
			});
		});
	});

}

function readFile(filename) {
	var promise = Promise.pending();

	fs.readFile(filename, function (err, data) {

		if (err) {
			promise.reject(err);
		} else if (data) {
			var doc = new DOMParser().parseFromString(data.toString(), "text/html");
			var params = parseDocument(doc);
			promise.resolve(new IndexedFile(filename, params));
		} else {
			promise.reject("No Data");
		}

	});

	return promise.promise;
}

function parseDocument(doc) {

	var params = {
		tags : {},
		attributes : {}
	};

	options.parseHtmlTags.forEach(function (tag) {

		var tags = doc.getElementsByTagName(tag);
		if (tags.length > 0) {
			params.tags[tag] = tags[0].firstChild.data;
		}
	});

	options.parseAttributes.forEach(function (attrName) {

		var attr = xpath.select("//@" + attrName, doc);
		if (attr.length > 0) {
			params.attributes[attrName] = attr[0].nodeValue;
		}
	});

	return params;
} 


function IndexedFile(path, parameters) {
	this.path = path;
	this.parameters = parameters;
}

