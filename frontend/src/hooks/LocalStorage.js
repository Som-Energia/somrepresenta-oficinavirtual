import React from 'react'

/**
Hook to store a persistent state in local storage.

The state is shared among any component using it
from any tab of the same browser
accessing any application hosted in the same domain.

A null value means the value is unset.
Setting the state to null unsets it.
Any other value is converted to string including undefined.
The initial value is set only if the value is unset
on component initialization.
Initial value of undefined is ignored.
*/

function decode(json) {
  const value = json === null ? null : JSON.parse(json)
  return value
}

function encodeValue(value) {
  const json = value === null ? null : JSON.stringify(value)
  return json
}

export default function useLocalStorage(key, initialValue) {
  function setStorage(value) {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, encodeValue(value))
  }

  const [state, setState] = React.useState(() => {
    const storedValue = localStorage.getItem(key)
    if (storedValue === null) {
      if (initialValue !== undefined) {
        setStorage(initialValue)
      }
    }
    return decode(localStorage.getItem(key))
  })
  // Update state when changed from other tab
  React.useEffect(() => {
    const listener = (e) => {
      if (e.key === key) {
        setState(decode(e.newValue))
      }
    }
    window.addEventListener('storage', listener)
    return () => {
      window.removeEventListener('storage', listener)
    }
  }, [])
  // Offer a setter that updates the storage
  // The state is set to the actual storage value (str conversion or null)
  const persistentSetState = React.useCallback((value) => {
    setStorage(value)
    setState(value)
  })
  return [state, persistentSetState]
}
