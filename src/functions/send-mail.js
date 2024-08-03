const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  try {
    const { email, firstName } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to:email,
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

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
