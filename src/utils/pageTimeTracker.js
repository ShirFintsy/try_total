import React, {useContext, useEffect} from "react";
import {SessionContext, WebSocketContext} from "./sessions";
import PropTypes from "prop-types";

function PageTimeTracker(props) {

  const websocket = useContext(WebSocketContext);
  const {session,} = useContext(SessionContext);

  useEffect(() => {
    const start = Date.now();
    return () => {
      const totalTime = (Date.now() - start) / 1000;
      websocket.send(JSON.stringify({
        'session': session,
        'action': 'time-tracker',
        'time': totalTime,
        'page': props.pageName
      }))
    }
  }, [])


  return <div>

  </div>
}


PageTimeTracker.propTypes = {
  pageName: PropTypes.string,
};


export default PageTimeTracker;