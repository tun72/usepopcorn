// ``

import { useEffect, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState(0);
  const [isLoading, setIsloading] = useState(false);



  function handelAddAmount(amount) {
    if (isNaN(amount)) return;
    setAmount(Number(amount));
  }

  useEffect(
    function () {
      async function calculate() {
        try {
          setIsloading(true);
          const request = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
           
          );
          const data = await request.json();

          const rate = data.rates;
          setResult(rate?.[`${to}`]);
          setIsloading(false);
        } catch (err) {
        } finally {
          setIsloading(false);
        }
      }

      calculate();
      
    },
    [amount, from, to]
  );
  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => handelAddAmount(e.target.value)}
      />
      <select
        value={from}
        onChange={(e) => {
          setFrom(e.target.value);
        }}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="MMR">MMR</option>
      </select>
      <select
        value={to}
        onChange={(e) => {
          setTo(e.target.value);
        }}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="MMR">MMR</option>
      </select>
      {isLoading ? (
        <p>loading...</p>
      ) : (
        <p>
          {result} {to}
        </p>
      )}
    </div>
  );
}
