import { beforeEach, afterEach, describe, expect, test, it } from 'vitest'

import { firstPendingDocument } from './signatures'

describe('firstPendingDocument', () => {
  function docversion(document, version) {
    return { document, version }
  }
  var date1 = '2001-01-01 00:00:00'
  var date2 = '2002-02-02 00:00:00'

  it('No documents to sign', () => {
    const required = []
    const signed = []
    expect(firstPendingDocument(required, signed)).toBe(null)
  })

  it('Single document to sign', () => {
    const required = [docversion('doc1', date1)]
    const signed = []
    expect(firstPendingDocument(required, signed)).toStrictEqual({
      document: 'doc1',
      version: date1,
    })
  })

  it('Single document already signed', () => {
    const required = [docversion('doc1', date1)]
    const signed = [docversion('doc1', date1)]
    expect(firstPendingDocument(required, signed)).toBe(null)
  })

  it('Old version signed, requires updated signature', () => {
    const required = [docversion('doc1', date2)]
    const signed = [docversion('doc1', date1)]
    expect(firstPendingDocument(required, signed)).toStrictEqual({
      document: 'doc1',
      version: date2,
    })
  })

  it('Newer versions signed, no signature required', () => {
    const required = [docversion('doc1', date1)]
    const signed = [docversion('doc1', date2)]
    expect(firstPendingDocument(required, signed)).toBe(null)
  })

  it('Many required documents', () => {
    const required = [docversion('doc1', date1), docversion('doc2', date1)]
    const signed = [docversion('doc1', date1)]
    expect(firstPendingDocument(required, signed)).toStrictEqual({
      document: 'doc2',
      version: date1,
    })
  })

  it('First unsigned document takes precedence', () => {
    const required = [docversion('doc1', date1), docversion('doc2', date1)]
    const signed = []
    expect(firstPendingDocument(required, signed)).toStrictEqual({
      document: 'doc1',
      version: date1,
    })
  })

  it('additional fields on required documents traspassed', () => {
    const required = [docversion('doc1', date1)]
    required[0].additional_field = 'additional value'
    const signed = []
    expect(firstPendingDocument(required, signed)).toStrictEqual({
      document: 'doc1',
      version: date1,
      additional_field: 'additional value',
    })
  })

  it('undefined signed as empty', () => {
    const required = [docversion('doc1', date1)]
    const signed = undefined
    expect(firstPendingDocument(required, signed)).toStrictEqual({
      document: 'doc1',
      version: date1,
    })
  })

  it('undefined required as empty', () => {
    const required = undefined
    const signed = [docversion('doc1', date1)]
    expect(firstPendingDocument(required, signed)).toBe(null)
  })
})
