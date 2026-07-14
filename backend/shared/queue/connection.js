export const queueConnection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,// if set
    maxRetriesPerRequest: null, // required by BullMQ
};

