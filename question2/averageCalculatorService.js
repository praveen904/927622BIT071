const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = 3000;
const WINDOW_SIZE = 10;
const VALID_IDS = ['p', 'f', 'e', 'r'];


const windows = {
  p: [],
  f: [],
  e: [],
  r: []
};


async function fetchNumbers(numberid) {
    const res = await axios.get(`http://localhost:3000/numbers/${numberId}`);
  const urlMap = {
    p: 'http://20.244.56.144/evaluation-service/primes',
    f: 'http://20.244.56.144/evaluation-service/fibo',
    e: 'http://20.244.56.144/evaluation-service/even',
    r: 'http://20.244.56.144/evaluation-service/rand',
  };
  const url = urlMap[numberid];
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
  
  while (windowArr.length > WINDOW_SIZE) {
    windowArr.shift();
  }
  return windowArr;
}


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

 
  const fetchPromise = fetchNumbers(numberid);
  const timeoutPromise = new Promise(resolve => setTimeout(() => {
    timedOut = true;
    resolve([]);
  }, 500));

  numbers = await Promise.race([fetchPromise, timeoutPromise]);

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
