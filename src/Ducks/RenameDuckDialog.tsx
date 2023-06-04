import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Duck } from "../types";
import { ChangeEvent, useState } from "react";
import { RenameRequest } from "./duckStore";

interface RenameDuckDialogProps {
  onSubmit: (renameRequest: RenameRequest) => void;
  onClose: () => void;
  open: boolean;
  duck: Duck;
}

export default function RenameDuckDialog({
  open,
  onClose,
  onSubmit,
  duck,
}: RenameDuckDialogProps) {
  const [name, setName] = useState(duck.name);
  async function handleSubmit() {
    if (name !== duck.name) {
      onSubmit({ oldName: duck.name, newName: name });
    }
    onClose();
  }
  function handleSetName(e: ChangeEvent<HTMLInputElement>) {
    setName(e.currentTarget.value);
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rename Duck</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please input the new name for this duck.
        </DialogContentText>
        <TextField
          label="Duck Name"
          value={name}
          onChange={handleSetName}
          sx={{ marginTop: 2, width: "100%" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
