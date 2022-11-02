# WebCrawler-async-tress-cheerio-needle-normalize-url
 
## How to run

`npm install`

after that for example : 

```server.js --url="https://www.sdpgroups.com" --limit=3```

or

```nodemon server.js --url="https://www.sdpgroups.com" --limit=3```

or

```nodemon server.js --url="https://www.flickr.com/photos/parismadrid/3977203168/in/photolist-74scWq-9bLLEJ-226odfE-8MCmWw-SdyM7a-YHe2GY-9Ysnay-9yhe1y-t24hs1-e6u5Ej-TrSQPo-7wUUmJ-8Mzhfz-dGHvJj-bK5Vfk-T5hM3L-qLVZYW-djzdki-pGBWGo-avqKos-djzdoC-djzd4P-V9YDUZ-bvk5wX-fKpSu7-8H1DK5-nwaCkh-dGHvLm-dSfo6Q-27e6LJV-snAgjM-5BNdKd-NmWhTk-267BxmT-fwH67v-6Ehre6-mJBHqN-Xvg3ER-6DGx7x-21RjjVA-5UeLTL-25AYixC-JSfqze-PDtK2m-8ogq3L-21A7M6W-3dtYzQ-QWNQS4-PYvYE-quyNsV" --limit=0```

## Web Crawler Exercise

The goal of this exercise is to build a web crawler CLI. Please write the application in your preferred coding language.

Assuming the CLI is a node.js application, the usage should be:
node crawler.js <url: string> <limit: number>
Description:
Given a URL, the crawler will scan the webpage for any images, continue to every link inside that page and scan it as well.
The crawling should stop once <limit> is reached. limit=3 means we can go as deep as 3 pages from the source URL (denoted by the <url> param), and limit=0 is just the first page.

Results should be saved into a results.json file in the following format:
{
results: [
{
imageUrl: string,
sourceUrl: string // the page url this image was found on
limit: number // the limit of the source at which this image was found on
}
]
}
 