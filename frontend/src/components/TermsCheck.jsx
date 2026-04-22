/**
A terms checker ask the user for certain terms and conditions
to be accepted before continuing using the application.
The different terms to be accepted separatelly are configured
in a yaml file.
*/
import React from "react"
import { useTranslation } from "react-i18next"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

import MuiMarkdown from "mui-markdown"

import requiredDocuments from "../data/terms.yaml"
import ov from "../services/ovapi"
import { firstPendingDocument } from "../services/signatures"
import { useAuth } from "./AuthProvider"

function TermsDialog(props) {
  const { document, title, body, accept, onAccept, onReject } = props
  const { t } = useTranslation()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const [error, setError] = React.useState(false)

  async function handleAccept() {
    try {
      await ov.signDocument(document)
      onAccept && onAccept()
    } catch (e) {
      console.log(e)
      setError(e.error)
    }
  }

  return (
    <Dialog open fullScreen={fullScreen} scroll="paper">
      <DialogTitle>{t(title)}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexFlow: "column",
          alignItems: "end",
          p: 2,
          gap: 2,
          maxWidth: "50rem",
        }}>
        <Container>
          <MuiMarkdown>{t(body)}</MuiMarkdown>
        </Container>
      </DialogContent>

      {error ? (
        <Box color="error.main">
          <Container>
            {t("TERMS.UNEXPECTED_ERROR")}: {error}
          </Container>
        </Box>
      ) : null}

      <DialogActions>
        <Button variant="contained" color="secondary" onClick={onReject}>
          {t("APP_FRAME.MENU_LOGOUT")}
        </Button>
        <Button variant="contained" color="primary" onClick={handleAccept}>
          {accept ? t(accept) : t("TERMS.ACCEPT")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function TermsCheck({ children }) {
  const { currentUser, logout, reloadUser } = useAuth()

  if (!currentUser) return children

  const tosign = firstPendingDocument(
    requiredDocuments,
    currentUser.signed_documents,
  )
  if (tosign === null) return children

  return (
    <>
      <TermsDialog {...tosign} onAccept={reloadUser} onReject={logout} />
      {children}
    </>
  )
}

export default TermsCheck
