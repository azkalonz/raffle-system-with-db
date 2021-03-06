import { CircularProgress, Typography } from "@material-ui/core";
import { useStoreState } from "easy-peasy";
import { motion } from "framer-motion";
import { find, random, sample, shuffle, uniqueId } from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useRef, useState } from "react";

function Raffler({ onWinner = (winner) => {}, inputRef, isLoading }) {
    const [isSpinning, setSpinning] = useState(false);
    const { winners } = useStoreState((states) => states.winners);
    const { enqueueSnackbar } = useSnackbar();
    const { participants: theParticipants } = useStoreState(
        (states) => states.participants
    );
    const [participants, setParticipants] = useState(
        theParticipants?.length < MAX_NAMES
            ? new Array(MAX_NAMES - theParticipants.length)
                  .fill(0)
                  .map((q) => sample(theParticipants))
                  .concat(theParticipants)
            : theParticipants?.length > MAX_NAMES
            ? shuffle(theParticipants.slice(0, MAX_NAMES))
            : shuffle(theParticipants)
    );
    const [winner, setWinner] = useState();
    const namesRef = useRef();
    const nameSize = () => $(".participants > p")[0].clientHeight;

    const loop = useCallback(
        (duration = 1, iteration = 1, index) => {
            $("#music")[0].currentTime = 3;
            $("#music")[0].pause();
            $(`.won`).removeClass("won");
            $(`.lose`).removeClass("lose");
            window.clearInterval(window.colorWinner);
            setSpinning(true);
            RAFFLE_STARTED = new Date();
            let newWinner = sample(participants);

            while (!!find(winners, { participant_id: newWinner.id })) {
                newWinner = sample(participants);
            }
            setWinner(newWinner);

            const position = index * nameSize();
            setKeyframes(position + 3.5);
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
        [participants, winners]
    );

    const revealWinner = useCallback((winner) => {
        window.clearInterval(window.highlightInterval);
        $(`.participants`).addClass("lose").removeClass("highlighted");
        window.colorWinner = setInterval(() => {
            $(`.participants > p:gt(20):lt(40):contains('${winner.name}')`).css(
                "color",
                "#fff"
            );
            $(`.winner`).addClass("won");
        }, 0);
        playSound(false);
        onWinner(winner);
        $("#music")[0].currentTime = 3;
        $("#music")[0].play();
        setSpinning(false);
    }, []);

    const playSound = (play) => {
        if (play) {
            window.clearTimeout(window.soundTimeout);
            window.soundTimeout = setInterval(() => {
                const diff = moment().diff(moment(RAFFLE_STARTED));
                $("#spin")[0].currentTime = 0;
                $("#spin")[0].play();

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
                transform: translateY(0) translateZ(0) perspective(1px);
                backface-visibility: hidden;
                -webkit-font-smoothing: subpixel-antialiased;
            }
            to {
                transform: translateY(FINAL_POSITION) translateZ(0) perspective(1px);
                backface-visibility: hidden;
                -webkit-font-smoothing: subpixel-antialiased;
            }
        }`;
        style.innerHTML = keyframes.replace(/FINAL_POSITION/g, position + "px");
        $("head").append(style);
    };

    useEffect(() => {
        $("#music")[0].currentTime = 2;
        $("#music")[0].volume = 0.02;
    }, []);

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
                            .map((q) => ({
                                ...q,
                                name:
                                    q.name.length > 50
                                        ? q.name.slice(0, 50) + "..."
                                        : q.name,
                            }))
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
                className={[
                    "draw-button",
                    isSpinning ? "spin" : "not-spin",
                ].join(" ")}
                disabled={isSpinning}
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
                    setParticipants(
                        theParticipants?.length < MAX_NAMES
                            ? new Array(MAX_NAMES - theParticipants.length)
                                  .fill(0)
                                  .map((q) => sample(theParticipants))
                                  .concat(theParticipants)
                            : theParticipants?.length > MAX_NAMES
                            ? shuffle(theParticipants.slice(0, MAX_NAMES))
                            : shuffle(theParticipants)
                    );
                    loop(DURATION, ITERATION, winnerIndex);
                }}
            >
                {isSpinning ? (
                    <CircularProgress
                        style={{ color: "#fff", transformOrigin: "center" }}
                    />
                ) : (
                    "START!"
                )}
            </motion.button>
        </>
    ) : null;
}

export default Raffler;
