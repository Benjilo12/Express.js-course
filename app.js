const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
//! we import express
//Step 1
const express = require("express");

//we asign express with app
const app = express();

//!Middlewares
app.use(morgan("dev"));
//using middleware, it a function to modify the incoming request data // it stands btn the req and the res
app.use(express.json());

//middleware fxn
app.use((req, res, next) => {
  console.log("hello from the middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//filepath
// Read JSON data
const filePath = path.join(
  __dirname,
  "starter",
  "dev-data",
  "data",
  "tours-simple.json"
);
const tours = JSON.parse(fs.readFileSync(filePath, "utf-8"));

//! step 3
// Read the JSON file safely
// let tours = [];
try {
  const filePath = path.join(
    __dirname,
    "Starter",
    "dev-data",
    "data",
    "tours-simple.json"
  );
  const data = fs.readFileSync(filePath, "utf-8");
  tours = JSON.parse(data);
} catch (error) {
  console.error("Error reading the tours data:", error.message);
}

//!Route Handlers
//*get all tours res
//to make the codes neat
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

//*to get one tour
const getTour = (req, res) => {
  console.log(req.params);

  //converting the id into string
  const id = req.params.id * 1;

  //finding id for the params
  const tour = tours.find((el) => el.id === id);

  //if there is no tour then Invalid ID
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

//* createTour
const createTour = (req, res) => {
  // Ensure req.body contains data
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid request body" });
  }
  // Create new tour
  const newId = tours.length > 0 ? tours[tours.length - 1].id + 1 : 1;
  const newTour = { id: newId, ...req.body };
  // Add to array
  tours.push(newTour);
  // Write to file
  fs.writeFile(filePath, JSON.stringify(tours, null, 2), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Could not save tour data" });
    }
    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  });
};

//*update tour function
const updateTour = (req, res) => {
  //if there is no tour then Invalid ID
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>",
    },
  });
};

//*delete tour fxn
const deleteTour = (req, res) => {
  //if there is no tour then Invalid ID
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

//*user handlers
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

//!ROUTES
//!get request
//we then read the tour data in the get request
app.get("/api/v1/tours", getAllTours);
//!get tour params
//setting the params for each item or get one item
app.get("/api/v1/tours/:id", getTour);
//!step 4
//Post request/Method
app.post("/api/v1/tours", createTour);
//!Patch/update request to modify part of data
app.patch("/api/v1/tours/:id", updateTour);
//!Delete request
app.delete("/api/v1/tours/:id", deleteTour);

//! you can also use chaining method for the route
// app.route("/api/v1/tours").get(getAllTours).post(createTour);
// app
//   .route("/api/v1/tours/:id")
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

//! User Route
app.route("/api/v1/users").get(getAllUsers).post(createUser);
app.route("/api/v1/user/:id").get(getUser).patch(updateUser).delete(deleteUser);

//!we now listern on port 3000/ Start server
//Step 2
const port = 3000;
app.listen(port, () => {
  console.log(`Running on Port ${port}`);
});
