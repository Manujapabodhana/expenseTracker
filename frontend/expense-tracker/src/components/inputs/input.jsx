import React from 'react'

const Input = ({ label, placeholder, type, value, onChange, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type || "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input"
        {...props}
      />
    </div>
  )
}

export default Input
