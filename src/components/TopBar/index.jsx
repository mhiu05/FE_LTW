import React, { useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Typography, Box, Checkbox, FormControlLabel, Button } from "@mui/material";
import { useMatch, useNavigate } from "react-router-dom";
import fetchModel, { postModel, postFormData } from "../../lib/fetchModelData";
import "./styles.css";

function TopBar({ advancedEnabled, setAdvancedEnabled, currentUser, onLogout }) {
  const userDetailMatch = useMatch("/users/:userId");
  const photosMatch = useMatch("/photos/:userId");
  const userId = userDetailMatch?.params?.userId || photosMatch?.params?.userId;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // add photo buttom

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    // cleanup function
    let active = true;
    fetchModel(`/user/${userId}`)
      .then((data) => {
        if (active) {
          setUser(data);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const handleLogout = async () => {
    try {
      await postModel("/admin/logout", {});
      onLogout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    postFormData("/photos/new", formData)
      .then((newPhoto) => {
        // Redirect to user's photos page
        navigate(`/photos/${currentUser._id}`);
      })
      .catch((err) => {
        console.error("Upload failed", err);
        alert(err.message || "Failed to upload photo");
      })
      .finally(() => {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
  };

  let title = currentUser ? "Photo Sharing App" : "Please Login";
  if (currentUser) {
    if (userDetailMatch && user) {
      title = `${user.first_name} ${user.last_name}`;
    } else if (photosMatch && user) {
      title = `Photos of ${user.first_name} ${user.last_name}`;
    }
  }

  return (
    <AppBar className="topbar-appBar" position="fixed">
      <Toolbar className="topbar-toolbar">
        <Typography variant="body2" color="inherit" sx={{ flexShrink: 0 }}>
          {currentUser ? `Hi ${currentUser.first_name}` : "Nguyễn Minh Hiếu - B23DCKH040"}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="h6" color="inherit" component="div">
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {currentUser && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={advancedEnabled}
                  onChange={(event) => setAdvancedEnabled(event.target.checked)}
                  color="default"
                />
              }
              label="Enable Advanced Features"
              labelPlacement="start"
              sx={{ color: 'inherit', margin: 0 }}
            />
            
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleAddPhoto}
            />
            <Button
              color="inherit"
              variant="outlined"
              size="small"
              onClick={() => fileInputRef.current?.click()}
            >
              Add Photo
            </Button>

            <Button color="inherit" variant="contained" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
