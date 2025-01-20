const SensitiveCharacters = ['\\', '*', '_', '~', '`', '|', '>']

const sanitizeDiscordString = function (text) {
  SensitiveCharacters.forEach(unsafechar => {
    text = text.replace(unsafechar, `\\${unsafechar}`)
  })
  return text
}

const getUserPingString = userId => `<@${userId}>`

const getTwitterStrApi = text => {
  let regurl = text.match(/https?:\/\/(?:www\.)?(twitter|x|fxtwitter|vxtwitter|fixupx|girlcockx)\.com\/\S+/g)
  let urls = null
	if (regurl != null && regurl.length > 0){
	
  urls = regurl
    ? regurl.map(_url => _url.replace(/(https?:\/\/(?:www\.)?(twitter|x|fxtwitter|vxtwitter|fixupx|girlcockx)\.com)/g, 'https://api.fxtwitter.com'))
    : null}
  return urls
}

module.exports = {
  sanitizeDiscordString,
  getUserPingString,
  getTwitterStrApi
}
