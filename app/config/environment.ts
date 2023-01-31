import dotenv from 'dotenv';
dotenv.config();

export default {
    key: process.env.CRYPTO_KEY,
    algorithm: process.env.CRYPTO_ALGORITHM,
    node_env: process.env.NODE_ENV,
};
