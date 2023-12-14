import axios from 'axios'
import messages from './messages'
import i18n from '../i18n/i18n'

function handleCommonErrors(context) {
  return (error) => {
    const t = i18n.t

    console.log(`Error ${error.code} ${context}\n${error.message}`)
    if (error.code === 'ERR_NETWORK') {
      messages.error(t('OVAPI.ERR_NETWORK'), { context })
      return {
        error: t('OVAPI.ERR_NETWORK'),
      }
    }
    // The server returned an error response
    if (error.response) {
      // Gateway error (ERP down)
      if (error.response.status === 502) {
        messages.error(t('OVAPI.ERR_GATEWAY'), { context })
        return {
          error: t('OVAPI.ERR_GATEWAY'),
        }
      }
      // API unexpected error
      if (error.response.status === 500) {
        const unreference = '42-666-137' // A 'random' number when no reference
        const reference = error.response.data.reference ?? unreference
        messages.error(t('OVAPI.ERR_INTERNAL', { reference }), {
          context,
        })
        return {
          error: t('OVAPI.ERR_INTERNAL', { reference }),
          reference: reference,
        }
      }
    }
    throw error
  }
}

function handleHttpStatus(status, result) {
  return (error) => {
    if (error.response && error.response.status === status) return result
    throw error
  }
}

function handleRemainingErrors(context) {
  return (error) => {
    // TODO: Obtain better info from axios error
    messages.error(`${error.code}: ${error.message}`, { context })
    return {
      error: "Unexpected error"
    }
  }
}

async function version() {
  return axios
    .get('/api/version')
    .then((result) => result.data.version)
    .catch((error) => {
      throw error
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
    .catch(
      handleHttpStatus(401, {
        error: i18n.t('LOGIN.VALIDATION_ERROR'),
        code: 'VALIDATION_ERROR',
      }),
    )
    .catch(handleRemainingErrors(context))
    .then((result) => {
      console.log(result)
      if (result.ok) return result.data
      return result
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

function signDocument(documentName) {
  const context = i18n.t('OVAPI.CONTEXT_SIGNING_DOCUMENT')
  const encodedDocument = encodeURIComponent(documentName)
  return axios
    .post(`/api/sign_document/${encodedDocument}`)
    .catch(handleCommonErrors(context))
    .catch(handleRemainingErrors(context))
    .then((response) => {
      if (response.error) {
        throw {
          error: i18n.t('OVAPI.ERR_UNABLE_TO_SIGN_DOCUMENT')
        }
      }
      return response.data
    })
}

async function installations() {
  const context = i18n.t('OVAPI.CONTEXT_INSTALLATIONS')
  return axios
    .get('/api/installations')
    .catch(handleCommonErrors(context))
    .catch(handleRemainingErrors(context))
    .then((result) => {
      if (result.error !== undefined) {
        return [] // TODO: raise and handle in user
      }
      return result.data
    })
}

async function installationDetails(contract_number) {
  const context = i18n.t('OVAPI.CONTEXT_INSTALLATION_DETAILS')
  return axios
    .get(`/api/installation_details/${contract_number}`)
    .catch(handleCommonErrors(context))
    .catch(handleRemainingErrors(context))
    .then((result) => {
      if (result.error !== undefined) {
        throw result
      }
      return result.data
    })
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
  installationDetails,
}
