import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  TextField,
  Divider,
  Avatar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../../App";

import apiList, { server } from "../../lib/apiList";
import AvatarWithUpload from "../../lib/AvatarWithUpload";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "30px",
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
    profile: ""
  });

  const [phone, setPhone] = useState("");

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileDetails(response.data);
        setPhone(response.data.contactNumber);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleUpdate = () => {
    let updatedDetails = {
      ...profileDetails,
      contactNumber: `+${phone}`
    };

    console.log("Update details", updatedDetails);

    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid container direction="row" flexWrap="nowrap">
        <Grid container direction="column" margin="0 auto" xs={7} gap={2}>
          <Grid item>
            <Typography variant="h4" color="primary" fontWeight={600}>Cập nhật hồ sơ</Typography>
          </Grid>
          <Divider variant="fullWidth" />

          <Typography variant="h6" color="secondary" fontWeight={500}>Thông tin</Typography>
          <Grid item>
            <TextField
              label="Tên công ty"
              value={profileDetails.name}
              onChange={(event) => handleInput("name", event.target.value)}
              className={classes.inputBox}
              variant="outlined"
              fullWidth
              required
            />
          </Grid>

          <Grid item>
            <TextField
              label="Bio"
              multiline
              rows={8}
              style={{ width: "100%" }}
              variant="outlined"
              value={profileDetails.bio}
              onChange={(event) => {
                if (
                  event.target.value.split(" ").filter(function (n) {
                    return n != "";
                  }).length <= 250
                ) {
                  handleInput("bio", event.target.value);
                }
              }}
            />
          </Grid>

          <Grid
            item
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PhoneInput
              specialLabel="Số điện thoại"
              country={"in"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
              style={{ width: "auto" }}
            />
          </Grid>
        </Grid>

        <Grid container direction="column" xs={3} gap={2} alignContent="center">
          <Typography variant="h6" color="secondary">Ảnh đại diện</Typography>
          <AvatarWithUpload
            src={server + profileDetails.profile}
            uploadTo={apiList.uploadProfileImage}
            onChange={(url) => handleInput("profile", url)}
          />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        style={{ padding: "10px 50px", marginTop: "30px" }}
        onClick={() => handleUpdate()}
      >
        Cập nhật hồ sơ
      </Button>
    </Grid>
  );
};

export default Profile;
