function androidSaveBase64(filename, blob, mimetype) {
  // SomenergiaPlatform object is injected in mobile applications.
  // It offers a hook to regular downloads which are diabled by default.
  if (!window.SomenergiaPlatform) return
  // We need to convert the blob to base64
  var reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onloadend = function () {
    // Remove trailing url header
    let base64String = reader.result.replace(/.*,/, '')
    window.SomenergiaPlatform.saveBase64(filename, base64String, mimetype)
  }
  return true
}

function androidSaveUtf8(filename, text, mimetype) {
  // SomenergiaPlatform object is injected in mobile applications.
  // It offers a hook to regular downloads which are diabled by default.
  if (!window.SomenergiaPlatform) return false
  window.SomenergiaPlatform.saveUtf8(filename, text, mimetype)
  return true
}

/// Forces a download by creating a temporary download link and clicking it
function downloadUrl(filename, url, mimetype) {
  console.log({downloadUrl, filename, url, mimetype})
  const link = document.createElement('a')
  link.href = url
  if (filename) link.download = filename
  document.body.appendChild(link)
  link.click()
  // clean up
  document.body.removeChild(link)
}

/// Platform sensible download of a binary file
function downloadBlob(filename, blob, mimetype='application/octet-stream') {
  if (androidSaveBase64(filename, blob, mimetype)) return blob
  const url = window.URL.createObjectURL(new Blob([blob]))
  downloadUrl(filename, url, mimetype)
  URL.revokeObjectURL(url)
  return blob
}

/// Platform sensible download of a text based file
function downloadTextFile(filename, text, mimetype='text/plain') {
  if (androidSaveUtf8(filename, text, mimetype)) return text
  const url = `data:${mimetype};charset=utf-8,` + encodeURIComponent(text)
  downloadUrl(filename, url, mimetype)
}

export default { downloadTextFile, downloadBlob }
export { downloadTextFile, downloadBlob }
