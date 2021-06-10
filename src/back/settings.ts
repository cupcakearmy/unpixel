import { BrowserWindow, ipcMain } from 'electron'
import Store from 'electron-store'
import { join } from 'path'
import AutoLaunch from 'auto-launch'

import { productName } from '../../package.json'

const autoLaunch = new AutoLaunch({ name: productName, mac: { useLaunchAgent: true } })

import { DEV } from '.'
import dayjs from 'dayjs'

const store = new Store()
const defaults = {
  every: 20,
  duration: 20,
  boot: true,
  paused: 0,
  lastRun: 0,
  autoClose: false,
  volume: 100,
  skipOnCameraOrMic: true,
}
export type SettingKeys = keyof typeof defaults
const IntNormalizer = (x: any) => parseInt(x)
const BoolNormalizer = (x: any) => !!x
const normalizers: Record<SettingKeys, (x: any) => any> = {
  every: IntNormalizer,
  duration: IntNormalizer,
  boot: BoolNormalizer,
  autoClose: BoolNormalizer,
  paused: IntNormalizer,
  lastRun: IntNormalizer,
  volume: IntNormalizer,
  skipOnCameraOrMic: BoolNormalizer,
}

export default class Settings {
  static win: BrowserWindow | null = null

  static init() {
    ipcMain.on('save', (e, { key, value }) => {
      this.save(key, value)
    })
    ipcMain.on('load', (e, { key }) => {
      e.returnValue = this.load(key)
    })
    if (Settings.load('boot')) {
      autoLaunch.enable()
    }
    Settings.save('lastRun', Date.now())
  }

  static save<T extends SettingKeys>(key: T, value: typeof defaults[T]) {
    const normalized = normalizers[key](value)
    store.set(key, normalized)
    if (key === 'boot') {
      normalized ? autoLaunch.enable() : autoLaunch.disable()
    }
  }

  static load<T extends SettingKeys>(key: T) {
    const saved = store.get(key) as typeof defaults[T] | undefined
    return saved ?? defaults[key]
  }

  static open() {
    if (this.win) return
    this.win = new BrowserWindow({
      width: 400,
      height: 690,
      center: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })
    this.win.on('closed', () => (this.win = null))

    const entry = join(__dirname, '../front/settings/index.html')
    this.win.loadFile(entry)
    this.win.setMenu(null)

    if (DEV) {
      this.win.setSize(800, 485)
      this.win.setResizable(true)
      this.win.webContents.openDevTools()
    }
  }

  static getStatus(): [boolean, number] {
    const paused: number = this.load('paused')
    const now = Date.now()
    if (paused > now) {
      return [true, paused - now]
    }

    const every = Settings.load('every')
    const lastRun = Settings.load('lastRun')
    const diff = every * 60 * 1000 - dayjs(now).diff(dayjs(lastRun), 'ms')
    return [false, diff]
  }
}
