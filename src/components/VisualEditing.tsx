import { useEffect } from 'react'
import { enableVisualEditing } from '@sanity/visual-editing'

export default function VisualEditing() {
  useEffect(() => {
    return enableVisualEditing()
  }, [])

  return null
}
