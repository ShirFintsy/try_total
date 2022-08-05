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
    "Q2": "It's known issue and part of the game, you need to wait until the problem will be fixed by ViPer",
    "Q3": "Will list your request and will get to it based on its considerations " +
      "(taking also into account requests from the other players)",
    "Q4": "8 seconds"
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
          "You will get full payment without bonuses",
          correctAnswers.Q1,
          "You will get full payment including bonuses achieved till the point you left"
        ]
      }, {
        type: "radiogroup",
        name: "Q2",
        title: "What happens if you get the message that there is an error loading the images",
        isRequired: true,
        hasNone: false,
        choices: [
          "The game doesn't work and you are allowed to leave and get full payment",
          "You need to check your internet connection",
          correctAnswers.Q2
        ]
      }, {
        type: "radiogroup",
        name: "Q3",
        title: "When you get an error and needs help, the ViPer:",
        isRequired: true,
        hasNone: false,
        choices: [
          correctAnswers.Q3,
          "Will handle your request immediately",
          "Will handle your request at randomly picked time during game",
        ]
      }, {
        type: "radiogroup",
        name: "Q4",
        title: "How much time it takes for the ViPer to handle a single request for help?",
        isRequired: true,
        hasNone: false,
        choices: [
          "10 seconds",
          correctAnswers.Q4,
          "7 seconds",
        ]
      }
    ]
  };

  const surveyModel = new Survey.Model(quizDef);
  const [openFailedModal, setOpenFailedModal] = useState(false);
  const [passed, setPassed] = useState(false);

  const hasAnsweredCorrectly = (answers) => {
    return JSON.stringify(answers) === JSON.stringify(correctAnswers);
  }

  const onComplete = (survey, options) => {
    if (hasAnsweredCorrectly(survey.data)) {
      setPassed(true);
    } else {
      websocket.send(JSON.stringify({"action": "failed-quiz", "answers": survey.data, "session": session}))
      surveyModel.clear();
      setOpenFailedModal(true);
      setTimeout(throwOutFromExperiment, 8 * 1000)
    }
  }

  const onCloseFailedModal = () => setOpenFailedModal(false);


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
            <Survey.Survey model={surveyModel} onComplete={onComplete} showCompletedPage={false}/>
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