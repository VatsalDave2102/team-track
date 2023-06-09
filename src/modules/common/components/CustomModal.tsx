import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
interface CustomModalProps {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  subtitle: string;
  children: JSX.Element;
}
const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  handleClose,
  title,
  subtitle,
  children,
}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mt: 2 }}>
          {subtitle}
          {children}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
