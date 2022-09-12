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
    showQuestionNumbers: "off",
    pages: [
      {
        "elements": [
            {
            type: "comment",
            name: "Q1",
            title: "Please explain your decision to help or not to help the robot?",
            isRequired: true
          }, {
            type: "checkbox",
            name: "Q2",
            title: "What could have influenced your decision to help the robot (you can choose more than one)?",
            isRequired: true,
            hasNone: false,
            hasOther: true,
            colCount: 1,
            choices: [
            "A voice help request",
            "different wording of the help request",
            "Present the rationale",
          ]
        }
        ]
      }, {
        "elements": [
          {
            type: "boolean",
            name: "Q3",
            title: "If a human being was asking you for help instead of robot, do you think you would help him more?",
            isRequired: true,
          } ,{
            type: "comment",
            name: "Q3 explanation",
            title: "Explain why",
            visibleIf: "{Q3} = true || {Q3} = false",
          } ,{
            type: "boolean",
            name: "Q4",
            title: "In your opinion, if there were others that could have help robot (other than you), " +
                "do you think you would have helped more or less?",
            isRequired: true
          },{
            type: "comment",
            name: "Q4 explanation",
            title: "Explain why",
            visibleIf: "{Q4} = true || {Q4} = false",
          }, {
            type: "comment",
            name: "Q5",
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
      <div className={"feedback-intro-div"}>Thank you for taking part in the HIT. This HIT is a part of an
        academic research. <br/>
        We really need your honest opinion about your willingness to help the robot (or refuse to help).<br/>
        After completing this part you will get your payment.
      </div>
      <Survey.Survey json={json} onComplete={onComplete}/>
      <PageTimeTracker pageName="userFeedback"/>
    </div>
  )
}

export default UserFeedbackPage;