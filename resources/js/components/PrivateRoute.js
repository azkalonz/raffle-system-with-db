import { Box, CircularProgress } from "@material-ui/core";
import { useStoreActions, useStoreRehydrated, useStoreState } from "easy-peasy";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import Api from "../util/api";

function PrivateRoute(props) {
    const rehydrated = useStoreRehydrated();
    const [loading, setLoading] = useState(true);
    const { info } = useStoreState((states) => states.user);
    const { setUser } = useStoreActions((states) => states.user);

    useEffect(() => {
        if (rehydrated) {
            if (isEmpty(info)) {
                window.location = "/login";
            } else {
                Api.get("/api/user").then(({ data }) => {
                    if (!data?.id) {
                        setUser({});
                        window.location = "/login";
                    } else {
                        setLoading(false);
                    }
                });
            }
        }
    }, [rehydrated]);

    return !loading ? (
        <Route {...props} />
    ) : (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <CircularProgress />
        </Box>
    );
}

export default PrivateRoute;
