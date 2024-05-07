import { Grid, Modal, Typography, Paper, Button, TextField, Link } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import { Delete, Update } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function JobDetails(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [job, setJob] = useState();
  const [numApplications, setNumApplications] = useState(0);
  const setPopup = useContext(SetPopupContext);
  const [open, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const getData = () => {
    const address = apiList.jobs + "/" + jobId;
    axios.get(address, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }).then((res) => {
      console.log(res.data);
      setJob(res.data);
    }).catch((err) => {
      console.log(err.response.data);
      setPopup({
        open: true,
        severity: "error",
        message: "Error",
      });
    });
  }

  const getApplications = () => {
    const address = `${apiList.applicants}?jobId=${jobId}`;

    axios.get(address, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(
      (res) => setNumApplications(res.data.length)
    ).catch((err) => console.log(err));
  }

  const handleInput = (key, value) => {
    setJob({
      ...job,
      [key]: value,
    });
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDelete = () => {
    console.log(job._id);
    axios
      .delete(`${apiList.jobs}/${job._id}`, {
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
        handleCloseDelete();
        navigate(-1);
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseDelete();
      });
  };

  const handleJobUpdate = () => {
    axios
      .put(`${apiList.jobs}/${job._id}`, job, {
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
        handleCloseUpdate();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const jobModals = () => (
    <>
      <Modal open={open} onClose={handleCloseDelete} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Are you sure you want to delete this job posting?
          </Typography>
          <Grid container direction="row" justifyContent="space-around">
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleDelete()}
              >
                Erase
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleCloseDelete()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        className={classes.popupDialog}
      >
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Update recruitment post
          </Typography>
          <Grid
            container
            direction="column"
            spacing={3}
            style={{ margin: "10px" }}
          >
            <Grid item>
              <TextField
                label="Application deadline"
                type="datetime-local"
                value={job.deadline.substr(0, 16)}
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
                label="Maximum number of candidates"
                type="number"
                variant="outlined"
                value={job.maxApplicants}
                onChange={(event) => {
                  handleInput("maxApplicants", event.target.value);
                }}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Number of recruitments"
                type="number"
                variant="outlined"
                value={job.maxPositions}
                onChange={(event) => {
                  handleInput("maxPositions", event.target.value);
                }}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="space-around" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleJobUpdate()}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleCloseUpdate()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </>
  );

  useEffect(() => {
    getData();
    getApplications();
  }, []);

  if (job) {
    const deadline = new Date(job.deadline);
    const postedOn = new Date(job.dateOfPosting);
    const curencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

    return (
      <Grid container item direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h3">{job.title}</Typography>
        </Grid>
        <Grid container item width="60%" spacing={2}>
          <Grid item container direction="row">
            <Typography fontWeight="600">Form</Typography> : {job.jobType}
          </Grid>
          <Grid item container direction="row">
            <Typography fontWeight="600">Wage</Typography> : {curencyFormatter.format(job.salary)} / month
          </Grid>
          <Grid item container direction="row">
            <Typography fontWeight="600">Job posting Month</Typography> : {postedOn.toLocaleDateString('en-US', { month: "long" })}
          </Grid>
          <Grid item container direction="row">
            <Typography fontWeight="600">Submission Deadline</Typography> : {deadline.toLocaleDateString('en-US', { day: "numeric", month: "long", year: "numeric" })}
          </Grid>
          <Grid item container direction="row">
            <Typography fontWeight="600">Max No of Applications</Typography> : {job.maxApplicants}
          </Grid>
          <Grid item container direction="column">
            <Typography variant="h6" fontWeight="600" style={{ fontSize: '1rem' }}>Job description</Typography>
            <Typography style={{ fontSize: '1rem' }}>{job.description}</Typography>
          </Grid>
          <Grid item container direction="column">
            <Typography variant="h6" fontWeight="600" style={{ fontSize: '1rem' }}>Skills Required</Typography>
            {job.skillsets.map((skill, index) => (
              <Typography key={index} variant="body1" style={{ fontSize: '1rem' }}>{skill}</Typography>
            ))}
          </Grid>
          <Grid item>
            <Typography variant="h6" fontWeight="600">Candidate information</Typography>
            <Typography>
              {numApplications} candidates have applied{" "}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container direction="row" width="20%" marginTop="50px" justifyContent="space-around">
          <Button variant="outlined">
                {<Link onClick={() => navigate(`/job/applications/${job._id}`)}>See details</Link>}
              </Button>
          <Button 
            variant="outlined"
            startIcon={<Update />}
            onClick={() => setOpenUpdate(true)}
          >Update</Button>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<Delete />}
            onClick={() => setOpenDelete(true)}
          >Erase</Button>
        </Grid>

        {jobModals()}
      </Grid>
    );
  } else {
    return <div>Loading...</div>;
  }
}