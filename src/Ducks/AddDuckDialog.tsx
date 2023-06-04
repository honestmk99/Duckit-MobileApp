import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Duck, NewOf } from "../types";
import { useRef } from "react";

interface AddDuckDialogProps {
  onSubmit: (ducks: NewOf<Duck>[]) => void;
  onClose: () => void;
  open: boolean;
}

export default function AddDuckDialog({
  open,
  onClose,
  onSubmit,
}: AddDuckDialogProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    if (fileInput.current?.files) {
      const ducks: NewOf<Duck>[] = [];
      for (let i = 0; i < fileInput.current.files.length; i++) {
        await new Promise((resolve) => {
          const file = fileInput.current?.files?.[i] as File;
          const reader = new FileReader();

          reader.onload = (e) => {
            if (e.target?.result == null || typeof e.target.result !== "string")
              return resolve(null);

            ducks.push({
              name: file.name.replace(/\.svg/g, ""),
              image: e.target.result,
            });
            resolve(null);
          };
          reader.readAsDataURL(file);
        });
      }

      onSubmit(ducks);
    }

    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Ducks</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 2 }}>
          Please select the files of the ducks you want to add.
        </DialogContentText>
        <input type="file" accept=".svg" multiple={true} ref={fileInput} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
