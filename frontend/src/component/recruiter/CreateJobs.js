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
    description: ""
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };
  const handleSkillsInput = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newSkill = event.target.value.trim();
      if (newSkill) {
        setJobDetails(prevState => ({
          ...prevState,
          skillsets: [...prevState.skillsets, newSkill]
        }));
        event.target.value = '';
      }
    }
  };

  const handleDeleteSkill = (index) => {
    setJobDetails(prevState => ({
      ...prevState,
      skillsets: prevState.skillsets.filter((_, i) => i !== index)
    }));
  };

  const handleUpdate = () => {

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
          description: ""
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
    <Grid container item xs direction="column" sx={{ paddingTop: "50px" }}>
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
                label="Job Title"
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
                label="Type of work"
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
                label="Wage"
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
                label="Submission Deadline"
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
                label="Maximum number of applications"
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
                label="Number of employees to recruit"
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

            <Grid item>
              <TextField
                label="Description"
                value={jobDetails.description}
                onChange={(event) =>
                  handleInput("description", event.target.value)
                }
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item>
              <TextField
                label="Skills Required"
                variant="outlined"
                fullWidth
                onKeyDown={handleSkillsInput}
              />
              <Grid container spacing={1} style={{ marginTop: 5 }}>
                {jobDetails.skillsets.map((skill, index) => (
                  <Grid item key={index}>
                    <Chip label={skill} onDelete={() => handleDeleteSkill(index)} />
                  </Grid>
                ))}
              </Grid>
            </Grid>

          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px", marginTop: "30px" }}
            onClick={() => handleUpdate()}
          >
            Confirm
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateJobs;
