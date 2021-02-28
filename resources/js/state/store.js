import { action, createStore, persist } from "easy-peasy";

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
    },
    {
        version: 1,
    }
);
