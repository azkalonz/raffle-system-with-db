import React, { useState } from "react";

function Hands(props) {
    const [ready, setReady] = useState(2);
    console.log(ready);
    return (
        <div className="hands-container">
            <div className={["ok", !ready ? "animate" : ""].join(" ")}>
                <img src="/img/ok.svg" />
            </div>
            <div className={["like", !ready ? "animate" : ""].join(" ")}>
                <img
                    src="/img/like.svg"
                    ref={(input) => {
                        if (!input || ready <= 0) {
                            return;
                        }
                        const img = input;

                        const updateFunc = () => {
                            setReady(ready - 1);
                        };
                        img.onload = updateFunc;
                        if (img.complete) {
                            updateFunc();
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default Hands;
