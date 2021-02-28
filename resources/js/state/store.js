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
        }),
    },
    {
        version: 1,
    }
);
