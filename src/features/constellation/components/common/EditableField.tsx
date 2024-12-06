import { memo, useState, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

const EditableField = memo(function EditableField({ 
  value, 
  onChange, 
  placeholder = '', 
  multiline = false 
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSubmit = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          className="editable-input multiline"
          autoFocus
        />
      );
    }

    return (
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        className="editable-input"
        autoFocus
      />
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className={`editable-text ${!value ? 'empty' : ''}`}
    >
      {value || placeholder}
    </div>
  );
});

export default EditableField;