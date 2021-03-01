import { action, createStore, persist, thunk } from "easy-peasy";
import Api from "../util/api";

export default createStore(
    {
        user: persist(
            {
                info: {},
                setUser: action((state, payload) => {
                    state.info = payload;
                }),
                logout: action((state, callback) => {
                    state.info = {};
                    callback();
                }),
            },
            {
                storage: "localStorage",
            }
        ),
        participants: persist({
            participants: [],
            getParticipants: thunk((actions, callback) => {
                Api.get("/api/participants").then((resp) => {
                    const { data } = resp;
                    if (data) {
                        actions.setParticipants(data);
                    } else {
                        callback(resp);
                    }
                });
            }),
            setParticipants: action((state, payload) => {
                state.participants = payload;
            }),
        }),
        winners: persist({
            winners: [],
            getWinners: thunk((actions, callback) => {
                Api.get("/api/winners").then((resp) => {
                    const { data } = resp;
                    if (data) {
                        actions.setWinners(data);
                    } else {
                        callback(resp);
                    }
                });
            }),
            setWinners: action((state, payload) => {
                state.winners = payload;
            }),
            addWinner: action((state, payload) => {
                state.winners.unshift(payload);
            }),
        }),
        items: persist({
            items: [],
            getItems: thunk((actions, callback) => {
                Api.get("/api/items").then((resp) => {
                    const { data } = resp;
                    if (data) {
                        actions.setItems(data);
                    } else {
                        callback(resp);
                    }
                });
            }),
            setItems: action((state, payload) => {
                state.items = payload;
            }),
            addWinner: action((state, payload) => {
                state.items.unshift(payload);
            }),
        }),
    },
    {
        version: 1,
    }
);
