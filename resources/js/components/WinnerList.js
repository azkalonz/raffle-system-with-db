import { Box, Divider, Grid, Icon, Typography } from "@material-ui/core";
import { useStoreState } from "easy-peasy";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Toolbar from "./Toolbar";
import Winner from "./Winner";

function WinnerList({ id }) {
    const { winners } = useStoreState((states) => states.winners);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <motion.div
            layout
            className={[
                "winners-list",
                id ? "open" : "close",
                menuOpen ? "peak" : "no-peak",
            ].join(" ")}
        >
            <div
                className="trophy-button"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? (
                    <Icon style={{ color: "#fff" }} fontSize="large">
                        close
                    </Icon>
                ) : (
                    <img src="/img/trophy.svg" width="40" alt="Winners" />
                )}
            </div>

            {!!!winners?.length ? (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        paddingTop: 30,
                    }}
                >
                    <WinnersListTitle />

                    <Typography color="textSecondary" variant="h4">
                        No winners
                    </Typography>
                </div>
            ) : (
                <Grid container spacing={1} direction="column">
                    <WinnersListTitle />
                    {winners?.map((win, index) => (
                        <Grid key={index} item>
                            <Winner
                                participant={win.participant}
                                win={win}
                                isSelected={parseInt(id) === parseInt(win.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </motion.div>
    );
}

function WinnersListTitle() {
    return (
        <>
            <Box
                width="100%"
                textAlign="center"
                p={3}
                pb={5}
                position="relative"
            >
                <Typography
                    variant="h3"
                    color="primary"
                    style={{ fontWeight: 700 }}
                >
                    Winners
                    <br />
                    List
                </Typography>
                <img src="/img/trophy.svg" width="40" alt="Winners" />
                <Toolbar />
            </Box>
            <Divider />
            <br />
            <br />
        </>
    );
}

export default WinnerList;
