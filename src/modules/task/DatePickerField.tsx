import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  const handleChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      onChange(date.toString());
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disablePast
        label={label}
        value={dayjs(value)}
        format="DD-MM-YYYY"
        onChange={handleChange}
      />
    </LocalizationProvider>
  );
};

export default DatePickerField;
