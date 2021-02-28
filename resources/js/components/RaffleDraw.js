import React from "react";
import { Link } from "react-router-dom";
import Raffler from "./Raffler";

function RaffleDraw(props) {
    return (
        <div className="raffle-container">
            <input
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
            <Raffler />
        </div>
    );
}

export default RaffleDraw;
