import axios from 'axios'

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
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((error) => {
      console.log({ error })
      throw error
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
  // TODO: escape document_name
  const response = await fetch(`/api/sign_document/${documentName}`, {
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

export default {
  logout,
  localLogin,
  externalLogin,
  localChangePassword,
  currentUser,
  signDocument,
}
