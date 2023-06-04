import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import orderBy from "lodash/orderBy";
import React, { useState } from "react";
import EnhancedTableHead from "../components/EnhancedTableHead";
import { memberApi } from "./memberStore";
import { Member } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/pro-regular-svg-icons/faInfoCircle";
import MemberDetails from "./MemberDetails";
import { faArrowsRotate } from "@fortawesome/pro-regular-svg-icons/faArrowsRotate";
import { WhoAmIResponse } from "../Login/authStore";

export default function Members() {
  const [activeMember, setActiveMember] = useState<WhoAmIResponse | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<keyof Member>("name");
  const [pageNumber, setPageNumber] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const { data: members } = memberApi.useListUsersQuery({
    pageNumber,
    resultsPerPage,
  });

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
    property: keyof Member
  ) => {
    const isAsc = sortColumn === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(property);
  };

  const emptyRows =
    pageNumber > 0
      ? Math.max(0, (1 + pageNumber) * resultsPerPage - (members?.length ?? 0))
      : 0;

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
          Members
        </Typography>
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
                id: "name",
                label: "Name",
              },
              {
                id: "email",
                label: "Email",
              },
              {
                id: "addressLine1",
                label: "Address",
              },
              {
                id: "id",
                label: "",
              },
            ]}
          />
          <TableBody>
            {orderBy(members, sortColumn, sortDirection)
              .slice(
                pageNumber * resultsPerPage,
                pageNumber * resultsPerPage + resultsPerPage
              )
              .map((row) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.profile.id}
                >
                  <TableCell>
                    {new Date(row.profile.created).toLocaleString()}
                    <br />
                    <FontAwesomeIcon
                      icon={faArrowsRotate}
                      style={{ marginRight: 5 }}
                    />
                    {new Date(row.profile.updated).toLocaleString()}
                  </TableCell>
                  <TableCell>{row.profile.name}</TableCell>
                  <TableCell>{row.profile.email}</TableCell>
                  <TableCell>
                    {row.profile.addressLine1}
                    {row.profile.addressLine2 && (
                      <>
                        <br />
                        {row.profile.addressLine2}
                      </>
                    )}
                    <br />
                    {row.profile.city}, {row.profile.state} {row.profile.zip}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => setActiveMember(row)}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </Button>
                    <MemberDetails
                      member={activeMember}
                      onClose={() => setActiveMember(null)}
                    />
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
        count={members?.length ?? 0}
        rowsPerPage={resultsPerPage}
        page={pageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
