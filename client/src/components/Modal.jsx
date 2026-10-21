import { useEffect } from 'react'
import './ui-components.css'

export default function Modal({ isOpen, title, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return undefined
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="ui-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose?.()
    }}>
      <section className="ui-modal" role="dialog" aria-modal="true" aria-label={title || 'Dialog'}>
        <header className="ui-modal__header">
          {title && <h2 className="ui-modal__title">{title}</h2>}
          <button type="button" className="ui-modal__close" onClick={onClose} aria-label="Tutup dialog">×</button>
        </header>
        {children}
      </section>
    </div>
  )
}
