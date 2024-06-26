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

app.get('/error', (req, res) => {
    throw new Error('TEST: Error occurred');
})

const start = async (): Promise<void> => {
    try {
        await app.ready();
        await app.listen({port: 3000});
        await connectToDatabase();
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();