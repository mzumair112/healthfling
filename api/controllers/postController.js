'use strict';

var Post = require('../models/post');
var Page = require('../models/page');
var Comment = require('../models/comment');
var Reply = require('../models/reply');
var galleryController = require('../controllers/galleryController');
var nodemailer = require('nodemailer');
var cloudinary = require('cloudinary');
var url  = require('url');
var ogs = require('open-graph-scraper');
var mongoose = require('mongoose');

function convertToSlug(Text){
    return Text
    .toLowerCase()
    .replace(/ /g,'')
    .replace(/[^\w-]+/g,'')
    ;
}

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'info@healthyfling.com',
        pass: 'Photography88'
    }
});

var MAXIMUM_ALLOWED_POST = 4;
var POSTS_TIMEOUT = 7;
var ADMIN_POSTS_TIMEOUT = 30;

cloudinary.config({
    cloud_name: 'dosxjzleb',
    api_key: '652824273966278',
    api_secret: 'K2oWfPXPXTm9PTGZD47bFQnIGAI'
});

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function sendActivityAlert(id, title, email) {
    var mailBody = "<p>New activity on your favorite post [<b>"+title+"</b>]</p><p>To view this post <a href='https://www.healthyfling.com/#/detail/"+id+"'>click here.<a></p><br><p style='font-size:12px;font-weight:bold;'>Please don\'t reply to this email!</p>";

    transporter.sendMail({
        from: 'Healthy Fling <info@healthyfling.com>',
        to: email,
        subject: "[HealthyFling] New activity on your favorite post!",
        html: mailBody
    }, function(error, info) {

        if (error) {

        } else {

        };
    });
}

// migration
// Page.find({
//     url: {
//         $exists: false
//     }
// }, (err, pages) => {
//     if (err) {
//         return;
//     }
//
//     pages.map((item) => {
//         Page.update({
//             _id: item._id
//         }, {
//             $set: {
//                 url: convertToSlug(item.title)
//             }
//         }, (err, updateInfo) => { });
//     });
// })

exports.list_all_images = function(req, res) {
    cloudinary.v2.api.resources(function(error, result){
        res.json(result.resources);
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

exports.create_a_post = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    var new_post = new Post({
        title: req.body.title,
        country: req.body.country,
        state: req.body.state,
        region: req.body.region,
        category: req.body.category,
        location: req.body.location,
        age: req.body.age,
        body: req.body.message,
        email: req.user.email,
        haircolor: req.body.haircolor,
        height: req.body.height,
        ethnicity: req.body.ethnicity,
        orientation: req.body.orientation,
        bodytype: req.body.bodytype,
        eyecolor: req.body.eyecolor,
        mstatus: req.body.mstatus,
        gender: req.body.gender,
        bodyhair: req.body.bodyhair,
        hivstatus: req.body.hivstatus,
        weight : req.body.weight,
        mage : req.body.mage,
        anonymouscomment : req.body.anonymouscomment,
        notified : req.body.notified,
        city : req.body.city,
        zip : req.body.zip,
        share : req.body.share,
        embed : req.body.embed,
        files: req.body.files,
        status: "active"
    });

    var date = new Date();
    var daysToDeletion = POSTS_TIMEOUT;
    var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

    var query_params = {};
    query_params.created = {$gt : deletionDate};
    query_params.email = req.user.email;

    Post.find(query_params, function (err, posts) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        if(posts && posts.length < MAXIMUM_ALLOWED_POST){
            new_post.save(function(err, post) {
                if (err)
                res.send(err);
                res.json(post);
            });

        }else{

            var data = {data:"limit reached"};
            res.json(data);
        }
        //
    });

};

exports.create_a_post_and_page = function(req, res) {
    console.log(1);
    console.log(req.user);
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }
    console.log(2);
    // Validation >>
    // If there is more than 0 page with this email, we should not give user permission to create a new page
    Page.count({
        email: req.user.email
    }, function(err, pagesCount) {
        if (err) {
            return res.send(err);
        }
        console.log(3);

        if (pagesCount == 1 && !req.body.pageId) {
            console.log(4);
            var data = {data:"limit reached"};
            return res.json(data);
        } else {
            console.log(5);

            // If page exists, then just add a new post
            if (req.body.pageId) {
                console.log(6);

                Page.findById(req.body.pageId, function(err, page) {
                    if (err) {
                        return res.send(err);
                    }

                    let imageURLs = [];

                    req.body.files.map(function(item) {
                        if (item.resource_type === 'imageURL') {
                            imageURLs.push(item);
                        }
                    });

                    req.body.files = req.body.files.filter(function(item) {
                        return !item.resource_type;
                    });

                    // If user provided url which should be shared, then scrape metas from it
                    if (req.body.sharedData && req.body.sharedData.url) {

                        var options = {'url': req.body.sharedData.url, 'encoding': 'utf8', 'followAllRedirects': true, 'maxRedirects': 5};
                        ogs(options, function (error, result) {
                            if (error) {
                                return res.json();
                            }

                            let ogData = {
                                url: req.body.sharedData.url,
                                domain: url.parse(req.body.sharedData.url, true).host.toUpperCase(),
                                title: result.data.ogTitle,
                                description: result.data.ogDescription,
                                image: (result.data.ogImage ? result.data.ogImage.url : '')
                            }

                            // Create a Post
                            var new_post = new Post({
                                title: req.body.title,
                                body: req.body.message,
                                email: req.user.email,
                                page: page._id,
                                anonymouscomment : req.body.anonymouscomment,
                                notified : req.body.notified,
                                embed : req.body.embed,
                                embedDescription : req.body.embedDescription || '',
                                embedSocial : req.body.embedSocial,
                                files: req.body.files,
                                status: "active",
                                sharedData: ogData,
                                sharedLink: true

                            });

                            new_post.save(function(err, post) {
                                if (err)
                                res.send(err);

                                imageURLs.map(function(item) {
                                    galleryController.download_from_url_and_process(item, post._id);
                                });

                                post.page = page;

                                res.json(post);
                            });
                        });

                    } else {

                        // Create a Post
                        var new_post = new Post({
                            title: req.body.title,
                            body: req.body.message,
                            email: req.user.email,
                            page: page._id,
                            anonymouscomment : req.body.anonymouscomment,
                            notified : req.body.notified,
                            embed : req.body.embed,
                            embedDescription : req.body.embedDescription || '',
                            embedSocial : req.body.embedSocial,
                            files: req.body.files,
                            status: "active"

                        });

                        new_post.save(function(err, post) {
                            if (err)
                            res.send(err);

                            imageURLs.map(function(item) {
                                galleryController.download_from_url_and_process(item, post._id);
                            });

                            post.page = page;

                            res.json(post);
                        });
                    }


                });

            } else {
                console.log(7);
                let imageURLs = [];

                req.body.files.map(function(item) {
                    if (item.resource_type === 'imageURL') {
                        imageURLs.push(item);
                    }
                });

                req.body.files = req.body.files.filter(function(item) {
                    return !item.resource_type;
                });

                // Create a Page
                new Page({
                    title: req.body.pageTitle,
                    url: convertToSlug(req.body.pageTitle),
                    description: req.body.pageMessage,
                    email: req.user.email,
                    profilePic: req.body.profilePic,
                    coverPic: req.body.coverPic,
                    website: req.body.website,
                    location: req.body.location,
                    status: 'active'
                }).save(function(err, page) {
                    if (err) {
                        return res.send(err);
                    }

                    // If user provided url which should be shared, then scrape metas from it
                    if (req.body.sharedData && req.body.sharedData.url) {

                        var options = {'url': req.body.sharedData.url, 'encoding': 'utf8', 'followAllRedirects': true, 'maxRedirects': 5};
                        ogs(options, function (error, result) {
                            if (error) {
                                return res.json();
                            }
                            let ogData = {
                                url: req.body.sharedData.url,
                                domain: url.parse(req.body.sharedData.url, true).host.toUpperCase(),
                                title: result.data.ogTitle,
                                description: result.data.ogDescription,
                                image: (result.data.ogImage ? result.data.ogImage.url : '')
                            }


                            // Create a Post
                            var new_post = new Post({
                                title: req.body.title,
                                body: req.body.message,
                                email: req.user.email,
                                page: page._id,
                                anonymouscomment : req.body.anonymouscomment,
                                embed : req.body.embed,
                                embedDescription : req.body.embedDescription,
                                embedSocial : req.body.embedSocial,
                                files: req.body.files,
                                status: "active",
                                sharedLink: true,
                                sharedData: ogData
                            });

                            new_post.save(function(err, post) {
                                if (err)
                                res.send(err);

                                imageURLs.map(function(item) {
                                    galleryController.download_from_url_and_process(item, post._id);
                                });

                                post.page = page;

                                res.json(post);
                            });


                        });

                    } else {

                        // Create a Post
                        var new_post = new Post({
                            title: req.body.title,
                            body: req.body.message,
                            email: req.user.email,
                            page: page._id,
                            anonymouscomment : req.body.anonymouscomment,
                            embed : req.body.embed,
                            embedDescription : req.body.embedDescription,
                            embedSocial : req.body.embedSocial,
                            files: req.body.files,
                            status: "active"
                        });

                        new_post.save(function(err, post) {
                            if (err)
                            res.send(err);

                            imageURLs.map(function(item) {
                                galleryController.download_from_url_and_process(item, post._id);
                            });

                            post.page = page;

                            res.json(post);
                        });

                    }

                });

            }

        }

    });

};

