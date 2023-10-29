import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const App = () => {
  const [quotes, setQuotes] = useState([]);
console.log(quotes);
  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("quotes", (newQuotes) => {
      setQuotes(newQuotes);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Stock Quotes</h1>
      <ul>
        {quotes.map((quote, index) => (
          <li key={index}>
            <strong>Ticker:</strong> {quote.ticker},<strong> Price:</strong>{" "}
            {quote.price},<strong> Change:</strong> {quote.change},
            <strong> Change Percent:</strong> {quote.change_percent}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
