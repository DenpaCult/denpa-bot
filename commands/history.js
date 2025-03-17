const Discord = require('discord.js')

module.exports = {
  name: 'history',
  aliases: ['hist'],
  run: async (client, message) => {
    if (client.history.length < 1) {
      message.channel.send('emty!!')
      return
    }
    let i = 0

    message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setTitle('Song History')
          .setDescription(
            [...client.history]
              .reverse()
              .map(hst => {
                i++
                return `${i}: \`${hst}\``
              })
              .join('\n')
          )
          .setColor(0x0099ff)
      ]
    })
  }
}
