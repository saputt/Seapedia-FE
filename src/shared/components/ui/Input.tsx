import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-text-secondary font-medium text-sm mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input-neo w-full transition-colors ${
          error ? "border-danger focus:border-danger focus:ring-danger/20" : ""
        } ${className}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-danger text-sm mt-1" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-text-muted text-xs mt-1">
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;