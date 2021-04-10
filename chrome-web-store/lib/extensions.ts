require('dotenv').config();

interface Extension {
  name: string;
  id: string;
  slackWebhookUrl: string;
}

export const extensions: Extension[] = [
  {
    name: 'view-background-image',
    id: 'cegndknljaapfbnmfnagomhhgbajjibd',
    slackWebhookUrl: process.env.VIEW_BACKGROUND_IMAGE_SLACK_WEBHOOK_URL!,
  },
  {
    name: 'nicorepo-filter',
    id: 'pcoahkcikijkecjcfclmoggolnocabfk',
    slackWebhookUrl: process.env.NICOREPO_FILTER_SLACK_WEBHOOK_URL!,
  },
  {
    name: 'tweet-button-webext',
    id: 'joolebahkfpcoapinfefhalfgjkpablf',
    slackWebhookUrl: process.env.TWEET_BUTTON_WEBEXT_SLACK_WEBHOOK_URL!,
  },
];
