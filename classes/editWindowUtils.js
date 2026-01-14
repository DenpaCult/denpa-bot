const fs = require('fs')

/**
 * @typedef EditWindowConfiguration
 * @type {object}
 * @property {boolean} enabled - whether an edit window is enabled for this particular guild
 * @property {EditWindowRule[]} rules - moderator configured thresholds and related pings
 * @property {string} channelId - the guild text channel ;;toromi will report to
 * @property {string[]} exempt - roleIds that marks a user as exempt from having their message dleeted
 */

/**
 * @typedef EditWindowRule
 * @type {object}
 * @property {number} threshold - the upper limit on how long a created message can be allowed to edit
 * @property {string[]} roles - the ids of the roles that will be pinged if the threshold has been passed

/**
 * @param {string} guildId
 * @returns {string}
 */
const getPath = guildId => {
  return `./backups/editwindow_${guildId}.json`
}

/**
 * @param {string} guildId
 * @returns {EditWindowConfiguration}
 */
const getEditWindowData = guildId => {
  /** @type{EditWindowConfiguration} */
  const defaults = {
    enabled: false,
    rules: [],
    channelId: '',
    exempt: []
  }

  try {
    const file = fs.readFileSync(getPath(guildId), { encoding: 'utf-8' })
    return { ...defaults, ...JSON.parse(file) }
  } catch {
    return defaults
  }
}

/**
 * @param {string} guildId
 * @param {EditWindowConfiguration} data
 */
const saveEditWindowData = (guildId, data) => {
  fs.writeFileSync(getPath(guildId), JSON.stringify(data))
}

module.exports = {
  getEditWindowData,
  saveEditWindowData
}
