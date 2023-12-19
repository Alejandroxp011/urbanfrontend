import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";

export default function AlertDialogRegister({ handleClose, text, openDialog}) {

    return (
        <>
            <Dialog
                open={openDialog}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">
                    Registro de Usuario
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}