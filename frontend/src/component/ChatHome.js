import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "100%",
  },
  item_container: {
    margin: "10px",
  },
  item: {
    margin: "6px auto !important",
    padding: "2px 8px",
    borderRadius: "10px",
    width: "80% !important",
    height: "100px",
    boxShadow: "0 0 2px black",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statusBlock: {
    margin: "2px 0",
    width: "100%",
    height: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
}));

const ChatHome = () => {
  const classes = useStyles();
  const [chats, setChats] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${apiList.chat}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }).then(res => {
      console.log(res.data)
      setChats(res.data)
    }).catch(err => {
      console.log(err)
      alert(err)
    })
  }, [])

  return (
    <>
      <Grid container
        className={classes.item_container}

        direction="column"
      >
        {
          chats.length === 0 && <div style={{
            margin: "10px auto",
          }}>No chats available</div>
        }
        {
          chats.map((chat, index) => {
            return (
              <Grid container
                item
                className={classes.item}
                key={`chat-preview-${index}`}
              >
                {
                  userType() === 'applicant' &&
                  <Grid container item xs={9} spacing={1} direction="column">
                    <Grid item>Recruiter</Grid>
                    <Grid item>Name: {chat.recruiterId.name}</Grid>
                    <Grid item>Phone: {chat.recruiterId.contactNumber}</Grid>
                  </Grid>
                }
                {
                  userType() === 'recruiter' &&
                  <Grid container item xs={9} spacing={1} direction="column">
                    <Grid item>Applicant</Grid>
                    <Grid item>Name: {chat.applicantId.name}</Grid>
                  </Grid>
                }

                <Grid item container direction="column" xs={3}>
                  <Grid item xs>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.statusBlock}
                      onClick={() => {
                        let userId
                        if (userType() === 'recruiter') {
                          userId = chat.applicantId._id
                        } else if (userType() === 'applicant') {
                          userId = chat.recruiterId._id
                        }
                        navigate(`/chat/${userId}`)
                      }}
                    >
                      Inbox
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )
          })
        }
      </Grid>

    </>
  );
};

export default ChatHome;
