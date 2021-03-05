import { Backdrop, Divider, Typography } from "@material-ui/core";
import { AnimateSharedLayout, motion } from "framer-motion";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function Winner({ participant, isSelected, win }) {
    const [isExpanded, setExpanded] = useState(isSelected);
    useEffect(() => {
        setExpanded(isSelected);
    }, [isSelected]);
    return (
        <AnimateSharedLayout>
            {isExpanded ? (
                <Expanded
                    win={win}
                    participant={participant}
                    setExpanded={setExpanded}
                    isExpanded={isExpanded}
                />
            ) : (
                <Compact
                    win={win}
                    participant={participant}
                    setExpanded={setExpanded}
                    isExpanded={isExpanded}
                />
            )}
        </AnimateSharedLayout>
    );
}
function Expanded({ participant, setExpanded, isExpanded, win }) {
    const history = useHistory();

    return (
        <>
            <div className="winner-container" style={{ zIndex: 3 }}>
                <motion.div
                    layout
                    layoutId="winner"
                    className="winner open"
                    onClick={() => {
                        setExpanded(false);
                        history.replace("/");
                    }}
                >
                    <div className="confetti">
                        <img src="/img/confetti.svg" alt="confetti" />
                    </div>
                    <div>
                        <div className="congrats">Congratulations!</div>

                        <motion.div layoutId={"picture"} className="picture">
                            <img
                                src={
                                    "/img/school/" +
                                    (participant?.school?.picture ||
                                        "default.jpg")
                                }
                                alt="School"
                            />
                        </motion.div>
                        <div className="details">
                            <motion.div layoutId="name" className="name">
                                <Typography
                                    variant="h3"
                                    style={{ fontWeight: 700 }}
                                >
                                    {participant.name}
                                </Typography>
                            </motion.div>
                            <motion.div
                                initial={{
                                    translateX: 0,
                                    opacity: 1,
                                }}
                                layoutId="school"
                                className="school"
                            >
                                <Typography
                                    variant="h4"
                                    style={{ fontSize: 29 }}
                                >
                                    {participant?.school?.name}
                                </Typography>
                                <Typography className="winning-the">
                                    on winning the
                                </Typography>
                                <Typography className="item">
                                    {win.item.name}
                                </Typography>
                                {win.item?.amount && (
                                    <sup>
                                        (worth PHP {win.item.amount.toFixed(2)})
                                    </sup>
                                )}
                                <br />
                                <br />
                                <Typography color="textSecondary" variant="h5">
                                    ⏳ {moment(win.created_at).fromNow()}
                                </Typography>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Backdrop
                open={isExpanded}
                onClick={() => setExpanded(false)}
                className="backdrop"
            />
        </>
    );
}

function Compact({ participant, setExpanded, win }) {
    const history = useHistory();

    return (
        <div className="winner-container">
            <motion.div
                initial={{
                    scale: 1,
                }}
                whileTap={{
                    scale: 0.9,
                }}
                whileHover={{
                    scale: 1.1,
                }}
            >
                <motion.div
                    layout
                    layoutId="winner"
                    className="winner"
                    onClick={() => {
                        setExpanded(true);
                        history.replace("/" + win.id);
                    }}
                >
                    <motion.div layoutId={"picture"} className="picture">
                        <img
                            src={
                                "/img/school/" +
                                (participant?.school?.picture || "default.jpg")
                            }
                            alt="School"
                        />
                    </motion.div>
                    <div className="details">
                        <motion.div
                            initial={{ translateY: -100, opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            exit={{
                                translateY: -100,
                                opacity: 0,
                                transition: { duration: 0.15 },
                            }}
                            transition={{ duration: 0.2, delay: 0.15 }}
                            className="item"
                        >
                            <Typography
                                variant="h5"
                                style={{ wordBreak: "break-word" }}
                            >
                                {win.item.name}{" "}
                                <sup>
                                    <small>
                                        <b>PHP {win.item.amount}</b>
                                    </small>
                                </sup>
                            </Typography>
                            <Divider
                                style={{
                                    width: "10%",
                                    height: 3,
                                    margin: "7px 0",
                                }}
                            />
                        </motion.div>
                        <motion.div layoutId="name" className="name">
                            <Typography
                                variant="h6"
                                style={{ wordBreak: "break-word" }}
                            >
                                {participant.name}
                            </Typography>
                            <Typography color="textSecondary">
                                {moment(win.created_at).fromNow()}
                            </Typography>
                        </motion.div>
                        <motion.div
                            layoutId="school"
                            className="school"
                            initial={{
                                translateX: -100,
                                opacity: 0,
                            }}
                        >
                            <Typography>{participant?.school?.name}</Typography>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Winner;
