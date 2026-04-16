import { useEffect } from 'react'
import { enableVisualEditing } from '@sanity/visual-editing'

export default function VisualEditing() {
  useEffect(() => {
    // Solo activar dentro del iframe del Sanity Studio (Presentation Tool)
    // Si la página es la ventana principal (visitante normal), no hacer nada
    if (window.self === window.top) return
    return enableVisualEditing()
  }, [])

  return null
}
