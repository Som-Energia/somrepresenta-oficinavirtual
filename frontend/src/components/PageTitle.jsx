import Typography from '@mui/material/Typography'

function PageTitle(props) {
  const { children, Icon } = props
  return (
    <Typography variant="h3" sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
      <Icon
        sx={{
          fontSize: '2.5rem',
          mr: '1rem',
        }}
      />
      {children}
    </Typography>
  )
}

export default PageTitle
