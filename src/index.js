const cheerio = require('cheerio')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let parsedRequest = new URL(request.url)
  let setNumber = parsedRequest.searchParams.get('setNumber')
  if (!setNumber) {
    return new Response(
      'No set number provided\nAppend `?setNumber=` to the url with a proper set number\nEx: URL `https://www.easynotecards.com/notecard_set/88846` would be `?setNumber=88846`',
      {
        status: 400,
        statusText: 'Bad Request',
      },
    )
  }
  const raw_res = await fetch(
    'https://www.easynotecards.com/notecard_set/' + setNumber,
  )
  if (raw_res.status !== 200) {
    return new Response(
      'Set not found\nAppend `?setNumber=` to the url with a proper set number\nEx: URL `https://www.easynotecards.com/notecard_set/88846` would be `?setNumber=88846`',
      {
        status: 404,
        statusText: 'Not Found',
      },
    )
  }
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

  let finalText = split_text.join('\n==========================\n')

  return new Response(finalText, {
    headers: { 'content-type': 'text/plain' },
  })
}
