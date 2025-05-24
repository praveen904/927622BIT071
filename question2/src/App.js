import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const VALID_IDS = ['p', 'f', 'e', 'r'];

function App() {
  const [numberId, setNumberId] = useState('p');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setNumberId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/numbers/${numberId}`);
      setResponse(res.data);
    } catch (err) {
      setError('Failed to fetch data from microservice.');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h2>Average Calculator Microservice Client</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Number Type:
          <select value={numberId} onChange={handleChange}>
            <option value="p">Prime (p)</option>
            <option value="f">Fibonacci (f)</option>
            <option value="e">Even (e)</option>
            <option value="r">Random (r)</option>
          </select>
        </label>
        <button type="submit">Fetch & Calculate</button>
      </form>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {response && (
        <div className="response-box">
          <h4>Response</h4>
          <div><strong>windowPrevState:</strong> [{response.windowPrevState.join(', ')}]</div>
          <div><strong>windowCurrState:</strong> [{response.windowCurrState.join(', ')}]</div>
          <div><strong>numbers (from server):</strong> [{response.numbers.join(', ')}]</div>
          <div><strong>avg:</strong> {response.avg}</div>
        </div>
      )}
    </div>
  );
}

export default App;
