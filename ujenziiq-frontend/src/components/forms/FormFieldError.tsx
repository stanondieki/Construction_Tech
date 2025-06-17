import React from 'react';

interface FormFieldErrorProps {
  error?: string;
}

/**
 * Component to display form field error messages
 */
export const FormFieldError: React.FC<FormFieldErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <p className="mt-1 text-sm text-red-600" role="alert">
      {error}
    </p>
  );
};
