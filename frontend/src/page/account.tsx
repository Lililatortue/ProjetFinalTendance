import { useState } from "react";

export default function AccountStats() {
    const [amount, setAmount] = useState("");

    const handleDeposit = () => {
        console.log(`Depositing: $${amount}`);
        // Logic to update balance via API/Socket
    };

    return (
        <div style={styles.statsContainer}>
            {/* Wallet Section */}
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Wallet</h3>
                <div style={styles.balanceBig}>$0.00</div>
                <div style={styles.depositRow}>
                    <input 
                        type="number" 
                        placeholder="Amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={styles.moneyInput}
                    />
                    <button onClick={handleDeposit} style={styles.addBtn}>
                        ADD MONEY
                    </button>
                </div>
            </div>

            {/* Statistics Section */}
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Stats</h3>
                <div style={styles.statsGrid}>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Total Bets</span>
                        <span style={styles.statValue}>0</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Total Won</span>
                        <span style={styles.statValue}>$0.00</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Win Rate</span>
                        <span style={styles.statValue}>0%</span>
                    </div>
                </div>
            </div>
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
        width: "320px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
    },
    title: { color: "#c0caf5", textAlign: "center", margin: "0 0 10px 0" },
    input: {
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #414868",
        background: "#1a1b26",
        color: "white",
        outline: "none"
    },
    button: {
        padding: "12px",
        borderRadius: "6px",
        border: "none",
        background: "#7aa2f7",
        color: "#1a1b26",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "10px"
    },
    link: {
        color: "#bb9af7",
        textAlign: "center",
        fontSize: "14px",
        textDecoration: "none",
        marginTop: "5px"
    },
    error: { color: "#f7768e", fontSize: "14px", textAlign: "center" }
};