exports.create_a_page_post = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    let imageURLs = [];

    req.body.files.map(function(item) {
        if (item.resource_type === 'imageURL') {
            imageURLs.push(item);
        }
    });

    req.body.files = req.body.files.filter(function(item) {
        return !item.resource_type;
    });

    var new_post = new Post({
        title: req.body.title,
        country: req.body.country,
        state: req.body.state,
        region: req.body.region,
        category: req.body.category,
        location: req.body.location,
        age: req.body.age,
        body: req.body.message,
        email: req.user.email,
        haircolor: req.body.haircolor,
        height: req.body.height,
        ethnicity: req.body.ethnicity,
        orientation: req.body.orientation,
        bodytype: req.body.bodytype,
        eyecolor: req.body.eyecolor,
        mstatus: req.body.mstatus,
        gender: req.body.gender,
        bodyhair: req.body.bodyhair,
        hivstatus: req.body.hivstatus,
        weight : req.body.weight,
        mage : req.body.mage,
        anonymouscomment : req.body.anonymouscomment,
        notified : req.body.notified,
        city : req.body.city,
        zip : req.body.zip,
        share : req.body.share,
        embed : req.body.embed,
        files: req.body.files,
        status: "active"
    });

    var date = new Date();
    var daysToDeletion = POSTS_TIMEOUT;
    var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

    var query_params = {};
    query_params.created = {$gt : deletionDate};
    query_params.email = req.user.email;

    Post.find(query_params, function (err, posts) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        if(posts && posts.length < MAXIMUM_ALLOWED_POST){
            new_post.save(function(err, post) {
                if (err)
                res.send(err);

                imageURLs.map(function(item) {
                    galleryController.download_from_url_and_process(item, post._id);
                });

                res.json(post);
            });

        }else{

            var data = {data:"limit reached"};
            res.json(data);
        }
        //
    });

};

exports.read_a_page_with_posts = function(req, res) {

    let response = {
        page: {},
        posts: []
    }

    let Q = {};
    try {
        if (String(mongoose.Types.ObjectId(req.params.pageId)) === req.params.pageId) {
            Q = { _id: req.params.pageId };
        }
    } catch (e) {

    } finally {

        if (!Q['_id']) {
            Q = { url: req.params.pageId };
        }

        Page.findOne(Q, function (err, page) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                return res.send(err);
            }

            if (!page) {
                return res.send({});
            }

            response.page = page;

            Post.find({ page: page._id, status: ['active', 'flagged'] }).sort({'created': -1}).exec(function (err, posts) {
                if (err) {
                    return res.send(err);
                }

                response.posts = posts;

                return res.json(response);
            });

        });
    }

};

