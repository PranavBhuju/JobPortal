const express = require("express");
const multer = require("multer");
const mongoose = require('mongoose')
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
const jwtAuth = require("../lib/jwtAuth");
const JobApplicant = require('../db/JobApplicant')
const Applications = require('../db/Application')
const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

const upload = multer();

router.post("/resume", upload.single("file"), jwtAuth, async(req, res) => {
  const { file } = req;
  
  if (!['application/pdf'].includes(file.mimetype)) {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.originalname}`;
    const file_dir = `host/resume/${filename}`
    pipeline(
      `${file.buffer}`,
      fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
    )
      .then(async () => {
        const jobApplicant = await JobApplicant.findOne({ userId: req.user._id })
        if (!jobApplicant) {
          return res.status(404).json({
            message: "Cannot specify user",
          });
        }

        jobApplicant.resume = file_dir        
        await jobApplicant.save()
        return res.status(200).json({
          message: "File uploaded successfully",
          url: file_dir,
        });
      })
      .catch((err) => {
        console.log(err)
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  }
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (
    !['image/jpg', 'image/png'].includes(file.mimetype)
  ) {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.originalname}`;

    pipeline(
      `${file.buffer}`,
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
      .then(() => {
        res.send({
          message: "Profile image uploaded successfully",
          url: `/host/profile/${filename}`,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  }
});

module.exports = router;
