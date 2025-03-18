import { useEffect, useState } from "react";

interface Message {
  type: string;
  content: string;
  user: string;
  timestamp: string;
  id: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState("Anonymous");
  const [room, setRoom] = useState("general");
  const [rooms, setRooms] = useState<string[]>([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const wsUrl = import.meta.env.VITE_WS_URL;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms");
        const data = await response.json();
        setRooms(data.rooms || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, [backendUrl]);

  useEffect(() => {
    const socket = new WebSocket(`/ws/${room}`);

    socket.onopen = () => console.log(`Connected to room: ${room}`);
    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      if (message.type === "message") {
        setMessages((prev) => [...prev, message]);
      } else if (message.type === "error") {
        console.error("WebSocket error:", message.content);
      }
    };
    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => {
      console.log(`Disconnected from room: ${room}`);
      setWs(null);
    };

    setWs(socket);
    return () => socket.close();
  }, [room, wsUrl]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (ws && input.trim()) {
      const message = { content: input.trim(), user: username };
      ws.send(JSON.stringify(message));
      setInput("");
    }
  };

  const changeRoom = (newRoom: string) => {
    setRoom(newRoom);
    setMessages([]);
  };

  // Rest of the JSX remains the same (omitted for brevity)
  return (
    <div className="chat-app">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Real-Time Chat</h1>
          <div className="room-selector">
            <select value={room} onChange={(e) => changeRoom(e.target.value)}>
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="username-input">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
            />
          </div>
        </div>
        <div className="messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.user === username ? "own-message" : ""
              }`}
            >
              <div className="message-content">
                <div className="message-user">{msg.user}</div>
                <div className="message-text">{msg.content}</div>
                <div className="message-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>

      <style>{`
        .chat-app {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .chat-container {
          width: 100%;
          max-width: 800px;
          height: 80vh;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          padding: 20px;
          background: white;
          border-bottom: 1px solid #eee;
          text-align: center;
        }

        .chat-header h1 {
          margin: 0;
          color: #2d3748;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .room-selector {
          margin-top: 10px;
        }

        .room-selector select {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
        }

        .username-input {
          margin-top: 10px;
        }

        .username-input input {
          width: 200px;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .username-input input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message {
          display: flex;
          margin-bottom: 8px;
          max-width: 80%;
        }

        .message.own-message {
          margin-left: auto;
          flex-direction: row-reverse;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 16px;
          background: #f7fafc;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .own-message .message-content {
          background: #667eea;
          color: white;
        }

        .message-user {
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 4px;
          color: #4a5568;
        }

        .own-message .message-user {
          color: rgba(255, 255, 255, 0.8);
        }

        .message-text {
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .message-timestamp {
          font-size: 0.7rem;
          color: #718096;
          margin-top: 4px;
        }

        .own-message .message-timestamp {
          color: rgba(255, 255, 255, 0.7);
        }

        .input-form {
          padding: 20px;
          background: white;
          border-top: 1px solid #eee;
          display: flex;
          gap: 12px;
        }

        .input-form input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .input-form input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .input-form button {
          padding: 12px 24px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .input-form button:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .input-form button:active {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .chat-container {
            height: 100vh;
            border-radius: 0;
          }

          .message {
            max-width: 90%;
          }
        }
      `}</style>
    </div>
  );
}
