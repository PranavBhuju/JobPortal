import { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Box
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    padding: "60px 60px",
    flexGrow: 1
  },
  inputBox: {
    width: "400px",
  },
  submitButton: {
    width: "400px",
    borderRadius: "50px !important"
  },
}));

const Signup = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const { state } = useLocation();

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: state ? state.type : undefined,
    email: "",
    password: "",
    name: "",
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleSignupApplicant = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substring(1)} không được để trống`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = { ...signupDetails };
    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Thông tin không chính xác",
      });
    }
  };

  const handleSignupRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substring(1)} không được để trống`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    console.log(updatedDetails);

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Thông tin không chính xác",
      });
    }
  };

  const applicantSignupForm = () => (
    <>
      <Grid item>
        <TextField
          label="Họ và tên"
          value={signupDetails.name}
          onChange={(event) => handleInput("name", event.target.value)}
          className={classes.inputBox}
          error={inputErrorHandler.name.error}
          helperText={inputErrorHandler.name.message}
          onBlur={(event) => {
            if (event.target.value === "") {
              handleInputError("name", true, "Họ và tên không được để trống");
            } else {
              handleInputError("name", false, "");
            }
          }}
          variant="outlined"
        />
      </Grid>
      <Grid item>
        <EmailInput
          label="Email"
          value={signupDetails.email}
          onChange={(event) => handleInput("email", event.target.value)}
          inputErrorHandler={inputErrorHandler}
          handleInputError={handleInputError}
          className={classes.inputBox}
          required={true}
        />
      </Grid>
      <Grid item>
        <PasswordInput
          label="Mật khẩu"
          value={signupDetails.password}
          onChange={(event) => handleInput("password", event.target.value)}
          className={classes.inputBox}
          error={inputErrorHandler.password.error}
          helperText={inputErrorHandler.password.message}
          onBlur={(event) => {
            if (event.target.value === "") {
              handleInputError("password", true, "Mật khẩu là bắt buộc");
            } else {
              handleInputError("password", false, "");
            }
          }}
        />
      </Grid>
    </>
  );

  const recruiterSignupForm = () => (
    <>
      <Grid item>
        <TextField
          label="Tên công ty"
          value={signupDetails.name}
          onChange={(event) => handleInput("name", event.target.value)}
          className={classes.inputBox}
          error={inputErrorHandler.name.error}
          helperText={inputErrorHandler.name.message}
          onBlur={(event) => {
            if (event.target.value === "") {
              handleInputError("name", true, "Tên công ty được để trống");
            } else {
              handleInputError("name", false, "");
            }
          }}
          variant="outlined"
        />
      </Grid>
      <Grid item>
        <EmailInput
          label="Email"
          value={signupDetails.email}
          onChange={(event) => handleInput("email", event.target.value)}
          inputErrorHandler={inputErrorHandler}
          handleInputError={handleInputError}
          className={classes.inputBox}
          required={true}
        />
      </Grid>
      <Grid item>
        <PasswordInput
          label="Mật khẩu"
          value={signupDetails.password}
          onChange={(event) => handleInput("password", event.target.value)}
          className={classes.inputBox}
          error={inputErrorHandler.password.error}
          helperText={inputErrorHandler.password.message}
          onBlur={(event) => {
            if (event.target.value === "") {
              handleInputError("password", true, "Mật khẩu là bắt buộc");
            } else {
              handleInputError("password", false, "");
            }
          }}
        />
      </Grid>
      <Grid item style={{ width: "100%" }}>
        <TextField
          label="Bio (upto 250 words)"
          multiline
          rows={8}
          style={{ width: "100%" }}
          variant="outlined"
          value={signupDetails.bio}
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
      <Grid item>
        <PhoneInput
          specialLabel="Số điện thoại"
          country="vn"
          value={phone}
          onChange={(phone) => setPhone(phone)}
        />
      </Grid>
    </>
  );

  const signupForm = () => (
    <Grid container flexDirection="row" flexWrap="nowrap" flexGrow={1} padding="0 5em">
      <Grid container margin="20vh 0" width="50%">
        <Grid container direction="column" spacing={4} alignItems="center">
          <Grid item>
            <Typography variant="h4" fontWeight={500} color="primary">
              Đăng ký
            </Typography>
          </Grid>
          {signupDetails.type === "recruiter" ? recruiterSignupForm() : applicantSignupForm()}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                console.log(signupDetails);
                signupDetails.type === "recruiter" ? handleSignupRecruiter() : handleSignupApplicant();
              }}
              className={classes.submitButton}
            >
              Xác nhận
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction="column" width="50%" alignItems="center">
        <Box component="img" margin="0 auto" src={signupDetails.type === "recruiter" ? "recruiter_abstract.jpg" : "applicant_abstract.jpg"} />
        <Typography variant="h6">{
          signupDetails.type === "recruiter" ? "Kết nối với hàng ngàn ứng viên tiềm năng cho công việc của bạn" : "Tìm việc làm cực kỳ đơn giản với LinkedCV"
        }</Typography>
      </Grid>
    </Grid>
  );

  const signupTypeChooser = () => (
    <Dialog open={signupDetails.type === undefined} fullWidth maxWidth="md" PaperProps={{ style: { borderRadius: 20 } }}>
      <DialogTitle textAlign="center" fontWeight="600" color="primary">Bạn là?</DialogTitle>
      <DialogContent>
        <Grid container flexWrap="nowrap" direction="row" spacing={4}>
          <Grid container direction="column" alignItems="center">
            <Box component="img" src="applicant_abstract.jpg" width={400} />
            <Button variant="text" color="primary" sx={{ textTransform: "capitalize", fontWeight: 600 }} onClick={() => setSignupDetails({type: "applicant"})}>
              Ứng viên tìm việc
            </Button>
          </Grid>
          <Grid container direction="column" alignItems="center">
            <Box component="img" src="recruiter_abstract.jpg" width={400} />
            <Button variant="text" color="primary" sx={{ textTransform: "capitalize", fontWeight: 600 }} onClick={() => setSignupDetails({type: "recruiter"})}>
              Nhà tuyển dụng
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );

  return loggedin ? (
    <Navigate to="/home" />
  ) : (
    signupDetails.type ? signupForm() : signupTypeChooser()
  );
};

export default Signup;
