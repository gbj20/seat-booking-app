import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000")
      .then(res => res.text())
      .then(data => setMsg(data));
  }, []);

  return (
    <div>
      <h1>Seat Booking App</h1>
      <p>{msg}</p>
    </div>
  );
}

export default App;
