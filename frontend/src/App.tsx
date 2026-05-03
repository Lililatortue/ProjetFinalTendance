import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";

// Component Imports
import Dashboard from "./page/dashboard";
import Login from "./page/login";
import Signup from './page/signup';
import Account from "./page/account";

// Initialize socket outside component to prevent multiple instances
const socket = io("http://localhost:3000", { 
    autoConnect: false,
    extraHeaders: {
        authorization: localStorage.getItem("token") || ""
    }
});

export default function App() {
    const [isConnected, setIsConnected] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate(); // Added this

    const connectSocket = (token: string) => { 
            if (socket.connected) return;
            console.log("try to connect to socket");
            socket.connect();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        socket.disconnect();
        setIsConnected(false);
        navigate("/login");
    };

    useEffect(() => {
            const token = localStorage.getItem("token");

            if (!token) {
                  setIsChecking(false);
                  return;
            }
            connectSocket(token);

        socket.on("connect", () => {
            console.log("Socket connected!");
            setIsConnected(true);
            setIsChecking(false);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection failed:", err.message);
            setIsConnected(false);
            setIsChecking(false);
        });
            const timeout = setTimeout(() => {
                  setIsChecking(false);
            }, 3000);

        return () => {
            socket.off("connect");
            socket.off("connect_error");
            clearTimeout(timeout)
        };
    }, []);

    if (isChecking) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Loading Arena...</div>;
    }

    return (
        <div className="app-container" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#11111b' }}>
            
            {/* Show Header only if connected */}
            {isConnected && (
                <header style={styles.headerBar}>
                    <div style={styles.logoSection}>
                        <span style={styles.logoIcon}>🪙</span>
                        <h2 style={styles.logoText}>COINFLIP ARENA</h2>
                    </div>
            
                    <div style={styles.userSection}>
                        <div style={styles.balanceTag}>$0.00</div>
                        <button onClick={() => navigate('/account')} style={styles.accountBtn}>
                            ACCOUNT
                        </button>
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            LOGOUT
                        </button>
                    </div>
                </header>
            )}

            <Routes>
<Route 
    path="/dashboard" 
    element={localStorage.getItem("token") ? <Dashboard socket={socket} /> : <Navigate to="/login" />} 
/>
                <Route path="/login"  element={<Login onLoginSuccess={connectSocket}/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/account" element={<Account />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<div style={{color: 'white'}}>Page Not Found</div>} />
            </Routes>
        </div>
    );
}

const styles = {
    headerBar: {
        height: '60px',
        backgroundColor: '#181825',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        borderBottom: '1px solid #313244',
    },
    logoSection: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoIcon: { fontSize: '1.5rem' },
    logoText: { color: '#cba6f7', fontSize: '1.1rem', margin: 0 },
    userSection: { display: 'flex', gap: '15px', alignItems: 'center' },
    balanceTag: { color: '#a6e3a1', fontWeight: 'bold', backgroundColor: '#313244', padding: '4px 10px', borderRadius: '15px' },
    accountBtn: { backgroundColor: '#45475a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' },
    logoutBtn: { backgroundColor: 'transparent', color: '#f38ba8', border: '1px solid #f38ba8', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' },
};
