import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Duck } from "../types";
import { RemoveRequest } from "./duckStore";

interface DeleteDuckDialogProps {
  onSubmit: (removeRequest: RemoveRequest) => void;
  onClose: () => void;
  open: boolean;
  duck: Duck;
}

export default function DeleteDuckDialog({
  open,
  onClose,
  onSubmit,
  duck,
}: DeleteDuckDialogProps) {
  async function handleSubmit() {
    onSubmit({ name: duck.name });
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Duck</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this duck?
        </DialogContentText>
        <img src={duck.image} alt="" />
        <Typography
          variant="subtitle1"
          fontStyle="italic"
          textAlign="center"
          width="100%"
        >
          {duck.name}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
