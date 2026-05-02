import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ socket }: { socket: any }) {
      const [GameResult, setGameResult] = useState<boolean | null>(null);
      const [GameState, setGameState] = useState<string | null>(null);
      const [GameTimer, setGameTimer] = useState<number | null>(null);
      const [Amount, setAmount] = useState(0);

      const [playerChoice, setPlayerChoice] = useState<"HEADS"| "TAILS" | null>(null);

      const [messages, setMessages] = useState<{ user: string, text: string }[]>([]);
      const [inputValue, setInputValue] = useState("");
    
      const chatRef = useRef<HTMLDivElement>(null);
      const navigate = useNavigate()

      useEffect(() => {
            socket.on("state", (state: string) => setGameState(state));

            socket.on("ShowResult", (result: boolean) => {
                  setGameResult(result);
                  setAmount(0);
                  setPlayerChoice(null);
            });

            socket.on("betConfirmed", () => {
                  setAmount((prev) => prev + 10);
            });
        
            socket.on("timerUpdate", (data: { timeLeft: number }) => {
                  setGameTimer(data.timeLeft);
            });

            socket.on("newMessage", (msg: { user: string, text: string }) => {
                  setMessages((prev) => [...prev, msg]);
            });
            socket.on("error-token", () => {
                  console.error("Session expired or token invalid.");
                  navigate("/login");
            });
            return () => {
                  socket.off("state");
                  socket.off("ShowResult");
                  socket.off("betConfirmed");
                  socket.off("timerUpdate");
                  socket.off("newMessage");
            };
    }, [socket]);
    


      // Auto-scroll chat
      useEffect(() => {
            if (chatRef.current) {
                  chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
      }, [messages]);

      const isBettingDisable = GameState !== "betting";

      const handleSendMessage = () => {
            if (!inputValue.trim()) return;
            socket.emit("sendMessage", inputValue);
            setInputValue("");
      };
      const handleBet = (isHeads: boolean) => {
            socket.emit("placeBet", { side: isHeads, amount: 10 });
            setPlayerChoice(isHeads ? "HEADS" : "TAILS");
      };
      return (
            <div style={styles.pageWrapper}>
                  <div style={styles.mainContainer}>
                
                        {/* GAME SECTION */}
                        <div style={{ ...styles.card, flex: 2 }}>
                              <h1 style={styles.title}>Game Dashboard</h1>
                    
                              <div style={styles.statsRow}>
                                    <div style={styles.statBox}>
                                          <p style={styles.label}>LAST RESULT</p>
                                          <p style={{ ...styles.value, color: GameResult ? '#a6e3a1' : '#f38ba8' }}>
                                                {GameResult === null ? "---" : (GameResult ? "HEADS" : "TAILS")}</p>
                                    </div>
                                    <div style={styles.statBox}>
                                          <p style={styles.label}>TIME LEFT</p>
                                          <p style={styles.value}>{GameTimer ?? "0"}s</p>
                                    </div>
                                    <div style={styles.statBox}>
                                          <p style={styles.label}>YOUR BET</p>
                                          <p style={{ ...styles.value, color: '#f9e2af' }}>${Amount}</p>
                                          <p>{playerChoice}</p>
                                    </div>
                              </div>
                  
                              <div style={styles.bettingArea}>
                                    {/* HEADS BUTTON */}
                                    {(playerChoice === null || playerChoice === "HEADS") && (
                                    <button 
                                          style={{ 
                                                ...styles.betButton, 
                                                ...styles.heads, 
                                                flex: playerChoice === "HEADS" ? '0 1 100%' : '1', 
                                                opacity: isBettingDisable && playerChoice !== "HEADS" ? 0.5 : 1,
                                                border: playerChoice === "HEADS" ? '2px solid #fff' : 'none'
                                          }}
                                          disabled={isBettingDisable }
                                          onClick={() => handleBet(true)}>
                                          {playerChoice === "HEADS" ? "SELECTED HEADS" : "BET HEADS"}
                                    </button>
                                    )}

                                    {/* TAILS BUTTON */}
                                    {(playerChoice === null || playerChoice === "TAILS") && (
                                    <button 
                                          style={{ 
                                                ...styles.betButton, 
                                                ...styles.tails, 
                                                flex: playerChoice === "TAILS" ? '0 1 100%' : '1',
                                                opacity: isBettingDisable && playerChoice !== "TAILS" ? 0.5 : 1,
                                                border: playerChoice === "TAILS" ? '2px solid #fff' : 'none'
                                          }}
                                          disabled={isBettingDisable }
                                          onClick={() => handleBet(false)}>
                                          {playerChoice === "TAILS" ? "SELECTED TAILS" : "BET TAILS"}
                                    </button>
                                    )}
                              </div>
                        </div>
                        {/* CHAT SECTION */}
                        <div style={{ ...styles.card, flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <h2 style={styles.chatTitle}>Live Chat</h2>
                              <div ref={chatRef} style={styles.chatBox}>
                                    <p style={styles.systemMsg}><strong>System:</strong> Welcome to the arena!</p>
                                    {messages.map((m, i) => (
                                    <p key={i} style={styles.msg}>
                                          <strong style={{ color: '#cba6f7' }}>{m.user}:</strong> {m.text}
                                    </p>
                              ))}
                        </div>
                        <div style={styles.inputRow}>
                              <input 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Message..." 
                                    style={styles.input}
                              />
                              <button onClick={handleSendMessage} style={styles.sendBtn}>SEND</button>
                        </div>
                  </div>
            </div>    
            </div>
      );
}


const styles: Record<string, React.CSSProperties> = {
    pageWrapper: {
        backgroundColor: '#11111b',
        minHeight: '100vh',
        padding: '40px 20px',
        fontFamily: "'Inter', sans-serif",
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    card: {
        backgroundColor: '#1e1e2e',
        borderRadius: '16px',
        padding: '30px',
        border: '1px solid #313244',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    },
    title: { color: '#f5c2e7', fontSize: '28px', marginBottom: '30px', textAlign: 'center' },
    statsRow: {
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: '#181825',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '40px',
    },
    statBox: { textAlign: 'center' },
    label: { fontSize: '10px', color: '#7f849c', letterSpacing: '1px', marginBottom: '5px' },
    value: { fontSize: '24px', fontWeight: 'bold', color: '#cdd6f4', margin: 0 },
    bettingArea: { display: 'flex', gap: '15px', marginTop: '20px' },
    betButton: {
        flex: 1,
        padding: '18px',
        border: 'none',
        borderRadius: '10px',
        fontWeight: '900',
        cursor: 'pointer',
        transition: 'transform 0.1s',
    },
    heads: { backgroundColor: '#89b4fa', color: '#11111b' },
    tails: { backgroundColor: '#cba6f7', color: '#11111b' },
    warning: { color: '#f38ba8', textAlign: 'center', marginTop: '20px', fontSize: '12px', fontWeight: 'bold' },
    
    // Chat Styles
    chatTitle: { color: '#bac2de', fontSize: '18px', marginBottom: '15px' },
    chatBox: {
        flex: 1,
        backgroundColor: '#11111b',
        borderRadius: '8px',
        padding: '15px',
        overflowY: 'auto',
        maxHeight: '400px',
        marginBottom: '15px',
        border: '1px solid #313244',
    },
    msg: { fontSize: '14px', color: '#cdd6f4', margin: '5px 0' },
    systemMsg: { fontSize: '13px', color: '#a6adc8', fontStyle: 'italic' },
    inputRow: { display: 'flex', gap: '10px' },
    input: {
        flex: 1,
        backgroundColor: '#313244',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        color: '#cdd6f4',
        outline: 'none',
    },
    sendBtn: {
        backgroundColor: '#5865f2',
        color: 'white',
        border: 'none',
        padding: '0 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
    }
};