exports.update_page = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Page.update({ _id: req.params.pageId, email: req.user.email }, {
        $set: {
            location: req.body.location,
            website: req.body.website,
            profilePic: req.body.profilePic,
            coverPic: req.body.coverPic
        }
    }, function (err, page) {
        if (err) {
            return res.send(err);
        }

        return res.json(page);
    });

};

exports.get_page_for_user = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Page.findOne({ email: req.user.email }, function (err, page) {
        if (err) {
            return res.send(err);
        }

        if (page && page.email === req.user.email) {
            return res.json(page);
        } else {
            return res.json();
        }

    });

};

exports.like_page = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Page.update({ _id: req.body.pageId }, {
        $inc: {
            like: 1
        }
    }, function (err, page) {
        if (err) {
            return res.send(err);
        }

        return res.json(page);
    });

};

exports.dislike_page = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Page.update({ _id: req.body.pageId }, {
        $inc: {
            dislike: 1
        }
    }, function (err, page) {
        if (err) {
            return res.send(err);
        }

        return res.json(page);
    });

};

exports.react_post = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    let dynQ = {
        $inc: {
        }
    }

    dynQ.$inc['reactions.' + req.body.reaction] = 1;

    Post.update({ _id: req.body.postId }, dynQ, function (err, post) {
        if (err) {
            return res.send(err);
        }

        return res.json(post);
    });

};

exports.like_post = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Post.update({ _id: req.body.postId }, {
        $inc: {
            like: 1
        }
    }, function (err, post) {
        if (err) {
            return res.send(err);
        }

        return res.json(post);
    });

};

exports.dislike_post = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Post.update({ _id: req.body.postId }, {
        $inc: {
            dislike: 1
        }
    }, function (err, post) {
        if (err) {
            return res.send(err);
        }

        return res.json(post);
    });

};

exports.like_post_photo = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Post.update({ "files._id": req.body.photoId }, {
        $inc: {
            "files.$.like": 1
        }
    }, function (err, post) {
        if (err) {
            return res.send(err);
        }

        return res.json(post);
    });

};

exports.dislike_post_photo = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Post.update({ "files._id": req.body.photoId }, {
        $inc: {
            "files.$.dislike": 1
        }
    }, function (err, post) {
        if (err) {
            return res.send(err);
        }

        return res.json(post);
    });

};

exports.like_post_video = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Post.update({ _id: req.body.postId }, {
        $inc: {
            videoLike: 1
        }
    }, function (err, post) {
        if (err) {
            return res.send(err);
        }

        return res.json(post);
    });

};

exports.dislike_post_video = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Post.update({ _id: req.body.postId }, {
        $inc: {
            videoDislike: 1
        }
    }, function (err, post) {
        if (err) {
            return res.send(err);
        }

        return res.json(post);
    });

};

exports.like_comment = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    if (req.body.reply) {
        Reply.update({ _id: req.body.commentId }, {
            $inc: {
                like: 1
            }
        }, function (err, comment) {
            if (err) {
                return res.send(err);
            }

            return res.json(comment);
        });
    } else {
        Comment.update({ _id: req.body.commentId }, {
            $inc: {
                like: 1
            }
        }, function (err, comment) {
            if (err) {
                return res.send(err);
            }

            return res.json(comment);
        });
    }

};

exports.dislike_comment = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    if (req.body.reply) {
        Reply.update({ _id: req.body.commentId }, {
            $inc: {
                dislike: 1
            }
        }, function (err, comment) {
            if (err) {
                return res.send(err);
            }

            return res.json(comment);
        });
    } else {
        Comment.update({ _id: req.body.commentId }, {
            $inc: {
                dislike: 1
            }
        }, function (err, comment) {
            if (err) {
                return res.send(err);
            }

            return res.json(comment);
        });
    }

};

exports.read_a_post = function(req, res) {

    var date = new Date();
    var daysToDeletion = POSTS_TIMEOUT;
    var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

    var query_params = {};
    query_params.created = {$gt : deletionDate};
    // query_params.status = "active";
    query_params["_id"] = req.params.postId;
    var query = {
        state : 'STATE1'
    };


    Post.find(query_params, function (err, posts) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        //
        res.json(posts[0]); // return all todos in JSON format
    });

};

exports.read_a_post_for_edit = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    var query_params = {};
    query_params["_id"] = req.params.postId;
    query_params["email"] = req.user.email;

    Post.find(query_params, function (err, posts) {
        if (err) {
            res.send(err);
        }
        res.json(posts[0]);
    });

};

exports.read_a_page_post = function(req, res) {

    let Q = {};
    try {
        if (String(mongoose.Types.ObjectId(req.params.pageId)) === req.params.pageId) {
            Q['_id'] = req.params.pageId;
        }
    } catch (e) {

    } finally {

        if (!Q['_id']) {
            Q['url'] = req.params.pageId;
        }

        Page.findOne(Q, function (err, page) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                return res.send(err);
            }

            if (!page) {
                return res.send({});
            }

            var query_params = {};
            query_params["_id"] = req.params.postId;
            query_params["page"] = page._id;
            query_params["status"] = ['active', 'flagged'];
            var query = {
                state : 'STATE1'
            };

            Post
                .findOne(query_params, {
                    subscribers: 0,
                    comments: 0,
                    __v: 0
                })
                .lean()
                .populate('page', 'title url')
                .exec((err, post) => {
                    if (err) {
                        return res.send(err);
                    }

                    if (!post) {
                        return res.json({});
                    }

                    if (req.user && req.user.email === post.email) {
                        post.isOwner = true;
                        delete post.email;
                    }

                    return res.json(post);
                });

        });

    }

};

exports.get_post_by_photo = function(req, res) {

    var photoId = req.params.id;
    Post.findOne({ "files._id": photoId }).populate('page', 'title url').exec(function (err, post) {
        if (err) {
            res.send(err);
        }

        if (post) {
            res.json(post);
        } else {
            res.json({});
        }
    });

};

