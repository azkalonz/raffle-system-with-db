import { Icon, IconButton, ThemeProvider } from "@material-ui/core";
import { StoreProvider } from "easy-peasy";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import store from "./state/store";
import theme from "./theme";
import Home from "./views/Home";
import Login from "./views/Login";
import Logout from "./views/Logout";

function Index() {
    const notistackRef = React.createRef();
    const onClickDismiss = (key) => () => {
        notistackRef.current.closeSnackbar(key);
    };
    return (
        <StoreProvider store={store}>
            <SnackbarProvider
                maxSnack={3}
                ref={notistackRef}
                action={(key) => (
                    <IconButton onClick={onClickDismiss(key)}>
                        <Icon>close</Icon>
                    </IconButton>
                )}
            >
                <App />
            </SnackbarProvider>
        </StoreProvider>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login} exact />
                    <PrivateRoute path={["/:id", "/"]} component={Home} exact />
                    <Route exact path="/auth/logout" component={Logout} />
                    <Route path="*" component={() => <Redirect to="/" />} />
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default Index;

if (document.getElementById("index")) {
    ReactDOM.render(<Index />, document.getElementById("index"));
}
