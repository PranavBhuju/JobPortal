import React, { useContext, useState } from 'react';
import { Avatar, Badge, Box, Grid, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Edit, PhotoCamera } from '@mui/icons-material';
import { SetPopupContext } from '../App';
import Axios from 'axios';


const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  avatar: {
    width: "12rem !important",
    height: "12rem !important",
  },
  input: {
    display: 'none',
  },
  uploadButton: {
    // position: 'absolute',
    // bottom: theme.spacing(1),
    // right: theme.spacing(1),
    // zIndex: 2,
  },
}));

export default function AvatarWithUpload({ src, uploadTo, onChange }) {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    console.log(file, uploadTo);
    const data = new FormData();
    data.append("file", file);
    Axios.post(uploadTo, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
      .then((response) => {
        console.log(response.data);
        onChange(response.data.url);
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
      })
      .catch((err) => {
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.statusText,
        });
      });
  };

  return (
    <Grid item className={classes.avatarContainer}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        badgeContent={
          <Box>
            <label htmlFor="avatar-upload">
              <IconButton
                color="primary"
                aria-label="upload avatar"
                component="span"
                className={classes.uploadButton}
              >
                <PhotoCamera />
              </IconButton>
            </label>
            <input
              accept="image/*"
              className={classes.input}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
          </Box>
        }
      >
        <Avatar alt="Avatar" src={src} className={classes.avatar} />
      </Badge>
    </Grid>
  );
};