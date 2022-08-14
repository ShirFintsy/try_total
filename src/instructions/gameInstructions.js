import './gameInstructions.css';
import Button from "react-bootstrap/Button";
import {useHistory} from "react-router-dom";
import React, {useState} from 'react';
import PageTimeTracker from "../utils/pageTimeTracker";

function GameInstructions() {
  const history = useHistory();
  const [partIdx, setPastIdx] = useState(0);

  const onClickNext = () => {
    if (partIdx === 0) {
      history.push("/tutorial");
    } else {
      setPastIdx(partIdx + 1);
    }
  }

  const onClickPrev = () => {
    setPastIdx(partIdx - 1);
  }

  return (
    <div className={"about-div"}>
      <h2 className={"app-heading-h2"} style={{"marginBottom": "20px"}}>About the task</h2>
      <p className={"instruction-passage"} hidden={partIdx !== 0}>
        <h5 style={{"color": "#db1111"}}>Please take good care, -there will be an attention quiz later on!</h5>
        Your task is to correctly classify dogs and cats pictures in 7 minutes. At any given stage you will receive a
          picture and you will need to press the button with the correct classification according to your best judgement.
      <strong>THE NUMBER OF CORRECT CLASSIFICATIONS YOU HAVE MADE WILL DETERMINE YOUR BONUS IN THIS TASK.</strong>
        To enrich our pile of annotated pictures, we also have a robot working on the same task in parallel
          (classifying a different set of pictures).
          <span
        style={{"fontWeight": "bold", "fontSize": "calc(1.2rem + .5vw)", "color": "red"}}> Notice! &nbsp;</span>
        From time to time the robot will probably have trouble correctly identifying if it is a dog or a cat in its
          picture. When this occurs, the robot might ask for your help. It is up to you decide if you want to help
          the robot (as the clock is ticking and while helping you cannot progress with your own classification task).
        <strong> Please note that the robot is not able to continue the quiz without help. </strong>
        
      </p>
      {/*<p className={"instruction-passage"} hidden={partIdx !== 1}>*/}

      {/*</p>*/}
      {/*<p className={"instruction-passage"} hidden={partIdx !== 1}>*/}
      {/*  Our long-term goal is to come up with a way that robots can ask for help and humans will assist them in cases*/}
      {/*  they can't solve by themself. For example, how to get somewhere, overcome an obstacle or use human intelligent.*/}
      {/*    For that sake, the first step is to check if humans want to help to a robot and the amount of people who do*/}
      {/*    this. Eventually we wish to find a good way that a robot will definitely get help from people when required.*/}
      {/*  <span>  After the task will end, we would like you to give us your honest opinion about what you thought during*/}
      {/*    the quiz. The feedback will help us draw conclusions. </span>*/}
      {/*  <span><strong>Please don't refresh the page at any stage till the end of the task. </strong>*/}
      {/*  Refreshing the page will terminate your session in the experiment, and you will not be able to proceed and get paid.</span>*/}
      {/*</p>*/}
      <div className={"nav-btn-div"}>
        <Button hidden={partIdx === 0} onClick={onClickPrev}
                style={{"backgroundColor": "#1ab394", "borderColor": "#1ab394"}}>Back</Button>
        <Button onClick={onClickNext} style={{"backgroundColor": "#1ab394", "borderColor": "#1ab394"}}>Next</Button>
      </div>
      <PageTimeTracker pageName="gameInstructions"/>
    </div>
  )
}

export default GameInstructions;