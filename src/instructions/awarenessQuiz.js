import * as Survey from "survey-react";
import React, {useContext, useState} from "react";
import {Box, Modal, Typography} from "@mui/material";
import {modalStyle, throwOutFromExperiment} from "../utils/generalUtils";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import PageTimeTracker from "../utils/pageTimeTracker";
import {SessionContext, WebSocketContext} from "../utils/sessions";

function AwarenessQuiz() {
  const websocket = useContext(WebSocketContext);
  const {session,} = useContext(SessionContext);

  const correctAnswers = {
    "Q1": "You will get no payment",
    "Q2": "I can choose to help the robot (click 'yes) or not (click 'no' or ignore)",
    "Q3": "The robot's current picture will be displayed and I will need to classify it (dog or cat), then return to " +
        "my own task",
    "Q4": "When I finished classify all 150 pictures"
  }

  const quizDef = {
    questions: [
      {
        type: "radiogroup",
        name: "Q1",
        title: "What happens if you leave before experiment ends?",
        isRequired: true,
        hasNone: false,
        choices: [
          "You will get full payment",
          correctAnswers.Q1,
          "You will get payment achieved till the point you left"
        ]
      }, {
        type: "radiogroup",
        name: "Q2",
        title: "What happens if you get the message that the robot needs help?",
        isRequired: true,
        hasNone: false,
        choices: [
          "I will ignore that",
          "I will always click 'yes'",
          correctAnswers.Q2
        ]
      }, {
        type: "radiogroup",
        name: "Q3",
        title: "What will happens if you click on 'yes' to the help the robot?",
        isRequired: true,
        hasNone: false,
        choices: [
          correctAnswers.Q3,
          "I'll need to replace the robot in its task for good",
          "It will skip to my next picture",
        ]
      }, {
        type: "radiogroup",
        name: "Q4",
        title: "When the game ends?",
        isRequired: true,
        hasNone: false,
        choices: [
          correctAnswers.Q4,
          "When I help the robot",
          "After the robot finished its work",
        ]
      }
    ]
  };

  const surveyModel = new Survey.Model(quizDef);
  const [openFailedModal, setOpenFailedModal] = useState(false);
  const [passed, setPassed] = useState(false);
  const [timesFailed, setTimes] = useState(0);
  const [failedOnce, setFailed] = useState(false);

  const hasAnsweredCorrectly = (answers) => {
    return JSON.stringify(answers) === JSON.stringify(correctAnswers);
  }

  const onComplete = (survey, options) => {
    if (hasAnsweredCorrectly(survey.data)) {
      setPassed(true);
    } else {
      setTimes(timesFailed + 1);
      if (timesFailed !== 2) {
             setFailed(true);
        setTimeout(() => onCloseTryModel(), 2000);
      }

    }
    if (timesFailed === 2) {
      websocket.send(JSON.stringify({"action": "failed-quiz", "answers": survey.data, "session": session}))
      surveyModel.clear();
      setOpenFailedModal(true);
      setTimeout(throwOutFromExperiment, 8 * 1000);
    }
  }

  const onCloseFailedModal = () => setOpenFailedModal(false);

  const onCloseTryModel = () => setFailed(false);

  return (
    <div>
      {
        !passed ?
          <div className={"quiz-div"}>
            <div style={{"marginBottom": "20px", "color": "#6d707c", "fontWeight": "bold", "fontSize": "large"}}>
              To make sure you understand the task, please answer the following four questions.<br/>
              <span style={{"color": "red"}}> You must answer all the questions correctly at the first try</span>,
              otherwise you will be disqualified and won't get paid. <br/>Go back to the tutorial if you need a
              reminder!<br/>
              <Link to={"/about"}>
                <a style={{"fontSize": "small"}}>Game Instructions</a>
              </Link>
            </div>
            <Survey.Survey id={"survey"} model={surveyModel} onComplete={onComplete} showCompletedPage={false}/>
            <Modal
              open={openFailedModal}
              onClose={onCloseFailedModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Failed
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                  You failed the quiz, as a result you are disqualified from our experiment.
                </Typography>
              </Box>
            </Modal>
            <Modal
              open={failedOnce}
              onClose={onCloseTryModel}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Failed
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                  Try again!
                </Typography>
              </Box>
            </Modal>
          </div>
          :
          <div className={"passed-div"}>
            <div>Passed!</div>
            <Link to={"/game"}>
              <Button style={{"backgroundColor": "#1ab394", "borderColor": "#1ab394"}}>Start Game</Button>
            </Link>
          </div>
      }
      <PageTimeTracker pageName="awarenessQuiz"/>
    </div>
  )
}

export default AwarenessQuiz;