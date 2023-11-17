/**
  Returns the first document in requiredDocuments not available
  in signedDocuments in an updated version.
  Objects in both arrays at least contain 'document' and 'version'
  properties.
*/

function firstPendingDocument(requiredDocuments, signedDocuments) {
  // consider undefined as empty
  signedDocuments ??= []
  requiredDocuments ??= []

  // build a hash for signed: document -> version
  const signed = Object.fromEntries(signedDocuments.map((d) => [d.document, d.version]))

  for (const required of requiredDocuments) {
    const signedVersion = signed[required.document]
    // Not signed ever
    if (signedVersion === undefined) return required
    // Signed but an older version
    if (signedVersion < required.version) return required
  }
  return null
}

export { firstPendingDocument }
