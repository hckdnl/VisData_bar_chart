import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
import './App.css';

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
            .then(response => response.json())
            .then(data => setData(data.data));
    }, []);

    return (
      <div className="App">
          <div className="container">
              <h1 id="title">United States GDP</h1>
              {data.length > 0 ? <BarChart data={data} /> : <p>Loading...</p>}
              <h2 id="info">More Information: http://www.bea.gov/national/pdf/nipaguid.pdf</h2>
          </div>
      </div>
  );
}

export default App;
