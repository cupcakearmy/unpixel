import React from 'react'
import { version } from '../../../package.json'

import Link from './ExternalLink'

const Footer: React.FC = () => {
  return (
    <div className="tc mt4 f6">
      <div className="flex justify-center items-center">
        <Link link="https://github.com/cupcakearmy" text="Github" />
        <div className="ph1"> - </div>
        <Link link="https://nicco.io/support" text="Support / Donate" />
      </div>
      <div className="code o-20 mt1">
        <small>version: {version}</small>
      </div>
    </div>
  )
}

export default Footer
