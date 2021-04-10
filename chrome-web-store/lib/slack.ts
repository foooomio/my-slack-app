import type { Review, Issue } from 'chrome-webstore';
import type { HeaderBlock, KnownBlock } from '@slack/types';

export const reviewHeader: HeaderBlock = {
  type: 'header',
  text: {
    type: 'plain_text',
    text: 'New review arrived',
  },
};

export const issueHeader: HeaderBlock = {
  type: 'header',
  text: {
    type: 'plain_text',
    text: 'New issue arrived',
  },
};

const formatDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString('ja', { timeZone: 'Asia/Tokyo' });

export const formatReview = ({
  rating,
  message,
  updated,
  author: { name },
}: Review): KnownBlock[] => [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      // prettier-ignore
      text: `${':star:'.repeat(rating)} by ${name} - ${formatDate(updated)}\n${message}`,
    },
  },
];

export const formatIssue = ({
  title,
  description,
  browser,
  version,
  date,
  author: { name },
}: Issue): KnownBlock[] => [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      // prettier-ignore
      text: `:warning: *${title}* by ${name} - ${formatDate(date)}\n${description}`,
    },
  },
  {
    type: 'context',
    elements: [
      {
        type: 'plain_text',
        // prettier-ignore
        text: `Extension Version: ${version}\nUser Agent: ${browser}`,
      },
    ],
  },
];
