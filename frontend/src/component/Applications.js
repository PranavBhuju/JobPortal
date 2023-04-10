import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
  Rating,
  Link
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
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

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
        console.log(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  const statusLabel = {
    applied: "Đã ứng tuyển",
    shortlisted: "Đang tuyển chọn",
    accepted: "Đã được chấp nhận",
    rejected: "Đã bị từ chối",
    deleted: "Đã bị xóa",
    cancelled: "Đã bị hủy",
    finished: "Đã hoàn thành",
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <Grid item>
      <Paper elevation={1} sx={{ borderRadius: "20px", padding: "15px", maxWidth: "30wh" }}>
        <Grid container item spacing={1} direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h5">{application.job.title}</Typography>
          </Grid>
          <Grid item>Nhà tuyển dụng : {application.recruiter.name}</Grid>
          <Grid item>Hình thức : {application.job.jobType}</Grid>
          <Grid item>Mức lương : {currencyFormatter.format(application.job.salary)} / tháng</Grid>
          <Grid item>Thời gian ứng tuyển: {appliedOn.toLocaleDateString('vi-VN')}</Grid>
          {application.status === "accepted" ||
            application.status === "finished" ? (
            <Grid item>Thời gian bắt đầu công việc: {joinedOn.toLocaleDateString('vi-VN')}</Grid>
          ) : null}
          <Grid item>
            Trạng thái: {application.status ? <span style={{ color: colorSet[application.status], fontWeight: 500 }}>{statusLabel[application.status]}</span> : null}
          </Grid>

          <Grid container item direction="row" alignItems="center" justifyContent="space-around">
            <Link>Chi tiết</Link>
            {application.status === "accepted" ||
              application.status === "finished" ? (
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.statusBlock}
                  onClick={() => {
                    fetchRating();
                    setOpen(true);
                  }}
                >
                  Đánh giá
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Paper>

      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
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
          <Rating
            name="simple-controlled"
            size="large"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => changeRating()}
          >
            Xác nhận
          </Button>
        </Paper>
      </Modal>
    </Grid>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
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

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h3" padding={5}>Việc làm đã ứng tuyển</Typography>
      </Grid>
      <Grid
        container
        // item
        // xs
        // direction="column"
        // style={{ width: "100%" }}
        // alignItems="stretch"
        // justify="center"
        marginY={4}
        gap={4}
        columns={2}
        justifyContent="space-around"
      >
        {applications.length > 0 ? (
          applications.map((obj) => (
            <Grid item>
              <ApplicationTile application={obj} />
            </Grid>
          ))
        ) : (
          <Typography variant="h5" style={{ textAlign: "center" }}>
            Bạn chưa ứng tuyển vào công việc nào
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
