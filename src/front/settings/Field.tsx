import { ipcRenderer } from 'electron'
import React, { useEffect, useState } from 'react'

const labels = {
  every: ['Alert every me', 'minutes'],
  duration: ['For', 'seconds'],
  boot: ['Start on boot'],
  autoClose: ['Close window after countdown'],
}

const Field: React.FC<{ setting: keyof typeof labels }> = ({ setting: key }) => {
  const label = labels[key]

  const [value, setValue] = useState<null | number | boolean>(null)

  useEffect(() => {
    const initial = ipcRenderer.sendSync('load', { key })
    setValue(initial)
  }, [])

  useEffect(() => {
    if (value === null) return
    ipcRenderer.send('save', { key, value })
  }, [value])

  return value === null ? null : (
    <div className="ma0 mt0">
      {typeof value === 'boolean' ? (
        <label className="form-switch">
          <input type="checkbox" id={key} onChange={(e) => setValue(e.target.checked)} checked={value} />
          <i className="form-icon"></i> {label[0]}
        </label>
      ) : (
        <div>
          <label htmlFor={key}>
            {label[0]} <b>{value}</b> {label[1]}
          </label>
          <input
            className="mt0 mb3"
            type="range"
            id={key}
            min="1"
            max="60"
            step="1"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
          />
        </div>
      )}
    </div>
  )
}

export default Field
