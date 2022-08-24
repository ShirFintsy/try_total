import * as Survey from "survey-react";
import "survey-react/survey.css";
import React, {useContext, useState} from "react";
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
            maxRateDescription: "Feel the need to help both times",
            isRequired: true
          }, {
            type: "comment",
            name: "Q2",
            title: "In case you help the robot at least once, why did you do that?",
            isRequired: true
          }, {
            type: "radiogroup",
            name: "Q3",
            title: "What would influence you to help the robot more?",
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
            title: "In your opinion, if there were others that could have help robot (other than you), " +
                "do you think you would have helped more or less? Explain",
            isRequired: true
          }, {
            type: "comment",
            name: "Q6",
            title: "Any technical issues experienced or other thoughts?",
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
    setTimeout(() => console.log("finished"), 5000);
  }

  return (
    <div className={"feedback-page-div"}>
      <h2>Feedback</h2>
      <div className={"feedback-intro-div"}>Thank you for taking part in the task. This task is a part of an
        academic research. <br/>
        We really need your honest opinion about your willingness to help the robot (or refuse to help).<br/>
        After completion this part you will get your payment.
      </div>
      <Survey.Survey json={json} onComplete={onComplete}/>
      <PageTimeTracker pageName="userFeedback"/>
    </div>
  )
}

export default UserFeedbackPage;