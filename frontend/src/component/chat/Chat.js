import { makeStyles } from "@mui/styles";
import React from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios'
import apiList from '../../lib/apiList'
import { SetPopupContext } from "../../App";
import './chat.css'
import { TextField, } from "@mui/material";
import Message from "./Message";
import socket from '../../lib/socket'
import { userType } from "../../lib/isAuth";

const Inbox = ({ className, messages }) => {
  return (
    <div className={className}>
      {
        messages.length > 0 &&
        messages.map((msg, index) => {
          return <Message key={`chat-msg-${index}`} data={msg} />
        })
      }
    </div>
  )
}

const ChatPanel = ({ className, chatId }) => {
  const [message, setMessage] = React.useState("")

  const handleSendMessage = (e) => {
    if (e.keyCode === 13) {
      axios.post(`${apiList.chat}/${chatId}/message`, {
        content: message.trim()
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }).then(res => {
        if (res.status === 200) {
          socket.emit("message", {
            ...res.data,
          })
          setMessage("")
        }
      }).catch((err) => {
        console.log(err)
        alert("Cannot send")
      })
    }
  }

  return (
    <div className={className}>
      <TextField
        className="chat-panel-input"
        label="Write your message... Press enter to send."
        rows={1}
        style={{ width: "100%", marginBottom: "2px" }}
        variant="outlined"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value)
        }}
        onKeyDown={handleSendMessage}
      />
    </div>
  );
}

const Chat = () => {
  const partnerId = useParams().id
  const [chatId, setChatId] = React.useState("")
  const [messages, setMessages] = React.useState([])
  const [partner, setPartner] = React.useState({})

  const setPopup = React.useContext(SetPopupContext);

  React.useEffect(() => {
    axios.get(`${apiList.chat}/${partnerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(res => {
      console.log(res)
      setChatId(res.data.chatId)
      socket.emit("join chat", res.data.chatId)
      setMessages(res.data.messages)
      setPartner(res.data.partner)
    }).catch(err => {
      console.log(err.response);
    })
  }, [])

  React.useEffect(() => {
    const sendMessageListener = msg => {
      console.log("on message")
      setMessages(prev => ([
        ...prev,
        {
          ...msg,
          you: userType() === msg.userType
        }
      ]))
    }

    socket.on("message", sendMessageListener)

    return () => {
      socket.off("message", sendMessageListener)
    }
  }, [socket])

  return (
    <div className="chat">
      {
        partner && Object.keys(partner).length === 0 ?
          <div>Invalid partner. Cannot open chat</div>
          :
          <>
            <div>
              <div>Chatting with: {partner.name}</div>
              {
                partner.userId?.email &&
                <div>Email: {partner.userId.email}</div>
              }
              {
                userType() === 'applicant' &&
                partner.contactNumber &&
                <div>Phone: {partner.contactNumber}</div>
              }
            </div>
            <Inbox className="inbox" messages={messages} />
            <ChatPanel className="chat-panel" chatId={chatId} />
          </>
      }
    </div>
  );
}

export default Chat