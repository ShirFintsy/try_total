import './gamePage.css'
import Button from 'react-bootstrap/Button';
import React, {useContext, useState, useEffect} from 'react';
import {CountdownCircleTimer} from 'react-countdown-circle-timer';
import {SessionContext, WebSocketContext} from "../utils/sessions";
import {Link} from "react-router-dom";
import useSound from "use-sound";
import {throwOutFromExperiment} from "../utils/generalUtils";


function GamePage() {
    const [isCompleteGame, setCompleteGame] = useState(false);
    const [nonBlockedPlayersNeedHelp, setNonBlockedPlayersNeedHelp] = useState(new Set());
    const [imageSrc, setImageSrc] = useState(null);
    const [imageTag, setImageTag] = useState(null);
    const [botImageSrc, setBotImageSrc] = useState(null);
    const [score, setScore] = useState(0);
    const [waitForImage, setWaitForImage] = useState(false);
    const [needsHelp, setHelpRequest] = useState(false);
    const [robotQuiz, setQuiz] = useState(false);
    const [robotRunning, setRobot] = useState("Robot is currently classifying pictures");
    const [flag, setFlag] = useState("");
    const [count, setCount] = useState(0);
    const [clickedYes, addClickYes] = useState(0);

    useEffect(() => {
        let time = [50000, 50000, 30000, 75000, 90000];
           setTimeout(() => {
                if (!robotQuiz && !needsHelp) {
                    setHelpRequest(true);
                    setCount(count + 1);
                }
            }, time[count]);
  }, [flag]);

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
        else if(data.type === "get-bot-image") {
            setBotImageSrc("data:image/png;base64, " + data.image);
        }
    }

    const onCompleteGame = () => {
        websocket.send(JSON.stringify({"action": "complete-game", "session": session, "yes": clickedYes}));
        setCompleteGame(true);
    };

    const afterHelp = () => {
        return new Promise(() => {
            setRobot("Thank You!")

            if (flag===""){ // for rerender useEffect
                setFlag("   ");
            } else {
                setFlag("");
            }

            setTimeout(() => setRobot("Robot is currently classifying pictures"), 5000);
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


    const onHelpAnswer = async (answer) => {
        if (answer === "Yes") {
            setHelpRequest(false);
            setQuiz(true);
            setRobot("");
            addClickYes(clickedYes+1);
            websocket.send(JSON.stringify({"action": "get-bot-image", "session": session}));
        } else {
            setHelpRequest(false);
            setRobot("Please I'm stuck");
            // set timer to ask again
            setTimeout(() => {
                setHelpRequest(true);
            }, 5000);
        }
    }

    const getBonus = () => {
        let bonus = (score / 30) * 0.2 ;{/* for every 30 point we get 0.2 dollars */}
        bonus.toFixed(2);
        return bonus;
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
                                            <div> {flag}</div>
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
                                    <div className={"robot-quiz"}>
                                        <h1>The Robot Quiz</h1>
                                        <h2>Please classify the following image</h2>
                                        <div>
                                            <img className={"img-to-cls"} src={botImageSrc} alt="pet"/>
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
                                            {/*There is a latency in loading images*/}
                                            {/*<img className={"td-item"} src={"red-snail-icon.png"} alt={"red-snail"}*/}
                                            {/*     width={"30px"}*/}
                                            {/*     height={"30px"}/>*/}
                                            {/*<br/>ViPer will take care of that!*/}
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
                    <div className={"complete-game-div"}><strong>Complete Game <br/>You got {score} correct
                        classifications!</strong>
                        <br/> Please continue to the final part of the experiment and you will receive your bonus
                        shortly. <br/> Your bonus is {getBonus().toFixed(2)} $.
                        <div><Link to={'/feedback'} ><Button
                            style={{"backgroundColor": "#1ab394", "borderColor": "#1ab394"}}>Next</Button></Link>
                        </div>
                    </div>
            }
        </div>
    )
}
    export default GamePage;
