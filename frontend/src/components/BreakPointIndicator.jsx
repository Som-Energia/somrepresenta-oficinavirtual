import Box from '@mui/material/Box'

export default function BreakPointIndicator() {
  return (
    <Box
      className="breakpoint-debug"
      sx={{
        position: 'absolute',
        bottom: '20%',
        right: '0%',
        zIndex: 100000,
        minWidth: '4rem',
        padding: '0.5rem 0.9rem',
        borderRadius: '5px',
        alignText: 'center',
        color: 'black',
        backgroundColor: {
          xs: '#9d9a',
          sm: '#9dda',
          md: '#99da',
          lg: '#d9da',
          xl: '#d99a',
        },
        '&:after': {
          marginInline: 'auto',
          content: {
            xs: '"xs"',
            sm: '"sm"',
            md: '"md"',
            lg: '"lg"',
            xl: '"xl"',
          },
        },
      }}
    />
  )
}