exports.get_all_comments = function(req, res) {

    var date = new Date();
    var daysToDeletion = POSTS_TIMEOUT;
    var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

    var query_params = {};
    // query_params.created = {$gt : deletionDate};
    query_params.status = ["active","inactive","flagged"];
    query_params["post"] = req.params.postId;
    var query = {
        state : 'STATE1'
    };

    Comment.find(query_params).populate('replies').exec(function (err, comments) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        //
        res.json(comments); // return all todos in JSON format
    });

};

exports.delete_a_comment= function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Comment.findById(req.params.commentId, function(err, comment) {
        if (err)
            res.send(err);

        if (comment && req.user.email !== comment.email) {
            return res.status(401).send({
                message: "Unauthorized request"
            });
        }

        comment.status = "inactive";
        comment.save(function(err, comment) {
            if (err)
            res.send(err);

            // Find post and send activity info to subscribed emails
            Post.findById(comment.post, function(err, post) {
                if (post.subscribers) {
                    post.subscribers.map(function(email) {
                        sendActivityAlert(post._id, post.title, email);
                    });
                }
            });
            res.json({ message: 'comment successfully deleted' });
        });
    });
};

exports.delete_a_reply= function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Reply.findById(req.params.replyId, function(err, reply) {
        if (err)
            res.send(err);

        if (reply && req.user.email !== reply.email) {
            return res.status(401).send({
                message: "Unauthorized request"
            });
        }

        reply.status = "inactive";
        reply.save(function(err, comment) {
            if (err)
            res.send(err);
            // Find post and send activity info to subscribed emails
            Post.findById(comment.post, function(err, post) {
                if (post && post.subscribers) {
                    post.subscribers.map(function(email) {
                        sendActivityAlert(post._id, post.title, email);
                    });
                }
            });
            res.json({ message: 'reply successfully deleted' });
        });
    });

};

exports.flag_a_reply = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Reply.findById(req.params.replyId, function(err, reply) {
        if (err)
            res.send(err);

        if (reply && req.user.email !== reply.email) {
            return res.status(401).send({
                message: "Unauthorized request"
            });
        }

        reply.status = "flagged";

        if(req.body.flagreason){
            reply.flagreason = req.body.flagreason;
        }

        reply.save(function(err, comment) {
            if (err)
            res.send(err);
            // Find post and send activity info to subscribed emails
            Post.findById(comment.post, function(err, post) {
                if (post.subscribers) {
                    post.subscribers.map(function(email) {
                        sendActivityAlert(post._id, post.title, email);
                    });
                }
            });
            res.json({ message: 'reply successfully flagged' });
        });
    });

};

exports.unflag_a_reply= function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Reply.findById(req.params.replyId, function(err, reply) {
        if (err)
            res.send(err);

        if (reply && req.user.email !== reply.email) {
            return res.status(401).send({
                message: "Unauthorized request"
            });
        }

        reply.status = "active";
        reply.save(function(err, comment) {
            if (err)
            res.send(err);
            // Find post and send activity info to subscribed emails
            Post.findById(comment.post, function(err, post) {
                if (post && post.subscribers) {
                    post.subscribers.map(function(email) {
                        sendActivityAlert(post._id, post.title, email);
                    });
                }
            });
            res.json({ message: 'reply successfully activated' });
        });
    });

};

exports.flag_a_comment= function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Comment.findById(req.params.commentId, function(err, comment) {
        if (err)
            res.send(err);

        comment.status = "flagged";
        comment.save(function(err, comment) {
            if (err)
            res.send(err);
            // Find post and send activity info to subscribed emails
            Post.findById(comment.post, function(err, post) {
                if (post.subscribers) {
                    post.subscribers.map(function(email) {
                        sendActivityAlert(post._id, post.title, email);
                    });
                }
            });
            res.json({ message: 'comment successfully flagged' });
        });
    });

};

exports.flag_a_comment_reason= function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Comment.findById(req.params.commentId, function(err, comment) {
        if (err)
            res.send(err);

        comment.status = "flagged";

        if(req.body.flagreason){
            comment.flagreason = req.body.flagreason;
        }

        comment.save(function(err, comment) {
            if (err)
            res.send(err);
            res.json({ message: 'comment successfully flagged' });
        });
    });

};

exports.unflag_a_comment= function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Comment.findById(req.params.commentId, function(err, comment) {
        if (err)
            res.send(err);

        comment.status = "active";
        comment.save(function(err, comment) {
            if (err)
            res.send(err);

            // Find post and send activity info to subscribed emails
            Post.findById(comment.post, function(err, post) {
                if (post.subscribers) {
                    post.subscribers.map(function(email) {
                        sendActivityAlert(post._id, post.title, email);
                    });
                }
            });
            res.json({ message: 'comment successfully activated' });
        });
    });

};

