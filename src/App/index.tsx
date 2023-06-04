import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import Router from "./Router";
import { useEffect } from "react";
import Login from "../Login";
import { memberApi } from "../Members/memberStore";

const linkStyles = (isActive: boolean) => ({
  fontSize: "0.85rem",
  color: isActive ? "white" : "#CFCFCF",
  transition: "0.1s linear all",
  "&:hover": {
    color: "white",
  },
});

export default function App() {
  const { isUninitialized, isError, isLoading, isSuccess, data } =
    memberApi.useGetUserQuery(null);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogOut() {}

  useEffect(() => {
    if (!isUninitialized && !isLoading && isError) navigate("/login");
  }, [isUninitialized, isError, isLoading, navigate]);

  if (location.pathname === "/login") return <Login />;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" mr={4}>
            Duck It
          </Typography>
          {(isSuccess || true) && (
            <>
              <NavLink to="/members" style={{ textDecoration: "none" }}>
                {({ isActive }) => (
                  <Typography component="div" sx={linkStyles(isActive)} mr={2}>
                    Members
                  </Typography>
                )}
              </NavLink>
              <NavLink to="/affiliates" style={{ textDecoration: "none" }}>
                {({ isActive }) => (
                  <Typography component="div" sx={linkStyles(isActive)} mr={2}>
                    Affiliates
                  </Typography>
                )}
              </NavLink>
              <NavLink to="/ducks" style={{ textDecoration: "none" }}>
                {({ isActive }) => (
                  <Typography component="div" sx={linkStyles(isActive)} mr={2}>
                    Ducks
                  </Typography>
                )}
              </NavLink>
              <NavLink to="/events" style={{ textDecoration: "none" }}>
                {({ isActive }) => (
                  <Typography component="div" sx={linkStyles(isActive)}>
                    Events
                  </Typography>
                )}
              </NavLink>
              <div style={{ flex: 1 }} />
              <Typography mr={4}>{data?.name}</Typography>
              <a
                href="/"
                onClick={handleLogOut}
                style={{
                  textDecoration: "none",
                  color: "white",
                  transition: "0.1s linear all",
                }}
              >
                Log Out
              </a>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Router />
      </Container>
    </Box>
  );
}
