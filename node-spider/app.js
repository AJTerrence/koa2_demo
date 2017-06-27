const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')
const url = require('url')
const superagent = require('superagent')
const cheerio = require('cheerio')
const eventproxy = require('eventproxy')
const targetUrl = 'https://cnodejs.org/'

superagent.get(targetUrl).end(function(err,res){
	if(err){
		return console.log(err)
	}
	const topicUrls = []
	const $ = cheerio.load(res.text)
	$('#topic_list .topic_title').each(function(idx,element){
		const $element = $(element)
		const href = url.resolve(targetUrl,$element.attr('href'))
		console.log(href)
		topicUrls.push (href)
	})

	const ep = new eventproxy()
    ep.after('topic_html',topicUrls.length,function(topics){
	topics = topics.map(function(topicPair){
		const topicUrl = topicPair[0]
		const topicHtml = topicPair[1]
		const $ = cheerio.load(topicHtml)
		return ({
			title: $('.topic_full_title').text().trim(),
			href: topicUrl,
			comment1: $('.reply_content').eq(0).text().trim()
		})
	})
	console.log('outcome')
	console.log(topics)
})

topicUrls.forEach(function(topicUrl){
	superagent.get(topicUrl).end(function(err,res){
		console.log('fetch ' + topicUrl + 'successful')
		ep.emit('topic_html',[topicUrl,res.text])
	})
})
})


app.listen(3000)
console.log('domo running at 3000')