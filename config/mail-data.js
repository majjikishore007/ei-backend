module.exports = {
  welcomeMail: {
    form: "EXTRA! Insights <info@extrainsights.in>",
    subject: "Let’s begin the journey with EXTRA! Insights",
  },
  resetMail: {
    form: "EXTRA! Insights <info@extrainsights.in>",
    subject: "Reset Your Account Password",
    body: [
      "<p>You recently requested to reset your password for your EXTRA! Insights account. Click the button below to reset it</p>",
      "<p>Or If you are having trouble clicking the password reset button, copy and paste the URL below into your web browser</p>",
      "<p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset is valid for the next 24 hours</p><p>Thanks</p><p>Team EXTRA! Insights.</p>",
    ],
  },
  emailVerifyMail: {
    form: "EXTRA! Insights <info@extrainsights.in>",
    subject: "Email verification Mail",
    upperBody: `<p>This email is to verify your email address for your new EXTRA! INSIGHTS account</p>
                    <p>Please enter verification OTP into the website</p>`,
    lowerBody: `
        <p>If you did not initiate this sign up and enter this email, please click here <a href='https://extrainsights.in' target='_blank'>EXTRA! Insights.</a> or write to us at <a href='mailto:info@extrainsights.in' target='_blank'>info@extrainsights.in.</a></p>
        <p>Cheers!</p><p>Team EXTRA! Insights</p>
        `,
  },
  expiryEmail: {
    from: "EXTRA! Insights <info@extrainsights.in>",
    subject: "We hope you are enjoying EXTRA! INSIGHTS",
  },
  paymentAcknowledgeEmail: {
    from: "EXTRA! Insights <info@extrainsights.in>",
    subject: "Thank you for subscribing to EXTRA! INSIGHTS",
  },
};
