# gatsby-source-rss

## Usage
Add the following to your `gatsby-config.js`

```js
module.exports = {
        plugins: [
                {
                        resolve: 'gatsby-source-rss',
                        options: {
                                rssURL: 'https://fancypants.io/rss.xml
                        }
                },
        ]
}
```