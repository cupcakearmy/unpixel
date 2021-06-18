import React from 'react'

import Field from './Field'

const Settings = () => {
  return (
    <div>
      <h3 className="ma0 mv3">Settings</h3>
      <form>
        <fieldset className="ma0 pa0">
          <Field setting="every" />
          <Field setting="duration" />
          <Field setting="volume" />
          <Field setting="autoClose" />
          <Field setting="boot" />
          <Field setting="skipOnCameraOrMic" />
          <small className="ml4" style={{ position: 'relative', top: '-0.5em' }}>
            experimental & only on <i>macOS</i>
          </small>
        </fieldset>
      </form>
    </div>
  )
}

export default Settings
