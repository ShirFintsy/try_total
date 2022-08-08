import './gamePage.css'
import Button from 'react-bootstrap/Button';
import React, {useContext, useState, useEffect} from 'react';
import {CountdownCircleTimer} from 'react-countdown-circle-timer';
import ParticipantsView from "./participantsView";
import {SessionContext, WebSocketContext} from "../utils/sessions";
import {Link} from "react-router-dom";
import useSound from "use-sound";
import {throwOutFromExperiment} from "../utils/generalUtils";


function GamePage() {
  const [players, setPlayers] = useState([]);
  const [isCompleteGame, setCompleteGame] = useState(false);
  const [blockedPlayers, setBlockedPlayers] = useState(new Set());
  const [playerGetHelp, setPlayerGetHelp] = useState(null);
  const [nextPlayerGetHelp, setNextPlayerGetHelp] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageTag, setImageTag] = useState(null);
  const [score, setScore] = useState(0);
  const [virtualHelperAway, setVirtualHelperAway] = useState(false);
  const [waitForImage, setWaitForImage] = useState(false);
  const [needsHelp, setHelpRequest] = useState(true); // true for debug - change for false

  useEffect(() => {
    let rand = Math.random() * 1000 + 20000;
    const reqTimer = setTimeout(() => {
      if (!needsHelp) {
        setHelpRequest(true);
      }
    }, rand);
  })

  const [play_right_sound] = useSound('/sounds/right.mp3');
  const [play_wrong_sound] = useSound('/sounds/wrong.mp3')

  const gameDurationSec = 420;

  const websocket = useContext(WebSocketContext);
  const {session, setSession} = useContext(SessionContext);
  if (session === undefined) {
    alert("Refreshing of a page caused session lost");
    throwOutFromExperiment();
  }
  const playerName = session ? session.name : undefined;

  useEffect(() => websocket.send(JSON.stringify({"action": "start-game", "session": session})),
    [websocket, session]);

  useEffect(() => {
    websocket.send(JSON.stringify({"action": "update-score", "score": score, "session": session}));
  }, [score, websocket, session]);


  websocket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case "set-players":
        setPlayers(data.players);
        const otherPlayersName = data.players.filter(p => p !== playerName);
        session.otherPlayersName = otherPlayersName;
        setSession(session);
        break;
      case "block-player":
        setBlockedPlayers(new Set([...blockedPlayers, data.player]));
        break;
      case "free-player":
        const newBlockedPlayers = [...blockedPlayers].filter(p => p !== data.player)
        setBlockedPlayers(new Set(newBlockedPlayers));
        setPlayerGetHelp(null);
        break;
      case "player-get-help":
        setPlayerGetHelp(data.player);
        break;
      case "next-player-get-help":
        setNextPlayerGetHelp(data.player);
        break;
      case "get-image":
        setImageSrc("data:image/png;base64, " + data.image);
        setImageTag(data.tag);
        break;
      case "virtual-helper-away":
        setVirtualHelperAway(true);
        break;
      case "virtual-helper-back":
        setVirtualHelperAway(false);
        break;
      default:
        console.error("Unsupported Event");
    }
  };

  const onCompleteGame = () => {
    websocket.send(JSON.stringify({"action": "complete-game", "session": session}));
    setCompleteGame(true);
  };

  const onTagButton = (playerTag) => {
    if (playerTag === imageTag) {
      setScore(score + 1);
      play_right_sound();
    } else {
      play_wrong_sound();
    }
    setWaitForImage(true);
    websocket.send(JSON.stringify({"action": "get-new-image", "session": session}));
    setTimeout(() => setWaitForImage(false), 3000);
  }

  const onHelpAnswer = (answer) => {
    //1. remove the help request - change the needsHelp value
    setHelpRequest(false);
    if (answer === "Yes") {
      //2. set the component of help request
    } else {
      //2. set timer to ask again
      setTimeout(() => {
        // add a second request
      }, 15000)
    }
  }


  return (
    <div>
      {
        !isCompleteGame ?
          <div className={"cls-page"}>
            <div className={"cls-page-col-2"}>
              <div className={"countdown-timer"}>
                <CountdownCircleTimer isPlaying duration={gameDurationSec} size={100}
                                      colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000', 0.33]]}
                                      onComplete={onCompleteGame}
                >
                  {/*show the time that left: */}
                  {({remainingTime}) => {
                    const minutes = Math.floor(remainingTime / 60)
                    const seconds = remainingTime % 60
                    return `${minutes}:${seconds}`
                  }}
                </CountdownCircleTimer>
              </div>
              <div className={"score-div"}>Correct answers: {score}</div>
              <div className={"participants-view-div"}>
                <div className={"virtual-player-status-div"}>

                  <div className={"robot-help"}>

                    {needsHelp ?
                        <div>
                          <div className={"asked-for-help"}>I need help. Can you help me?</div>
                          <Button className={"did-help"} onClick={() => onHelpAnswer("Yes")}>Yes</Button>
                          <Button className={"didnt-help"} onClick={() => onHelpAnswer("No")}>No</Button>
                        </div> :
                        <div> The robot is runnig too {/* need to change this sentence to picture and other sentence */}</div>
                    }
                  </div>
                  {/*{virtualHelperAway ?*/}
                  {/*  <span style={{"color": "brown"}}>ViPer is away</span>*/}
                  {/*  : (*/}
                  {/*    <span>*/}
                  {/*      {playerGetHelp ?*/}
                  {/*        <span style={{"color": "green"}}>ViPer is helping {playerGetHelp}</span> :*/}
                  {/*        <span style={{"color": "green"}}>ViPer is available</span>*/}
                  {/*      }*/}
                  {/*      {nextPlayerGetHelp ?*/}
                  {/*        <div style={{"color": "green", "fontSize": "smaller"}}>next*/}
                  {/*          helping {nextPlayerGetHelp}</div> : ""*/}
                  {/*      }*/}
                  {/*    </span>*/}
                  {/*  )*/}
                  {/*}*/}
                </div>
                {/* the participant view is the names in the side */}
                {/*<ParticipantsView players={players} thisPlayer={playerName}*/}
                {/*                  playerGettingHelp={playerGetHelp}*/}
                {/*                  blockedPlayers={blockedPlayers}/>*/}
              </div>
            </div>
            <div className={"cls-page-col-1"}>
              {blockedPlayers.has(playerName) ?
                <div className={"blocked-div"}>
                  Error loading images<br/>
                  ViPer will take care of that! <br/>
                  <img src={"error-icon.png"} alt={"error"}/>
                </div> :
                <div>
                  <h1>Please classify the following image</h1>
                  {
                    waitForImage ?
                      <div className={"loading-div"}>loading image
                        <div className={"loader"}/>
                      </div> :
                      <div>
                        <img className={"img-to-cls"} src={imageSrc} alt="pet"/>
                        <div>
                          <Button style={{"backgroundColor": "sandybrown", "borderColor": "sandybrown"}}
                                  className={"class-btn"} onClick={() => onTagButton('Cat')}>Cat</Button>
                          <Button style={{"backgroundColor": "cornflowerblue", "borderColor": "cornflowerblue"}}
                                  className={"class-btn"} onClick={() => onTagButton('Dog')}>Dog</Button>
                        </div>
                      </div>
                  }
                </div>
              }
            </div>
            {/* end of 7 minute: */}
          </div> :
          <div className={"complete-game-div"}>Complete Game <br/>You got {score} correct classifications!
            <br/> Please continue to the final part of the experiment and you will receive your bonus shortly
            <div><Link to={'/feedback'}><Button
              style={{"backgroundColor": "#1ab394", "borderColor": "#1ab394"}}>Next</Button></Link></div>
          </div>
      }
    </div>
  );
}

export default GamePage;
