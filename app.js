const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// Custom Middleware
app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mount Routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//!Route Handlers

//!ROUTES
// //!get request
// //we then read the tour data in the get request
// app.get("/api/v1/tours", getAllTours);
// //!get tour params
// //setting the params for each item or get one item
// app.get("/api/v1/tours/:id", getTour);
// //!step 4
// //Post request/Method
// app.post("/api/v1/tours", createTour);
// //!Patch/update request to modify part of data
// app.patch("/api/v1/tours/:id", updateTour);
// //!Delete request
// app.delete("/api/v1/tours/:id", deleteTour);

//! you can also use chaining method for the route

module.exports = app;
