const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const send = (url ,res) => {
  var file = fs.createReadStream(url);
  var stat = fs.statSync(url);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  file.pipe(res);
}

router.get("/resume/:file", (req, res) => {
  const address = path.join(__dirname, `../public/resume/${req.params.file}`);
  fs.access(address, fs.F_OK, (err) => {
    if (err) {
      console.log(err)
      res.status(404).json({
        message: "File not found",
      });
      return;
    }
    console.log("send file:", address)
    res.status(200).sendFile(address);
  });
});

router.get("/profile/:file", (req, res) => {
  const address = path.join(__dirname, `../public/profile/${req.params.file}`);
  fs.access(address, fs.F_OK, (err) => {
    if (err) {
      res.status(404).json({
        message: "File not found",
      });
      return;
    }
    res.sendFile(address);
  });
});

module.exports = router;
