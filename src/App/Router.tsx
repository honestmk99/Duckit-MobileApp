import { Navigate, Route, Routes } from "react-router-dom";
import Members from "../Members";
import React from "react";
import Affiliates from "../Affiliates";
import Ducks from "../Ducks";
import Login from "../Login";
import Events from "../Events";

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/members" element={<Members />} />
      <Route path="/affiliates" element={<Affiliates />} />
      <Route path="/ducks" element={<Ducks />} />
      <Route path="/events" element={<Events />} />
      <Route path="*" element={<Navigate to="/members" replace />} />
    </Routes>
  );
}
