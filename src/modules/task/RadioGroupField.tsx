import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

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
