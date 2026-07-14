// workers/emailWorker.js
import { Worker } from 'bullmq';
import { queueConnection } from '../../../../shared/queue/connection.js';
import { transporter } from '../../../../shared/mailer/mailer.js';

const worker = new Worker(
    'email',
    async (job) => {
        const { type, to, otp } = job.data;

        if (type === 'signup-otp') {
            await transporter.sendMail({
                from: process.env.MAIL_FROM,
                to,
                subject: 'Verify your email',
                html: `<p>Your verification code is <b>${otp}</b>. It expires in 5 minutes.</p>`,
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