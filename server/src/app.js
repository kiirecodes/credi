const express = require('express');
const cors = require('cors');
const loanRoutes = require('./routes/loanRoutes');
const userRoutes = require('./routes/userRoutes');
const lenderRoutes = require('./routes/lenderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/loans', loanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lenders', lenderRoutes);

app.use(errorHandler);

module.exports = app;
