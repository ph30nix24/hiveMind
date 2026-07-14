import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URI);

redis.on('connect', () => {
    console.log('redis connected')
})

export default redis