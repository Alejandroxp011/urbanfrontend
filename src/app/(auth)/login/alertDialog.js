import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
export default function AlertDialogLogin({ handleClose, text, openDialog}) {
    return (
        <>
            <Dialog
                open={openDialog}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">
                    Iniciar Sesión
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