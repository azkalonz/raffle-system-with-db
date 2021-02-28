import { useStoreRehydrated, useStoreState } from "easy-peasy";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";

function PrivateRoute(props) {
    const rehydrated = useStoreRehydrated();
    const [loading, setLoading] = useState(true);
    const { info } = useStoreState((states) => states.user);

    useEffect(() => {
        if (rehydrated) {
            if (isEmpty(info)) {
                window.location = "/login";
            } else {
                setLoading(false);
            }
        }
    }, [rehydrated]);

    return !loading ? <Route {...props} /> : null;
}

export default PrivateRoute;
