import { styled } from '@mui/material/styles'
import { Container, Alert, Box, Typography, Button, ButtonGroup } from '@mui/material'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import { Link } from 'react-router-dom'

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.table.titleColor,
  color: 'white',
  borderColor: theme.palette.mode === 'dark' ? theme.palette.table.contentDark : 'white',
  '&:hover': {
    backgroundColor: theme.palette.text.primary,
    borderColor:
      theme.palette.mode === 'dark' ? theme.palette.table.contentDark : 'white',
  },
}))

const NavigationButtons = (props) => {
  const { toBefore, toNext, toReturn } = props
  return (
    <Box
      sx={{
        widht: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: '1rem',
        marginTop: '1rem',
      }}
    >
      <ButtonGroup size="small">
        <StyledButton component={Link} to={toBefore}>
          <NavigateBeforeIcon />
        </StyledButton>
        <StyledButton component={Link} to={toNext}>
          <NavigateNextIcon />
        </StyledButton>
        {/* TODO: pass return icon */}
        <StyledButton component={Link} to={toReturn}>
          <FormatListBulletedIcon />
        </StyledButton>
      </ButtonGroup>
    </Box>
  )
}

export default NavigationButtons
