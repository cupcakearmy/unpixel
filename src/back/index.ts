import { app } from 'electron'
import logger from 'electron-log'

import TrayUtility from './tray'
import Settings from './settings'
import Banner from './banner'
import Updater from './updater'

export const DEV = !app.isPackaged

// Disable gpu
app.disableHardwareAcceleration()
app.commandLine.appendSwitch('disable-software-rasterizer')

logger.catchErrors({ showDialog: true })
logger.log('Starting')
app
  .whenReady()
  .then(() => {
    logger.log('Initializing')
    if (!DEV) app.dock?.hide()
    TrayUtility.init()
    Settings.init()
    Banner.init()
    Updater.init()
    logger.log('Done')
  })
  .catch((e) => {
    logger.error(e)
    process.exit(1)
  })

app.on('window-all-closed', () => {
  // Prevent closing of the app
})
