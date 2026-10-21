import './ui-components.css'

export default function Card({ title, children, className = '', ...props }) {
  return (
    <section className={`ui-card ${className}`.trim()} {...props}>
      {title && <h2 className="ui-card__title">{title}</h2>}
      {children}
    </section>
  )
}
