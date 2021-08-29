'use strict';
var nodemailer = require('nodemailer');

var Cryptr = require('cryptr'),
cryptr = new Cryptr('Ji5RW2BlJ6');

module.exports = function(apiRoutes) {

  apiRoutes.post('/sendMail', function(req, res) {

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 25,
        auth: {
            user: 'info@healthyfling.com',
            pass: 'Photography88'
        }
    });

    if (req.body) {
      var text = req.body.message;

      var link = req.body.link || "";

      var replyAddr = "";

      if (req.body['x-post-id'] && req.body['x-from']) {
        // replyAddr = req.body['x-post-id']+"-"+cryptr.encrypt(req.body['x-from'])+"-reply@healthyfling.com"
        replyAddr = req.body['x-from']
      }

      var attachments = [];

      if(req.body["attachments"] && req.body["attachments"].length > 0) {
        for(var i =0; i < req.body["attachments"].length; i++){
          var attachment = req.body["attachments"][i];
          attachments.push({
            filename: attachment.public_id +"."+attachment.format,
            path: attachment.secure_url
          });
        }
      }

      

      var mailOptions = {};
      
      if (req.body.htmlmessage) {
        text = req.body.htmlmessage || req.body.message;
        mailOptions = {
            from: 'Healthy Fling <info@healthyfling.com>', // sender address
            to: [req.body.sender1,req.body.sender2], // list of receivers
            subject: req.body.subject, // Subject line
            html: "<b>Greetings!</b> <br/>"+text+"\n\n"+link,
            replyTo: replyAddr,
            attachments: attachments
            // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
        };
      }else{

        mailOptions = {
            from: 'Healthy Fling <info@healthyfling.com>', // sender address
            to: [req.body.sender1,req.body.sender2], // list of receivers
            subject: req.body.subject, // Subject line
            text: "Greetings! \n\n"+text+"\n\n"+link,
            replyTo: replyAddr
            // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
        };

      }


      transporter.sendMail(mailOptions, function(error, info){
          if(error){
              
              res.json({yo: 'error'});
          }else{
              
              res.json({yo: info.response});
          };
      });
    }

  });

  // app.route('/tasks/:taskId')
  //   .get(todoList.read_a_task)
  //   .put(todoList.update_a_task)
  //   .delete(todoList.delete_a_task);
};
