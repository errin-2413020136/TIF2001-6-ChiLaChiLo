import './ui-components.css'

export default function Input({ id, label, error, className = '', ...props }) {
  const inputId = id || props.name
  const errorId = error && inputId ? `${inputId}-error` : undefined

  return (
    <div className="ui-input-field">
      {label && <label className="ui-input-label" htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={`ui-input ${error ? 'ui-input--error' : ''} ${className}`.trim()}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {error && <span className="ui-input-error" id={errorId} role="alert">{error}</span>}
    </div>
  )
}
