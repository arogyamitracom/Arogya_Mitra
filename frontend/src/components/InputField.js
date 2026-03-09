import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './InputField.css';

function InputField({ label, type, name, value, onChange, error, required }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : (type || 'text');

  return (
    <div className="input-field">
      <label htmlFor={name}>{label}{required && <span className="required">*</span>}</label>
      <div className="input-wrapper">
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={error ? 'input-error' : ''}
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default InputField;
