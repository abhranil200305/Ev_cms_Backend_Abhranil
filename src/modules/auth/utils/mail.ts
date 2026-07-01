import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),

  secure: process.env.SMTP_USE_SSL === "true",

  requireTLS: process.env.SMTP_USE_TLS === "true",

  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOtpMail(
  email: string,
  otp: string
): Promise<void> {
  await transporter.sendMail({
    from: process.env.MAIL_FROM_EMAIL,
    to: email,
    subject: "EV CMS Email Verification OTP",

    html: `
      <div style="font-family:Arial,sans-serif;padding:20px">
          <h2>Email Verification</h2>

          <p>Your OTP is</p>

          <h1 style="letter-spacing:4px">${otp}</h1>

          <p>This OTP is valid for <b>5 minutes</b>.</p>

          <p>If you didn't request this OTP, please ignore this email.</p>

          <br/>

          <p>EV CMS Team</p>
      </div>
    `,
  });
}