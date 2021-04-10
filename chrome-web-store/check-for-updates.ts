import webstore from 'chrome-webstore';
import { IncomingWebhook } from '@slack/webhook';
import { extensions } from './lib/extensions';
import {
  reviewHeader,
  issueHeader,
  formatReview,
  formatIssue,
} from './lib/slack';

(async () => {
  const lastExecution = Date.parse(process.argv[2]!);

  if (isNaN(lastExecution)) {
    throw new Error(`Invalid argument: ${process.argv[2]}`);
  }

  const promises = extensions.map(async ({ id, slackWebhookUrl }) => {
    const slack = new IncomingWebhook(slackWebhookUrl);

    const reviews = (await webstore.reviews({ id, sort: 'recent' })).filter(
      (review) => review.updated > lastExecution
    );

    if (reviews.length) {
      await slack.send({
        blocks: [reviewHeader, ...reviews.flatMap(formatReview)],
      });
    }

    const issues = (await webstore.issues({ id })).filter(
      (issue) => issue.date > lastExecution
    );

    if (issues.length) {
      await slack.send({
        blocks: [issueHeader, ...issues.flatMap(formatIssue)],
      });
    }
  });

  await Promise.all(promises);
})().catch(async (error: Error) => {
  const slack = new IncomingWebhook(process.env.GENERAL_SLACK_WEBHOOK_URL!);
  await slack.send(`${error.name}: ${error.message}`);
});
