import Sentry from './src/utils/sentry.js';
import Fastify from "fastify";
import routes from "./src/routes/index.js";
import {connectToDatabase} from './src/utils/mongo.js';

const app = Fastify();

Sentry.setupFastifyErrorHandler(app);

routes.forEach(route => {
    app.register((app, options, done) => {
        app.route(route);
        done();
    });
});

app.get('/error', () => {
    throw new Error('TEST: Error occurred');
});

const start = async (): Promise<void> => {
    try {
        const port = parseInt(process.env.PORT || '3000', 10);
        await app.ready();
        await app.listen({port});
        await connectToDatabase();
        console.log(`Server listening on port ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();