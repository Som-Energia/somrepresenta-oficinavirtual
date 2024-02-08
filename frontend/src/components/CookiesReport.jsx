import { useEffect } from 'react'

export default function CookiesReport() {
  useEffect(() => {
    const script = document.createElement('script')

    script.src = "//report.cookie-script.com/r/7fd67909c826ccd5a817b2e250aa80fc.js"
    script.async = true
    document.body.appendChild(script)

  return () => {
      document.body.removeChild(script)
    }
  }, [])
}