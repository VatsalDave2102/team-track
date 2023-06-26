import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

interface RadioGroupFieldProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}
const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  name,
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <FormControl>
      <FormLabel id={`${name}-radio-buttons`}>{label}</FormLabel>
      <RadioGroup
        row
        name={name}
        aria-labelledby={`${name}-radio-buttons`}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioGroupField;
