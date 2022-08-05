import {useContext} from "react";
import {SessionContext, WebSocketContext} from "../utils/sessions";
import {useHistory} from "react-router-dom";
import * as Survey from "survey-react";
import {parse} from "querystring";
import "./login.css";

function Login(props) {
  const {_, setSession} = useContext(SessionContext);
  const websocket = useContext(WebSocketContext);
  const history = useHistory();
  const urlParams = parse(props.location.search.substring(1));

  const onComplete = (survey, options) => {
    const session = {"prolific_pid": urlParams.PROLIFIC_PID, "name": survey.data.name}
    setSession(session);
    const info = Object.assign({}, survey.data,
      {"study_id": urlParams.STUDY_ID, "session_id": urlParams.SESSION_ID})
    websocket.send(JSON.stringify({"action": "participant-info", "session": session, "info": info}));
    history.push("/");
  }

  const json = {
    questions: [
      {
        type: "text",
        name: "name",
        title: "nickname",
        hasNone: false,
        isRequired: true
      }, {
        type: "radiogroup",
        name: "gender",
        title: "Gender",
        isRequired: true,
        hasNone: false,
        choices: ["Female", "Male"]
      }, {
        name: "age",
        type: "text",
        inputType: "number",
        min: 18,
        title: "Your age:",
        isRequired: true,
      }
    ]
  };

  return (
    <div className={"login-page-div"}>
      <h1 className={"app-heading-h1"}>Welcome to our experiment!</h1>
      <Survey.Survey json={json} onComplete={onComplete}/>
    </div>
  )
}

export default Login;