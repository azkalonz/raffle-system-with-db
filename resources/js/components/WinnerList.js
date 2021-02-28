import { Tabs, Typography } from "@material-ui/core";
import { useStoreState } from "easy-peasy";
import React from "react";
import Toolbar from "./Toolbar";
import Winner from "./Winner";

function WinnerList({ id }) {
    const { winners } = useStoreState((states) => states.winners);
    return (
        <div className="winners-list">
            {!!!winners?.length ? (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        paddingTop: 30,
                    }}
                >
                    <Typography color="textSecondary" variant="h4">
                        No winners
                    </Typography>
                </div>
            ) : (
                <Tabs value={0} variant="scrollable">
                    {winners?.map((win, index) => (
                        <Winner
                            participant={win.participant}
                            win={win}
                            key={index}
                            isSelected={parseInt(id) === parseInt(win.id)}
                        />
                    ))}
                </Tabs>
            )}

            <Toolbar />
        </div>
    );
}

export default WinnerList;
