const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");

const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

const upload = multer();

router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;
  if (!["application/pdf"].includes(file.mimetype)) {
    res.status(400).json({
      message: "Invalid format"
    });
  } else {
    const filename = `${uuidv4()}${file.mimetype.replace("application/", ".")}`;
    fs.writeFile(
      `${__dirname}/../public/resume/${filename}`,
      file.buffer,
      (err) => {
        if (err) {
          res.status(400).json({
            message: "Error while uploading"
          });
        } else {
          res.send({
            message: "File uploaded successfully",
            url: `/host/resume/${filename}`
          });
        }
      }
    );
  }
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (!["image/jpg", "image/png", "image/jpeg"].includes(file.mimetype)) {
    res.status(400).json({
      message: "Invalid format"
    });
  } else {
    const filename = `${uuidv4()}${file.mimetype.replace("image/", ".")}`;
    fs.writeFile(
      `${__dirname}/../public/profile/${filename}`,
      file.buffer,
      (err) => {
        if (err) {
          res.status(400).json({
            message: "Error while uploading"
          });
        } else {
          res.send({
            message: "Profile image uploaded successfully",
            url: `/host/profile/${filename}`
          });
        }
      }
    )
  }
});

module.exports = router;