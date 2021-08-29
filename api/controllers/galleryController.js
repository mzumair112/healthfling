'use strict';

const sharp = require('sharp');
const fs = require('fs');
const request = require('request');

var Post = require('../models/post');

var cloudinary = require('cloudinary');
var tempcloudinary = require('cloudinary');
var url  = require('url');
var local_file_path = "";

var multer = require('multer');

var Storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "./public/files");
	},
	filename: function(req, file, callback) {
		var file_name = file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s+/g, '_').toLowerCase();
		callback(null, file_name);
		local_file_path = file_name;
	}
});

var upload = multer({
	storage: Storage
}).array("imgUploader", 3); //Field name and max count

cloudinary.config({
	cloud_name: 'dosxjzleb',
	api_key: '652824273966278',
	api_secret: 'K2oWfPXPXTm9PTGZD47bFQnIGAI'
});

tempcloudinary.config({
	cloud_name: 'intellirio-consultancy-and-labs-llp',
	api_key: '579673852831583',
	api_secret: 'BCArjT98AV1jmrSwL45DNnlK_DE'
});

exports.list_all_images = function(req, res) {
	cloudinary.v2.api.resources(function(error, result){
		res.json(result.resources);
	});
};

exports.uploadimages = function(req, res) {
	
	cloudinary.v2.uploader.upload(req.body.url, function(error, result) {
		if (result) {
			res.json(result);
		}else{
			res.json(error);
		}
	});
};

exports.list_featured_images = function(req, res) {
	var query_params = url.parse(req.url,true).query;
	if(query_params.tagId != undefined){
		cloudinary.v2.api.resources_by_tag(query_params.tagId, function(error, result){
			res.json(result.resources);
		});
	}else{
		cloudinary.v2.api.resources(function(error, result){
			res.json(result.resources);
		});
	}
};

exports.upload_images_to_temp = function(req, res) {
	
	tempcloudinary.v2.uploader.upload(req.body.url, function(error, result) {
		if (result) {
			res.json(result);
		}else{
			res.json(error);
		}
	});
};

exports.upload_images_to_local = function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			return res.end("Something went wrong!");
		}
		if (req.query.original) {
			sharp('./public/files/'+local_file_path).resize({ width: 1200 }).toFile('./public/processed/'+local_file_path)
			.then(function(newFileInfo) {
				res.json({"secure_url": 'https://www.healthyfling.com/processed/' + local_file_path});
			})
			.catch(function(err) {
				return res.end("Something went wrong!");
			});
		} else {
			sharp('./public/files/'+local_file_path).resize({ width: 500 }).toFile('./public/processed/'+local_file_path)
			.then(function(newFileInfo) {
				res.json({"secure_url": 'https://www.healthyfling.com/processed/' + local_file_path});
			})
			.catch(function(err) {
				return res.end("Something went wrong!");
			});
		}
	});
};

exports.download_from_url_and_process = function(item, postId, callback) {

	if (!item ||(item && !item.secure_url)) {
		return;
	}

	var download = function(link, imagePath, callback) {
		request(link).pipe(fs.createWriteStream('./public/files/' + imagePath)).on('close', callback);
	};

	let fileName = item.secure_url.split('/');
	fileName = fileName.filter(function(el) {
	  return el != '';
	});
	fileName = fileName[fileName.length-1];
	let imagePath = "imgURL_" + Date.now() + "_" + fileName.toLowerCase();

	// Downlaod
	download(item.secure_url, imagePath, function() {

		// Compress
		sharp('./public/files/' + imagePath).resize({ width: 500 }).toFile('./public/processed/' + imagePath)
		.then(function(newFileInfo) {

			// Update post and add image url
			Post.update({
				_id: postId
			}, {
				$push: {
					files: {
						secure_url: 'https://www.healthyfling.com/processed/' + imagePath,
						signature: item.signature
					}
				}
			}, function(err, result) {
				return true;
			});
		})
		.catch(function(err) {
			return false;
		});

	});

};
