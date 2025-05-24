// averageCalculatorService.js
// Microservice for calculating average of numbers fetched from a third-party API
// Supports: prime (p), fibonacci (f), even (e), random (r)

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
const WINDOW_SIZE = 10;
const VALID_IDS = ['p', 'f', 'e', 'r'];

// In-memory storage for each number type
const windows = {
  p: [],
  f: [],
  e: [],
  r: []
};

// Helper to fetch numbers from third-party API
async function fetchNumbers(numberid) {
  // Use the correct numberid in the third-party API URL
  const url = `http://localhost:9876/numbers/${numberid}`;
  try {
    const response = await axios.get(url, { timeout: 500 });
    if (Array.isArray(response.data.numbers)) {
      return response.data.numbers;
    }
    return [];
  } catch (err) {
    return [];
  }
}

// Helper to update window with unique numbers, keeping only WINDOW_SIZE
function updateWindow(windowArr, newNumbers) {
  const set = new Set(windowArr);
  for (const num of newNumbers) {
    if (!set.has(num)) {
      windowArr.push(num);
      set.add(num);
      if (windowArr.length > WINDOW_SIZE) {
        windowArr.shift();
      }
    }
  }
  // If still over window size (in case of multiple new numbers), trim oldest
  while (windowArr.length > WINDOW_SIZE) {
    windowArr.shift();
  }
  return windowArr;
}

// Helper to calculate average
function calcAvg(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  if (!VALID_IDS.includes(numberid)) {
    return res.status(400).json({ error: 'Invalid number id' });
  }

  const prevWindow = [...windows[numberid]];
  let numbers = [];
  let timedOut = false;

  // Fetch numbers with 500ms timeout
  const fetchPromise = fetchNumbers(numberid);
  const timeoutPromise = new Promise(resolve => setTimeout(() => {
    timedOut = true;
    resolve([]);
  }, 500));

  numbers = await Promise.race([fetchPromise, timeoutPromise]);

  // Only update window if not timed out and numbers received
  if (!timedOut && numbers.length > 0) {
    windows[numberid] = updateWindow(windows[numberid], numbers);
  }

  const currWindow = [...windows[numberid]];
  const avg = currWindow.length === WINDOW_SIZE ? calcAvg(currWindow) : 0;

  res.json({
    windowPrevState: prevWindow,
    windowCurrState: currWindow,
    numbers,
    avg
  });
});

app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running on port ${PORT}`);
});
