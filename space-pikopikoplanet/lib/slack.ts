import { IncomingWebhook } from '@slack/webhook';

require('dotenv').config();

export const slack = new IncomingWebhook(
  process.env.SPACE_PIKOPIKOPLANET_SLACK_WEBHOOK_URL!
);
