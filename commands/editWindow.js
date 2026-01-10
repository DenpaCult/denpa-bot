const Discord = require('discord.js')
const { getEditWindowData, saveEditWindowData } = require('../classes/editWindowUtils.js')

const Flags = Discord.PermissionsBitField.Flags

module.exports = {
  name: 'editwindow',
  aliases: [],
  inVoiceChannel: false,

  /**
   * @param {Discord.Client} client
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    if (!message.guildId) return console.warn(';;editwindow called outside of a guild TODO: log DMs?')

    if (!message.member.permissions.has(Flags.Administrator | Flags.ManageRoles)) {
      await message.channel.send('you do not have the necessary perms (Admin or Manage Roles)')
      return
    }

    const guildId = message.guildId

    const settings = getEditWindowData(guildId)
    const command = args[0]

    switch (command) {
      case 'enable': {
        saveEditWindowData(guildId, { ...settings, enabled: true })
        await message.channel.send(`edit window monitoring enabled for ${message.guild.name}`)
        break
      }

      case 'disable': {
        saveEditWindowData(guildId, { ...settings, enabled: false })
        await message.channel.send(`edit window monitoring disabled for ${message.guild.name}`)
        break
      }

      case 'channel': {
        const subCommand = args[1]
        const channelId = args[2]

        if (subCommand !== 'set') {
          await message.channel.send('TODO(kajo): proper usage is `;;windowedit channel set <channel_id>`')
          return
        }

        saveEditWindowData(guildId, { ...settings, channelId })
        await message.channel.send(`set report channel id to ${channelId}`)
        break
      }

      case 'rule': {
        const subCommand = args[1]

        switch (subCommand) {
          case 'add': {
            const threshold = +args[2]
            const roles = handleQuotes(args.slice(3))

            if (isNaN(threshold)) {
              await message.channel.send(
                "expected format ';;editwindow rule add <threshold (s)> <role name> <role name> ... <role name>'"
              )
              return
            }

            const found = message.guild.roles.cache.filter(role => roles.includes(role.name))
            const ids = found.map(role => role.id)

            if (ids.length !== roles.length) {
              await message.channel.send(`failed to find every role in list: ${roles.join(', ')} `)
              return
            }

            if (ids.length === 0) {
              await message.channel.send('no roles found')
              return
            }

            for (const rule of settings.rules) {
              if (JSON.stringify(rule) !== JSON.stringify({ threshold, roles: ids })) continue

              await message.channel.send('this rule has already been added')
              return
            }

            saveEditWindowData(guildId, { ...settings, rules: [...settings.rules, { threshold, roles: ids }] })
            await message.channel.send('successfully added rule to edit window monitoring')
            break
          }

          case 'remove': {
            await message.channel.send('TODO(kajo): implement lol')
            break
          }

          default:
            await message.channel.send("';;editwindow rule' supports two subcommands. 'add' and 'remove'")
        }

        break
      }

      default:
        await message.channel.send(
          'TODO(kajo): write documentation. go annoy kajo about how this works for now i guess.'
        )
    }
  }
}

/**
 * @param {string[]} args
 * @returns {string[]}
 */
function handleQuotes (args) {
  const tokens = []

  for (let i = 0; i < args.length; i++) {
    const str = args[i]

    if (!containsQuote(str)) {
      tokens.push(str)
      continue
    }

    const remaining = args.slice(i + 1)
    const end = remaining.findIndex(s => str[0] === s[s.length - 1])

    const merged = args.slice(i, i + 1 + end + 1).join(' ')
    tokens.push(merged.slice(1, merged.length - 1))

    i = i + 1 + end // skip to next word after endquote
  }

  console.debug('args', args)
  console.debug('tokens', tokens)

  return tokens
}

/**
 * @param {string} text
 * @returns boolean
 */
function containsQuote (text) {
  const start = text[0] === "'" || text[0] === '"'
  const end = text[text.length - 1] === "'" || text[text.length - 1] === '"'

  return start || end
}
