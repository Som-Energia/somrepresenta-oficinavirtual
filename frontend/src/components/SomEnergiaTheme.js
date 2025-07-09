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
      fontFamily: '"Outfit", "Helvetica", "Arial", sans-serif',
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
        primary: isDarkMode ? '#bdbdbd' : '#0B2E34',
      },
      primary: {
        //main: '#96D600', //'hsl(78, 100%, 42%)', // from style guide
        main: '#0B2E34',
        contrastText: '#E2E8DE',
        light: '#CDFF80'
      },
      primary2: {
        main: '#ff632b',
        light: '#ffcdb5',
        alt: '#afb5e8'
      },
      secondary: {
        //main: '#E0E723', //'hsl(62, 80%, 52%)', // from style guide
        // main: '#a1a1a1', // from webforms-ui
        // main: '#e6cc00', // Original design
        main: '#E2E8DE', // From mentxu design 2023-10-26
      },
      pagetitle: {
        main: '#0B2E34',
      },
      table: {
        titleColor: '#0c4c27',
        contentLight: 'rgba(0, 0, 0, 0.03)',
        contentDark: '#1A2027',
        line: '#8080804a',
      },
      chartlines: {
        production: '#96b633',
        foreseen: '#f2970f',
      },
      bar: {
        background: '#FFFFFFFF',
        color: '#0B2E34',
      }
    },
  })
  return responsiveFontSizes(theme, {
    variants: standardTypographies.concat(customTypographies),
  })
}
