import { Controller } from "react-hook-form";
import { Question } from "../../types";

// 🔹 Универсальный компонент для инпутов
const EditQuestionFormInput = ({
  label,
  name,
  control,
  type = "text",
  placeholder = "",
  options = [],
}: {
  label: string;
  name: keyof Question;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  type?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({ field }) =>
        options.length > 0 ? (
          <select {...field} className="w-full p-2 border rounded-md">
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            className="w-full p-2 border rounded-md"
          />
        )
      }
    />
  </div>
);

export default EditQuestionFormInput;
