import { beforeEach, afterEach, describe, expect, test, it } from 'vitest'

import { firstPendingDocument } from './signatures'

// Remove when real tests are available
describe('firstPendingDocument', () => {
  function docversion(document, version) {
    return { document, version }
  }
  var date1 = '2001-01-01 00:00:00'
  var date2 = '2001-01-01 00:00:00'

  it('No documents to sign', () => {
    const required = []
    const signed = []
    expect(firstPendingDocument(signed, required)).toBe(null)
  })

  it('Single document to sign', () => {
    const required = [docversion('doc1', date1)]
    const signed = []
    expect(firstPendingDocument(signed, required)).toBe(null)
  })
})
