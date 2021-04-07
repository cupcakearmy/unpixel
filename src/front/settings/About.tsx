import React from 'react'

import Link from './ExternalLink'

const About: React.FC = () => {
  return (
    <div>
      <h3 className="ma0 mb2">About</h3>
      <p>
        UnPixel aims at helping you following the 20/20/20 rule to alleviate stress on the eyes caused by Computer
        Vision Syndrome (CVS).
        <br />
        Read more
        <Link text="here" link="https://en.wikipedia.org/wiki/Computer_vision_syndrome" /> and
        <Link text="here." link="https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome" />
      </p>
    </div>
  )
}

export default About
