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
        Your task is to correctly classify 150 pictures of dogs and cats. At any given stage you will receive a
          picture and you will need to press the button with the correct classification according to your best judgement.<br/>
        To enrich our pile of annotated pictures, we also have a robot working on the same task in parallel
          (classifying a different set of pictures).<br/>
          <span
        style={{"fontWeight": "bold", "fontSize": "calc(1.2rem + .5vw)", "color": "red"}}> Notice! &nbsp;</span>
        From time to time the robot will probably have trouble correctly identifying if it is a dog or a cat in its
          picture. When this occurs, the robot might ask for your help. It is up to you decide if you want to help
          the robot (while helping you cannot progress with your own classification task).
          You will not get score for identify the robot's pictures.<br/> After you will finish classify all pictures,
          you will be needed to answer some feedback questions and then you will get your payment.
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