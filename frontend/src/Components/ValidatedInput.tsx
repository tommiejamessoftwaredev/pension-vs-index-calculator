import React from 'react';

interface ValidatedInputProps {
    type?: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
    label: string;
    step?: string;
    min?: string;
    max?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
    type = "number",
    value,
    onChange,
    error,
    label,
    step,
    min,
    max
}) => {
    const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
        <div className="control-item">
            <label htmlFor={inputId} className={error ? 'error-label' : ''}>{label}</label>
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={error ? 'input-error' : ''}
                step={step}
                min={min}
                max={max}
            />
            {error && <div className="field-error">{error}</div>}
        </div>
    );
};