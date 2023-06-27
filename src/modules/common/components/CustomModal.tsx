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
    <Dialog open={isOpen} onClose={handleClose} fullWidth scroll="paper">
      <DialogTitle
        variant="h5"
        textAlign={"center"}
        bgcolor={"primary.main"}
        color={"white"}
      >
        {title}
      </DialogTitle>
      <DialogContent dividers={true} sx={{ p: 0 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
