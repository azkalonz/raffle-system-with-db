import { Typography } from "@material-ui/core";
import { useStoreState } from "easy-peasy";
import { random } from "lodash";
import React, { useRef } from "react";

function Raffler(props) {
    const { participants } = useStoreState((states) => states.participants);
    const namesRef = useRef();

    const setKeyframes = (position = 48) => {
        const prevFrames = $("#spinner-keyframes");
        if (prevFrames) {
            prevFrames.remove();
        }
        const style = document.createElement("style");
        style.rel = "stylesheet";
        style.id = "spinner-keyframes";
        const keyframes = `
        @keyframes spinning {
            from {
                transform: translateY(0);
            }
            to {
                transform: translateY(FINAL_POSITION);
            }
        }`;
        style.innerHTML = keyframes.replace(/FINAL_POSITION/g, position + "px");
        $("head").append(style);
    };

    const loop = (duration = 1, iteration = 1, index) => {
        const position = index * $(".participants > p")[0].clientHeight;
        setKeyframes(position + random(-10, 10));
        $(namesRef.current).attr("style", "").removeClass("spinning");
        setTimeout(() => {
            $(namesRef.current).css({
                "animation-name": "spinning",
                "animation-duration": duration + "s",
                "animation-iteration-count": iteration,
                "animation-timing-function": "cubic-bezier(0, 1.05, 0.75, 1)",
                "animation-fill-mode": "forwards",
            });
        }, 0);
        // window.clearTimeout(window.revealTimeout);
        // window.revealTimeout = setTimeout(() => {
        //     revealWinner();
        // }, (duration * iteration - 2) * 1000);
    };

    const revealWinner = () => {
        window.clearTimeout(window.revealTimeout);
        $(namesRef.current).attr("style", "").addClass("spinning");
    };

    return (
        <div className="raffler-container">
            <div className="wrapper">
                <div className="winner"></div>
                <div ref={namesRef} className="participants">
                    {participants
                        .map((p, index) =>
                            index === participants.length - 30
                                ? { ...p, name: "MarkKKk" }
                                : p
                        )
                        .slice(0, 1000)
                        .reverse()
                        .map((participant) => (
                            <Typography key={participant.id}>
                                {participant.name}
                            </Typography>
                        ))}
                </div>
            </div>
            <div style={{ display: "flex" }}>
                <button
                    onClick={() => {
                        console.log(namesRef.current);
                        loop(20, 1, participants.length - 30);
                    }}
                >
                    Spin
                </button>
                <button
                    onClick={() => {
                        revealWinner();
                    }}
                >
                    reveal
                </button>
            </div>
        </div>
    );
}

export default Raffler;
