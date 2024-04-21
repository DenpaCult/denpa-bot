const SensitiveCharacters = ['\\', '*', '_', '~', '`', '|', '>']

const sanitizeDiscordString = function (text) {
  SensitiveCharacters.forEach(unsafechar => {
    text = text.replace(unsafechar, `\\${unsafechar}`)
  })
  return text
}

const getUserPingString = userId => `<@${userId}>`

const fixTwitterStr = (text) => {
  return text ? text.replace(/(https?:\/\/(?:www\.)?(twitter|x)\.com)/g, "https://fxtwitter.com") : null;
};

module.exports = {
  sanitizeDiscordString,
  getUserPingString,
  fixTwitterStr
}
