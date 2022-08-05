import React from "react";


export const SessionContext = React.createContext({
  session: undefined,
  setSession: () => {}
});

export const WebSocketContext = React.createContext({
  websocket: undefined,
  setWebsocket: () => {}
});