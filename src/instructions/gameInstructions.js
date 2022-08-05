import './gameInstructions.css';
import Button from "react-bootstrap/Button";
import {useHistory} from "react-router-dom";
import React, {useState} from 'react';
import PageTimeTracker from "../utils/pageTimeTracker";

function GameInstructions() {
  const history = useHistory();
  const [partIdx, setPastIdx] = useState(0);

  const onClickNext = () => {
    if (partIdx === 2) {
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
      <h2 className={"app-heading-h2"} style={{"marginBottom": "20px"}}>About our experiment</h2>
      <p className={"instruction-passage"} hidden={partIdx !== 0}>
        <h5 style={{"color": "#db1111"}}>Please take good care, there will be an attention quiz later on!</h5>
        Your task is to classify dogs and cats pictures. At any given stage you will receive a picture of a dog or a cat
        - and you will need to press the button with the correct classification according to your best judgement.
        Your goal is to classify correctly as many images as possible in 7 minutes.
        While you are answering this quiz, a robot is programed to answer this quiz too, but there is no competition
          between you two.
         The robot job ????
        {/*<strong> more correct classifications you accumulate, the greater is your bonus!</strong>*/}
        
      </p>
      <p className={"instruction-passage"} hidden={partIdx !== 1}><span
        style={{"fontWeight": "bold", "fontSize": "calc(1.2rem + .5vw)", "color": "red"}}>Notice! &nbsp;</span>
        From time to time the robot will probably have trouble identify if the picture present a dog or a cat. When
          it occurs, the robot will ask for help.
        <strong> Please note that the robot is not able to continue the quiz without help. </strong>

      </p>
      <p className={"instruction-passage"} hidden={partIdx !== 2}>
        Our long-term goal is to come up with a way that robots can ask for help and humans will assist them in cases
        they can't fix by themself. For example, how to get somewhere, or use human intelligent. For that sake, we need
        to check at first the amount of people who want to help a robot. Eventually we wish to find a good way that a robot
         will definitely get help from people when required.
        <span>  After the task will end, we would like you to give us your honest opinion about what tou thought during
          the quiz.</span>
        <span><strong>Please don't refresh the page at any stage till the end of the task. </strong>
        Refreshing the page will terminate your session in the experiment, and you will not able to proceed and get paid.</span>
      </p>
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