exports.reply_a_comment = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Comment.findById(req.params.commentId, function(err, comment) {
        if (err) {
            return handleError(err);
        }

        // Find post and send activity info to subscribed emails
        Post.findById(comment.post, function(err, post) {
            if (post.subscribers) {
                post.subscribers.map(function(email) {
                    sendActivityAlert(post._id, post.title, email);
                });
            }
        });

        Post.findById(comment.post, function(err, post) {
            if (err) {
                return handleError(err);
            }
            var reply = new Reply({
                body: req.body.commentmessage,
                status: "active",
                files: req.body.commentfiles,
                embed: req.body.commentembed,
                email: req.user.email,
                label: req.body.label,
                owner: req.body.owner,
                comment: req.params.commentId // assign the _id from the post
            });
            reply.save(function (err, reply) {
                let replyEmail = req.user.email;
                if (err) {
                    return handleError(err);
                }

                comment.replies.unshift(reply);

                if (replyEmail && replyEmail != '') {
                    var mailBody = '';
                    if (replyEmail.toLowerCase() == post.email.toLowerCase()) {
                        mailBody = "<p>A new comment has been added to the post [<b>"+post.title+"</b>]</p><p>To view the post <a href='https://www.healthyfling.com/#/detail/"+post['_id']+"?edit=true'>click here.<a></p><br><p style='font-size:12px;font-weight:bold;'>Please dont reply to this email!</p>";
                    }else{
                        mailBody = "<p>A new comment has been added to the post [<b>"+post.title+"</b>]</p><p>To view the post <a href='https://www.healthyfling.com/#/detail/"+post['_id']+"'>click here.<a></p><br><p style='font-size:12px;font-weight:bold;'>Please dont reply to this email!</p>";
                    }
                    var mailOptions = {
                        from: 'Healthy Fling <info@healthyfling.com>', // sender address
                        to: replyEmail,
                        subject: "You have a new comment ["+post.title+"]",
                        html: mailBody
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){

                        }else{

                        };
                    });
                }

                comment.save(function(err, comment) {
                    if (err){

                        res.send(err);
                    }
                    if(comment.email && comment.email != "" && replyEmail.toLowerCase() != comment.email.toLowerCase()){
                        var mailBody = "<p>A new comment has been added to the post [<b>"+post.title+"</b>]</p><p>To view the post <a href='https://www.healthyfling.com/#/detail/"+post['_id']+"'>click here.<a></p><br><p style='font-size:12px;font-weight:bold;'>Please dont reply to this email!</p>";
                        var mailOptions = {
                            from: 'Healthy Fling <info@healthyfling.com>', // sender address
                            to: comment.email,
                            subject: "You have a new comment ["+post.title+"]",
                            html: mailBody
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){

                            }else{

                            };
                        });
                    }
                    res.json(comment);
                });
            });
        });
    });

};

exports.admin_read_a_post = function(req, res) {

    // var date = new Date();
    // var daysToDeletion = ADMIN_POSTS_TIMEOUT;
    // var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

    var query_params = {};
    // query_params.created = {$gt : deletionDate};
    // query_params.status = "active";
    query_params["_id"] = req.params.postId;

    Post.find(query_params, function (err, posts) {
        if (err) {
            res.send(err);
        }
        res.json(posts[0]);
    });

};

exports.renderpost = function(req, res) {
    var ua = req.headers['user-agent'];
    if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)(googlebot)|(bingbot)|(linkedinbot)/gi.test(ua)) {

        var date = new Date();
        var daysToDeletion = POSTS_TIMEOUT;
        var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

        var query_params = {};
        query_params.created = {$gt : deletionDate};
        // query_params.status = "active";
        query_params["_id"] = req.params.postId;
        var query = {
            state : 'STATE1'
        };

        Post.find(query_params, function (err, posts) {
            if (err) {

                res.redirect("/expired");
            }
            var post = posts[0];

            var metaUrl = "https://www.healthyfling.com/app-content/images/logo_meta.png";
            if(post && post.files && post.files.length >0){
                metaUrl = post.files[0].secure_url;
            }
            res.send('<meta property="og:type" content="article"><meta property="og:title" content="'+post.title+'"><meta property="og:description" content="' + post.body + '"><meta property="og:image" content="'+metaUrl+'"><meta property="og:image:width" content="680"><meta property="og:image:height" content="340"><meta name="twitter:card" content="summary"><meta name="twitter:site" content="@healthyfling"><meta name="twitter:title" content="'+post.title+'"><meta name="twitter:description" content="' + post.body + '"><meta name="twitter:image" content="'+metaUrl+'">');
        });
    }else{

        res.redirect("/detail/"+req.params.postId);
    }
};

exports.renderpagepost = function(req, res) {
    var ua = req.headers['user-agent'];

    var query_params = {};
    query_params["_id"] = req.params.postId;
    var query = {
        state : 'STATE1'
    };

    Post.findOne(query_params, function (err, post) {
        if (err) {

            res.redirect("/#/expired");
        }

        if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)(googlebot)|(bingbot)|(linkedinbot)/gi.test(ua)) {
            var metaUrl = "https://www.healthyfling.com/app-content/images/logo_meta.png";
            if(post && post.files && post.files.length >0){
                metaUrl = post.files[0].secure_url;
            }
            res.send('<meta property="og:type" content="article"><meta property="og:title" content="'+post.title+'"><meta property="og:description" content="' + post.body + '"><meta property="og:image" content="'+metaUrl+'"><meta property="og:image:width" content="680"><meta property="og:image:height" content="340"><meta name="twitter:card" content="summary"><meta name="twitter:site" content="@healthyfling"><meta name="twitter:title" content="'+post.title+'"><meta name="twitter:description" content="' + post.body + '"><meta name="twitter:image" content="'+metaUrl+'">');
        }else{
            res.redirect("/#/page/" + post.page + '/post/' + req.params.postId);
        }

    });

};

exports.renderpage = function(req, res) {
    var ua = req.headers['user-agent'];
    if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)(googlebot)|(bingbot)|(linkedinbot)/gi.test(ua)) {

        var query_params = {};
        try {
            if (String(mongoose.Types.ObjectId(req.params.pageId)) === req.params.pageId) {
                query_params["_id"] = req.params.pageId;
            }
        } catch (e) {

        } finally {
            if (!query_params["_id"]) {
                query_params["url"] = req.params.pageId;
            }
            Page.findOne(query_params, function (err, page) {
                if (err) {

                    res.redirect("/#/expired");
                }

                var metaUrl = "https://www.healthyfling.com/app-content/images/logo_meta.png";
                if (page.profilePic) {
                    metaUrl = page.profilePic;
                }

                res.send('<meta property="og:type" content="article"><meta property="og:title" content="'+page.title+'"><meta property="og:description" content="Your new favorite personals site to create, search and reply to personal ads."><meta property="og:image" content="'+metaUrl+'"><meta property="og:image:width" content="680"><meta property="og:image:height" content="340"><meta name="twitter:card" content="summary"><meta name="twitter:site" content="@healthyfling"><meta name="twitter:title" content="'+page.title+'"><meta name="twitter:description" content="Your new favorite personals site to create, search and reply to personal ads."><meta name="twitter:image" content="'+metaUrl+'">');
            });
        }
    }else{

        res.redirect("/#/page/"+req.params.pageId);
    }
};

