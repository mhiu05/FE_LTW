import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      setLoading(true);
      setError(null);
      fetchModel("/user/list")
        .then(setUsers)
        .catch((err) => {
          console.error(err);
          setError("Unable to load users. Make sure backend is running.");
        })
        .finally(() => setLoading(false));
    }, []);

    if (loading) {
      return <Typography variant="body2">Loading users...</Typography>;
    }

    return (
      <div>
        <Typography variant="h6" gutterBottom>
          User List
        </Typography>
        {error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : users.length === 0 ? (
          <Typography variant="body2">No users available.</Typography>
        ) : (
          <List component="nav">
            {users.map((item) => (
              <React.Fragment key={item._id}>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to={`/users/${item._id}`}
                    sx={{ flex: 1, alignItems: "center" }}
                  >
                    <ListItemText
                      primary={`${item.last_name} ${item.first_name}`}
                      secondary={`${item.location} · ${item.occupation}`}
                    />
                  </ListItemButton>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", pr: 1 }}>
                    <Chip
                      label={item.photo_count ?? 0}
                      size="small"
                      color="success"
                    />
                    <Chip
                      component={Link}
                      to={`/users/${item._id}/comments`}
                      label={item.comment_count ?? 0}
                      size="small"
                      color="error"
                      clickable
                    />
                  </Box>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </div>
    );
}

export default UserList;
