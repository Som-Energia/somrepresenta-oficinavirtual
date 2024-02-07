import { useEffect } from 'react'

export default function CookiesBanner() {
  useEffect(() => {
    const script = document.createElement('script')

    script.src = '//cookie-script.com/s/7fd67909c826ccd5a817b2e250aa80fc.js'
    script.async = true
    document.body.appendChild(script)

  return () => {
      document.body.removeChild(script)
    }
  }, [])
}
