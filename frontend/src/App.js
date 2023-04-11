import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Grid, ThemeProvider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { lightTheme } from "./theme";

import Welcome, { ErrorPage } from "./component/Welcome";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import Logout from "./component/Logout";
import Signup from "./component/Signup";
import Home from "./component/Home";
import { ApplicantApplications } from "./component/applicant";
import Profile from "./component/Profile";
import CreateJobs from "./component/recruiter/CreateJobs";
import JobApplications from "./component/recruiter/JobApplications";
import AcceptedApplicants from "./component/recruiter/AcceptedApplicants";
import MessagePopup from "./lib/MessagePopup";
import Chat from "./component/chat/Chat";
import ChatHome from './component/ChatHome'
import JobDetails from "./component/JobDetails";

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    minHeight: "98vh",
    boxSizing: "border-box",
    width: "100%",
  },
}));

export const SetPopupContext = createContext();

function App() {
  const classes = useStyles();
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <SetPopupContext.Provider value={setPopup}>
          <Grid container direction="column">
            <Grid item xs>
              <Navbar />
            </Grid>
            <Grid item className={classes.body}>
              <Routes>
                <Route exact path="/" element={<Welcome />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/logout" element={<Logout />} />
                <Route exact path="/home" element={<Home />} />
                <Route exact path="/applications" element={<ApplicantApplications />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/addjob" element={<CreateJobs />} />
                <Route exact path="/job/applications/:jobId" element={<JobApplications />} />
                <Route exact path="/job/:jobId" element={<JobDetails />} />
                <Route exact path="/employees" element={<AcceptedApplicants />} />
                <Route exact path="/chat/:id" element={<Chat />} />
                <Route exact path="/chat" element={<ChatHome />} />
                <Route element={<ErrorPage />} />
              </Routes>
            </Grid>
          </Grid>
          <MessagePopup
            open={popup.open}
            setOpen={(status) =>
              setPopup({
                ...popup,
                open: status,
              })
            }
            severity={popup.severity}
            message={popup.message}
          />
        </SetPopupContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
