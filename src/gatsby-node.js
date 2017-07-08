import parser from 'rss-parser';

function promisifiedParseURL(url) {
  return new Promise((resolve) => {
    parser.parseURL(url, resolve);
  });
}

// TODO: actually process
const processDatum = () => {};

export default async function sourceNodes(
  { boundActionCreators },
  { rssURL },
) {
  const { createNode } = boundActionCreators;
  const data = await promisifiedParseURL(rssURL);

  // Process data into nodes.
  data.forEach(datum => createNode(processDatum(datum)));
}
