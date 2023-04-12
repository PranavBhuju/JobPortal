import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  Divider,
  Avatar
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import FileUploadInput from "../../lib/FileUploadInput";
import { Add, Description, Edit, Face, Person } from "@mui/icons-material";

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

const MultifieldInput = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid item container className={classes.inputBox} key={key} marginBottom="10px">
          <Grid item xs={6}>
            <TextField
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      ))}
      <Grid item style={{ alignSelf: "center" }}>
        <Button
          variant="text"
          color="secondary"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={classes.inputBox}
          startIcon={<Add />}
          sx={{ textTransform: "none" }}
        >
          Thêm thông tin học vấn
        </Button>
      </Grid>
    </>
  );
};

const Profile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [userData, setUserData] = useState();
  const [open, setOpen] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
  });

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

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
        console.log("response", response.data);
        console.log("profile", response.data.profile);
        setProfileDetails(response.data);
        if (response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu) => ({
              institutionName: edu.institutionName ? edu.institutionName : "",
              startYear: edu.startYear ? edu.startYear : "",
              endYear: edu.endYear ? edu.endYear : "",
            }))
          );
        }
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
    console.log(education);

    let updatedDetails = {
      ...profileDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };

    console.log("updated details", updatedDetails);

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
    setOpen(false);
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
      gap={2}
    >
      <Grid container direction="row" flexWrap="nowrap">
        <Grid container direction="column" margin="0 auto" xs={7} gap={2}>
          <Grid item>
            <Typography variant="h4" color="primary" fontWeight={600}>Cập nhật hồ sơ</Typography>
          </Grid>

          <Divider variant="fullWidth" />

          <Typography variant="h6" color="secondary" fontWeight={500}>Thông tin cơ bản</Typography>
          <Grid item>
            <TextField
              label="Họ và tên"
              value={profileDetails.name}
              onChange={(event) => handleInput("name", event.target.value)}
              className={classes.inputBox}
              variant="outlined"
              fullWidth
              required
            />
          </Grid>

          <Typography variant="h6" color="secondary" fontWeight={500}>Học vấn</Typography>
          <Grid item>
            <MultifieldInput
              education={education}
              setEducation={setEducation}
            />
          </Grid>

          <Typography variant="h6" color="secondary" fontWeight={500}>Công việc</Typography>
          <Grid item>
            <FileUploadInput
              className={classes.inputBox}
              label="Resume (.pdf)"
              icon={<Description />}
              uploadTo={apiList.uploadResume}
              handleInput={handleInput}
              identifier={"resume"}
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
