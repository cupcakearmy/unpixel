import { ipcRenderer } from 'electron'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { render } from 'react-dom'

// @ts-ignore
import chime from 'url:../assets/chime.mp3'

const useKeyPress = (handler: (e: KeyboardEvent) => void) => {
  const handlerRef = useRef<typeof handler>()

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const fn = (event: KeyboardEvent) => {
      if (handlerRef.current) handlerRef.current(event)
    }
    window.addEventListener('keydown', fn)
    return () => {
      window.removeEventListener('keydown', fn)
    }
  }, [])
}

const Banner: React.FC = () => {
  const close = useCallback(() => {
    ipcRenderer.send('close')
  }, [])

  const [done, setDone] = useState(false)
  const [auto, setAuto] = useState(false)
  const [countdown, setCountdown] = useState<null | number>(null)

  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (done) close()
    },
    [countdown, done]
  )
  useKeyPress(handler)

  useEffect(() => {
    if (done && auto) setTimeout(() => close(), 1500)
  }, [done, auto])

  useEffect(() => {
    if (countdown === null) return
    else if (countdown > 0) {
      setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      const audio = new Audio(chime)
      const volume = ipcRenderer.sendSync('load', { key: 'volume' })
      audio.volume = volume / 100
      audio.play()
      setDone(true)
    }
  }, [countdown])

  useEffect(() => {
    const autoClose = ipcRenderer.sendSync('load', { key: 'autoClose' })
    setAuto(autoClose)
    const time = ipcRenderer.sendSync('load', { key: 'duration' })
    setCountdown(time)
  }, [])

  return (
    <div>
      <h1 className="ma0 mb4">Look Away</h1>
      <div className="code countdown">{countdown}</div>
      <div className="tile message">
        Look at least <b>6 meters</b> away. <br />
        <small>You will hear a sound when you are done.</small>
      </div>
      <button className="tile" onClick={close}>
        {done ? (
          <span>
            Close me
            <br />
            <small className="code f6">or press any key</small>
          </span>
        ) : (
          `I'm weak, close me now`
        )}
      </button>
    </div>
  )
}

render(<Banner />, document.querySelector('main'))
