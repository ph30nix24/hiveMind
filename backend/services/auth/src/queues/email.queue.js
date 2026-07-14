import { Queue } from 'bullmq';
import { queueConnection } from '../../../../shared/queue/connection';

export const emailQueue = new Queue('email', {
    connection: queueConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 }, // 2s, 4s, 8s
        removeOnComplete: 100, // keep last 100 completed jobs, discard rest
        removeOnFail: 500,     // keep more failed ones for debugging
    },
});