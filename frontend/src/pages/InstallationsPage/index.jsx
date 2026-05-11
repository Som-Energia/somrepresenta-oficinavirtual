import { useContext } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import { SolarPowerIconMenu } from "../../assets/Icons"
import ErrorSplash from "../../components/ErrorSplash"
import { InstallationContext } from "../../components/InstallationProvider"
import Loading from "../../components/Loading"
import PageTitle from "../../components/PageTitle"
import TableEditor from "../../components/TableEditor"

export default function InstallationsPage() {
  const { t } = useTranslation()
  const { installations, loading, error } = useContext(InstallationContext)

  const columns = [
    {
      id: "contract_number", // TODO: can we name it contract?
      label: t("INSTALLATIONS.COLUMN_CONTRACT_NUMBER"),
      searchable: true,
      numeric: false,
    },
    {
      id: "installation_name",
      label: t("INSTALLATIONS.COLUMN_INSTALLATION_NAME"),
      searchable: true,
      numeric: false,
    },
  ]

  const actions = []
  const selectionActions = []

  const itemActions = [
    {
      title: t("INSTALLATIONS.TOOLTIP_DETAILS"),
      view: (contract) => (
        <Button
          variant="contained"
          size="small"
          component={Link}
          to={`/installation/${contract.contract_number}`}
          endIcon={<ChevronRightIcon />}>
          {t("INSTALLATIONS.BUTTON_DETAILS")}
        </Button>
      ),
    },
  ]

  return loading ? (
    <Loading />
  ) : (
    <Container>
      <PageTitle Icon={SolarPowerIconMenu}>
        {t("INSTALLATIONS.INSTALLATIONS_TITLE")}
      </PageTitle>
      {error ? (
        <ErrorSplash
          title={error.context}
          message={error.error}
          backlink="/installation"
          backtext={t("INSTALLATIONS.RELOAD")}
        />
      ) : (
        <TableEditor
          title={t("INSTALLATIONS.TABLE_TITLE", { n: installations.length })}
          defaultPageSize={12}
          pageSizes={[]}
          columns={columns}
          rows={installations}
          actions={actions}
          selectionActions={selectionActions}
          itemActions={itemActions}
          idField={"contract_number"}
          loading={loading}
          noDataPlaceHolder={
            <Typography variant="h4">
              {t("INSTALLATIONS.NO_INSTALLATIONS")}
            </Typography>
          }
        />
      )}
    </Container>
  )
}
