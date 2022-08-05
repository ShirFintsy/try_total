import './tutorial.css';
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import PageTimeTracker from "../utils/pageTimeTracker";

function Tutorial() {
  const pictures = ['Picture1.png', 'Picture2.png', 'Picture3.png', 'Picture4.png', 'Picture5.png', 'Picture6.png',
    'Picture7.png']

  const [currentPictureIdx, setCurrentPictureIdx] = useState(0);

  const history = useHistory();

  const onClickNext = () => {
    if (currentPictureIdx === pictures.length - 1) {
      history.push("/quiz");
    }
    setCurrentPictureIdx(currentPictureIdx + 1);
  }

  const onClickPrev = () => {
    setCurrentPictureIdx(currentPictureIdx - 1);
  }

  return (
    <div className={"tutorial-div"}>
      <h2 className={"app-heading-h2"}>Quick Tutorial</h2>
      <img className={"tutorial-img"} src={"/tutorial/" + pictures[currentPictureIdx]} alt={"pic1"} width={"75%"}
           height={"85%"}/>
      <div className={"nav-btn-div"}>
        <Button hidden={currentPictureIdx === 0} onClick={onClickPrev}
                style={{"backgroundColor": "#1ab394", "borderColor": "#1ab394"}}>Back</Button>
        <Button hidden={currentPictureIdx >= pictures.length} onClick={onClickNext}
                style={{"backgroundColor": "#1ab394", "borderColor": "#1ab394"}}>Next</Button>
      </div>
      <PageTimeTracker pageName="tutorial"/>
    </div>
  )
}

export default Tutorial;