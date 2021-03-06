import { MenuItem, Select, Typography } from "@material-ui/core";
import { useStoreActions, useStoreState } from "easy-peasy";
import { find, update } from "lodash";
import { useSnackbar } from "notistack";
import React, { useCallback, useRef, useState } from "react";
import Api, { hasErrors } from "../util/api";
import Raffler from "./Raffler";

function RaffleDraw({ history }) {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { addWinner } = useStoreActions((states) => states.winners);
    const { updateItem } = useStoreActions((states) => states.items);
    const { items } = useStoreState((states) => states.items);
    const [selectedItem, setSelected] = useState();
    const itemRef = useRef();

    const handleWin = useCallback((winner) => {
        let item = {};
        const selectedItem = window.item;

        if (!selectedItem?.id) {
            item = {
                item_name: itemRef.current.value,
            };
        } else {
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
                if (data?.item?.amount) {
                    updateItem(data.item);
                    setSelected(data.item);
                }
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
                <div>
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
                    {selectedItem && (
                        <Typography variant="h4">
                            Worth <b>PHP {selectedItem?.amount?.toFixed(2)}</b>
                            <sup>({selectedItem.quantity}x left)</sup>
                        </Typography>
                    )}
                </div>
                <Select
                    className="select"
                    onChange={(e) => {
                        window.item = e.target.value;
                        setSelected(e.target.value);
                        itemRef.current.value = e.target.value.name;
                    }}
                >
                    {items?.map((item) => (
                        <MenuItem key={item.id} value={item}>
                            {item.name} (PHP {item.amount})
                            <sup>{item.quantity}x</sup>
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
