"use strict";
const nodemailer = require("nodemailer");

// The entry point for the GCF recieves the HTTP request and response objects
async function sendVerificationEmail(req,res) {
  
  let testAccount = await nodemailer.createTestAccount();
  
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user, 
      pass: testAccount.pass, 
    },
  });
  
  let info = await transporter.sendMail({
    from: 'maillingList@subscription.com', 
    to: req.query.email, 
    subject: "Verify Your email", 
    text: "Thank you for your interest in our mailing list", 
    // The html body of the message contains the URL to trigger the verify-email GCF
    html: '<a href="https://us-central1-fit-heaven-286717.cloudfunctions.net/verify-email?email=' 
            + req.query.email 
            +'"> Click here to verify your email</a>' 
    , 
  });

  // Send the preview url as a response
  let preview = "A verification email sent to your account: <a href='" 
                + nodemailer.getTestMessageUrl(info)
                + "'> Here </a>";
  res.status(200).send(preview);
}

module.exports.sendVerificationEmail = sendVerificationEmail;

