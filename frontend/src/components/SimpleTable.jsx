import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const Item = styled('div')(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.table.contentDark
      : theme.palette.table.contentLight,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}))

const SimpleTable = ({
  title = false,
  fields,
  fieldsOrder = false,
  translationsPrefix = 'DETAILS',
}) => {
  const { t } = useTranslation()
  const data = fieldsOrder || Object.keys(fields)
  return (
    <Grid
      container
      sx={{ width: 'auto', marginLeft: '1rem', marginTop: '2rem', marginRight: '1rem' }}
    >
      {title && (
        <Item
          sx={{
            backgroundColor: 'table.titleColor',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          <b>{title}</b>
        </Item>
      )}
      <Box sx={{ width: '100%' }}>
        {data.map((detail, index) => (
          <Box key={index} sx={{ display: 'flex', width: '100%' }}>
            <Grid
              item
              xs={4}
              sx={{ marginRight: '1rem', display: 'grid', overflow: 'hidden' }}
            >
              <Item>
                <b>{t(`${translationsPrefix}.${detail.toUpperCase()}`)}</b>
              </Item>
            </Grid>
            <Grid item xs={8} sx={{ display: 'grid', overflow: 'hidden' }}>
              <Item>{fields[detail] ? t(fields[detail]) : '-'}</Item>
            </Grid>
          </Box>
        ))}
      </Box>
    </Grid>
  )
}

export default SimpleTable
