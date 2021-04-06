import React from 'react'
import { version } from '../../../package.json'

const Footer: React.FC = () => {
  return (
    <div className="tc mt4 f6 o-40">
      <span className="code">version: {version}</span>
    </div>
  )
}

export default Footer
