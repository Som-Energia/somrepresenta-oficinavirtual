import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

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
  const { toBefore, toNext, toReturn, returnIcon } = props

  return (
    <Box
      sx={{
        width: '100%',
        ml: '.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: '1rem',
        marginTop: '1rem',
      }}
    >
      <ButtonGroup size="small">
        {toBefore && (
          <StyledButton component={Link} to={toBefore}>
            <NavigateBeforeIcon />
          </StyledButton>
        )}
        {toNext && (
          <StyledButton component={Link} to={toNext}>
            <NavigateNextIcon />
          </StyledButton>
        )}
        <StyledButton component={Link} to={toReturn}>
          {returnIcon}
        </StyledButton>
      </ButtonGroup>
    </Box>
  )
}

export default NavigationButtons
