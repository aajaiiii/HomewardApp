// SocketContext.js
import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection when the component mounts
    const socketInstance = io("http://localhost:5000"); // Replace with your actual server URL
    setSocket(socketInstance);

    // Cleanup the socket connection when the component unmounts
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
