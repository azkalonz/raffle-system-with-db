import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Icon,
    LinearProgress,
    Typography,
} from "@material-ui/core";
import { useStoreActions } from "easy-peasy";
import { useSnackbar } from "notistack";
import React, { useCallback, useState } from "react";
import Api, { hasErrors } from "../util/api";

function Toolbar() {
    const { enqueueSnackbar } = useSnackbar();
    const [saving, setSaving] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const { setWinners } = useStoreActions((states) => states.winners);

    const handleDelete = useCallback(() => {
        setSaving(true);
        Api.delete("/api/winners").then((resp) => {
            const { data } = resp;
            if (data) {
                setWinners([]);
            } else {
                hasErrors(resp, (error, options) => {
                    enqueueSnackbar(error, options);
                });
            }
            setOpen(false);
            setSaving(false);
        });
    }, []);

    return (
        <>
            <Dialog open={isOpen || saving} onClose={() => setOpen(false)}>
                <DialogTitle>
                    {saving && <LinearProgress />}
                    Confirm Action
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to clear the winners list?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>No</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDelete()}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="toolbar">
                {/* <div className="title">
                    <Typography variant="h6">Lucky Winners</Typography>
                </div> */}
                <div className="actions">
                    <Button
                        startIcon={<Icon>delete</Icon>}
                        onClick={() => setOpen(true)}
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Toolbar;
