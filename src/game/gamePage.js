import './gamePage.css'
import Button from 'react-bootstrap/Button';
import React, {useContext, useState, useEffect} from 'react';
import {CountdownCircleTimer} from 'react-countdown-circle-timer';
import {SessionContext, WebSocketContext} from "../utils/sessions";
import {Link} from "react-router-dom";
import useSound from "use-sound";
import {throwOutFromExperiment} from "../utils/generalUtils";
import Modal from 'react-bootstrap/Modal';


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
    const [clickedYes, addClickYes] = useState(0);
    const [robotImgSrc, setImgSrc] = useState("radio-bot-animated.gif");
    const [loading, setLoading] = useState(false);
    const [loadingActivity, setLoadingAct] = useState("");
    const [robotAct, setRobotAct] = useState("Switching to robot's task")
    const [firstLoading, setFirst] = useState(0);

    /**
     * Send a help request after getting 60 or 85 classifications or notify when game ended
     */
    useEffect(() => {
        // if (score % 3 === 0) {
        //     setHelpRequest(true);
        // }
        if (score === 32) {
            setHelpRequest(true);
        }
        if (score === 57) {
            setHelpRequest(true);
        }
        if(score === 70){
            onCompleteGame();
        }

  }, [score]);

    useEffect(() => {
        let seconds;
        if (firstLoading === 1) { seconds = 15; }
        else if (firstLoading === 2) { seconds = 20; }
        if (loading) {
            for (let i=0; i<seconds; i++)
            setTimeout(() => setLoadingAct((seconds - i).toString()), 1000 * (i + 1));
        }
        setTimeout(() => {
            if (firstLoading === 1){
                setRobotAct("Switching back to your task");
                setLoadingAct("");
            }
            else if (firstLoading === 2){
                setRobotAct("Switching to the robot's task");
                setLoadingAct("");
            }
        }, (seconds + 1) * 1000);
    }, [firstLoading])


    const [play_right_sound] = useSound('/sounds/right.mp3');
    const [play_wrong_sound] = useSound('/sounds/wrong.mp3')

     let timer = null;

    const websocket = useContext(WebSocketContext);
    const {session, setSession} = useContext(SessionContext);
    if (session === undefined) {
        alert("Refreshing of a page caused session lost");
        throwOutFromExperiment();
    }
    const playerName = session ? session.name : undefined;

    /* Notify the server the game started */
    useEffect(() => websocket.send(JSON.stringify({"action": "start-game", "session": session})),
        [websocket, session]);

    /* Notify the server the user click yes to help */
    useEffect(() => {
        websocket.send(JSON.stringify({"action": "update-click-counter", "yes": clickedYes, "session": session}));
    }, [clickedYes, websocket, session]);


    /**
     * Get an image for the game from server
     * @param event - the info from server
     */
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

    const handleCLose = () => {
        setHelpRequest(false)
        setRobot("");
        setImgSrc("radio-bot-animated.gif");
    }

    /* Notify the server the game ended */
    const onCompleteGame = () => {
        websocket.send(JSON.stringify({"action": "complete-game", "session": session}));
        setCompleteGame(true);
    };

    const afterHelp = () => {
        return new Promise(() => {
            setRobot("Thank You!")
            setTimeout(() => setRobot("Robot is currently classifying pictures"), 21000);
            setLoading(true);
            setFirst(2);
            setTimeout(() => {setLoading(false)}, 21000);
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
            console.log("played sound")
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


    const onHelpAnswer = () => {
            setHelpRequest(false);
            setQuiz(true);
            setRobot("");
            //setImgSrc("");
            addClickYes(clickedYes + 1);
            setLoading(true);
            setFirst(1);
            setTimeout(() => {setLoading(false)}, 16000);
            websocket.send(JSON.stringify({"action": "get-bot-image", "session": session})); //maybe sync?
    }

    return (
        <div className={"content"}>
                <div className={"main-content"}>
                    {!isCompleteGame ?
                        <div className={"cls-page"}>
                            <div className={"cls-page-col-2"}>
                                <div className={"score-div"}>Correct classification: {score}</div>
                                <div className={"answers-left"}>{70 - score} pictures left</div>
                                <div className={"participants-view-div"}>
                                    <div className={"virtual-player-status-div"}>
                                        <Modal show={needsHelp}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>The robot needs help </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>I can't identify my image. Can you help me </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCLose}>
                                                    No
                                                </Button>
                                                <Button variant="primary" onClick={onHelpAnswer}>
                                                    Yes
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                    </div>
                                    <div>
                                        <div className={"robot-text"}> {robotRunning} </div>
                                        <img src={robotImgSrc} alt={"robot-pic"}/>
                                    </div>

                                </div>


                            </div>
                            {/*the main side of the window */}
                            <div className={"cls-page-col-1"}>
                                {loading ?
                                    <div className="loader-container">
                                        <div className={"list"}>
                                            <ul className={"list-spinner"}><div className="spinner"></div></ul>
                                            <ul>{robotAct}</ul>
                                            <ul className={"list-text"}>{loadingActivity}</ul>
                                        </div>
                                    </div> :
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

                                        </div>}
                                </div> }
                            </div>
                        </div> :
                        <div className={"complete-game-div"}><strong>Thank you! <br/>You've completed 70 correct
                            classifications.</strong>
                            <br/> Please continue to the feedback stage in order to successfully finish this Hit. <br/>
                            <div><Link to={'/feedback'}><Button onClick={onCompleteGame}
                                                                style={{
                                                                    "backgroundColor": "#1ab394",
                                                                    "borderColor": "#1ab394"
                                                                }}>Next</Button></Link>
                            </div>
                        </div>
                    }
                </div>
        </div>
    )
}
    export default GamePage;
