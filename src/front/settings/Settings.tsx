import React from 'react'

import '../base.css'

import Field from './Field'

const Settings = () => {
  return (
    <div>
      <h3 className="ma0 mv3">Settings</h3>
      <form>
        <fieldset className="ma0 pa0">
          <Field setting="every" />
          <Field setting="duration" />
          <Field setting="autoClose" />
          <Field setting="boot" />
        </fieldset>
      </form>
    </div>
  )
}

export default Settings
