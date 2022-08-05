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
        We'll ask you to classify dogs and cats pictures.
        At any given stage you will receive a picture of a dog or a cat - and you will need to press on the button with
        the correct classification according to your best judgement. <br/>
        Your goal is to classify correctly as many images as possible in 7 minutes. Your bonus in this HIT will be
        calculated as one penny for each five properly classified pictures, meaning that the
        <strong> more correct classifications you accumulate, the greater is your bonus!</strong>
        <br/>
      </p>
      <p className={"instruction-passage"} hidden={partIdx !== 1}><span
        style={{"fontWeight": "bold", "fontSize": "calc(1.2rem + .5vw)", "color": "red"}}>Notice! &nbsp;</span>
        From time to time we experience some errors loading the pictures. When this happens you won't be able to
        continue tagging the pictures and earning further bonus. <br/>Lucky for you, we have a virtual helper (“ViPer”)
        who
        is responsible for solving these problems! <br/>When you will get an error, a request for help will be sent
        to ViPer. Unfortunately you are sharing the ViPer with another two players participating in your session, and
        <strong> ViPer can help only one player at a time</strong>, so when helping someone else you will have to wait for him to reach
        your
        request. ViPer schedules the incoming requests for help and it takes a constant time of <strong>8 seconds </strong>
        to handle a single request. <br/>
      </p>
      <p className={"instruction-passage"} hidden={partIdx !== 2}>
        Our motive in this experiment is to examine different methods of scheduling. Eventually we wish to find a
        generic scheduling algorithm that would maximize the aggregated users’ satisfaction.<br/> In this game,
        <strong> the scheduling process includes choosing the order of handling the incoming help requests coming from
          the players. </strong> ViPer is using a randomly chosen scheduling algorithm out of two options, and with this
        algorithm he decides who he is going to take care of next. <br/>After the game ends, we would like you to give
        us your honest opinion about the ViPer’s scheduling process.
        <br/><span><strong>Please don't refresh the page at any stage till the end of the experiment. </strong>
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