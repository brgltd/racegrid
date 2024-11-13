import { SyntheticEvent } from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useAppContext } from "@/hooks/use-app-context";

export function Toast() {
  const { isToastOpen, setIsToastOpen, toastMessage, setToastMessage } =
    useAppContext();

  const onClose = (
    event: SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsToastOpen(false);
    setToastMessage("");
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div>
      <Snackbar
        open={isToastOpen}
        autoHideDuration={6000}
        onClose={onClose}
        message={toastMessage}
        action={action}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      />
    </div>
  );
}
