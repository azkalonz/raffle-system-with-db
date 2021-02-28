import { Tabs } from "@material-ui/core";
import { useStoreState } from "easy-peasy";
import { slice } from "lodash";
import React from "react";
import Toolbar from "./Toolbar";
import Winner from "./Winner";

function WinnerList({ id = 1 }) {
    const { participants } = useStoreState((states) => states.participants);

    return (
        <div className="winners-list">
            <Tabs value={0} variant="scrollable">
                {slice(participants, 0, 30)
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
