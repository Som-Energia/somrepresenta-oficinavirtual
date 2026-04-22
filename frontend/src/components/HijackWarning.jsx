import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"

import IconLogout from "@mui/icons-material/Logout"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import { useAuth } from "./AuthProvider"

function HijackWarning() {
  const { logout } = useAuth()
  const [open, setOpen] = useState(true)
  const [cookies, setCookie] = useCookies(["Hijacked"])

  useEffect(() => {
    setOpen(cookies["Hijacked"])
  }, [cookies])

  function handleClose() {
    setCookie("Hijacked", false)
    logout()
  }

  return (
    open && (
      <div style={{ position: "fixed", bottom: "30px", right: "20px" }}>
        <Box
          component="section"
          sx={{
            p: 2,
            backgroundColor: "lightgrey",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            size: "large",
          }}>
          Modo suplantación activado
          <Button
            variant="contained"
            startIcon={<IconLogout />}
            style={{
              backgroundColor: "grey",
              marginTop: "8px",
            }}
            onClick={handleClose}>
            Salir
          </Button>
        </Box>
      </div>
    )
  )
}
export default HijackWarning
