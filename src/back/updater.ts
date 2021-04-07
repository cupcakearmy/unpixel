import semver from 'semver'
import axios from 'axios'
import logger from 'electron-log'
import { dialog, shell } from 'electron'

import pkg from '../../package.json'

const current = semver.coerce(pkg.version)
const url = 'https://api.github.com/repos/cupcakearmy/unpixel/tags'
const interval = 1000 * 60 * 15 // 10 Minutes

export default class Updater {
  static init() {
    this.check()
  }

  static async check() {
    const { data } = await axios({
      method: 'get',
      url,
    })
    // parse tags and reverse sort them to get the highest
    const tags = data.map((d: any) => semver.coerce(d.name)).sort(semver.rcompare)
    const latest = tags[0]
    if (!current) throw new Error('Could not determine current version')
    if (semver.lt(current, latest)) {
      logger.info('New version available')
      dialog
        .showMessageBox(null, {
          title: 'Update available',
          message: 'A newer version is available, please download.',
          buttons: ['Download', 'Later'],
          cancelId: 1,
        })
        .then(({ response }) => {
          if (response === 0) {
            shell.openExternal('https://github.com/cupcakearmy/unpixel/releases')
            process.exit(0)
          }
        })
    } else {
      logger.info('Up to date')
      setTimeout(() => this.check(), interval)
    }
  }
}
