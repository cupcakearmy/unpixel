import React, { useCallback } from 'react'
import { shell } from 'electron'

const ExternalLink: React.FC<{ text: string; link: string }> = ({ text, link }) => {
  const fn = useCallback(
    (e: any) => {
      e.preventDefault()
      shell.openExternal(link)
    },
    [link]
  )
  return (
    <a onClick={fn} href={link}>
      {' '}
      {text}{' '}
    </a>
  )
}

export default ExternalLink
