import { Tabs, Typography } from "@material-ui/core";
import { useStoreState } from "easy-peasy";
import { slice } from "lodash";
import React from "react";
import Toolbar from "./Toolbar";
import Winner from "./Winner";

function WinnerList({ id }) {
    const { winners: participants } = useStoreState((states) => states.winners);
    const parts = slice(participants, 0, 10);
    return (
        <div className="winners-list">
            {!!!parts?.length && (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        transform: "translateY(70px)",
                    }}
                >
                    <Typography color="textSecondary" variant="h4">
                        None
                    </Typography>
                </div>
            )}
            <Tabs value={0} variant="scrollable">
                {parts
                    ?.map((participant) => ({
                        ...participant,
                        school: {
                            ...participant.school,
                            picture: "/img/school/uc.png",
                        },
                    }))
                    .map((participant, index) => (
                        <Winner
                            participant={participant}
                            key={index}
                            isSelected={parseInt(id) === participant.id}
                        />
                    ))}
            </Tabs>
            <Toolbar />
        </div>
    );
}

export default WinnerList;
