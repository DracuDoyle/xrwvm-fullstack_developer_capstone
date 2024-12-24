const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' });

const Reviews = require('./review');
const Dealerships = require('./dealership');

try {
  Reviews.deleteMany({}).then(() => {
    Reviews.insertMany(reviews_data.reviews);  // Notación de punto
  });
  Dealerships.deleteMany({}).then(() => {
    Dealerships.insertMany(dealerships_data.dealerships);  // Notación de punto
  });

} catch (error) {
  res.status(500).json({ error: 'Error fetching documents' });
}


// Express route to home
app.get('/', async (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });  // Notación de punto
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealerships = await Dealerships.find();
    res.json(dealerships);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const stateDealers = await Dealerships.find({ state: req.params.state });
    res.json(stateDealers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships for the specified state' });
  }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    // const dealer = await Dealerships.findOne({ id: req.params.id });  // Usando id con notación de punto
    const dealer = await Dealerships.find({ id: req.params.id });
    if (!dealer) {
      res.status(404).json({ error: 'Dealer not found' });
    } else {
      res.json(dealer);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealer' });
  }
});

//Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  const data = JSON.parse(req.body);
  const documents = await Reviews.find().sort({ id: -1 });
  let new_id = documents[0].id + 1;  // Notación de punto

  const review = new Reviews({
    "id": new_id,
    "name": data.name,  // Notación de punto
    "dealership": data.dealership,  // Notación de punto
    "review": data.review,  // Notación de punto
    "purchase": data.purchase,  // Notación de punto
    "purchase_date": data.purchase_date,  // Notación de punto
    "car_make": data.car_make,  // Notación de punto
    "car_model": data.car_model,  // Notación de punto
    "car_year": data.car_year,  // Notación de punto
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
