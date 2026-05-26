import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import fetchModel, { postModel } from "../../lib/fetchModelData";
import "./styles.css";

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

function CommentInput({ photoId, onCommentAdded }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const newComment = await postModel(`/commentsOfPhoto/${photoId}`, {
        comment: commentText,
      });
      onCommentAdded(newComment);
      setCommentText("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
      <TextField
        label="Add a comment..."
        variant="outlined"
        size="small"
        fullWidth
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <Button type="submit" variant="contained" size="small">
        Post
      </Button>
    </form>
  );
}

function UserPhotos({ advancedEnabled }) {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    Promise.all([
      fetchModel(`/user/${userId}`),
      fetchModel(`/photosOfUser/${userId}`),
    ])
      .then(([userData, photoData]) => {
        setUser(userData);
        setPhotos(photoData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const selectedPhotoIndex = photos.findIndex((photo) => photo._id === photoId);
  const currentPhotoIndex = advancedEnabled
    ? selectedPhotoIndex >= 0
      ? selectedPhotoIndex
      : 0
    : -1;

  useEffect(() => {
    if (!advancedEnabled || loading || photos.length === 0) {
      return;
    }

    if (!photoId || selectedPhotoIndex === -1) {
      navigate(`/photos/${userId}/${photos[0]._id}`, { replace: true });
    }
  }, [advancedEnabled, loading, photoId, photos, selectedPhotoIndex, userId, navigate]);

  if (loading) {
    return <Typography variant="body2">Loading photos...</Typography>;
  }

  const selectedPhoto = advancedEnabled ? photos[currentPhotoIndex] : null;

  const handleCommentAdded = (photoId, newComment) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((p) => {
        if (p._id === photoId) {
          return {
            ...p,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      })
    );
  };

  const renderPhotoDetails = (photo) => (
    <>
      <CardMedia
        component="img"
        className="photo-img"
        image={`http://localhost:5000/images/${photo.file_name}`}
        alt={photo.file_name}
        onError={(e) => {
          // Fallback if not absolute url or not uploaded yet
          try {
             e.target.src = require(`../../images/${photo.file_name}`);
          } catch(err) {
             e.target.src = "https://via.placeholder.com/300";
          }
        }}
      />
      <CardContent>
        <Typography variant="subtitle1" className="photo-title" gutterBottom>
          {photo.file_name}
        </Typography>
        <Typography variant="caption" className="photo-date" display="block" gutterBottom>
          Taken: {formatDateTime(photo.date_time)}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" className="comments-heading" gutterBottom>
          Comments ({photo.comments ? photo.comments.length : 0})
        </Typography>
        {photo.comments && photo.comments.length > 0 ? (
          photo.comments.map((comment) => (
            <Box className="comment-item" key={comment._id}>
              <Typography variant="caption" className="comment-meta" display="block">
                {formatDateTime(comment.date_time)} by{' '}
                <Link className="comment-user-link" to={`/users/${comment.user._id}`}>
                  {comment.user.first_name} {comment.user.last_name}
                </Link>
              </Typography>
              <Typography variant="body2" className="comment-text">
                {comment.comment}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" className="no-comments">
            No comments yet.
          </Typography>
        )}
        
        <CommentInput
          photoId={photo._id}
          onCommentAdded={(newComment) => handleCommentAdded(photo._id, newComment)}
        />
      </CardContent>
    </>
  );

  return (
    <div className="user-photos">
      <Typography variant="h6" gutterBottom>
        {user ? `Photos of ${user.first_name} ${user.last_name}` : "User Photos"}
      </Typography>
      {photos.length === 0 ? (
        <Typography variant="body2">No photos available.</Typography>
      ) : advancedEnabled ? (
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Button
              variant="contained"
              disabled={currentPhotoIndex <= 0}
              onClick={() => navigate(`/photos/${userId}/${photos[currentPhotoIndex - 1]._id}`)}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              disabled={currentPhotoIndex >= photos.length - 1}
              onClick={() => navigate(`/photos/${userId}/${photos[currentPhotoIndex + 1]._id}`)}
            >
              Next
            </Button>
            <Typography variant="body2">
              Photo {currentPhotoIndex + 1} of {photos.length}
            </Typography>
          </Stack>

          {selectedPhoto ? (
            <Card className="photo-card" elevation={1}>
              {renderPhotoDetails(selectedPhoto)}
            </Card>
          ) : (
            <Typography variant="body2">Selected photo not found.</Typography>
          )}
        </Box>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <Card className="photo-card" key={photo._id} elevation={1}>
              {renderPhotoDetails(photo)}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserPhotos;
