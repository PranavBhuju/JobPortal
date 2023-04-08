const express = require("express");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const Chat = require("../db/Chat");
const Message = require("../db/Message");
const jwtAuth = require("../lib/jwtAuth");

const router = express.Router();

router.get("/:id", jwtAuth, async (req, res) => {
    const user = req.user;
    const partnerId = req.params.id;
    let _u;
    let me;
 
    let filter = {}
    if (user.type === 'recruiter') {
        _u = await JobApplicant.findOne({ _id: partnerId })
        me = await Recruiter.findOne({userId: user._id})
        if (!_u) {
            return res.status(404).json({
                message: `Partner with ID:${partnerId} not found`,
            });
        }
        filter = {
            applicantId: _u._id,
            recruiterId: me._id
        }
    } else if (user.type === 'applicant') {
        _u = await Recruiter.findOne({ _id: partnerId })
        me = await JobApplicant.findOne({userId: user._id})
        if (!_u) {
            return res.status(404).json({
                message: `Partner with ID:${partnerId} not found`,
            });
        }
        filter = {
            applicantId: me._id,
            recruiterId: _u._id
        }
    }

  Chat.findOne(filter)
    .lean()
    .exec(async (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      } else {
        if (!doc) {
          const chat = filter
          new Chat(chat)
            .save()
            .then((record) => {
              return res.status(200).json({
                isNew: true,
                chatId: record._id,
                messages: [],
              });
            })
            .catch((err) => {
              return res.status(400).json(err);
            });
        } else {
          const messages = await Message.find({
            chatId: doc._id,
          });
          return res.status(200).json({
            isNew: false,
            chatId: doc._id,
            messages: messages.map((msg) => ({
              ...msg._doc,
              you: msg._doc.userId.toString() === user._id.toString(),
            })),
          });
        }
      }
    });
});

router.post("/:id/message", jwtAuth, async (req, res) => {
  const user = req.user;
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId)
    .populate("recruiterId", "userId")
    .populate("applicantId", "userId")
  if (!chat) {
    return res.status(404).json({
      message: `Chat with ID: ${chatId} not found`,
    });
  }
  const message = {
    chatId,
    userId: user._id,
    content: req.body.content,
  };
  new Message(message)
    .save()
    .then((record) => {
      return res.status(200).json({
        ...record._doc,
        from: user._id,
        to: user.type === 'recruiter' ? chat.applicantId.userId.toString() : chat.recruiterId.userId.toString()
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.get("/", jwtAuth,async (req, res) => {
    const user = req.user;
    let _u = {}
    let filterPo = {}
    let filterChat = {}
    if (user.type === "recruiter") {
        _u = await Recruiter.findOne({ userId: user._id })
        filterChat = {
            recruiterId: _u._id
        }
        filterPo = {
            path: 'applicantId',
            model: 'JobApplicantInfo'
        }
    } else if (user.type === "applicant") {
        _u = await JobApplicant.findOne({ userId: user._id })
        filterChat = {
            applicantId: _u._id
        }
        filterPo = {
            path: 'recruiterId',
            model: 'RecruiterInfo'
        }
    }
    Chat.find(filterChat)
        .populate(filterPo)
        .exec((err, records) => {
            if (err) {
                console.log(err)
                return res.status(500).json(err)
            } else {
                return res.status(200).json(records)
            }
        })
});

module.exports = router;
