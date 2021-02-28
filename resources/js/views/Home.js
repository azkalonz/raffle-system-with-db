import { Grid, Icon, IconButton } from "@material-ui/core";
import { useStoreActions } from "easy-peasy";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import RaffleDraw from "../components/RaffleDraw";
import WinnerList from "../components/WinnerList";
import { hasErrors } from "../util/api";

function Home({ match, history }) {
    const { id } = match.params;
    const { enqueueSnackbar } = useSnackbar();
    const { getParticipants } = useStoreActions(
        (states) => states.participants
    );
    const { getWinners } = useStoreActions((states) => states.winners);

    useEffect(() => {
        getParticipants((resp) => {
            hasErrors(resp, (error, options) => {
                enqueueSnackbar(error, options);
            });
        });
        getWinners((resp) => {
            hasErrors(resp, (error, options) => {
                enqueueSnackbar(error, options);
            });
        });
    }, []);

    return (
        <div className="app-container">
            <audio src="/mp3/spin.mp3" id="spin" />
            <audio src="/mp3/collect.mp3" id="collect" />
            <audio src="/mp3/winner.mp3" id="winner" />
            <WinnerList id={id} />
            <RaffleDraw history={history} />
            <Grid
                className="footer"
                container
                justify="space-between"
                alignItems="center"
            >
                <Grid item>
                    <Link to="/auth/logout">Logout</Link>
                </Grid>
                <Grid item>
                    Create with ♥ by Mark Joseph&nbsp;&nbsp;
                    <a
                        href="https://www.facebook.com/average.g0at/"
                        target="_blank"
                    >
                        FB
                    </a>
                    &nbsp;|&nbsp;
                    <a href="https://github.com/azkalonz" target="_blank">
                        Github
                    </a>
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;
