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
            name: "satisfaction",
            title: "How satisfied are you from the decisions made by Viper regarding which player to help in cases of conflict?",
            minRateDescription: "Not satisfied",
            maxRateDescription: "Completely satisfied",
            isRequired: true
          }, {
            type: "rating",
            name: "pay_attention_to_others",
            title: "How much did you pay attention to ViPer helping other players? ",
            minRateDescription: "Did not pay attention at all",
            maxRateDescription: "Paid close attention",
            isRequired: true
          }
        ]
      }, {
        "elements": [
          {
            type: "rating",
            name: "fairness",
            title: "How do you estimate the ViPer fairness?",
            minRateDescription: "Not fair",
            maxRateDescription: "Completely fair",
            isRequired: true
          }, {
            type: "rating",
            name: "attentive_to_needs",
            title: "How much was the ViPer attentive to your needs?",
            minRateDescription: "Not attentive",
            maxRateDescription: "Completely attentive",
            isRequired: true
          }, {
            type: "rating",
            name: "future_use",
            title: "Would you like to keep using ViPer in the future?",
            minRateDescription: "Absolutely No",
            maxRateDescription: "Absolutely yes",
            isRequired: true
          }
        ]
      }, {
        "elements": [
          {
            type: "comment",
            name: "decision_process",
            title: "Describe the decision process of the ViPer as you experienced it. To whom he helped first? why?",
            isRequired: true
          }, {
            type: "comment",
            name: "suggestions_for_improvement",
            title: "How did ViPer should have acted differently in your opinion?",
            isRequired: true
          }, {
            type: "comment",
            name: "technical_issues",
            title: "Any other thoughts or technical issues encountered?",
            isRequired: false
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
        <strong style={{"color": "#8f1919"}}>
          We ask you to take the server errors as given, and focus only on the decisions of ViPer to help you
          or the other two players {session.otherPlayersName[0]} and {session.otherPlayersName[1]}</strong>
      </div>
      <Survey.Survey json={json} onComplete={onComplete}/>
      <PageTimeTracker pageName="userFeedback"/>
    </div>
  )
}

export default UserFeedbackPage;