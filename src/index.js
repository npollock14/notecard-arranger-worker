const cheerio = require('cheerio')

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
  let text = $('p')
    .append('\n')
    .text()

  //split text after a "Answer: " with a letter
  let split_text = text.split(/Answer: /)
  for (let i = 1; i < split_text.length; i++) {
    //add the first line of the next text to the previous text
    split_text[i - 1] += '\nAnswer: ' + split_text[i].split('\n')[0].trim()
    //remove the first line of the next text
    split_text[i] = split_text[i]
      .replace(split_text[i].split('\n')[0], '')
      .trim()
  }
  //remove the last element of the array
  split_text.pop()

  //sort the array of split text with a function
  split_text.sort(function(a, b) {
    return a.split(' ')[1].localeCompare(b.split(' ')[1])
  })

  let finalText = split_text.join('\n')

  return new Response(finalText, {
    headers: { 'content-type': 'text/plain' },
  })
}
