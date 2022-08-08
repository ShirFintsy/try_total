import Button from "react-bootstrap/Button";
import React, {useState} from "react";

function helpRequest(props) {

    return(
        <div>
            {props.needsHelp ?
                <div>
                <div className={"title"}>The robot quiz</div>
                    <div>
                    <h1>Please classify the following image</h1>
                    {
                        props.waitForImage ?
                            <div className={"loading-div"}>loading image
                            <div className={"loader"}/>
                            </div> :
                            <div>
                            <img className={"img-to-cls"} src={props.imageSrc} alt="pet"/>
                            <div>
                            <Button style={{"backgroundColor": "sandybrown", "borderColor": "sandybrown"}}
                                  className={"class-btn"}>Cat</Button>
                            <Button style={{"backgroundColor": "cornflowerblue", "borderColor": "cornflowerblue"}}
                                  className={"class-btn"}>Dog</Button>
                            </div>
                        </div>
                    }
                </div>
                </div>:
                <div></div>
            }
        </div>
    )
}