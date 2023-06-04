import { Duck } from "../types";
import {
  Card,
  CardHeader,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons";
import React, { useState } from "react";
import RenameDuckDialog from "./RenameDuckDialog";
import DeleteDuckDialog from "./DeleteDuckDialog";
import { duckApi } from "./duckStore";

interface DuckCardProps {
  duck: Duck;
}

export default function DuckCard({ duck }: DuckCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>();
  function openMenu(e: React.MouseEvent<HTMLElement>) {
    setMenuAnchor(e.currentTarget);
  }
  function closeMenu() {
    setMenuAnchor(null);
  }

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  function openRenameDialog() {
    closeMenu();
    setIsRenameDialogOpen(true);
  }
  function closeRenameDialog() {
    setIsRenameDialogOpen(false);
  }
  const [renameDuck] = duckApi.useRenameMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  function openDeleteDialog() {
    closeMenu();
    setIsDeleteDialogOpen(true);
  }
  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
  }
  const [deleteDuck] = duckApi.useRemoveMutation();

  return (
    <Card sx={{ width: 200, margin: 2 }}>
      <CardHeader
        action={
          <IconButton
            aria-label="settings"
            id="settings-button"
            aria-controls={menuAnchor ? "settings-menu" : undefined}
            aria-expanded={menuAnchor ? "true" : undefined}
            aria-haspopup="true"
            onClick={openMenu}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </IconButton>
        }
        subheader={duck.name}
      />
      <Menu
        id="settings-menu"
        MenuListProps={{
          "aria-labelledby": "settings-menu",
        }}
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={closeMenu}
      >
        <MenuItem onClick={openRenameDialog}>Rename</MenuItem>
        <MenuItem onClick={openDeleteDialog}>Delete</MenuItem>
      </Menu>
      <CardMedia
        component="img"
        image={duck.image}
        alt=""
        sx={{ padding: "40px" }}
      />
      <RenameDuckDialog
        onSubmit={renameDuck}
        onClose={closeRenameDialog}
        open={isRenameDialogOpen}
        duck={duck}
      />
      <DeleteDuckDialog
        onSubmit={deleteDuck}
        onClose={closeDeleteDialog}
        open={isDeleteDialogOpen}
        duck={duck}
      />
    </Card>
  );
}
