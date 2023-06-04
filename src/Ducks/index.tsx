import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/pro-regular-svg-icons";
import AddDuckDialog from "./AddDuckDialog";
import { duckApi } from "./duckStore";
import DuckCard from "./DuckCard";

export default function Ducks() {
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const { data, isSuccess, isLoading } = duckApi.useGetQuery({
    pageNumber,
    resultsPerPage,
  });
  const [addDucks] = duckApi.useAddMutation();

  const [addDuckDialogVisible, setAddDuckDialogVisible] = useState(false);
  function closeAddDuckDialog() {
    setAddDuckDialogVisible(false);
  }
  function openAddDuckDialog() {
    setAddDuckDialogVisible(true);
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
          Ducks
        </Typography>
        <IconButton onClick={openAddDuckDialog}>
          <FontAwesomeIcon icon={faPlus} />
        </IconButton>
        <IconButton>
          <FontAwesomeIcon icon={faSearch} />
        </IconButton>
      </Toolbar>
      <AddDuckDialog
        onSubmit={addDucks}
        onClose={closeAddDuckDialog}
        open={addDuckDialogVisible}
      />
      {isLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {!isLoading && isSuccess && data.ducks.length === 0 && (
        <Stack justifyContent="center" alignItems="center">
          There are no ducks. Add some by pressing the + icon.
        </Stack>
      )}
      {!!data && data.ducks.length > 0 && !isLoading && isSuccess && (
        <Stack direction="column" alignItems="center" gap={4}>
          <Stack direction="row" flexWrap="wrap" justifyContent="center">
            {data.ducks.map((duck) => (
              <DuckCard duck={duck} key={duck.name} />
            ))}
          </Stack>
          <Pagination
            page={pageNumber || 1}
            onChange={(_, newPage) => setPageNumber(newPage)}
            count={Math.ceil(data.totalDuckCount / resultsPerPage)}
            color="primary"
            size="large"
          />
          <Stack direction="row" alignItems="center" marginBottom={4}>
            <Typography marginRight={4}>Results Per Page:</Typography>
            <Select
              value={resultsPerPage}
              label="Results Per Page"
              onChange={(e) =>
                setResultsPerPage(parseInt(e.target.value as string))
              }
            >
              <MenuItem value="20">20</MenuItem>
              <MenuItem value="50">50</MenuItem>
              <MenuItem value="100">100</MenuItem>
            </Select>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
