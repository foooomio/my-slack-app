import { app, db } from './lib/firebase';
import { slack } from './lib/slack';

(async () => {
  const lastExecution = Number(process.argv[2]);

  if (isNaN(lastExecution)) {
    throw new Error(`Invalid argument: ${process.argv[2]}`);
  }

  const queryUrl = (queryId: string) =>
    `https://space.pikopikopla.net/query/${queryId}`;

  // Check for new queries
  const queries = await db
    .collection('queries')
    .orderBy('updatedAt', 'asc')
    .startAfter(lastExecution)
    .get();

  queries.forEach(async (doc) => {
    const url = queryUrl(doc.get('queryId'));
    await slack.send(`Query updated: ${url}`);
  });

  // Check for new comments
  const comments = await db
    .collectionGroup('comments')
    .orderBy('updatedAt', 'asc')
    .startAfter(lastExecution)
    .get();

  comments.forEach(async (doc) => {
    const url = queryUrl(doc.get('queryId'));
    await slack.send(`Comment updated: ${url}`);
  });
})()
  .catch(async (error: Error) => {
    await slack.send(`${error.name}: ${error.message}`);
  })
  .finally(() => {
    app.delete();
  });
