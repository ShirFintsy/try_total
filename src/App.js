import './App.css';
import GamePage from './game/gamePage';
import Intro from './intro';
import {Route} from "react-router-dom";
import React, {useState} from "react";
import Login from "./login/login";
import {SessionContext, WebSocketContext} from "./utils/sessions";
import UserFeedbackPage from "./feedback/userFeedbackPage";
import Tutorial from "./instructions/tutorial";
import AwarenessQuiz from "./instructions/awarenessQuiz";
import GameInstructions from "./instructions/gameInstructions";
import ConfigData from "./config.json";


function App() {
  const [session, setSession] = useState(undefined);
  const sessionValue = {session, setSession};

  const websocket = new WebSocket('ws://' + ConfigData.SERVER_IP +':' + ConfigData.WEB_SOCKET_PORT);
  return (
    <SessionContext.Provider value={sessionValue}>
      <WebSocketContext.Provider value={websocket}>
        <div className="App">
          <Route exact path={"/"}><Intro/></Route>
          <Route path={"/about"}><GameInstructions/></Route>
          <Route path={"/tutorial"}><Tutorial/></Route>
          <Route path={"/quiz"}><AwarenessQuiz/></Route>
          <Route path={"/game"}><GamePage/></Route>
          <Route path={"/login"} component={Login}/>
          <Route path={'/feedback'}><UserFeedbackPage/></Route>
        </div>
      </WebSocketContext.Provider>
    </SessionContext.Provider>
  );
}

export default App;
