import cp from 'child_process'

import Settings from './settings'

export async function isCameraActive(): Promise<boolean> {
  if (process.platform === 'darwin') {
    return new Promise((resolve) => {
      // Check number of processes using the camera
      cp.exec(`lsof -n | grep "AppleCamera"`, (_, out) => {
        const processesUsingCamera = out.trim().split('\n').length
        resolve(processesUsingCamera > 1) // One is the apple daemon that is always active
      })
    })
  }
  return false
}

export async function isMicrophoneActive(): Promise<boolean> {
  if (process.platform === 'darwin') {
    return new Promise((resolve) => {
      cp.exec(`ioreg -c AppleHDAEngineInput | grep IOAudioEngineState`, (_, out) => {
        const parsed = parseInt(out.trim().replace(/[^\d]/gim, ''))
        resolve(parsed > 0)
      })
    })
  }
  return false
}

export class InputDevicesStatus {
  static status = {
    mic: false,
    camera: false,
  }

  static init() {
    setInterval(() => {
      isMicrophoneActive().then((result) => (this.status.mic = result))
      isCameraActive().then((result) => (this.status.camera = result))
    }, 2000)
  }

  static areCameraOrMicrophoneActive(): boolean {
    if (Settings.load('skipOnCameraOrMic')) {
      return this.status.mic || this.status.camera
    }
    return false
  }
}