exports.flagpost = function(req, res) {
    Post.findById(req.params.postId, function(err, post) {
        if (err)
        res.send(err);
        post.status = "inactive";
        post.save(function(err, post) {
            if (err)
            res.send(err);

            var subject_sufix = "";

            if(post.location || post.age){
                subject_sufix = " -";
                if(post.age){
                    subject_sufix = subject_sufix + " " +post.location;
                }
                if(post.location){
                    subject_sufix = subject_sufix + " (" +post.location+")";
                }
            }

            // Send activity info to subscribed emails
            if (post.subscribers) {
                post.subscribers.map(function(email) {
                    sendActivityAlert(post._id, post.title, email);
                });
            }

            var mailBody = "<b>Greetings!</b><br/>"+ "<p>Your posting in HealthyFling has been flagged!</p>"+"<p>If you feel your post was flagged incorrectly, please contact us for further review.</p><p>You can contact us <a href='https://www.healthyfling.com/#/contact'>here</a></p><p>https://www.healthyfling.com/#/contact</p>";
            var mailOptions = {
                from: 'Healthy Fling <info@healthyfling.com>', // sender address
                to: post.email,
                subject: "[POST FLAGGED] : " + post.title + subject_sufix,
                html: mailBody
            };


            transporter.sendMail(mailOptions, function(error, info){
                if(error){

                }else{

                };
            });
            res.json(post);
        });
    });
};

exports.flagpage = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Page.findById(req.params.pageId, function(err, page) {
        if (err)
        res.send(err);
        page.status = "flagged";
        page.save(function(err, page) {
            if (err)
            res.send(err);

            var subject_sufix = "";

            if(page.location || page.age){
                subject_sufix = " -";
                if(page.age){
                    subject_sufix = subject_sufix + " " +page.location;
                }
                if(page.location){
                    subject_sufix = subject_sufix + " (" +page.location+")";
                }
            }

            // Send activity info to subscribed emails
            if (page.subscribers) {
                page.subscribers.map(function(email) {
                    sendActivityAlert(page._id, page.title, email);
                });
            }

            var mailBody = "<b>Greetings!</b><br/>"+ "<p>Your page in HealthyFling has been flagged!</p>"+"<p>If you feel your page was flagged incorrectly, please contact us for further review.</p><p>You can contact us <a href='https://www.healthyfling.com/#/contact'>here</a></p><p>https://www.healthyfling.com/#/contact</p>";
            var mailOptions = {
                from: 'Healthy Fling <info@healthyfling.com>', // sender address
                to: page.email,
                subject: "[PAGE FLAGGED] : " + page.title + subject_sufix,
                html: mailBody
            };


            transporter.sendMail(mailOptions, function(error, info){
                if(error){

                }else{

                };
            });
            res.json(page);
        });
    });
};

// @todo
exports.unflagpost = function(req, res) {
    Post.findById(req.params.postId, function(err, post) {
        if (err)
        res.send(err);
        post.status = "active";
        post.flagreason = "";
        post.save(function(err, post) {
            if (err)
            res.send(err);
            // Send activity info to subscribed emails
            if (post.subscribers) {
                post.subscribers.map(function(email) {
                    sendActivityAlert(post._id, post.title, email);
                });
            }
            res.json(post);
        });
    });
};

// @todo
exports.unflagpage = function(req, res) {
    Page.findById(req.params.pageId, function(err, page) {
        if (err)
        res.send(err);
        page.status = "active";
        page.flagreason = "";
        page.save(function(err, page) {
            if (err)
            res.send(err);
            // Send activity info to subscribed emails
            if (page.subscribers) {
                page.subscribers.map(function(email) {
                    sendActivityAlert(page._id, page.title, email);
                });
            }
            res.json(page);
        });
    });
};

exports.read_all_posts = function(req, res) {

    var date = new Date();
    var daysToDeletion = POSTS_TIMEOUT;
    var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

    var query_params = url.parse(req.url,true).query;
    query_params.created = {$gt : deletionDate};
    query_params.page = {$exists : false};
    query_params.status = ["active","flagged"];
    var query = {
        state : 'STATE1'
    };


    Post.find(query_params, function (err, posts) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(posts); // return all todos in JSON format
    });

};

exports.read_all_page_posts = function(req, res) {

    Post.find({page: {$exists: true}, status: ['active', 'flagged']}).populate('page', '_id title profilePic url').exec(function (err, posts) {
        if (err) {
            return res.send(err);
        }
        return res.json(posts);
    });

};

exports.admin_read_all_page_posts = function(req, res) {

    var query_params = url.parse(req.url,true).query;
    query_params.page = {$exists : true};

    Post.find(query_params, function (err, posts) {
        if (err) {
            res.send(err);
        }
        res.json(posts);
    });

};

exports.admin_read_all_posts = function(req, res) {

    var date = new Date();
    var daysToDeletion = ADMIN_POSTS_TIMEOUT;
    var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

    var query_params = url.parse(req.url,true).query;
    query_params.created = {$gt : deletionDate};
    query_params.page = {$exists : false};

    Post.find(query_params, function (err, posts) {
        if (err) {
            res.send(err);
        }
        res.json(posts);
    });

};

exports.admin_read_all_pages = function(req, res) {

    var query_params = url.parse(req.url,true).query;

    Page.find(query_params, function (err, pages) {
        if (err) {
            res.send(err);
        }
        res.json(pages);
    });

};

exports.subscribe = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Post.findById(req.params.postId, function(err, post) {
        if (err) {
            res.send(err);
        }

        if (!post.subscribers) {
            post.subscribers = [req.user.email];
        } else {
            if (post.subscribers.indexOf(req.user.email) > -1) {
                return res.json('EMAIL_ALREADY_SUBSCRIBED');
            }
            post.subscribers.push(req.user.email);
        }

        // Filter only unique emails
        page.subscribers = page.subscribers.filter(onlyUnique);

        post.save(function(err, post) {
            if (err)
            res.send(err);

            res.json(post);
        });
    });
};

