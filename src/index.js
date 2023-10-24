import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import StarRating from './StarRating';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating message={['bad', 'good', 'very good'] } maxRating={3} color='blue'/> */}
  </React.StrictMode>
);

