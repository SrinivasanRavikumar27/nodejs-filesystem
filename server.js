// import express and file system
const express = require("express");
const fs = require("fs");
const path = require("path");

// create app
const app = express();

// Function to format the current date and time
function getCurrentDateTimeString() {
  const now = new Date();
  // Get date components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  // Get time components
  const hours = String(now.getHours() % 12 || 12).padStart(2, "0"); // Convert 24-hour format to 12-hour format
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const meridiem = now.getHours() < 12 ? "AM" : "PM";
  // Construct the formatted date and time string
  return `${day}_${month}_${year}_${hours}_${minutes}_${seconds}_${meridiem}`;
}

// files to be stored
const fileStore = path.join(__dirname, "/textFiles/");

// Route to create a new file
app.post("/createFile", (req, res) => {
  // Get the current date and time as a string
  const dateTimeString = getCurrentDateTimeString();
  const fileName = `${dateTimeString}.txt`;
  const filePath = path.join(fileStore, fileName);

  // Write data to a file
  fs.writeFile(filePath, dateTimeString, { flag: "w+" }, (error) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error writing file" });
    } else {
      console.log(dateTimeString + " Data has been written to " + fileName);
      res.json({ message: "File created successfully", fileName });
    }
  });
});

// api documentation
const apiDoc = "https://documenter.getpostman.com/view/19026522/2sA2xpTVAP";

// home url
app.get("/", function (req, res) {
  res.send(`Hi! This is a sample node file system with <a href="${apiDoc}" target = "_blank">API documentation</a>`);
});



// Route to get a list of all text files
app.get("/files", (request, response) => {
  // Read files in the directory
  fs.readdir(fileStore, (error, files) => {
    if (error) {
      console.log(error);
      response.status(500).json({ message: "Error in retrieving data" });
    } else {
      const textFiles = files.filter((file) => file.endsWith(".txt"));
      response.json({ files: textFiles });
    }
  });
});

// Start the server and listen for incoming requests
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
