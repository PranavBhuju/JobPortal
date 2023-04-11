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

import apiList from "../../lib/apiList";

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
    };
    if (phone !== "") {
      updatedDetails = {
        ...profileDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...profileDetails,
        contactNumber: "",
      };
    }

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
          <Avatar
            src="https://i.guim.co.uk/img/media/327e46c3ab049358fad80575146be9e0e65686e7/0_0_1023_742/master/1023.jpg?width=465&quality=85&dpr=1&s=none"
            sx={{ width: "10rem", height: "10rem", borderInlineWidth: "10px", borderColor: "grey.500" }}
          >
            {profileDetails.name ? profileDetails.name[0] : "U"}
          </Avatar>
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
      {/* <Grid item xs style={{ width: "100%" }}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            //   width: "60%",
          }}
        >
          <Grid container direction="column" alignItems="stretch" spacing={3}>
            <Grid item>
              <TextField
                label="Name"
                value={profileDetails.name}
                onChange={(event) => handleInput("name", event.target.value)}
                className={classes.inputBox}
                variant="outlined"
                fullWidth
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Bio (upto 250 words)"
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
                country={"in"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                style={{ width: "auto" }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px", marginTop: "30px" }}
            onClick={() => handleUpdate()}
          >
            Update Details
          </Button>
        </Paper>
      </Grid> */}
    </Grid>
  );
};

export default Profile;
