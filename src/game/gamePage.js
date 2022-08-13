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
    const [helpFirst, setHelpFirst] = useState({playerName: "", duration: 0});
    const [players, setPlayers] = useState([]);
    const [isCompleteGame, setCompleteGame] = useState(false);
    const [helpedPlayer, setHelpedPlayer] = useState({playerName: "", duration: ""});
    const [nextHelpedPlayer, setNextHelpedPlayer] = useState({playerName: "", duration: 0});
    const [nonBlockedPlayersNeedHelp, setNonBlockedPlayersNeedHelp] = useState(new Set());
    const [blockedPlayers, setBlockedPlayers] = useState(new Set());
    const [playerGetHelp, setPlayerGetHelp] = useState(null);
    const [nextPlayerGetHelp, setNextPlayerGetHelp] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [imageTag, setImageTag] = useState(null);
    const [score, setScore] = useState(0);
    const [virtualHelperAway, setVirtualHelperAway] = useState(false);
    const [virtualHelperOnHisWay, setVirtualHelperOnHisWay] = useState(false);
    const [waitForImage, setWaitForImage] = useState(false);
    const [needsHelp, setHelpRequest] = useState(false);
    const [robotQuiz, setQuiz] = useState(false);
    const [robotRunning, setRobot] = useState("The robot is running too");
    const [wantToHelp, setWant] = useState(true);

    useEffect(() => {
    let rand = Math.floor(Math.random() * 11) * 30000; {/* 1,000 is 1 second. rand is a number between 1/2 minute to 5 minutes */}
    setTimeout(() => {
      if (!needsHelp && !robotQuiz && wantToHelp) {
        setHelpRequest(true);
      }
    }, 15000); // debug - to chang to rand
  })
    const [play_right_sound] = useSound('/sounds/right.mp3');
    const [play_wrong_sound] = useSound('/sounds/wrong.mp3')

    const gameDurationSec = 420;
    let timer = null;

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
        if(data.type === "get-image") {
            setImageSrc("data:image/png;base64, " + data.image);
            setImageTag(data.tag);
        }
    }

    //     switch (data.type) {
    //         case "set-players":
    //             setPlayers(data.players);
    //             const otherPlayersName = data.players.filter(p => p !== playerName);
    //             session.otherPlayersName = otherPlayersName;
    //             setSession(session);
    //             break;
    //         case "player-task":
    //             if (data.task_type === "blocking") {
    //                 setBlockedPlayers(new Set([...blockedPlayers, data.player]));
    //                 if (blockedPlayers.size > 1) {
    //
    //                 }
    //             }
    //             if (data.task_type === "non-blocking")
    //                 setNonBlockedPlayersNeedHelp(new Set([...nonBlockedPlayersNeedHelp, data.player]));
    //             break;
    //         case "free-player":
    //             const newBlockedPlayers = [...blockedPlayers].filter(p => p !== data.player)
    //             setBlockedPlayers(new Set(newBlockedPlayers));
    //             if (data.player === playerName) {
    //                 clearTimeout(timer);
    //             }
    //             const newNonBlockedPlayersNeedHelp = [...nonBlockedPlayersNeedHelp].filter(p => p !== data.player)
    //             setNonBlockedPlayersNeedHelp(new Set(newNonBlockedPlayersNeedHelp));
    //             setPlayerGetHelp(null);
    //             console.log("next helped player is: " + nonBlockedPlayersNeedHelp.size);
    //             if (nonBlockedPlayersNeedHelp.size === 0) {
    //                 //if none of the players is blocked, send the ViPer away.
    //                 setNextHelpedPlayer(null);
    //             }
    //             if (blockedPlayers.size === 0) {
    //                 setVirtualHelperAway(true);
    //
    //             }
    //             console.log("Freed player:" + data.player)
    //             console.log("number of blocked players need help: " + nonBlockedPlayersNeedHelp.size)
    //             break;
    //         case "player-get-help":
    //             setHelpedPlayer({'playerName': data.player, 'duration': data.duration});
    //             setPlayerGetHelp(data.player);
    //             break;
    //         case "next-player-get-help":
    //             setNextPlayerGetHelp(data.player);
    //             setNextHelpedPlayer({'playerName': data.player, 'duration': data.duration});
    //             break;
    //         case "get-image":
    //             setImageSrc("data:image/png;base64, " + data.image);
    //             setImageTag(data.tag);
    //             break;
    //         case "virtual-helper-away":
    //             setVirtualHelperAway(true);
    //             setVirtualHelperOnHisWay(false);
    //             break;
    //         case "virtual-helper-back":
    //             setVirtualHelperAway(false);
    //             setVirtualHelperOnHisWay(false);
    //             break;
    //         case "viper_about_to_help":
    //             console.log(blockedPlayers.size)
    //             if (blockedPlayers.size === 2) {
    //                 setVirtualHelperOnHisWay(true);
    //                 setHelpFirst({'playerName': data.player, 'duration': data.duration});
    //             }
    //         default:
    //             console.error("Unsupported Event");
    //     }
    // }
    // ;

    const onCompleteGame = () => {
        websocket.send(JSON.stringify({"action": "complete-game", "session": session}));
        setCompleteGame(true);
    };

    const afterHelp = () => {
        return new Promise(() => {
            setRobot("Thank You!")
            setTimeout(() => setRobot("The robot is running too"), 5000);
        })
    }

    const onTagButton = async (playerTag, event) => {
        if (event === "robot") {
            setQuiz(false);
            await afterHelp();
            return;
        }
        if (playerTag === imageTag) {
            setScore(score + 1);
            play_right_sound();
        } else {
            play_wrong_sound();
        }
        setWaitForImage(true);
        websocket.send(JSON.stringify({"action": "get-new-image", "session": session}));
        let millisecondsToNextImage = 2000;
        if (nonBlockedPlayersNeedHelp.has(playerName)) {
            millisecondsToNextImage = 5000;
        }
        timer = setTimeout(() => setWaitForImage(false), millisecondsToNextImage);
    }

    const onHelpAnswer = (answer) => {
        if (answer === "Yes") {
            setHelpRequest(false);
            setQuiz(true);
        } else {
            setWant(false);
            setHelpRequest(false);
            setRobot("I need help");
            // set timer to ask again
            // setTimeout(() => {
            //     // add a second request
            //
            // }, 15000);
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
                                    {needsHelp ?
                                        <div>
                                            <div className={"asked-for-help"}>I need help. Can you help me?</div>
                                            <Button className={"help-button"}
                                                    onClick={() => onHelpAnswer("Yes")}> Yes </Button>
                                            <Button className={"help-button"}
                                                    onClick={() => onHelpAnswer("No")}> No </Button>
                                        </div> :
                                        <div>
                                            <div> {robotRunning} </div>
                                            <img src={"radio-bot-animated.gif"} alt={"robot-pic"}/>
                                        </div>
                                    }
                                </div>


                            </div>
                        </div>
                        {/*the main side of the window - need to make changed */}
                        <div className={"cls-page-col-1"}>
                            <div>
                                {robotQuiz ?
                                    <div>
                                        <h1>The Robot Quiz</h1>
                                        <h2>Please classify the following image</h2>
                                        <div>
                                            <img className={"img-to-cls"} src={imageSrc} alt="pet"/>
                                            <div>
                                                <Button style={{
                                                    "backgroundColor": "sandybrown",
                                                    "borderColor": "sandybrown"
                                                }}
                                                        className={"class-btn"}
                                                        onClick={() => onTagButton('Cat', "robot")}>Cat</Button>
                                                <Button style={{
                                                    "backgroundColor": "cornflowerblue",
                                                    "borderColor": "cornflowerblue"
                                                }}
                                                        className={"class-btn"}
                                                        onClick={() => onTagButton('Dog', "robot")}>Dog</Button>
                                            </div>
                                        </div>

                                    </div> :
                                    <div>
                                        <h1>Please classify the following image</h1>
                                        <div style={{"color": "red", "lineHeight": "0.2"}} className={"error-div"}
                                             hidden={!nonBlockedPlayersNeedHelp.has(playerName)}>
                                            There is a latency in loading images
                                            <img className={"td-item"} src={"red-snail-icon.png"} alt={"red-snail"}
                                                 width={"30px"}
                                                 height={"30px"}/>
                                            <br/>ViPer will take care of that!
                                        </div>
                                        <div>
                                            <img className={"img-to-cls"} src={imageSrc} alt="pet"/>
                                            <div>
                                                <Button style={{
                                                    "backgroundColor": "sandybrown",
                                                    "borderColor": "sandybrown"
                                                }}
                                                        className={"class-btn"}
                                                        onClick={() => onTagButton('Cat', "user")}>Cat</Button>
                                                <Button style={{
                                                    "backgroundColor": "cornflowerblue",
                                                    "borderColor": "cornflowerblue"
                                                }}
                                                        className={"class-btn"}
                                                        onClick={() => onTagButton('Dog', "user")}>Dog</Button>
                                            </div>
                                        </div>

                                    </div> }
                                {/* the end of the main part of the page */}
                            </div>
                        </div>
                    </div> :
                    <div className={"complete-game-div"}>Complete Game <br/>You got {score} correct classifications!
                        <br/> Please continue to the final part of the experiment and you will receive your bonus
                        shortly
                        <div><Link to={'/feedback'}><Button
                            style={{"backgroundColor": "#1ab394", "borderColor": "#1ab394"}}>Next</Button></Link>
                        </div>
                    </div>
            }
        </div>
    )
}
    export default GamePage;
