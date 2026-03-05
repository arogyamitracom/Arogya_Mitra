import React from 'react';
import './InputField.css';

function InputField({ label, type, name, value, onChange, error, required }) {
  return (
    <div className="input-field">
      <label htmlFor={name}>{label}{required && <span className="required">*</span>}</label>
      <input
        id={name}
        type={type || 'text'}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={error ? 'input-error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default InputField;
