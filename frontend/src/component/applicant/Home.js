import { useState, useEffect, useContext } from "react";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  Checkbox,
  Rating,
  Divider,
  Link
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Search, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";
import { userType } from "../../lib/isAuth";

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

const JobTile = (props) => {
  const classes = useStyles();
  const { job } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

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

  const deadline = new Date(job.deadline).toLocaleDateString('vi-VN');
  const curencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <Grid item>
      <Paper elevation={1} sx={{borderRadius: "20px", padding: "15px", maxWidth: "30wh"}}>
        <Grid container item spacing={1} direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h5">{job.title}</Typography>
          </Grid>
          <Grid item>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
          </Grid>
          <Grid item>Hình thức : {job.jobType}</Grid>
          <Grid item>Mức lương : {curencyFormatter.format(job.salary)} / tháng</Grid>
          <Grid item>Nhà tuyển dụng : {job.recruiter.name}</Grid>
          <Grid item>Hạn nộp hồ sơ : {deadline}</Grid>

          <Grid container item direction="row" alignItems="center" justifyContent="space-around">
            <Link>Chi tiết</Link>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setOpen(true);
              }}
              disabled={userType() === "recruiter"}
            >
              Apply
            </Button>
          </Grid>
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
        </Paper>
    </Grid>
  );
};

const Home = (props) => {
  const drawerWidth = 320;
  const [jobs, setJobs] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });
  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, [searchOptions]);

  const getData = () => {
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary[0] != 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] != 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
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

  const FilterDrawerLeft = () => (
    <Grid container direction="column" maxWidth={drawerWidth} paddingLeft={2}>
      {/* <Divider textAlign="left">Hình thức làm việc</Divider> */}
      <Typography>Hình thức làm việc</Typography>
      <Grid
        container
        direction="column"
        item
        padding="0 20px"
      >
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                name="fullTime"
                checked={searchOptions.jobType.fullTime}
                onChange={(event) => {
                  setSearchOptions({
                    ...searchOptions,
                    jobType: {
                      ...searchOptions.jobType,
                      [event.target.name]: event.target.checked,
                    },
                  });
                }}
              />
            }
            label="Full Time"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                name="partTime"
                checked={searchOptions.jobType.partTime}
                onChange={(event) => {
                  setSearchOptions({
                    ...searchOptions,
                    jobType: {
                      ...searchOptions.jobType,
                      [event.target.name]: event.target.checked,
                    },
                  });
                }}
              />
            }
            label="Part Time"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                name="wfh"
                checked={searchOptions.jobType.wfh}
                onChange={(event) => {
                  setSearchOptions({
                    ...searchOptions,
                    jobType: {
                      ...searchOptions.jobType,
                      [event.target.name]: event.target.checked,
                    },
                  });
                }}
              />
            }
            label="Work From Home"
          />
        </Grid>
      </Grid>

      <Divider sx={{ margin: "20px 0" }}></Divider>
      <Typography>Mức lương</Typography>
      <Grid container item alignItems="center" padding="0 20px">
        <Slider
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => {
            return value * (100000 / 100);
          }}
          marks={[
            { value: 0, label: "0" },
            { value: 100, label: "100000" },
          ]}
          value={searchOptions.salary}
          onChange={(event, value) =>
            setSearchOptions({
              ...searchOptions,
              salary: value,
            })
          }
        />
      </Grid>

      <Divider sx={{ margin: "20px 0" }}></Divider>
      <Typography>Sắp xếp</Typography>
      <Grid item container direction="column" alignItems="center">
        <Grid
          item
          container
          xs={4}
          justify="space-around"
          alignItems="center"
        >
          <Grid item>
            <Checkbox
              name="salary"
              checked={searchOptions.sort.salary.status}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    salary: {
                      ...searchOptions.sort.salary,
                      status: event.target.checked,
                    },
                  },
                })
              }
              id="salary"
            />
          </Grid>
          <Grid item>
            <label for="salary">
              <Typography>Mức lương</Typography>
            </label>
          </Grid>
          <Grid item>
            <IconButton
              disabled={!searchOptions.sort.salary.status}
              onClick={() => {
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    salary: {
                      ...searchOptions.sort.salary,
                      desc: !searchOptions.sort.salary.desc,
                    },
                  },
                });
              }}
            >
              {searchOptions.sort.salary.desc ? (
                <ArrowDownward />
              ) : (
                <ArrowUpward />
              )}
            </IconButton>
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={4}
          justify="space-around"
          alignItems="center"
        >
          <Grid item>
            <Checkbox
              name="rating"
              checked={searchOptions.sort.rating.status}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    rating: {
                      ...searchOptions.sort.rating,
                      status: event.target.checked,
                    },
                  },
                })
              }
              id="rating"
            />
          </Grid>
          <Grid item>
            <label for="rating">
              <Typography>Đánh giá</Typography>
            </label>
          </Grid>
          <Grid item>
            <IconButton
              disabled={!searchOptions.sort.rating.status}
              onClick={() => {
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    rating: {
                      ...searchOptions.sort.rating,
                      desc: !searchOptions.sort.rating.desc,
                    },
                  },
                });
              }}
            >
              {searchOptions.sort.rating.desc ? (
                <ArrowDownward />
              ) : (
                <ArrowUpward />
              )}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <>
      {FilterDrawerLeft()}
      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ padding: "0 30px", minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h3" padding={5}>Công việc</Typography>
          </Grid>
          <Grid item xs>
            <TextField
              label="Bắt đầu tìm công việc mà bạn mong muốn..."
              value={searchOptions.query}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  query: event.target.value,
                })
              }
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getData();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => getData()}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ width: "500px" }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Grid
          container
          marginY={4}
          gap={4}
          justifyContent="space-around"
        >
          {jobs.length > 0 ? (
            jobs.map((job) => {
              return <JobTile job={job} />;
            })
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              Không tìm thấy công việc nào
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
