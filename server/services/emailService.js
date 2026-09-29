const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid API Key is missing.');
  }
  
  if (!process.env.EMAIL_FROM) {
    throw new Error('Sender email (EMAIL_FROM) is missing.');
  }

  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    html: html || text, // Fallback to text if html is not provided
    text: text || html.replace(/<[^>]*>?/gm, ''), // Very basic html to text
  };

  try {
    const response = await sgMail.send(msg);
    return response;
  } catch (error) {
    console.error('SendGrid Error:', error.response ? error.response.body : error);
    throw new Error('Failed to send email. Please verify configuration.');
  }
};

const sendBulkEmails = async (messages) => {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error('SendGrid configuration missing.');
  }

  // Format messages for SendGrid
  const formattedMessages = messages.map(msg => ({
    to: msg.to,
    from: process.env.EMAIL_FROM,
    subject: msg.subject,
    html: msg.html || msg.text,
    text: msg.text || (msg.html ? msg.html.replace(/<[^>]*>?/gm, '') : ''),
  }));

  try {
    const response = await sgMail.send(formattedMessages);
    return response;
  } catch (error) {
    console.error('SendGrid Bulk Error:', error.response ? error.response.body : error);
    throw new Error('Failed to send bulk emails. Please verify configuration.');
  }
};

module.exports = {
  sendEmail,
  sendBulkEmails
};
