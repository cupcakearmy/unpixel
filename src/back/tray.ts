import { Tray, Menu, nativeImage } from 'electron'
import path from 'path'

import Banner from './banner'
import Settings from './settings'

enum Items {
  Status = 'status',
  Pause = 'pause',
  Run = 'run',
}

export default class TrayUtility {
  static menu: Parameters<typeof Menu['buildFromTemplate']>[0] = [
    { label: 'Status', type: 'normal', enabled: false, id: Items.Status },
    { type: 'separator' },
    {
      label: 'Take a break now',
      type: 'normal',
      id: Items.Run,
      click: () => Banner.open(),
    },
    { label: 'Pause', type: 'checkbox', id: Items.Pause },
    { label: 'Settings', type: 'normal', click: () => Settings.open() },
    { type: 'separator' },
    { label: 'Quit', type: 'normal', role: 'quit' },
  ]

  static tray: Tray | null = null

  static setStatus(status: string) {
    this.menu[0].label = status
    this.tray?.setContextMenu(this.build())
  }

  private static build() {
    const menu = Menu.buildFromTemplate(this.menu)
    for (const item of menu.items) {
      if (item.id === Items.Pause) {
        let initial = Settings.load('paused')
        item.checked = initial
        item.click = () => {
          initial = !initial
          item.checked = initial
          Settings.save('paused', initial)
        }
        break
      }
    }
    return menu
  }

  static init() {
    if (!this.tray) {
      const file = path.join(__dirname, '../../assets/tray.png')
      const icon = nativeImage.createFromPath(file).resize({
        width: 24,
        height: 24,
      })
      this.tray = new Tray(icon)
      this.tray.setContextMenu(this.build())
    }
  }
}
