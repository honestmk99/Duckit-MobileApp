import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import EnhancedTableHead from "../components/EnhancedTableHead";
import orderBy from "lodash/orderBy";
import { Affiliate } from "../types";
import { affiliateApi } from "./affiliateStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/pro-regular-svg-icons/faArrowsRotate";

export default function Affiliates() {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<keyof Affiliate>("name");
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const { data } = affiliateApi.useListAffiliatesQuery({
    pageNumber,
    resultsPerPage,
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNumber(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResultsPerPage(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Affiliate
  ) => {
    const isAsc = sortColumn === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(property);
  };

  const emptyRows =
    pageNumber > 1
      ? Math.max(
          0,
          pageNumber * resultsPerPage - (data?.affiliates?.length ?? 0)
        )
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
          Affiliates
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
                id: "description",
                label: "About",
              },
              {
                id: "addressLine1",
                label: "Address",
              },
            ]}
          />
          <TableBody>
            {orderBy(data?.affiliates ?? [], sortColumn, sortDirection)
              .slice(
                (pageNumber - 1) * resultsPerPage,
                (pageNumber - 1) * resultsPerPage + resultsPerPage
              )
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                  <TableCell>
                    {new Date(row.created).toLocaleString()}
                    <br />
                    <FontAwesomeIcon
                      icon={faArrowsRotate}
                      style={{ marginRight: 5 }}
                    />
                    {new Date(row.updated).toLocaleString()}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    {row.addressLine1}
                    {row.addressLine2 && (
                      <>
                        <br />
                        {row.addressLine2}
                      </>
                    )}
                    <br />
                    {row.city}, {row.state} {row.zip}
                  </TableCell>
                  <TableCell></TableCell>
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
        count={data?.totalAffiliateCount ?? 0}
        rowsPerPage={resultsPerPage}
        page={pageNumber - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
