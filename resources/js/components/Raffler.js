import { Typography } from "@material-ui/core";
import { useStoreState } from "easy-peasy";
import { random, sample, uniqueId } from "lodash";
import React, { useCallback, useRef, useState } from "react";

const MAX_NAMES = MAX_NAMES;
const winnerIndex = 970;

function Raffler({ onWinner = (winner) => {}, inputRef, isLoading }) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const { participants: theParticipants } = useStoreState(
        (states) => states.participants
    );
    const participants =
        theParticipants?.length < MAX_NAMES
            ? new Array(MAX_NAMES - theParticipants.length)
                  .fill(0)
                  .map((q) => sample(theParticipants))
                  .concat(theParticipants)
            : theParticipants?.length > MAX_NAMES
            ? theParticipants.slice(0, MAX_NAMES)
            : theParticipants;

    const [winner, setWinner] = useState();
    const namesRef = useRef();
    const nameSize = () => $(".participants > p")[0].clientHeight;

    const loop = useCallback(
        (duration = 1, iteration = 1, index) => {
            const newWinner = sample(participants);
            setWinner(newWinner);
            const position = index * nameSize();
            setKeyframes(position + random(-10, 10));
            $(namesRef.current).attr("style", "").removeClass("spinning");
            setTimeout(() => {
                $(namesRef.current).css({
                    "animation-name": "spinning",
                    "animation-duration": duration + "s",
                    "animation-iteration-count": iteration,
                    "animation-timing-function":
                        "cubic-bezier(0, 1.05, 0.75, 1)",
                    "animation-fill-mode": "forwards",
                });
                window.highlightInterval = setInterval(() => {
                    const index =
                        participants.length -
                        1 -
                        parseInt(translateYValue() / nameSize());
                    $(`.participants > p:eq(${index})`).addClass("highlighted");
                    $(`.participants > p:gt(${index})`).removeClass(
                        "highlighted"
                    );
                }, 0);
                $(namesRef.current).on("animationend", function () {
                    revealWinner(newWinner);
                });
            }, 0);
        },
        [participants]
    );

    const revealWinner = useCallback((winner) => {
        $(`.highlighted`).removeClass("highlighted");
        $(
            `.participants > p:gt(20):lt(40):contains('${winner.name}')`
        ).addClass("highlighted");
        window.clearInterval(window.highlightInterval);
        $(namesRef.current).off();
        onWinner(winner);
    }, []);

    const translateYValue = () =>
        parseInt($(namesRef.current).css("transform").split(",")[5]?.trim());

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

    return participants ? (
        <div className="raffler-container">
            <div className="wrapper">
                <div
                    className={["winner", isLoading ? "saving" : ""].join(" ")}
                ></div>
                <div ref={namesRef} className="participants">
                    {participants
                        .slice(0, winnerIndex + 30)
                        .map((p, i) => (i === winnerIndex ? winner || p : p))
                        .reverse()
                        .map((participant) => (
                            <Typography key={uniqueId()}>
                                {participant.name}
                            </Typography>
                        ))}
                </div>
            </div>

            <div style={{ display: "flex" }}>
                <button
                    onClick={() => {
                        if (!inputRef?.current?.value || isLoading) return;
                        loop(1, 1, winnerIndex);
                    }}
                >
                    Spin
                </button>
            </div>
        </div>
    ) : null;
}

export default Raffler;
