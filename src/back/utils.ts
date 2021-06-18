import cp from 'child_process'
import { promisify } from 'util'

import Settings from './settings'

const exec = promisify(cp.exec)

export async function isCameraActive(): Promise<boolean> {
  // Not reliable
  if (process.platform === 'darwin') {
    // Check number of processes using the camera
    const out = await exec(`lsof -n | grep "AppleCamera"`)
    const processesUsingCamera = out.stdout.trim().split('\n').length
    return processesUsingCamera > 1 // One is the apple daemon that is always active
  }
  return false
}

export async function isMicrophoneActive(): Promise<boolean> {
  if (process.platform === 'darwin') {
    const out = await exec(`ioreg -c AppleHDAEngineInput | grep "IOAudioEngineState"`)
    const parsed = parseInt(out.stdout.trim().replace(/[^\d]/gim, ''))
    return parsed > 0
  }
  return false
}

export class InputDevicesStatus {
  static status = {
    mic: false,
    camera: false,
  }

  static update() {
    // TODO: Update electron version as soon as issue is resolved https://github.com/electron/electron/issues/26143
    isMicrophoneActive().then((result) => (InputDevicesStatus.status.mic = result))
    isCameraActive().then((result) => (InputDevicesStatus.status.camera = result))
  }

  static init() {
    setInterval(InputDevicesStatus.update, 2000)
  }

  static areCameraOrMicrophoneActive(): boolean {
    if (Settings.load('skipOnCameraOrMic')) {
      return InputDevicesStatus.status.mic
    }
    return false
  }
}
