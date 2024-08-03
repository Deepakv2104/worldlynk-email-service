const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests (OPTIONS method)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins
        'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
        'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allow specific methods
      },
      body: JSON.stringify({ message: 'CORS preflight response' }),
    };
  }

  // Proceed only if the request method is POST
  if (event.httpMethod === 'POST') {
    try {
      // Parse the request body as JSON
      const { email, firstName } = JSON.parse(event.body);

      // Set up nodemailer transport using Outlook SMTP settings
      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER, // Your Outlook email address
          pass: process.env.SMTP_PASS, // Your Outlook email password
        },
        tls: {
          ciphers: 'SSLv3',
        },
      });

      // Define the email options
      const mailOptions = {
        from: process.env.SMTP_USER, // Sender email address
        to: email, // Recipient email address
        subject: 'Thank you for reaching out to WorldLynk!',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>WorldLynk Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center;">
                      <img src="https://firebasestorage.googleapis.com/v0/b/worldlynk-97994.appspot.com/o/logo%2Fworldlynk.jpg?alt=media&token=aa7fb6a8-7ec3-41ba-ad03-700001319f8" alt="WorldLynk" style="width: 100px; height: auto;">
                  </div>
                  <div style="margin-top: 20px;">
                      <p>Dear ${firstName},</p>
                      <p>Thank you for reaching out to WorldLynk! We have received your request for mentorship and are thrilled to assist you on your journey.</p>
                      <p>Our team will review your request and get in touch with you shortly to schedule a convenient time for your mentorship session. Meanwhile, if you have any questions or need further assistance, feel free to reply to this email or contact us directly.</p>
                      <p>We look forward to connecting with you soon!</p>
                      <p>Best regards,<br>The WorldLynk Team</p>
                  </div>
              </div>
          </body>
          </html>
        `,
      };

      // Send the email using the transporter
      await transporter.sendMail(mailOptions);

      // Return a success response
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Email sent successfully' }),
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  } else {
    // Method not allowed
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }
};
