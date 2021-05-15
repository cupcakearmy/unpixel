import { Tray, Menu, nativeImage } from 'electron'
import path from 'path'
import ms from 'ms'

import Banner from './banner'
import Settings from './settings'

export default class TrayUtility {
  static tray: Tray | null = null

  static build() {
    const [paused, interval] = Settings.getStatus()
    const status = paused ? `Paused for: ${ms(interval)}` : `Next break: ${ms(interval)}`

    const template: Parameters<typeof Menu['buildFromTemplate']>[0] = [
      { label: status, type: 'normal', enabled: false },
      { type: 'separator' },
      {
        label: 'Take a break now',
        type: 'normal',
        click: () => Banner.open(),
      },
    ]

    template.push(
      paused
        ? {
            label: 'Break pause',
            click: () => {
              Settings.save('paused', 0)
              this.build()
            },
          }
        : {
            label: 'Pause for...',
            submenu: Menu.buildFromTemplate(
              // Minutes to pause
              [10, 30, 60, 120, 360]
                .map((minutes) => minutes * 60 * 1000)
                .map((time) => ({
                  label: ms(time),
                  click: () => {
                    Settings.save('paused', Date.now() + time)
                    this.build()
                  },
                }))
            ),
          }
    )

    template.push(
      { label: 'Settings', click: () => Settings.open() },
      { type: 'separator' },
      { label: 'Quit', role: 'quit' }
    )

    const menu = Menu.buildFromTemplate(template)
    this.tray?.setContextMenu(menu)
  }

  static init() {
    if (!this.tray) {
      const file = path.join(__dirname, '../../assets/tray.png')
      const icon = nativeImage.createFromPath(file).resize({
        width: 24,
        height: 24,
      })
      this.tray = new Tray(icon)
      this.build()
    }
  }
}
