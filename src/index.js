// const jsdom = require('jsdom')
const cheerio = require('cheerio')
// const { JSDOM } = jsdom

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const raw_res = await fetch(
    'https://www.easynotecards.com/notecard_set/88846',
  )
  const html = await raw_res.text()
  const $ = cheerio.load(html)
  const text = $('.vs-card')
    .append('\n\n')
    .text()

  return new Response(text, {
    headers: { 'content-type': 'text/plain' },
  })
}
