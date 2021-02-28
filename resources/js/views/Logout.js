import { useStoreActions } from "easy-peasy";
import React, { useEffect } from "react";

function Logout(props) {
    const { logout } = useStoreActions((states) => states.user);
    useEffect(() => {
        logout(() => {
            props.history.replace("/login");
        });
    }, []);
    return null;
}

export default Logout;
