import { Button, Icon, Typography } from "@material-ui/core";
import React from "react";

function Toolbar(props) {
    return (
        <div className="toolbar">
            <div className="title">
                <Typography variant="h6">Lucky Winners</Typography>
            </div>
            <div className="actions">
                {/* <Button startIcon={<Icon>list</Icon>}>View All</Button> */}
            </div>
        </div>
    );
}

export default Toolbar;
