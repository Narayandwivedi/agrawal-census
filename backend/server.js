const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const familyRoutes = require('./routes/familyRoutes');
const samajRoutes = require('./routes/samajRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrawal_census';

app.use(cors());
app.use(express.json());

app.use('/api/families', familyRoutes);
app.use('/api/samaj', samajRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
