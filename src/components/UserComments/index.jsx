import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function formatDateTime(dateTime) {
  const parser = new Date(dateTime.replace(" ", "T"));
  return isNaN(parser.getTime())
    ? dateTime
    : parser.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function UserComments() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    Promise.all([fetchModel(`/user/${userId}`), fetchModel(`/commentsOfUser/${userId}`)])
      .then(([userData, commentsData]) => {
        setUser(userData);
        setComments(commentsData);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load comments for this user.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <Typography variant="body2">Loading comments...</Typography>;
  }

  if (error) {
    return <Typography variant="body2" color="error">{error}</Typography>;
  }

  if (!user) {
    return <Typography variant="body2">User not found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comments by {user.first_name} {user.last_name}
      </Typography>
      {comments.length === 0 ? (
        <Typography variant="body2">No comments found for this user.</Typography>
      ) : (
        <Stack spacing={2}>
          {comments.map((comment) => {
            const photoLink = `/photos/${comment.photo_user_id}/${comment.photo_id}`;
            const imageSrc = require(`../../images/${comment.photo_file_name}`);
            return (
              <Card key={comment._id} sx={{ textDecoration: "none" }}>
                <CardActionArea component={Link} to={photoLink}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CardMedia
                      component="img"
                      image={imageSrc}
                      alt={comment.photo_file_name}
                      sx={{ width: 160, height: 120, objectFit: "cover" }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Photo: {comment.photo_file_name}
                      </Typography>
                      <Typography variant="caption" display="block" gutterBottom>
                        {formatDateTime(comment.date_time)}
                      </Typography>
                      <Typography variant="body2">{comment.comment}</Typography>
                    </CardContent>
                  </Stack>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

export default UserComments;
