import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { postModel } from "../../lib/fetchModelData";

function LoginRegister({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form state
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register form state
  const [regLoginName, setRegLoginName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regDescription, setRegDescription] = useState("");
  const [regOccupation, setRegOccupation] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const user = await postModel("/admin/login", {
        login_name: loginName,
        password: loginPassword,
      });
      // Save token to local storage
      if (user.token) {
        localStorage.setItem("jwt_token", user.token);
      }
      onLogin(user);
    } catch (err) {
      setLoginError(err.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    // Validate
    if (!regLoginName.trim()) {
      setRegisterError("Login name is required");
      return;
    }
    if (!regFirstName.trim()) {
      setRegisterError("First name is required");
      return;
    }
    if (!regLastName.trim()) {
      setRegisterError("Last name is required");
      return;
    }
    if (!regPassword) {
      setRegisterError("Password is required");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    try {
      await postModel("/user", {
        login_name: regLoginName.trim(),
        password: regPassword,
        first_name: regFirstName.trim(),
        last_name: regLastName.trim(),
        location: regLocation.trim(),
        description: regDescription.trim(),
        occupation: regOccupation.trim(),
      });
      setRegisterSuccess("Registration successful! You can now login.");
      // Clear form
      setRegLoginName("");
      setRegPassword("");
      setRegConfirmPassword("");
      setRegFirstName("");
      setRegLastName("");
      setRegLocation("");
      setRegDescription("");
      setRegOccupation("");
      
      // Chuyển sang form Login sau 2 giây
      setTimeout(() => {
         setIsRegistering(false);
         setRegisterSuccess("");
      }, 2000);
    } catch (err) {
      setRegisterError(err.message || "Registration failed");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card sx={{ minWidth: 320, maxWidth: 400, flex: 1 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">
              {isRegistering ? "Register" : "Login"}
            </Typography>
            <Button size="small" onClick={() => {
              setIsRegistering(!isRegistering);
              setRegisterSuccess("");
              setRegisterError("");
              setLoginError("");
            }}>
              {isRegistering ? "Go to Login" : "Register"}
            </Button>
          </Box>

          {!isRegistering ? (
            <form onSubmit={handleLogin}>
              <TextField
                label="Login Name"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                fullWidth
                margin="normal"
                size="small"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                fullWidth
                margin="normal"
                size="small"
                required
              />
              {loginError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {loginError}
                </Alert>
              )}
              {registerSuccess && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  {registerSuccess}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <TextField
                label="Login Name"
                value={regLoginName}
                onChange={(e) => setRegLoginName(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
                required
              />
              <TextField
                label="First Name"
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
                required
              />
              <TextField
                label="Last Name"
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
                required
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
                required
              />
              <TextField
                label="Location"
                value={regLocation}
                onChange={(e) => setRegLocation(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
              />
              <TextField
                label="Description"
                value={regDescription}
                onChange={(e) => setRegDescription(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
              />
              <TextField
                label="Occupation"
                value={regOccupation}
                onChange={(e) => setRegOccupation(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
              />
              {registerError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {registerError}
                </Alert>
              )}
              {registerSuccess && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  {registerSuccess}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Register Me
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginRegister;
