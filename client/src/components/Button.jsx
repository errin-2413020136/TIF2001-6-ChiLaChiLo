import './ui-components.css'

export default function Button({ children, variant = 'primary', isLoading = false, disabled = false, type = 'button', ...props }) {
  const variants = {
    primary: 'ui-button--primary',
    secondary: 'ui-button--secondary',
    danger: 'ui-button--danger',
  }
  const variantClass = variants[variant] || variants.primary

  return (
    <button
      type={type}
      className={`ui-button ${variantClass} ${props.className || ''}`.trim()}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? 'Memuat...' : children}
    </button>
  )
}
