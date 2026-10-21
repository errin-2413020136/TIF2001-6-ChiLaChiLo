function AuthField({
  id,
  name,
  label,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
      />
    </div>
  )
}

export default AuthField
