import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!userId) return;

      setLoading(true);
      fetchModel(`/user/${userId}`)
        .then(setUser)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [userId]);

    if (loading) {
      return <Typography variant="body2">Loading user details...</Typography>;
    }

    if (!user) {
      return <Typography variant="body2">User not found.</Typography>;
    }

    return (
      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User Details
          </Typography>

          <Stack spacing={1} mb={2}>
            <Typography variant="body2">
              <strong>First Name:</strong> {user.first_name}
            </Typography>
            <Typography variant="body2">
              <strong>Last Name:</strong> {user.last_name}
            </Typography>
            <Typography variant="body2">
              <strong>Location:</strong> {user.location}
            </Typography>
            <Typography variant="body2">
              <strong>Occupation:</strong> {user.occupation}
            </Typography>
            <Typography variant="body2">
              <strong>Description:</strong> {user.description}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2}>
            <Button component={Link} to={`/photos/${userId}`} variant="contained" size="small">
              View photos for {user.first_name}
            </Button>
            <Button component={Link} to={`/users/${userId}/comments`} variant="outlined" size="small">
              View comments
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
}

export default UserDetail;
