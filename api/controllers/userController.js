"use strict";

const Crypto = require("crypto-js");
const User = require("../models/user");
const config = require("../../config");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'info@healthyfling.com',
        pass: 'Photography88'
    }
});

function sendEmail(subject, email, content) {
    transporter.sendMail({
        from: 'Healthy Fling <info@healthyfling.com>',
        to: email,
        subject: subject,
        html: content
    }, function(error, info) {
        if (error) {

        } else {

        };
    });
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.user = (req, res) => {
    User.findOne({
        tempAccessToken: req.headers.authorization
    }, (err, user) => {
        if (err) {
            return res.send(err);
        }
        if (user && user.blocked) {
            return res.sendStatus(403);
        }
        if (user) {
            return res.send({
                email: user.email
            });
        } else {
            return res.sendStatus(401);
        }
    });
}

exports.login = (req, res) => {
    if (!req.body.email || !validateEmail(req.body.email ? req.body.email.toLowerCase(): null)) {
        return res.send(400);
    }

    const email = req.body.email.toLowerCase();
    User.findOne({
        email: email
    }, (err, user) => {
        if (err) {
            return res.send(err);
        }
        if (user && user.blocked) {
            return res.sendStatus(403);
        }

        // Generate temporary access token and save it
        let tempAccessToken = Crypto.AES.encrypt(email, config.key).toString();
        if (user) {
            User.update({
                _id: user._id
            }, {
                $set: {
                    tempAccessToken: tempAccessToken
                }
            }, (err, result) => {
                
            });
        } else {
            User.create({
                admin: false,
                name: "",
                email: email,
                tempAccessToken: tempAccessToken
            }, (err, result) => {
                
            });
        }

        // Send email
        const subject = "[HealthyFling] Login";
        const content = `Folow this link to authenticate on healthyfling: <a href="https://www.healthyfling.com/?accessToken=${tempAccessToken}">https://www.healthyfling.com/?accessToken=${tempAccessToken}</a>`;
        sendEmail(subject, email, content);
        return res.sendStatus(200);
    });
};

exports.block = (req, res) => {
    User.update({
        email: req.body.email
    }, {
        $set: {
            blocked: true
        }
    }, (err, result) => {
        return res.sendStatus(200);
    });
}

exports.unblock = (req, res) => {
    User.update({
        email: req.body.email
    }, {
        $set: {
            blocked: false
        }
    }, (err, result) => {
        return res.sendStatus(200);
    });
}
