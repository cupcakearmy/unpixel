import { join } from 'path'
import os from 'os'
import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from 'electron'
import dayjs from 'dayjs'
import logger from 'electron-log'
import ms from 'ms'

import { DEV } from '.'
import Settings from './settings'
import TrayUtility from './tray'

export default class Banner {
  static interval: ReturnType<typeof setInterval>
  static window: BrowserWindow | null = null

  static init() {
    if (this.interval) return
    this.interval = setInterval(this.check, 1000)
    this.check()
    ipcMain.on('close', () => {
      this.close()
    })
  }

  static check() {
    TrayUtility.build()
    const [paused, interval] = Settings.getStatus()
    if (!paused && interval < 1000) {
      Banner.open()
    }
  }

  static open() {
    if (this.window) return

    logger.debug('Showing banner')
    const options: BrowserWindowConstructorOptions = {
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      width: 1200,
      height: 600,
      fullscreen: true,
      simpleFullscreen: os.platform() === 'darwin',
    }
    this.window = new BrowserWindow(options)

    const entry = join(__dirname, '../front/banner/index.html')
    this.window.loadFile(entry)

    if (DEV) {
      this.window.webContents.toggleDevTools()
    } else {
      this.window.setAlwaysOnTop(true, 'floating', 99)
      this.window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
      this.window.setMovable(false)
      this.window.setResizable(false)
      this.window.focus()
    }
  }

  static close() {
    if (this.window) {
      Settings.save('lastRun', Date.now())
      this.window.close()
      this.window = null
    }
  }
}
