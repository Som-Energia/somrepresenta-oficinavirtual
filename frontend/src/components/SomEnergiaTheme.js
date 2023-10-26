import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export default function SomEnergiaTheme(isDarkMode) {
  return responsiveFontSizes(
    createTheme({
      typography: {
        fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
        // Custom variant for home page paragraphs
        brochureP: {
          fontSize: 18,
        },
        homeButtons: {
          fontSize: 22,
          fontWeight: 'bold',
        },
        pagetitle: {
          fontSize: 20,
          fontWeight: 400,
        },
        pagesubtitle: {
          fontSize: 20,
          fontWeight: 700,
        }
      },
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        //contrastThreshold: 0.2, // From webforms-ui
        contrastThreshold: 4.5, // Recommended by WCAG 2.1 Rule 1.4.3
        tonalOffset: 0.2,
        text: {
          primary: isDarkMode ? '#bdbdbd' : '#4d4d4d',
        },
        primary: {
          //main: '#96D600', //'hsl(78, 100%, 42%)', // from style guide
          main: '#96b633', // from webforms-ui
          contrastText: 'white',
        },
        secondary: {
          //main: '#E0E723', //'hsl(62, 80%, 52%)', // from style guide
          // main: '#a1a1a1', // from webforms-ui
          // main: '#e6cc00', // Original design
          main: '#e2e2e2', // From mentxu design 2023-10-26
          contrastText: 'white',
        },
        pagetitle: {
          main: '#444',
        }

      },
    }),
  )
}
