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
  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

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

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    console.log(job._id);
    console.log(sop);
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

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
          <Grid item container direction="row"><Typography fontWeight="600">Type</Typography> : {job.jobType}</Grid>
          <Grid item container direction="row"><Typography fontWeight="600">Wage</Typography> : {curencyFormatter.format(job.salary)} / month</Grid>
          <Grid item container direction="row"><Typography fontWeight="600">Job posting date</Typography> : {postedOn.toLocaleDateString('vi-VN', { month: "long" })}</Grid>
          <Grid item container direction="row"><Typography fontWeight="600">Submission deadline</Typography> : {deadline.toLocaleDateString('vi-VN', { day: "numeric", month: "long", year: "numeric" })}</Grid>
          <Grid item container direction="row"><Typography fontWeight="600">Maximum number of applications</Typography> : {job.maxApplicants}</Grid>

          <Grid item container direction="row">
            <Typography variant="h6" fontWeight="600">Job description</Typography>
            <Typography variant="body1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
          </Grid>

          <Grid item container direction="row">
            <Typography variant="h6" fontWeight="600">Request</Typography>
            <Typography variant="body1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6" fontWeight="600">Candidate information</Typography>
            <Typography>
              {numApplications} candidate has applied
              {" "}
            </Typography>
          </Grid>
        </Grid>

        <Grid item container direction="row" width="20%" marginTop="50px" justifyContent="space-around">
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
          >Apply</Button>
        </Grid>

        <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: "50%",
              alignItems: "center",
              borderRadius: "20px"
            }}
          >
            <TextField
              label="Write SOP (upto 250 words)"
              multiline
              rows={8}
              style={{ width: "100%", marginBottom: "30px" }}
              variant="outlined"
              value={sop}
              onChange={(event) => {
                if (
                  event.target.value.split(" ").filter(function (n) {
                    return n != "";
                  }).length <= 250
                ) {
                  setSop(event.target.value);
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => handleApply()}
            >
              Submit
            </Button>
          </Paper>
        </Modal>
      </Grid>
    );
  } else {
    return <div>Loading...</div>;
  }
}