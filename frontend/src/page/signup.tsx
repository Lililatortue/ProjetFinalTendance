import { useState } from "react";
import { Link } from "react-router-dom";



export default function Signup() {
      const [email, setEmail]    = useState("");
      const [psw  , setPassword] = useState("");
      const [uname, setUsername] = useState("");
      const [error, setError]    = useState("");

      const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();
            setError("");

            try {
                  const response = await fetch("http://localhost:3000/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, psw }),
                  });

                  const data = await response.json();

                  if (response.ok && data.token) {
                       
                  } else {
                        setError(data.message || "Login failed");
                  }
            } catch (err) {
                  setError("Cannot connect to the server");
            }
      };

      return (
            <div style={styles.container}>
                  <form onSubmit={handleSubmit} style={styles.form}>
                        <h2 style={styles.title}>Sign Up</h2>
        
                        {error && <p style={styles.error}>{error}</p>}

                        <input
                              type="email"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              style={styles.input}
                              required
                        />

                        <input
                              type="text"
                              placeholder="Username"
                              value={uname}
                              onChange={(e) => setUsername(e.target.value)}
                              style={styles.input}
                              required
                        />

                        <input
                              type="password"
                              placeholder="Password"
                              value={psw}
                              onChange={(e) => setPassword(e.target.value)}
                              style={styles.input}
                              required
                        />

                        <button type="submit" style={styles.button}>
                              Sign Up
                        </button>
                        <Link to="/login">I already have an account</Link>
                  </form>
            </div>
      );
}

const styles: Record<string, React.CSSProperties> = {
      container: {
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a1b26" 
      },
      form: {
            background: "#24283b",
            padding: "30px",
            borderRadius: "12px",
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "15px"
      },
      title: { color: "#c0caf5", textAlign: "center", margin: "0 0 10px 0" },
      input: {
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #414868",
            background: "#1a1b26",
            color: "white"
      },
      button: {
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            background: "#7aa2f7",
            color: "#1a1b26",
            fontWeight: "bold",
            cursor: "pointer"
      },
      error: { color: "#f7768e", fontSize: "14px", textAlign: "center" }
}

