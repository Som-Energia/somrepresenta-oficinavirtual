import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// TODO: This list must be updated if standard MUI typographies change
const standardTypographies = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'button',
  'overline',
]

const customTypographies = ['pagetitle', 'pagesubtitle', 'homeButtons']

export default function SomEnergiaTheme(isDarkMode) {
  const theme = createTheme({
    typography: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
      // Custom variant for home page paragraphs
      homeButtons: {
        fontSize: 22,
        fontWeight: 600,
        lineHeight: 1,
      },
      pagetitle: {
        fontSize: 20,
        fontWeight: 400, // from style guide
        lineHeight: 1,
      },
      pagesubtitle: {
        fontSize: 20,
        //fontWeight: 800, // from style guide
        fontWeight: 700, //
        lineHeight: 1,
      },
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
      },
      pagetitle: {
        main: '#4d4d4d',
      },
      table: {
        titleColor: 'rgb(150,182,51,0.7)',
        contentLight: 'rgba(0, 0, 0, 0.03)',
        contentDark: '#1A2027',
        line: '#8080804a',
      },
      chartlines: {
        production: '#96b633',
        foreseen: '#f2970f',
      },
    },
  })
  return responsiveFontSizes(theme, {
    variants: standardTypographies.concat(customTypographies),
  })
}
