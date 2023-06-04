import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import React, { useState } from "react";
import AddEventDialog from "./AddEventDialog";
import { eventApi } from "./eventsStore";
import EnhancedTableHead from "../components/EnhancedTableHead";
import orderBy from "lodash/orderBy";
import { faArrowsRotate } from "@fortawesome/pro-regular-svg-icons/faArrowsRotate";
import { Event } from "../types";

export default function Events() {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<keyof Event>("name");
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const { data: events } = eventApi.useListQuery({
    pageNumber,
    resultsPerPage,
  });
  const [addEvent] = eventApi.useAddMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNumber(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResultsPerPage(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Event
  ) => {
    const isAsc = sortColumn === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(property);
  };

  const emptyRows =
    pageNumber > 0
      ? Math.max(0, (1 + pageNumber) * resultsPerPage - (events?.length ?? 0))
      : 0;

  const [addEventDialogVisible, setAddEventDialogVisible] = useState(false);
  function closeAddDuckDialog() {
    setAddEventDialogVisible(false);
  }
  function openAddEventDialog() {
    setAddEventDialogVisible(true);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Events
        </Typography>
        <IconButton onClick={openAddEventDialog}>
          <FontAwesomeIcon icon={faPlus} />
        </IconButton>
        <AddEventDialog
          onSubmit={addEvent}
          onClose={closeAddDuckDialog}
          open={addEventDialogVisible}
        />
      </Toolbar>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <EnhancedTableHead
            order={sortDirection}
            orderBy={sortColumn}
            onRequestSort={handleRequestSort}
            headCells={[
              {
                id: "created",
                label: "Created",
              },
              {
                id: "date",
                label: "Date",
              },
              {
                id: "name",
                label: "Name",
              },
              {
                id: "location",
                label: "Location",
              },
            ]}
          />
          <TableBody>
            {orderBy(events ?? [], sortColumn, sortDirection)
              .slice(
                (pageNumber - 1) * resultsPerPage,
                (pageNumber - 1) * resultsPerPage + resultsPerPage
              )
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell>
                    {new Date(row.created).toLocaleString()}
                    <br />
                    <FontAwesomeIcon
                      icon={faArrowsRotate}
                      style={{ marginRight: 5 }}
                    />
                    {new Date(row.updated).toLocaleString()}
                  </TableCell>
                  <TableCell>{row.date.format("l LT")}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    {JSON.stringify(row.location.coordinates)}
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={events?.length ?? 0}
        rowsPerPage={resultsPerPage}
        page={pageNumber - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