exports.subscribePage = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Page.findById(req.params.pageId, function(err, page) {
        if (err) {
            return res.send(err);
        }

        if (!page.subscribers) {
            page.subscribers = [req.user.email];
        } else {
            if (page.subscribers.indexOf(req.user.email) > -1) {
                return res.json('EMAIL_ALREADY_SUBSCRIBED');
            }
            page.subscribers.push(req.user.email);
        }

        // Filter only unique emails
        page.subscribers = page.subscribers.filter(onlyUnique);

        page.save(function(err, page) {
            if (err)
            return res.send(err);

            return res.json(page);
        });
    });
};

exports.edit_a_post= function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Post.findOne({
        _id: req.params.postId
    }, function(err, post) {
        if (err) {
            res.send(err);
        }

        if(req.body.title){
            post.title = req.body.title;
        }
        if(req.body.country){
            post.country = req.body.country;
        }
        if(req.body.state){
            post.state = req.body.state;
        }
        if(req.body.region){
            post.region = req.body.region;
        }
        if(req.body.category){
            post.category = req.body.category;
        }
        if(req.body.location){
            post.location = req.body.location;
        }
        if(req.body.age){
            post.age = req.body.age;
        }
        if(req.body.message){
            post.body = req.body.message;
        }
        if(req.body.haircolor){
            post.haircolor = req.body.haircolor;
        }
        if(req.body.height){
            post.height = req.body.height;
        }
        if(req.body.ethnicity){
            post.ethnicity = req.body.ethnicity;
        }
        if(req.body.orientation){
            post.orientation = req.body.orientation;
        }
        if(req.body.bodytype){
            post.bodytype = req.body.bodytype;
        }
        if(req.body.eyecolor){
            post.eyecolor = req.body.eyecolor;
        }
        if(req.body.mstatus){
            post.mstatus = req.body.mstatus;
        }
        if(req.body.gender){
            post.gender = req.body.gender;
        }
        if(req.body.bodyhair){
            post.bodyhair = req.body.bodyhair;
        }
        if(req.body.hivstatus){
            post.hivstatus = req.body.hivstatus;
        }
        if(req.body.weight){
            post.weight = req.body.weight;
        }
        if(req.body.mage){
            post.mage = req.body.mage;
        }
        if(req.body.anonymouscomment){
            post.anonymouscomment = req.body.anonymouscomment;
        }
        if(req.body.notified){
            post.notified = req.body.notified;
        }
        if(req.body.share){
            post.share = req.body.share;
        }

        if(req.body.embed){
            post.embed = req.body.embed;
        }

        if(req.body.embedDescription){
            post.embedDescription = req.body.embedDescription;
        }

        if(req.body.city){
            post.city = req.body.city;
        }
        if(req.body.zip){
            post.zip = req.body.zip;
        }
        if(req.body.embedSocial && req.body.embedSocial[0] !== ''){
            post.embedSocial = req.body.embedSocial;
        }

        let imageURLs = [];

        if(req.body.files){
            req.body.files.map(function(item) {
                if (item.resource_type === 'imageURL') {
                    imageURLs.push(item);
                }
            });

            req.body.files = req.body.files.filter(function(item) {
                return !item.resource_type;
            });

            post.files = req.body.files;
        }

        if (req.user.email === post.email && ((req.body.sharedData && post.sharedLink && post.sharedData.url !== req.body.sharedData.url) || (req.body.sharedData && !post.sharedLink && req.body.sharedData.url))) {
            var options = {'url': req.body.sharedData.url, 'encoding': 'utf8', 'followAllRedirects': true, 'maxRedirects': 5};
            ogs(options, function (error, result) {
                if (error) {
                    return res.json();
                }
                let ogData = {
                    url: req.body.sharedData.url,
                    domain: url.parse(req.body.sharedData.url, true).host.toUpperCase(),
                    title: result.data.ogTitle,
                    description: result.data.ogDescription,
                    image: (result.data.ogImage ? result.data.ogImage.url : '')
                }
                post.sharedData = ogData;
                post.sharedLink = true;

                post.save(function(err, post) {
                    if (err)
                    res.send(err);

                    imageURLs.map(function(item) {
                        galleryController.download_from_url_and_process(item, post._id);
                    });

                    // Send activity info to subscribed emails
                    if (post.subscribers) {
                        post.subscribers.map(function(email) {
                            sendActivityAlert(post._id, post.title, email);
                        });
                    }

                    if(req.body.commentmessage || req.body.commentfiles || req.body.commentembed){
                        var comment = new Comment({
                            body: req.body.commentmessage,
                            email: req.user.email || "",
                            embed : req.body.commentembed,
                            files: req.body.commentfiles,
                            status: "active",
                            post: post._id    // assign the _id from the post
                        });
                        comment.save(function (err, commentItem) {

                            if (err) {

                                return handleError(err);
                            }else{

                                Post.update({
                                    _id: post._id
                                }, {
                                    $push: {
                                        comments: commentItem._id
                                    }
                                }, function(err, updateInfo) {

                                });

                                if(post.notified == 'yes'){
                                    if (post.page) {
                                        var mailBody = "<p>A new comment has been added to the post [<b>"+post.title+"</b>]</p><p>To view this post and reply to this comment <a href='https://www.healthyfling.com/#/page/"+post.page+"/post/" + post._id +"'>click here.<a></p><br><p style='font-size:12px;font-weight:bold;'>Please dont reply to this email!</p>";
                                        var mailOptions = {
                                            from: 'Healthy Fling <info@healthyfling.com>', // sender address
                                            to: post.email,
                                            subject: "You have a new comment ["+post.title+"]",
                                            html: mailBody
                                        };

                                        transporter.sendMail(mailOptions, function(error, info){
                                            if(error){

                                            }else{

                                            };
                                        });
                                    } else {
                                        var mailBody = "<p>A new comment has been added to the post [<b>"+post.title+"</b>]</p><p>To view this post and reply to this comment <a href='https://www.healthyfling.com/#/detail/"+post['_id']+"?edit=true'>click here.<a></p><br><p style='font-size:12px;font-weight:bold;'>Please dont reply to this email!</p>";
                                        var mailOptions = {
                                            from: 'Healthy Fling <info@healthyfling.com>', // sender address
                                            to: post.email,
                                            subject: "You have a new comment ["+post.title+"]",
                                            html: mailBody
                                        };

                                        transporter.sendMail(mailOptions, function(error, info){
                                            if(error){

                                            }else{

                                            };
                                        });
                                    }
                                }

                            }
                        });
                    }
                    res.json(post);
                });
            });
        } else {

            post.save(function(err, post) {
                if (err)
                res.send(err);

                imageURLs.map(function(item) {
                    galleryController.download_from_url_and_process(item, post._id);
                });

                // Send activity info to subscribed emails
                if (post.subscribers) {
                    post.subscribers.map(function(email) {
                        sendActivityAlert(post._id, post.title, email);
                    });
                }

                if(req.body.commentmessage || req.body.commentfiles || req.body.commentembed){
                    var comment = new Comment({
                        body: req.body.commentmessage,
                        email: req.user.email || "",
                        embed : req.body.commentembed,
                        files: req.body.commentfiles,
                        status: "active",
                        post: post._id    // assign the _id from the post
                    });
                    comment.save(function (err, commentItem) {

                        if (err) {

                            return handleError(err);
                        }else{

                            Post.update({
                                _id: post._id
                            }, {
                                $push: {
                                    comments: commentItem._id
                                }
                            }, function(err, updateInfo) {

                            });

                            if(post.notified == 'yes'){
                                if (post.page) {
                                    var mailBody = "<p>A new comment has been added to the post [<b>"+post.title+"</b>]</p><p>To view this post and reply to this comment <a href='https://www.healthyfling.com/#/page/"+post.page+"/post/" + post._id +"'>click here.<a></p><br><p style='font-size:12px;font-weight:bold;'>Please dont reply to this email!</p>";
                                    var mailOptions = {
                                        from: 'Healthy Fling <info@healthyfling.com>', // sender address
                                        to: post.email,
                                        subject: "You have a new comment ["+post.title+"]",
                                        html: mailBody
                                    };

                                    transporter.sendMail(mailOptions, function(error, info){
                                        if(error){

                                        }else{

                                        };
                                    });
                                } else {
                                    var mailBody = "<p>A new comment has been added to the post [<b>"+post.title+"</b>]</p><p>To view this post and reply to this comment <a href='https://www.healthyfling.com/#/detail/"+post['_id']+"?edit=true'>click here.<a></p><br><p style='font-size:12px;font-weight:bold;'>Please dont reply to this email!</p>";
                                    var mailOptions = {
                                        from: 'Healthy Fling <info@healthyfling.com>', // sender address
                                        to: post.email,
                                        subject: "You have a new comment ["+post.title+"]",
                                        html: mailBody
                                    };

                                    transporter.sendMail(mailOptions, function(error, info){
                                        if(error){

                                        }else{

                                        };
                                    });
                                }
                            }

                        }
                    });
                }
                res.json(post);
            });
        }

    });
};

