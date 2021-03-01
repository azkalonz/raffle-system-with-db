import { MenuItem, Select } from "@material-ui/core";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useSnackbar } from "notistack";
import React, { useCallback, useRef, useState } from "react";
import Api, { hasErrors } from "../util/api";
import Raffler from "./Raffler";

function RaffleDraw({ history }) {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { addWinner } = useStoreActions((states) => states.winners);
    const { items } = useStoreState((states) => states.items);
    const itemRef = useRef();

    const handleWin = useCallback((winner) => {
        let item = {};
        const selectedItem = window.item;

        if (!selectedItem?.id) {
            console.log(selectedItem?.id);
            item = {
                item_name: itemRef.current.value,
            };
        } else {
            console.log(itemRef.current.value, selectedItem.name);
            if (itemRef.current.value === selectedItem.name)
                item = {
                    item_id: selectedItem.id,
                };
            else
                item = {
                    item_name: itemRef.current.value,
                };
        }
        setLoading(true);
        Api.post("/api/winner", {
            participant_id: winner.id,
            ...item,
        }).then((resp) => {
            const { data } = resp;
            if (data) {
                addWinner(data);
                $("#winner")[0].currentTime = 0;
                $("#winner")[0].play();
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
            <div className="raffle-item-container">
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
                <Select
                    className="select"
                    onChange={(e) => {
                        window.item = e.target.value;
                        itemRef.current.value = e.target.value.name;
                    }}
                >
                    {items?.map((item) => (
                        <MenuItem key={item.id} value={item}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <Raffler
                onWinner={handleWin}
                inputRef={itemRef}
                isLoading={loading}
            />
        </div>
    );
}

export default RaffleDraw;
