import { useContext, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Navigate } from "react-router-dom";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import socket from '../lib/socket'

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

const Login = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Đăng nhập thành công",
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
      setPopup({
        open: true,
        severity: "error",
        message: "Thông tin không chính xác",
      });
    }
  };

  return loggedin ? (
    <Navigate to="/home" />
  ) : (
    <Grid container flexDirection="row" flexWrap="nowrap" flexGrow={1} padding="0 5em">
      <Grid container margin="20vh 0" width="50%" direction="column" spacing={4} alignItems="center">
        <Grid item>
          <Typography variant="h4" fontWeight={500} color="primary">
            Đăng nhập
          </Typography>
        </Grid>
        <Grid item>
          <EmailInput
            label="Email"
            value={loginDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            className={classes.inputBox}
          />
        </Grid>
        <Grid item>
          <PasswordInput
            label="Mật khẩu"
            value={loginDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            className={classes.inputBox}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLogin()}
            className={classes.submitButton}
          >
            Xác nhận
          </Button>
        </Grid>
      </Grid>
      <Grid container width="50%" margin="auto" alignItems="center" spacing={4}>
        <Box component="img" src="applicant_abstract.jpg" />
      </Grid>
    </Grid>
  );
};

export default Login;