exports.flagpostreason = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Post.findById(req.params.postId, function(err, post) {
        if (err)
        res.send(err);
        post.status = "flagged";
        if(req.body.flagreason){
            post.flagreason = req.body.flagreason;
        }
        post.save(function(err, post) {
            if (err)
            res.send(err);

            var subject_sufix = "";

            if(post.location || post.age){
                subject_sufix = " -";
                if(post.age){
                    subject_sufix = subject_sufix + " " +post.location;
                }
                if(post.location){
                    subject_sufix = subject_sufix + " (" +post.location+")";
                }
            }

            // Send activity info to subscribed emails
            if (post.subscribers) {
                post.subscribers.map(function(email) {
                    sendActivityAlert(post._id, post.title, email);
                });
            }

            res.json(post);
        });
    });
};

exports.reportpagereason = function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Page.findById(req.params.pageId, function(err, page) {
        if (err)
        res.send(err);
        page.status = "flagged";

        if(req.body.flagreason){
            page.reportreason = req.body.flagreason;
        }

        page.save(function(err, page) {
            if (err)
            res.send(err);

            // Send activity info to subscribed emails
            if (page.subscribers) {
                page.subscribers.map(function(email) {
                    sendActivityAlert(page._id, page.title, email);
                });
            }

            res.json(page);
        });
    });
};

exports.delete_a_post= function(req, res) {
    // if (!req.user) {
    //     return res.status(401).send({
    //         message: "Unauthorized request"
    //     });
    // }

    // Post.findOne({
    //     _id: req.params.postId,
    //     // email: req.user.email
    // }, function(err, post) {
    //     if (err) res.send(err);
    //     post.status = "inactive";
    //     post.save(function(err, post) {
    //         if (err)
    //         res.send(err);
    //         // Send activity info to subscribed emails
    //         if (post.subscribers) {
    //             post.subscribers.map(function(email) {
    //                 sendActivityAlert(post._id, post.title, email);
    //             });
    //         }

    //         res.json({ message: 'post successfully deleted' });
    //     });
    // });

    Post.remove({
      _id: req.params.postId
    }, function(err, post) {
      if (err)
        res.send(err);
      res.json({ message: 'post successfully deleted' });
    });
};

exports.delete_a_page= function(req, res) {
    if (!req.user) {
        return res.status(401).send({
            message: "Unauthorized request"
        });
    }

    Page.findOne({
        _id: req.params.pageId,
        email: req.user.email
    }, function(err, page) {
        if (err || !page)
        res.send(err);
        page.status = "inactive";
        page.save(function(err, page) {
            if (err)
            res.send(err);

            // Send activity info to subscribed emails
            if (page.subscribers) {
                page.subscribers.map(function(email) {
                    sendActivityAlert(page._id, page.title, email);
                });
            }

            Post.update({page: req.params.pageId}, {$set: {status: 'inactive'}}, {multi: true}, function(err, posts) {
                if (err)
                res.send(err);

                res.json({ message: 'page successfully deleted' });
            });

        });
    });

    // Post.remove({
    //   _id: req.params.postId
    // }, function(err, post) {
    //   if (err)
    //     res.send(err);
    //   res.json({ message: 'post successfully deleted' });
    // });
};
