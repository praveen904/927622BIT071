import React, { useState } from 'react';
import axios from 'axios';

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
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Average Calculator Microservice Client</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <label>
          Number Type:
          <select value={numberId} onChange={handleChange} style={{ marginLeft: 10 }}>
            <option value="p">Prime (p)</option>
            <option value="f">Fibonacci (f)</option>
            <option value="e">Even (e)</option>
            <option value="r">Random (r)</option>
          </select>
        </label>
        <button type="submit" style={{ marginLeft: 15 }}>Fetch & Calculate</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {response && (
        <div style={{ background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
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
