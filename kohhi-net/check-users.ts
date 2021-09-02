import fetch from 'node-fetch';
import { IncomingWebhook } from '@slack/webhook';

require('dotenv').config();

const slack = new IncomingWebhook(process.env.KOHHI_NET_SLACK_WEBHOOK_URL!);

(async () => {
  const timestamp = new Date().getUTCMilliseconds();
  const url = 'https://dynmap.kohhi.net/up/world/world/' + timestamp;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} ${res.url}`);
  }

  const { players } = (await res.json()) as any;

  if (players.length) {
    const names = players.map((player: any) => player.name);
    await slack.send('Players: ' + names.join(' '));
  }
})().catch(async (error: Error) => {
  await slack.send(`${error.name}: ${error.message}`);
});
