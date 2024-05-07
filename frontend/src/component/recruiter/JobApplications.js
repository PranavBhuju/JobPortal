import { useState, useEffect, useContext } from "react";
import { Button, Grid, IconButton, Paper, Typography, Modal, FormControlLabel, Checkbox, Avatar, Rating, Divider, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowUpward, ArrowDownward, SentimentDissatisfied, SentimentVeryDissatisfiedRounded, SentimentVeryDissatisfied, } from "@mui/icons-material";
import { SetPopupContext } from "../../App";
import apiList, { server } from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    textTransform: "uppercase",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "10px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const appliedOn = new Date(application.dateOfApplication);

  const handlePopupOpen = () => {
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
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

  const getResume = () => {
    console.log(application)
    if (
      application.jobApplicant.resume &&
      application.jobApplicant.resume !== ""
    ) {
      const address = `${server}${application.jobApplicant.resume}`;
      console.log("address resume", address);
      window.open(address);
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume found",
      });
    }
  };


  const updateStatus = (status) => {
    const address = `${apiList.applications}/${application._id}`;
    const statusData = {
      status: status,
      dateOfJoining: new Date().toISOString(),
    };
    axios
      .put(address, statusData, {
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
  };

  const buttonSet = {
    applied: (
      <>
        <Grid item>
          <Button
            className={classes.statusBlock}
            style={{
              background: colorSet["shortlisted"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("shortlisted")}
          >
            Shortlist
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.statusBlock}
            style={{
              background: colorSet["rejected"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("rejected")}
          >
            Reject
          </Button>
        </Grid>
      </>
    ),
    shortlisted: (
      <>
        <Grid item>
          <Button
            className={classes.statusBlock}
            style={{
              background: colorSet["accepted"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("accepted")}
          >
            Accept
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.statusBlock}
            style={{
              background: colorSet["rejected"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("rejected")}
          >
            Reject
          </Button>
        </Grid>
      </>
    ),
    rejected: (
      <>
        <Grid item>
          <Button
            className={classes.statusBlock}
            variant="text"
            disableRipple
            style={{
              color: colorSet["rejected"],
            }}
          >
            Rejected
          </Button>
        </Grid>
      </>
    ),
    accepted: (
      <>
        <Grid item>
          <Button
            className={classes.statusBlock}
            disableRipple
            style={{
              color: colorSet["accepted"],
            }}
          >
            Accepted
          </Button>
        </Grid>
      </>
    ),
    cancelled: (
      <>
        <Grid item>
          <Button
            className={classes.statusBlock}
            disableRipple
            style={{
              color: colorSet["cancelled"],
            }}
          >
            Cancelled
          </Button>
        </Grid>
      </>
    ),
    finished: (
      <>
        <Grid item>
          <Button
            className={classes.statusBlock}
            disableRipple
            style={{
              background: colorSet["finished"],
              color: "#ffffff",
            }}
          >
            Finished
          </Button>
        </Grid>
      </>
    ),
  };

  return (
    <Paper
      className={classes.jobTileOuter}
      elevation={0}
      sx={{ borderRadius: "20px" }}
    >
      <Grid container direction="column">
        <Grid container direction="row" flexWrap="nowrap">
          <Grid container>
            {/* Avatar and Name */}
            <Grid container item alignItems="center" gap={4}>
              <Grid item>
                <Avatar
                  src={`${server}${application.jobApplicant.profile}`}
                  className={classes.avatar}
                />
              </Grid>

              <Grid item>
                <Typography variant="h5">
                  {application.jobApplicant.name}
                </Typography>
                <Rating
                  value={
                    application.jobApplicant.rating !== -1
                      ? application.jobApplicant.rating
                      : null
                  }
                  readOnly
                />
              </Grid>
            </Grid>
            {/* Other Info */}
            <Grid container item direction="column" spacing={1}>
              <Grid item>Applied On: {appliedOn.toLocaleDateString('vi-VN')}</Grid>
              <Grid item>
                Education:{" "}
                {application.jobApplicant.education
                  .map((edu) => {
                    return `${edu.institutionName} (${edu.startYear}-${edu.endYear ? edu.endYear : "Ongoing"
                      })`;
                  })
                  .join(", ")}
              </Grid>
              <Grid item>
                SOP: {application.sop !== "" ? application.sop : "Not Submitted"}
              </Grid>
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-end" alignItems="flex-start" gap={1}>
            <Grid item>
              <Button variant="contained" sx={{ marginRight: 1 }} className={classes.statusBlock} color="primary" onClick={() => getResume()}>Download resume</Button>
              <Button variant="contained"className={classes.statusBlock} color="primary" onClick={() => window.open("http://localhost:3001/resume-parser", "_blank")} > Parse Resume</Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/chat/${application.jobApplicant._id}`)
                }}
              >Chat</Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction="row" alignItems="center" justifyContent="flex-end" gap={5}>
          {buttonSet[application.status]}
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
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
          // onClick={() => changeRating()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const JobApplications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    status: {
      all: false,
      applied: false,
      shortlisted: false,
    },
    sort: {
      "jobApplicant.name": {
        status: false,
        desc: false,
      },
      dateOfApplication: {
        status: true,
        desc: true,
      },
      "jobApplicant.rating": {
        status: false,
        desc: false,
      },
    },
  });

  useEffect(() => {
    getData();
  }, [searchOptions]);

  const getData = () => {
    let searchParams = [];

    if (searchOptions.status.rejected) {
      searchParams = [...searchParams, `status=rejected`];
    }
    if (searchOptions.status.applied) {
      searchParams = [...searchParams, `status=applied`];
    }
    if (searchOptions.status.shortlisted) {
      searchParams = [...searchParams, `status=shortlisted`];
    }
    if (searchOptions.status.accepted) {
      searchParams = [...searchParams, `status=accepted`];
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
    let address = `${apiList.applicants}?jobId=${jobId}`;
    if (queryString !== "") {
      address = `${address}&${queryString}`;
    }

    console.log(address);

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        // console.log(err.response.data);
        setApplications([]);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  const FilterBar = () => (
    <Grid container direction="column" width="320px" paddingLeft={2}>
      <Typography variant="h6">Status</Typography>
      <Grid
        container
        direction="column"
        padding="0 20px"
      >
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                name="accepted"
                checked={searchOptions.status.accepted}
                onChange={(event) => {
                  setSearchOptions({
                    ...searchOptions,
                    status: {
                      ...searchOptions.status,
                      [event.target.name]: event.target.checked,
                    },
                  });
                }}
              />
            }
            label="Accepted"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                name="rejected"
                checked={searchOptions.status.rejected}
                onChange={(event) => {
                  setSearchOptions({
                    ...searchOptions,
                    status: {
                      ...searchOptions.status,
                      [event.target.name]: event.target.checked,
                    },
                  });
                }}
              />
            }
            label="Rejected"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                name="applied"
                checked={searchOptions.status.applied}
                onChange={(event) => {
                  setSearchOptions({
                    ...searchOptions,
                    status: {
                      ...searchOptions.status,
                      [event.target.name]: event.target.checked,
                    },
                  });
                }}
              />
            }
            label="Applied"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                name="shortlisted"
                checked={searchOptions.status.shortlisted}
                onChange={(event) => {
                  setSearchOptions({
                    ...searchOptions,
                    status: {
                      ...searchOptions.status,
                      [event.target.name]: event.target.checked,
                    },
                  });
                }}
              />
            }
            label="Shortlisted"
          />
        </Grid>
      </Grid>

      <Divider sx={{ margin: "20px 0" }}></Divider>
      <Typography variant="h6">Organize</Typography>
      <Grid container direction="column" padding="0 10px">
        <Grid
          item
          container
          justify="space-around"
          alignItems="center"
        >
          <Grid item>
            <Checkbox
              name="name"
              checked={searchOptions.sort["jobApplicant.name"].status}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    "jobApplicant.name": {
                      ...searchOptions.sort["jobApplicant.name"],
                      status: event.target.checked,
                    },
                  },
                })
              }
              id="name"
            />
          </Grid>
          <Grid item>
            <label for="name">
              <Typography>Name</Typography>
            </label>
          </Grid>
          <Grid item>
            <IconButton
              disabled={!searchOptions.sort["jobApplicant.name"].status}
              onClick={() => {
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    "jobApplicant.name": {
                      ...searchOptions.sort["jobApplicant.name"],
                      desc: !searchOptions.sort["jobApplicant.name"].desc,
                    },
                  },
                });
              }}
            >
              {searchOptions.sort["jobApplicant.name"].desc ? (
                <ArrowDownward />
              ) : (
                <ArrowUpward />
              )}
            </IconButton>
          </Grid>
        </Grid>
        <Grid item container alignItems="center">
          <Grid item>
            <Checkbox
              name="dateOfApplication"
              checked={searchOptions.sort.dateOfApplication.status}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    dateOfApplication: {
                      ...searchOptions.sort.dateOfApplication,
                      status: event.target.checked,
                    },
                  },
                })
              }
              id="dateOfApplication"
            />
          </Grid>
          <Grid item>
            <label for="dateOfApplication">
              <Typography>Date of Application</Typography>
            </label>
          </Grid>
          <Grid item>
            <IconButton
              disabled={!searchOptions.sort.dateOfApplication.status}
              onClick={() => {
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    dateOfApplication: {
                      ...searchOptions.sort.dateOfApplication,
                      desc: !searchOptions.sort.dateOfApplication.desc,
                    },
                  },
                });
              }}
            >
              {searchOptions.sort.dateOfApplication.desc ? (
                <ArrowDownward />
              ) : (
                <ArrowUpward />
              )}
            </IconButton>
          </Grid>
        </Grid>
        <Grid item container alignItems="center">
          <Grid item>
            <Checkbox
              name="rating"
              checked={searchOptions.sort["jobApplicant.rating"].status}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    "jobApplicant.rating": {
                      ...searchOptions.sort[["jobApplicant.rating"]],
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
              <Typography>Rating</Typography>
            </label>
          </Grid>
          <Grid item>
            <IconButton
              disabled={!searchOptions.sort["jobApplicant.rating"].status}
              onClick={() => {
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    "jobApplicant.rating": {
                      ...searchOptions.sort["jobApplicant.rating"],
                      desc: !searchOptions.sort["jobApplicant.rating"]
                        .desc,
                    },
                  },
                });
              }}
            >
              {searchOptions.sort["jobApplicant.rating"].desc ? (
                <ArrowDownward />
              ) : (
                <ArrowUpward />
              )}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid >
  );

  return (
    <>
      {FilterBar()}
      <Grid
        container
        item
        direction="column"
        style={{ padding: "0 30px", minHeight: "93vh" }}
      >
        <Grid
          container
          item
          xs
          direction="column"
          style={{ width: "100%" }}
          alignItems="center"
        >
          {applications.length > 0 ? (
            applications.map((obj) => (
              // <Grid item>
              <ApplicationTile application={obj} getData={getData} />
              // </Grid>
            ))
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" marginY="auto">
              <SentimentVeryDissatisfied fontSize="large" />
              <Typography variant="h5" style={{ textAlign: "center" }}>
                No applications found...
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default JobApplications;