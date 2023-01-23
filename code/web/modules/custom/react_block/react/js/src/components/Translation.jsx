import React from "react";

export default function Translation({ doStuff, setInput, result }) {
  return (
    <div>
      <textarea  style={{color: "white", background: "black"}}
        className="text-area bg-dark "
        cols={55}
        rows={10}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <button className="action-btn" onClick={doStuff}>
        Ask your bot
      </button>

      <h3 className="result-text">{result.length > 0 ? result : ""}</h3>
    </div>
  );
}
