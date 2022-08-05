import {Button} from "react-bootstrap";
import './intro.css';
import {Link} from "react-router-dom";
import {SessionContext} from "./utils/sessions";
import {useContext} from "react";
import {useHistory} from "react-router-dom";

function Intro() {
  const {session,} = useContext(SessionContext);
  let history = useHistory();

  if (session === undefined) {
    history.push("/login");
  }

  return (
    <div className={"intro-div"}>
      <h2 className={"app-heading-h2"} style={{"marginBottom": "20px"}}>Dear participant,</h2>
      <p>Thank you for participating in this HIT, which is part of a study carried out by Prof. David Sarne and lab members
        from Bar-Ilan University.<br/><br/>
        The purpose of this research is to study how human satisfaction is affected by different features and models
        of task scheduling. <br/><br/>
        We believe there are no known risks associated with this research study; however, as with any online related
        activity, the risk of a breach of confidently is always possible. To the best of our ability your answers in
        this study will remain confidential. We will minimize any risks by storing all data in a secured server.
        Furthermore, all results that will be reported based on the data collected in this study will be based on
        aggregation over users - no specific data of any single (anonymous) user will be disclosed
        whatsoever. <br/><br/>
        Your participation in this study is completely voluntary and you can withdraw at any time. There will be no
        penalty for withdrawal, though you will not complete the experiment and get paid.<br/><br/>
        We sincerely appreciate your consideration and participation in this study. <br/><br/>
        If you encounter any technical problem or have any questions or comments, please contact us. If you have
        research-related questions or want clarification regarding this research and/or your participation, please
        contact Prof. David Sarne at david.sarne@biu.ac.il<br/><br/>
        By clicking "I agree" below you are indicating you are at least 18 years old, have read and understood this
        consent form and agree to participate in this research study. It is adviced that you print a copy of this
        page for your records.</p>

      <div>
        <Link to={"/about"}><Button variant="success" className={"consent-form-btn agree"}>I agree</Button></Link>
        <Button variant="danger" className={"consent-form-btn not-agree"}>I do not agree</Button>
      </div>

    </div>
  )
}

export default Intro;