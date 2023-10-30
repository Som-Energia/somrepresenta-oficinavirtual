import Box from '@mui/material/Box'

export default function BreakPointIndicator() {
  // This component only shows on dev mode or by enabling it in config
  const enabledByConfig = import.meta.env.VITE_ENABLE_BREAKPOINT_INDICATOR == false // intended ==
  if (!import.meta.env.DEV && enabledByConfig) return null

  return (
    <Box
      className="breakpoint-debug"
      sx={{
        position: 'fixed',
        bottom: '20%',
        right: '0%',
        zIndex: 100000,
        minWidth: '4rem',
        padding: '0.5rem 0.9rem',
        borderRadius: '5px',
        alignText: 'center',
        color: 'black',
        backgroundColor: {
          xs: '#d99a',
          sm: '#d9da',
          md: '#99da',
          lg: '#9dda',
          xl: '#9d9a',
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
