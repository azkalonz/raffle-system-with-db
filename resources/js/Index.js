import { ThemeProvider } from "@material-ui/core";
import { StoreProvider } from "easy-peasy";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import store from "./state/store";
import theme from "./theme";
import Login from "./views/Login";

function Index() {
    return (
        <StoreProvider store={store}>
            <App />
        </StoreProvider>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login} exact />
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default Index;

if (document.getElementById("index")) {
    ReactDOM.render(<Index />, document.getElementById("index"));
}
