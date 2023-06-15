import { Dialog, DialogContent, DialogTitle } from "@mui/material";
interface CustomModalProps {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  children: JSX.Element;
}
const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  handleClose,
  title,
  children,
}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle variant="h5" textAlign={"center"}>
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default CustomModal;
