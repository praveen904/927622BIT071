const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 3000;
const WINDOW_SIZE = 10;
let windowPrevState = [];
let windowCurrState = [];

function generateNumbers(id) {
  let numbers = [];
  switch (id) {
    case 'p': // Prime
      let num = 2;
      while (numbers.length < 5) {
        if (isPrime(num)) numbers.push(num);
        num++;
      }
      break;
    case 'f': // Fibonacci
      numbers = [0, 1];
      while (numbers.length < 5) {
        numbers.push(numbers[numbers.length - 1] + numbers[numbers.length - 2]);
      }
      break;
    case 'e': // Even
      for (let i = 2; numbers.length < 5; i += 2) {
        numbers.push(i);
      }
      break;
    case 'r': // Random
      for (let i = 0; i < 5; i++) {
        numbers.push(Math.floor(Math.random() * 100));
      }
      break;
    default:
      break;
  }
  return numbers;
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

app.get('/numbers/:id', (req, res) => {
  const { id } = req.params;
  const numbers = generateNumbers(id);
  windowPrevState = [...windowCurrState];
  windowCurrState = [...numbers];
  const avg = (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2);
  res.json({
    windowPrevState,
    windowCurrState,
    numbers,
    avg
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
