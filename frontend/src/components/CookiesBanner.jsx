import { useEffect } from 'react'

const cookieScriptId = import.meta.env.VITE_COOKIE_SCRIPT_ID

export default function CookiesBanner() {
  useEffect(() => {
    const script = document.createElement('script')

    script.src = `//cookie-script.com/s/${cookieScriptId}.js`
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])
}
