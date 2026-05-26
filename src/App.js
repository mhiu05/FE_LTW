import './App.css';

import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";
import LoginRegister from "./components/LoginRegister";
import fetchModel from "./lib/fetchModelData";

const App = (props) => {
  const [advancedEnabled, setAdvancedEnabled] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined); // undefined means loading

  useEffect(() => {
    // Check if user is already logged in
    fetchModel("/admin/check")
      .then((user) => {
        setCurrentUser(user);
      })
      .catch(() => {
        setCurrentUser(null);
      });
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setCurrentUser(null);
  };

  if (currentUser === undefined) {
    return <Typography>Loading...</Typography>;
  }

  return (
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar
                advancedEnabled={advancedEnabled}
                setAdvancedEnabled={setAdvancedEnabled}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                {currentUser ? <UserList /> : null}
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                {currentUser ? (
                  <Routes>
                    <Route path="/" element={<Navigate to="/users" replace />} />
                    <Route path="/users/:userId/comments" element={<UserComments />} />
                    <Route path="/users/:userId" element={<UserDetail />} />
                    <Route path="/photos/:userId/:photoId?" element={<UserPhotos advancedEnabled={advancedEnabled} />} />
                    <Route
                      path="/users"
                      element={
                        <div style={{ padding: 16 }}>
                          <Typography variant="h6" gutterBottom>
                            Select a user
                          </Typography>
                          <Typography variant="body2">
                            Choose a user from the left sidebar to view their details or photos.
                          </Typography>
                        </div>
                      }
                    />
                    <Route path="*" element={<Navigate to="/users" replace />} />
                  </Routes>
                ) : (
                  <Routes>
                    <Route path="/login-register" element={<LoginRegister onLogin={handleLogin} />} />
                    <Route path="*" element={<Navigate to="/login-register" replace />} />
                  </Routes>
                )}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;
