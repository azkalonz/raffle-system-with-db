import {
    Box,
    CircularProgress,
    Grid,
    Icon,
    IconButton,
} from "@material-ui/core";
import { useStoreActions } from "easy-peasy";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hands from "../components/Hands";
import RaffleDraw from "../components/RaffleDraw";
import WinnerList from "../components/WinnerList";
import { hasErrors } from "../util/api";

function Home({ match, history }) {
    const { id } = match.params;
    const { enqueueSnackbar } = useSnackbar();
    const { getParticipants } = useStoreActions(
        (states) => states.participants
    );
    const [loaded, setLoaded] = useState(true);
    const { getWinners } = useStoreActions((states) => states.winners);
    const { getItems } = useStoreActions((states) => states.items);

    const onError = (resp) => {
        hasErrors(resp, (error, options) => {
            enqueueSnackbar(error, options);
        });
    };

    const onSuccess = (data) => {
        setLoaded(--window.loadedData);
    };

    useEffect(() => {
        window.loadedData = 3;
        getParticipants({
            error: onError,
            success: onSuccess,
        });
        getWinners({
            error: onError,
            success: onSuccess,
        });
        getItems({
            error: onError,
            success: onSuccess,
        });
    }, []);

    return (
        <>
            {!!loaded && (
                <Box
                    width="100vw"
                    height="100vh"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <CircularProgress />
                </Box>
            )}
            {!loaded && (
                <div className="app-container">
                    <audio src="/mp3/spin.mp3" id="spin" />
                    <audio src="/mp3/collect.mp3" id="collect" />
                    <audio src="/mp3/winner.mp3" id="winner" />
                    <img
                        src="/img/uc.png"
                        width="140"
                        alt="UCLM #1"
                        style={{
                            position: "fixed",
                            top: 13,
                            left: 13,
                            zIndex: 4,
                        }}
                    />
                    {id && <Hands />}
                    <WinnerList id={id} />
                    <RaffleDraw history={history} />
                    <Grid
                        className="footer"
                        container
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item style={{ opacity: 0.5 }}>
                            <div>
                                Created with ♥ by Mark Joseph Judaya&nbsp;&nbsp;
                                <a
                                    href="https://www.facebook.com/average.g0at/"
                                    target="_blank"
                                >
                                    FB
                                </a>
                                &nbsp;|&nbsp;
                                <a
                                    href="https://github.com/azkalonz"
                                    target="_blank"
                                >
                                    Github
                                </a>
                            </div>
                            <div>Designed by Andre Guinita</div>
                        </Grid>
                        <Grid item>
                            <Link to="/auth/logout">Logout</Link>
                        </Grid>
                    </Grid>
                </div>
            )}
            <iframe src="/html/background.html" className="background" />
        </>
    );
}

export default Home;
