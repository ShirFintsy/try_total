import * as Survey from "survey-react";
import "survey-react/survey.css";
import React, {useContext} from "react";
import {SessionContext, WebSocketContext} from "../utils/sessions";
import "./userFeedbackPage.css";
import PageTimeTracker from "../utils/pageTimeTracker";

function UserFeedbackPage() {
  const websocket = useContext(WebSocketContext);
  const {session,} = useContext(SessionContext);

  const json = {
    showProgressBar: "bottom",
    goNextPageAutomatic: false,
    showNavigationButtons: true,
    pages: [
      {
        "elements": [
          {
            type: "rating",
            name: "Q1",
            title: "How would you rate your willingness to help the robot?",
            minRateDescription: "Didn't want to help at all",
            maxRateDescription: "Feel the need to help all the time",
            isRequired: true
          }, {
            type: "comment",
            name: "Q2",
            title: "In case you help the robot at least once, why did you do that?",
            isRequired: true
          }, {
            type: "radiogroup",
            name: "Q3",
            title: "What would cause you to help the robot more?",
            isRequired: true,
            hasNone: false,
            choices: [
            "A voice help request",
            "different wording of the help request",
            "Present the rationale",
              "other",
          ]
        }
        ]
      }, {
        "elements": [
          {
            type: "comment",
            name: "Q4",
            title: "If a human being was asking you for help instead of robot, do you think you would help him more? Explain",
            isRequired: true
          }, {
            type: "comment",
            name: "Q5",
            title: "In your opinion, if more people could help, do you think you would help more? Explain",
            isRequired: true
          }
        ]
      }
    ]
  }


  const onComplete = (survey, options) => {
    websocket.send(JSON.stringify({"action": "feedback", "session": session, "feedback": survey.data}));
    websocket.close();
    window.location.href = "https://app.prolific.co/submissions/complete?cc=71029DA9";
  }

  return (
    <div className={"feedback-page-div"}>
      <h2>Feedback</h2>
      <div className={"feedback-intro-div"}>This is a part of an academic research which includes examination of several
        kinds of virtual helpers. <br/>
        We really need you honest opinion about the helper you experienced with. Please do not try to please us –
        tell us what you really think.<br/>
        {/*<strong style={{"color": "#8f1919"}}>*/}
        {/*  We ask you to take the server errors as given, and focus only on the decisions of ViPer to help you*/}
        {/*  or the other two players {session.otherPlayersName[0]} and {session.otherPlayersName[1]}</strong>*/}
      </div>
      <Survey.Survey json={json} onComplete={onComplete}/>
      <PageTimeTracker pageName="userFeedback"/>
    </div>
  )
}

export default UserFeedbackPage;