let tress = require('tress')
let needle = require('needle')
let cheerio = require('cheerio')
let fs = require('fs')
const normalize = require('normalize-url')
let url = require('url')

const argv = require('minimist')(process.argv.slice(2), { '--': true })

let startUrl = argv.url
let limit = argv.limit

let pageLimit = 0
let idGood = -1
let idAll = -1
let results = []
let cacheGoodLinksObj = {}
let cacheGoodLinks = []
let cacheAllLinks = []
let regexLink = ''
let imgUrlRegexLink = ''

function webCrawler(startUrl, limit) {
	let q = tress(function (dst, callback) {
		needle.get(dst, function (err, res) {
			if (err) throw err

			let urlNorm = normalize(dst)

			if (urlNorm in cacheGoodLinksObj === false && pageLimit <= limit) {
				cacheGoodLinksObj[urlNorm] = ++idGood
				cacheGoodLinks.push({ id: idGood, limit: pageLimit, link: urlNorm })

				let $ = cheerio.load(res.body)

				$('img').each((index, imageElement) => {

					const imgUrl = $(imageElement).attr('src')

				

					if (imgUrl) {
						imgUrlRegexLink = imgUrl.match(
							/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
						)
					}

					console.log('index', index)
					console.log('imgUrl', imgUrl)
					console.log('imgUrlRegexLink', imgUrlRegexLink)


					if (imgUrlRegexLink) {
						results.push({
							limit: pageLimit,
							sourceUrl: urlNorm,
							imgUrl: imgUrl,
						})
					}
				})
				$('a').each(function () {
					const linkURL = $(this).attr('href')

					// console.log('----------------')
					if (linkURL) {
						regexLink = linkURL.match(
							/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
						)
					}

					if (regexLink) {
						const url_object = new URL(linkURL, dst)
						const urlResolved = url_object.href

						if (
							normalize(urlResolved) in cacheGoodLinksObj === false &&
							url_object.host.slice(0, 4) != 'mail' &&
							url_object.host.slice(0, 4) != 'wa.m' &&
							url_object.host.slice(0, 10) != 'twitter3e4' &&
							url_object.host.slice(0, 7) != 'status.'
						) {
							idAll++
							cacheAllLinks.push({
								id: idAll,
								limit: pageLimit,
								link: normalize(urlResolved),
							})

							q.push(normalize(urlResolved))
						}
					}
				})
				pageLimit++
			}
			callback()
		})
	}, 10)

	q.drain = function () {
		console.log(
			'\n' +
				' ===== results successfully saved in folder results ===== ' +
				'[' +
				new Date().toLocaleString('en-GB', { timeZone: 'Europe/Paris' }) +
				'] ' +
				'\n',
		)

		fs.writeFileSync('./results/results.json', JSON.stringify(results, null, 4))
		fs.writeFileSync('./results/cacheAllLinks.json', JSON.stringify(cacheAllLinks, null, 4))
		fs.writeFileSync('./results/cacheGoodLinks.json', JSON.stringify(cacheGoodLinks, null, 4))
	}
	q.push(startUrl)
}

webCrawler(startUrl, limit)
