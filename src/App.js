import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import HeroImage from "./assets/report.svg"
import NoteAddIcon from "@mui/icons-material/NoteAdd"
import UpdateIcon from "@mui/icons-material/Update"
import { useState, useRef, forwardRef } from "react"
import Avatar from "@mui/material/Avatar"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PostAddIcon from "@mui/icons-material/PostAdd"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function HeroCentered() {
  const [file, setFile] = useState(null)
  const [openToast, setOpenToast] = useState(false)
  const [notification, setNotification] = useState({
    severity: "success",
    content: "message",
  })
  const uploadButtonRef = useRef()
  const [type, setType] = useState("Create")
  const handleChoseFile = (type) => () => {
    uploadButtonRef.current.click()
    setType(type)
    setTimeout(() => setOpen(true), 2000)
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }
  const postFile = async () => {
    if (file === null || file === undefined) {
      setOpenToast(true)
      setNotification({
        severity: "error",
        content: "No file",
      })
      return
    }
    const xlsxFile = new FormData()
    xlsxFile.append("in_file", file)
    const response = await fetch(`http://localhost:8000/uploadxlsx/${type}`, {
      method: "POST",
      body: xlsxFile,
    })
    const res = await response.json()
    setOpenToast(true)
    setNotification({
      severity: "success",
      content: res.Result,
    })
    console.log(res)
  }

  return (
    <Box component="section">
      <Snackbar
        open={openToast}
        autoHideDuration={6000}
        onClose={() => setOpenToast(false)}
      >
        <Alert
          onClose={() => setOpenToast(false)}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.content}
        </Alert>
      </Snackbar>
      <Container sx={{ py: 10 }} maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: 480,
            mx: "auto",
          }}
        >
          <Typography variant="h3" component="h1">
            Upload XLSX here
          </Typography>

          <Typography
            color="text.secondary"
            variant="subtitle1"
            component="div"
            sx={{ mt: 2 }}
          >
            Update or create new file in the database. her you upload file to
            create a new table or update xlsx.
          </Typography>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="*"
            // accept=".xlsx"
            ref={uploadButtonRef}
            onChange={handleFileChange}
          ></input>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              size="large"
              variant="outlined"
              endIcon={<UpdateIcon />}
              onClick={handleChoseFile("update")}
            >
              Update
            </Button>
            <Button
              size="large"
              variant="contained"
              endIcon={<NoteAddIcon />}
              onClick={handleChoseFile("create")}
            >
              Create
            </Button>
          </Stack>
          <Box
            alt="hero"
            component="img"
            src={HeroImage}
            sx={{
              borderRadius: 1,
              boxShadow: 2,
              maxWidth: 720,
              mt: 6,
              objectFit: "contain",
            }}
          />
        </Box>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        maxWidth="xs"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Avatar sx={{ mt: 3 }}>
            <PostAddIcon />
          </Avatar>
          <DialogTitle id="dialog-title">
            {file === null ? ".xlsx" : file.name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">
              this action will {type} the content of the database so be careful
              of what you are doing. click on {type} when you know what you are
              doing
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} sx={{ color: "GrayText" }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleClose()
                postFile()
              }}
            >
              {type}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}
