import * as Sentry from "@sentry/node";
import {nodeProfilingIntegration} from "@sentry/profiling-node";
import {Page} from "puppeteer";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

// export function setupPuppeteerErrorHandler(page: Page): void {
//     page.on('error', async (err) => {
//         const screenshot = await page.screenshot();
//
//         await new Promise((resolve) => {
//             Sentry.withScope(scope => {
//                 scope.addAttachment({
//                     filename: 'error_screenshot',
//                     data: screenshot,
//                 })
//                 Sentry.captureException(err, scope);
//                 resolve(null);
//             });
//         });
//     });
// }

export default Sentry;