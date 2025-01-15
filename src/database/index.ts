import logger from '@utils/Logger';
import mongoose from 'mongoose';

mongoose.connect(process.env.mongodbUrl as string)
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error);
    });

export default mongoose;