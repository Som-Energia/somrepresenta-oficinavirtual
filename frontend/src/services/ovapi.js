import axios from 'axios'
import wait from './wait'
import messages from './messages'
import i18n from '../i18n/i18n'

function handleCommonErrors(context) {
  return (error) => {
    const t = i18n.t

    console.log(`Error ${error.code} ${context}\n${error.message}`)
    if (error.code === 'ERR_NETWORK') {
      messages.error(t('OVAPI.ERR_NETWORK'), { context })
      return
    }
    // The server returned an error response
    if (error.response) {
      // Gateway error (ERP down)
      if (error.response.status === 502) {
        messages.error(t('OVAPI.ERR_GATEWAY'), { context })
        return
      }
      // API unexpected error
      if (error.response.status === 500) {
        const unreference = '42-666-137' // A 'random' number when no reference
        const reference = error.response.data.reference ?? unreference
        messages.error(t('OVAPI.ERR_INTERNAL', { reference }), {
          context,
        })
        return
      }
    }
    messages.error(`${error.code}: ${error.message}`)
    throw error
  }
}

async function logout() {
  axios
    .get('/api/auth/logout', {
      headers: {
        Accept: 'application/json',
        ContentType: 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response)
    })
}

async function currentUser() {
  const response = await fetch('/api/me')
  if (response.ok === false) {
    const error = await response.json()
    console.error('Login status:', error.detail)
    return null
  }
  const user = await response.json()
  return user
}

async function localLogin(username, password) {
  const context = i18n.t('OVAPI.CONTEXT_LOGIN')
  const formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)
  return axios
    .post('/api/auth/token', formData, {
      headers: {
        Accept: 'application/json',
        ContentType: 'multipart/form-data',
      },
    })
    .catch(handleCommonErrors(context))
    .then((response) => {
      if (response === undefined) {
        return
      }
      return response
    })
}

async function externalLogin(providerId) {
  window.location = `/oauth2/${providerId}/authorize`
  return
  // TODO: use a popup, pending how to close it afterwards
  var pop = window.open(
    `/oauth2/${providerId}/authorize`,
    '_blank',
    'location=yes,height=570,width=520,scrollbars=yes,status=yes',
  )
  return
  // TODO: How to close it after login
  setInterval(function () {
    if (pop.location.href.indexOf('https://accounts.google.com/AddSession') === 0) {
      pop.close()
    }
  }, 1)
}

async function localChangePassword(currentPassword, newPassword) {
  return axios
    .post(
      '/api/auth/change_password',
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
      {
        headers: {
          Accept: 'application/json',
          ContentType: 'application/json',
        },
      },
    )
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((error) => {
      console.log('Error received', error.response.data)
      throw 'Unable to change the password'
    })
}

async function signDocument(documentName) {
  const encodedDocument = encodeURIComponent(documentName)
  const response = await fetch(`/api/sign_document/${encodedDocument}`, {
    method: 'POST',
  })
    .catch((error) => {
      console.log('Error received', error.response.json())
      throw 'Unable to sign document'
    })
    .then(async (response) => {
      console.log('Response', response)
      if (!response.ok) {
        throw `Unable to sign document: ${await response.text()}`
      }
      return response.json()
    })
  return response
}

async function version() {
  return axios
    .get('/api/version')
    .then((result) => result.data.version)
    .catch((error) => {
      throw error
    })
}

async function installations() {
  const context = i18n.t('OVAPI.CONTEXT_INSTALLATIONS')
  return axios
    .get('/api/installations')
    .catch(handleCommonErrors(context))
    .then((result) => (result?.data === undefined ? [] : result.data))
}

export default {
  version,
  logout,
  localLogin,
  externalLogin,
  localChangePassword,
  currentUser,
  signDocument,
  installations,
}
