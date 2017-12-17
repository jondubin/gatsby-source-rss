const parser = require('rss-parser');
const crypto = require('crypto');

const createContentDigest = obj => crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex');

function promisifiedParseURL(url) {
  return new Promise((resolve, reject) => {
    parser.parseURL(url, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.feed);
    });
  });
}

const createChildren = (entries, parentId, createNode) => {
  const childIds = [];
  entries.forEach(entry => {
    childIds.push(entry.link);
    console.log('entry', entry);
    const node = Object.assign({}, entry, {
      id: entry.link,
      title: entry.title,
      link: entry.link,
      description: entry.description,
      parent: parentId,
      children: []
    });
    node.internal = {
      type: 'rssFeedItem',
      contentDigest: createContentDigest(node)
    };
    createNode(node);
  });
  return childIds;
};

async function sourceNodes({ boundActionCreators }, { rssURL }) {
  const { createNode } = boundActionCreators;
  console.log('fetching rss feed');
  const data = await promisifiedParseURL(rssURL);
  if (!data) {
    return;
  }
  // console.log('data from rss', data);
  const { title, description, link, entries } = data;
  const childrenIds = createChildren(entries, link, createNode);
  const feedStory = {
    id: link,
    title,
    description,
    link,
    // children: [],
    parent: null,
    children: childrenIds
  };

  feedStory.internal = { type: 'rssFeed', contentDigest: createContentDigest(feedStory) };

  console.log('creating', feedStory);

  createNode(feedStory);

  // Process data into nodes.
  // data.forEach(datum => createNode(datum));
}

exports.sourceNodes = sourceNodes;