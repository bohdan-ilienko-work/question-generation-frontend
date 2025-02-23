import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type: "text" | "number" | "select";
  value: string | number;
  selectOptions?: Array<string | number>; // Для типа 'select'
  //дополнительные опции для поля ввода (например, min, max, step для числового)
  options?: {
    min?: number;
    max?: number;
    step?: number;
  };
  onChange: (name: string, value: string | number) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type,
  value,
  selectOptions,
  options,
  onChange,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    onChange(name, type === "number" ? Number(value) : value);
  };

  return (
    <div className="flex flex-col">
      <label className="font-semibold">{label}</label>
      {type === "select" ? (
        <select
          className="p-2 border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          name={name}
          value={value}
          onChange={handleChange}
        >
          {selectOptions?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="p-2 border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          {...options}
        />
      )}
    </div>
  );
};

export default InputField;
