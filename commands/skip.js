module.exports = {
  name: 'skip',
  aliases: ['s'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)

    const arg = args.join()
    try {
      if (isNaN(arg) || arg === '') {
        if (arg.includes('-')) {
          // SKIP BY RANGE
          const argsRange = arg.split('-')
          const rBegin = argsRange[0]
          let rEnd = argsRange[1]
          await queue._taskQueue.queuing()
          try {
            rEnd = rEnd >= queue.songs.length ? queue.songs.length - 1 : rEnd
            queue.songs.splice(rBegin, rEnd - rBegin + 1)
            message.channel.send(`${client.emotes.success} | Skipped songs ${rBegin} to ${rEnd}`)
          } finally {
            queue._taskQueue.resolve()
          }
        } else {
          // SKIP (NO ARG)
          const song = await queue.skip()
          message.channel.send(`${client.emotes.success} | Skipped! Now playing:\n${song.name}`)
        }
      } else {
        await queue._taskQueue.queuing()
        try {
          if (arg < 0) {
            // SKIP BY LAST SONG
            if (Math.abs(arg) >= queue.songs.length) {
              message.channel.send(`${client.emotes.error} | Not found. No song has been skipped.`)
            } else {
              queue.songs.splice(arg)
              message.channel.send(
                `${client.emotes.success} | Skipped song ${Math.abs(arg)} from the end of the playlist`
              )
            }
          } else {
            if (arg >= queue.songs.length) {
              // NO SKIP IF SKIP ARG IS GREATER THAN QUEUE
              message.channel.send(`${client.emotes.error} | Not found. No song has been skipped.`)
            } else {
              // SKIP BY INDEX
              const skippedsong = queue.songs.splice(arg, 1)
              message.channel.send(`${client.emotes.success} | Skipped song ${skippedsong[0].name}`)
            }
          }
        } finally {
          queue._taskQueue.resolve()
        }
      }
    } catch (e) {
      message.channel.send(`${client.emotes.error} | ${e}`)
    }
  }
}
