import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Chip
} from "@mui/material";
import { NumericFormat } from 'react-number-format';
import { makeStyles } from "@mui/styles";
import axios from "axios";

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

const CreateJobs = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    maxApplicants: 100,
    maxPositions: 30,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    skillsets: [],
    jobType: "Full Time",
    duration: 0,
    salary: 0,
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    console.log(jobDetails);
    axios
      .post(apiList.jobs, jobDetails, {
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
        setJobDetails({
          title: "",
          maxApplicants: 100,
          maxPositions: 30,
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          skillsets: [],
          jobType: "Full Time",
          duration: 0,
          salary: 0,
        });
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
    <Grid container item xs direction="column" sx={{paddingTop: "50px"}}>
      <Grid item>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            direction="column"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item>
              <TextField
                label="Vị trí tuyển dụng"
                value={jobDetails.title}
                onChange={(event) =>
                  handleInput("title", event.target.value)
                }
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                select
                label="Hình thức làm việc"
                variant="outlined"
                value={jobDetails.jobType}
                onChange={(event) => {
                  handleInput("jobType", event.target.value);
                }}
                fullWidth
              >
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Work From Home">Work From Home</MenuItem>
              </TextField>
            </Grid>
            <Grid item>
              <NumericFormat
                label="Mức lương"
                prefix="$"
                thousandSeparator=","
                customInput={TextField}
                value={jobDetails.salary}
                onValueChange={(newFormattedValues) => {
                  handleInput("salary", newFormattedValues.value);
                }}
                variant="outlined"
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Hạn nộp hồ sơ"
                type="datetime-local"
                value={jobDetails.deadline}
                onChange={(event) => {
                  handleInput("deadline", event.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Số lượng đơn ứng tuyển tối đa"
                type="number"
                variant="outlined"
                value={jobDetails.maxApplicants}
                onChange={(event) => {
                  handleInput("maxApplicants", event.target.value);
                }}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Số lượng nhân viên tuyển dụng"
                type="number"
                variant="outlined"
                value={jobDetails.maxPositions}
                onChange={(event) => {
                  handleInput("maxPositions", event.target.value);
                }}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px", marginTop: "30px" }}
            onClick={() => handleUpdate()}
          >
            Xác nhận
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateJobs;
