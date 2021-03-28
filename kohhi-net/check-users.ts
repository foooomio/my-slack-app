import fetch from 'node-fetch';
import { IncomingWebhook } from '@slack/webhook';

require('dotenv').config();

const slack = new IncomingWebhook(process.env.KOHHI_NET_SLACK_WEBHOOK_URL!);

(async () => {
  const timestamp = new Date().getUTCMilliseconds();
  const url = 'https://dynmap.kohhi.net/up/world/world/' + timestamp;
  const { players } = await fetch(url).then((res) => res.json());

  if (players.length) {
    const names = players.map((player: any) => player.name).join(', ');
    await slack.send('Playing: ' + names);
  }
})().catch(async (error: Error) => {
  await slack.send(`${error.name}: ${error.message}`);
});
