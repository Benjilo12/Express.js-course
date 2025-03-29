const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.param("id", (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  next();
});

// File Path
const filePath = path.join(
  __dirname,
  "../starter/dev-data/data/tours-simple.json"
);

// Read Tours Data
let tours = [];
try {
  const data = fs.readFileSync(filePath, "utf-8");
  tours = JSON.parse(data);
} catch (error) {
  console.error("Error reading the tours data:", error.message);
}

exports.checkID = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
};

// Controllers
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }

  res.status(200).json({ status: "success", data: { tour } });
};

const createTour = (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid request body" });
  }

  const newId = tours.length > 0 ? tours[tours.length - 1].id + 1 : 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(filePath, JSON.stringify(tours, null, 2), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Could not save tour data" });
    }
    res.status(201).json({ status: "success", data: { tour: newTour } });
  });
};

const updateTour = (req, res) => {
  res
    .status(200)
    .json({ status: "success", data: { tour: "<Updated tour here...>" } });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",

    data: null,
  });
};

// Routes
router.route("/").get(getAllTours).post(exports.checkBody, createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
