/**
  Returns the first document in requiredDocuments not available
  in signedDocuments in an updated version.
*/
function firstPendingDocument(requiredDocuments, signedDocuments) {
  const signed = Object.fromEntries(signedDocuments.map((d) => [d.document, d.version]))
  if (requiredDocuments.length > 0) {
    const required = requiredDocuments[0]
    if (signed[required.document] === undefined) return required
    if (signed[required.document] !== required.version) return required
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
