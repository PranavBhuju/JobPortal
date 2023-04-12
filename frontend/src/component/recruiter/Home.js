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
  Link,
  Box,
  Fab,
  Container,
  Avatar
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Search, ArrowUpward, ArrowDownward, Add, SentimentVeryDissatisfied, Person2, Person, AccessTime, AttachMoney, AccessTimeOutlined, AttachMoneyOutlined } from "@mui/icons-material";
import { SetPopupContext } from "../../App";
import apiList, { server } from "../../lib/apiList";
import { useNavigate } from "react-router-dom";
import CreateJobs from "./CreateJobs";

const JobTile = (props) => {
  let navigate = useNavigate();
  const { job, getData } = props;

  const [numApplications, setNumApplications] = useState(0);

  const getApplications = () => {
    const address = `${apiList.applicants}?jobId=${job._id}`;

    axios.get(address, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(
      (res) => setNumApplications(res.data.length)
    ).catch((err) => console.log(err));
  }

  useEffect(getApplications, []);

  const deadline = new Date(job.deadline);
  const postedOn = new Date(job.dateOfPosting);
  const curencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <Grid item>
      <Paper elevation={0} sx={{ borderRadius: "20px", padding: "15px", maxWidth: "30wh" }}>
        <Grid container item spacing={1} direction="column" alignItems="center" marginLeft="10px">
          <Grid container direction="row" flexWrap="nowrap" gap={1}>
            <Grid item>
              <Avatar
                variant="square"
                sx={{ width: "5rem", height: "5rem" }}
                src={server + job.recruiter.profile} />
            </Grid>
            <Grid container direction="column">
              <Grid item>
                <Typography variant="h5">{job.title}</Typography>
              </Grid>
              <Grid item>
                <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
              </Grid>
            </Grid>
          </Grid>

          <Grid container item direction="row" justifyContent="flex-start" gap={2}>
            <Grid item container direction="row" alignItems="center" width="auto" gap={1}>
              <AccessTimeOutlined />
              <Typography variant="body2">{job.jobType}</Typography>
            </Grid>

            <Grid item container direction="row" alignItems="center" width="auto" gap={1}>
              <AttachMoneyOutlined />
              <Typography variant="body2">{curencyFormatter.format(job.salary)} / tháng</Typography>
            </Grid>
          </Grid>

          <Grid item container direction="column" spacing={1} marginTop="5px">
            <Typography variant="body1">Ngày đăng : {postedOn.toLocaleDateString('vi-VN')}</Typography>
            <Typography variant="body1">Hạn nộp hồ sơ : {deadline.toLocaleDateString('vi-VN')}</Typography>
          </Grid>

          <Grid container item direction="row" alignItems="center" justifyContent="space-between" paddingRight="20px">
            <Typography variant="body2" color="secondary">Số lượng ứng viên: {numApplications}/{job.maxApplicants}</Typography>
            <Button variant="outlined" onClick={() => navigate(`/job/${job._id}`)}>Chi tiết</Button>
          </Grid>
        </Grid>
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
  const [openCreateJobModal, setOpenCreateJobModal] = useState(false);
  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, [searchOptions, openCreateJobModal]);

  const getData = () => {
    let searchParams = [`myjobs=1`];
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
          {/* <Grid item> */}
          <Box display="flex" flexDirection="row" alignItems="center">
            <TextField
              label="Tìm kiếm các công việc bạn đã đăng..."
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

            <Typography variant="body1" padding="0 10px">hoặc</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ borderRadius: "20px", textTransform: "none" }}
              onClick={() => setOpenCreateJobModal(true)}
            >Thêm công việc mới</Button>
          </Box>
        </Grid>

        <Grid
          container
          direction="column"
          gap={2}
          marginTop={4}
        >
          {jobs.length > 0 ? (
            jobs.map((job) => {
              return <JobTile job={job} />;
            })
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" marginY="auto">
              <SentimentVeryDissatisfied fontSize="large" />
              <Typography variant="h5" style={{ textAlign: "center" }}>
                Không tìm thấy công việc nào...
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      <Modal
        open={openCreateJobModal}
        onClose={() => setOpenCreateJobModal(false)}
      >
        <Container fixed>
          <CreateJobs />
        </Container>
      </Modal>
    </>
  );
};

export default Home;
