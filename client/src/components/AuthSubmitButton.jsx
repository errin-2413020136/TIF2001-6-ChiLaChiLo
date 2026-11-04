import { getAuthSubmitLabel } from '../utils/authViewModel'

function AuthSubmitButton({ loading, isRegister }) {
  return (
    <button className="submit-button" type="submit" disabled={loading}>
      {getAuthSubmitLabel({ loading, isRegister })}
    </button>
  )
}

export default AuthSubmitButton
