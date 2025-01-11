/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light', // Choose your default theme (light or dark)
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FAFBFB',
        },
      },
      typography: {
        fontFamily: '"Inter", sans-serif', // Apply Inter as the global font
      },
    },
  },
})
