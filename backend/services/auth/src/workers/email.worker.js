// workers/emailWorker.js
import { Worker } from 'bullmq';
import { queueConnection } from '../../../../shared/queue/connection.js';
import { transporter } from '../../../../shared/mailer/mailer.js';

const worker = new Worker(
  'email',
  async (job) => {
    const { type, to, otp, name } = job.data;

    if (type === "signup-otp") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Verify Your HiveMind Account",
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#111827;color:#F9FAFB;border-radius:12px;">

        <h1 style="text-align:center;color:#A15BF2;margin-bottom:10px;">
          Welcome to HiveMind 🤖
        </h1>

        <p style="font-size:16px;line-height:1.7;">
          Thanks for signing up! To complete your registration, please verify your email address using the One-Time Password (OTP) below.
        </p>

        <div style="margin:30px 0;text-align:center;">
          <div style="
            display:inline-block;
            background:#1F2937;
            border:2px dashed #A15BF2;
            border-radius:10px;
            padding:18px 40px;
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            color:#FFFFFF;
          ">
            ${otp}
          </div>
        </div>

        <p style="font-size:15px;color:#D1D5DB;text-align:center;">
          This code is valid for <strong>5 minutes</strong>.
        </p>

        <hr style="border:none;border-top:1px solid #374151;margin:30px 0;">

        <p style="font-size:14px;color:#9CA3AF;line-height:1.7;">
          If you didn't create a HiveMind account, you can safely ignore this email.
          Never share your OTP with anyone. HiveMind will never ask for your verification code.
        </p>

        <p style="margin-top:30px;">
          Cheers,<br>
          <strong>The HiveMind Team</strong>
        </p>

      </div>
    `,
      });
    }

    if (type === "welcome-user") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "🎉 Welcome to HiveMind",
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#111827;color:#F9FAFB;border-radius:12px;">
        
        <h1 style="color:#A15BF2;text-align:center;margin-bottom:10px;">
          Welcome to HiveMind 🤖
        </h1>

        <p style="font-size:16px;line-height:1.7;">
          Hi <b>${name || "there"}</b>,
        </p>

        <p style="font-size:16px;line-height:1.7;">
          Your account has been successfully created! 🎉
        </p>

        <p style="font-size:16px;line-height:1.7;">
          HiveMind is your all-in-one <b>Multi-Agent AI Platform</b>, where intelligent AI agents work together to help you solve problems, automate workflows, and boost productivity.
        </p>

        <div style="background:#1F2937;padding:20px;border-radius:8px;margin:25px 0;">
          <h3 style="margin-top:0;color:#A15BF2;">You can now:</h3>
          <ul style="padding-left:20px;line-height:1.8;">
            <li>🤖 Chat with specialized AI agents</li>
            <li>⚡ Automate complex tasks</li>
            <li>🧠 Collaborate with multiple AI agents</li>
            <li>📂 Manage all your AI conversations in one place</li>
          </ul>
        </div>

        <p style="font-size:16px;line-height:1.7;">
          We're excited to have you with us and can't wait to see what you'll build with HiveMind.
        </p>

        <p style="margin-top:30px;">
          Cheers,<br>
          <b>The HiveMind Team</b>
        </p>

      </div>
    `,
      });
    }

    if (type === "login-user") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "🔐 New Login to Your HiveMind Account",
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#111827;color:#F9FAFB;border-radius:12px;">

        <h1 style="color:#A15BF2;text-align:center;margin-bottom:10px;">
          HiveMind
        </h1>

        <h2 style="text-align:center;margin-bottom:25px;">
          Login Successful ✅
        </h2>

        <p style="font-size:16px;line-height:1.7;">
          Hello,
        </p>

        <p style="font-size:16px;line-height:1.7;">
          We noticed a successful login to your <strong>HiveMind</strong> account.
        </p>

        <div style="background:#1F2937;padding:18px;border-radius:8px;margin:25px 0;">
          <p style="margin:8px 0;"><strong>📅 Time:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin:8px 0;"><strong>📧 Account:</strong> ${to}</p>
        </div>

        <p style="font-size:16px;line-height:1.7;">
          If this was you, no further action is required.
        </p>

        <p style="font-size:16px;line-height:1.7;color:#FCA5A5;">
          If you don't recognize this login, change your password immediately and contact our support team.
        </p>

        <p style="margin-top:30px;">
          Stay secure,<br>
          <strong>The HiveMind Team</strong>
        </p>

      </div>
    `,
      });
    }
    // add more job types here (password-reset, welcome-email, etc.)
  },
  {
    connection: queueConnection,
    concurrency: 5, // process 5 emails at once
    limiter: {
      max: 10,      // don't send more than 10 emails
      duration: 1000, // per 1000ms — stay under provider rate limits
    },
  }
);

worker.on('completed', (job) => {
  console.log(`Email job ${job.id} sent to ${job.data.to}`);
});

worker.on('failed', (job, err) => {
  console.error(`Email job ${job.id} failed:`, err.message);
  // after all retries exhausted, consider alerting or logging to a dead-letter table
});

export default worker;