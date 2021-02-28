import { useStoreActions } from "easy-peasy";
import { useSnackbar } from "notistack";
import React, { useCallback, useRef, useState } from "react";
import Api, { hasErrors } from "../util/api";
import Raffler from "./Raffler";

function RaffleDraw({ history }) {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { addWinner } = useStoreActions((states) => states.winners);
    const itemRef = useRef();

    const handleWin = useCallback((winner) => {
        setLoading(true);
        Api.post("/api/winner", {
            participant_id: winner.id,
            item: itemRef.current.value,
        }).then((resp) => {
            const { data } = resp;
            if (data) {
                addWinner(data);
                history.replace("/" + data.id);
            } else {
                hasErrors(resp, (error, options) => {
                    enqueueSnackbar(error, options);
                });
            }
            setLoading(false);
        });
    }, []);

    return (
        <div className="raffle-container">
            <input
                ref={itemRef}
                onFocus={(e) => {
                    e.currentTarget.placeholder = "";
                }}
                onBlur={(e) => {
                    e.currentTarget.placeholder = "Raffle Item";
                }}
                className="raffle-item"
                type="text"
                spellCheck={false}
                placeholder="Raffle Item"
            />
            <Raffler
                onWinner={handleWin}
                inputRef={itemRef}
                isLoading={loading}
            />
        </div>
    );
}

export default RaffleDraw;
