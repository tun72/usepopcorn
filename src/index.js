import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import StarRating from './StarRating';
import App from './App.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating size={28} maxRating={10} color='blue'/> */}
  </React.StrictMode>
);

