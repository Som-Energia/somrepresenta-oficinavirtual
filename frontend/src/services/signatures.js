/**
  Returns the first document in requiredDocuments not available
  in signedDocuments in an updated version.
*/
function firstPendingDocument(requiredDocuments, signedDocuments) {
  const signed = Object.fromEntries(signedDocuments.map((d) => [d.document, d.version]))
  for (const required of requiredDocuments) {
    const signedVersion = signed[required.document]
    if (signedVersion === undefined) return required
    if (signedVersion < required.version) return required
  }
  return null

  /*
  signedDocuments = signedDocuments || []
  const signed = Object.fromEntries(signedDocuments.map((d) => [d.document, d.version]))
  for (const required of requiredDocuments) {
    const signedVersion = signed[required.document]
    // Not signed ever
    if (signedVersion === undefined) return required
    // Signed but an older version
    if (signedVersion < required.version) return required
  }
  return null
  */
}

export { firstPendingDocument }
