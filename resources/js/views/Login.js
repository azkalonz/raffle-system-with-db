import React, { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Api, { hasErrors } from "../util/api";
import { useSnackbar } from "notistack";
import { LinearProgress } from "@material-ui/core";
import { useStoreActions, useStoreState } from "easy-peasy";

export default function Login({ history }) {
    const classes = useStyles();
    const emailRef = useRef();
    const passRef = useRef();
    const [loading, setLoading] = useState(false);
    const { setUser } = useStoreActions((states) => states.user);
    const { info } = useStoreState((states) => states.user);
    const { enqueueSnackbar } = useSnackbar();

    const handleLogin = useCallback((e) => {
        e.preventDefault();
        setLoading(true);
        console.log(emailRef, passRef);
        Api.post("/api/login", {
            email: emailRef.current.value,
            password: passRef.current.value,
        }).then((response) => {
            const { data } = response;
            if (data) {
                setUser(data);
            } else {
                hasErrors(response, (error, options) => {
                    enqueueSnackbar(error, options);
                });
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (info?.access_token) {
            history.replace("/");
        }
    }, [info]);

    return (
        <Container component="main" maxWidth="xs">
            {JSON.stringify(info)}
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={handleLogin}
                >
                    {loading && <LinearProgress />}
                    <TextField
                        inputRef={emailRef}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        inputRef={passRef}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={loading}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </Container>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));
