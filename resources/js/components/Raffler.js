import { Typography } from "@material-ui/core";
import { useStoreState } from "easy-peasy";
import { motion } from "framer-motion";
import { random, sample, uniqueId } from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";
import React, { useCallback, useRef, useState } from "react";

const MAX_NAMES = MAX_NAMES;
const DURATION = 1;
const ITERATION = 1;
const winnerIndex = 970;

let SOUND_INTERVAL = 40;
let RAFFLE_STARTED = 0;

function Raffler({ onWinner = (winner) => {}, inputRef, isLoading }) {
    const { enqueueSnackbar } = useSnackbar();
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
            RAFFLE_STARTED = new Date();
            const newWinner = sample(participants);
            setWinner(newWinner);
            const position = index * nameSize();
            setKeyframes(position + random(-10, 10));
            $(namesRef.current).attr("style", "").removeClass("spinning");
            setTimeout(() => {
                playSound(true);
                $(namesRef.current).css({
                    "animation-name": "spinning",
                    "animation-duration": duration + "s",
                    "animation-iteration-count": iteration,
                    "animation-timing-function":
                        "cubic-bezier(0, 1.05, 0.75, 1)",
                    "animation-fill-mode": "forwards",
                });
                window.highlightInterval = setInterval(() => {
                    $("");
                    const index =
                        participants.length -
                        1 -
                        parseInt(translateYValue() / nameSize());
                    $(`.participants > p:eq(${index})`).addClass("highlighted");
                    $(`.participants > p:gt(${index})`).removeClass(
                        "highlighted"
                    );
                }, 0);
                $(namesRef.current).off();
                $(namesRef.current).on("animationend", function () {
                    revealWinner(newWinner);
                });
            }, 0);
        },
        [participants]
    );

    const revealWinner = useCallback((winner) => {
        window.clearInterval(window.highlightInterval);
        $(`.highlighted`).removeClass("highlighted");
        console.log($(`.participants > p:contains('${winner.name}')`));
        $(
            `.participants > p:gt(20):lt(40):contains('${winner.name}')`
        ).addClass("highlighted");
        playSound(false);
        onWinner(winner);
    }, []);

    const playSound = (play) => {
        if (play) {
            window.clearTimeout(window.soundTimeout);
            window.soundTimeout = setInterval(() => {
                const diff = moment().diff(moment(RAFFLE_STARTED));
                $("#spin")[0].currentTime = 0;
                $("#spin")[0].play();
                console.log(SOUND_INTERVAL, diff);

                SOUND_INTERVAL = diff / 50;

                if (diff >= 10000) {
                    SOUND_INTERVAL = 340;
                }
                if (diff >= 16500) {
                    SOUND_INTERVAL = 1000;
                }
                playSound(true);
            }, SOUND_INTERVAL);
        } else {
            $("#collect")[0].currentTime = 0;
            $("#collect")[0].play();
            window.clearTimeout(window.soundTimeout);
        }
    };

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
        <>
            <div className="raffler-container">
                <div className="wrapper">
                    <div
                        className={["winner", isLoading ? "saving" : ""].join(
                            " "
                        )}
                    ></div>
                    <div ref={namesRef} className="participants">
                        {participants
                            .slice(0, winnerIndex + 30)
                            .map((p, i) =>
                                i === winnerIndex ? winner || p : p
                            )
                            .reverse()
                            .map((participant) => (
                                <Typography key={uniqueId()}>
                                    {participant.name}
                                </Typography>
                            ))}
                    </div>
                </div>
            </div>
            <motion.button
                initial={{
                    scale: 1,
                }}
                whileHover={{
                    scale: 1.1,
                }}
                whileTap={{
                    scale: 0.9,
                }}
                className="draw-button"
                onClick={() => {
                    if (!inputRef?.current?.value || isLoading) {
                        enqueueSnackbar(
                            !inputRef?.current?.value
                                ? "Enter item to raffle"
                                : "Please wait...",
                            {
                                variant: "error",
                            }
                        );
                        return;
                    }
                    loop(DURATION, ITERATION, winnerIndex);
                }}
            >
                START!
            </motion.button>
        </>
    ) : null;
}

export default Raffler;
