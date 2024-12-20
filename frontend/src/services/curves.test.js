import { beforeEach, afterEach, describe, expect, test, it } from 'vitest'

import {
  array2datapoints,
  time2index,
  index2time,
  timeInterval,
  timeSlice,
} from './curves'

const d_2020_02_02_Z = '2020-02-02T00:00:00Z'
const d_2020_02_03_Z = '2020-02-03T00:00:00Z'
const d_2020_08_02_Z = '2020-08-02T00:00:00Z'
// TODO: make local dates timezone explicit (Will fail in a different locale))
const d_2020_02_02_M = '2020-02-02T00:00:00'
const d_2020_08_02_M = '2020-08-02T00:00:00'
// last sunday of march that year
const pre_summer_daylight = '2020-03-29T00:00:00'
const post_summer_daylight = '2020-03-30T00:00:00'
// last sunday of october that year
const pre_winter_daylight = '2020-10-25T00:00:00'
const post_winter_daylight = '2020-10-26T00:00:00'

describe('array2datapoints', () => {
  it('converts array', () => {
    const baseDate = new Date(d_2020_08_02_M)
    const base = 1596319200000 // baseDate.getTime()
    expect(array2datapoints(baseDate, [1, 2, 3, 4, 5, null])).toStrictEqual([
      { value: 1, date: base + 0 * 3600000 },
      { value: 2, date: base + 1 * 3600000 },
      { value: 3, date: base + 2 * 3600000 },
      { value: 4, date: base + 3 * 3600000 },
      { value: 5, date: base + 4 * 3600000 },
      { value: null, date: base + 5 * 3600000 },
    ])
  })
})

describe('time2index', () => {
  it('reference time is zero', () => {
    expect(time2index(d_2020_02_02_Z, d_2020_02_02_Z)).toBe(0)
  })
  it('next day is 24', () => {
    expect(time2index(d_2020_02_02_Z, d_2020_02_03_Z)).toBe(24)
  })
  it('passing Date object', () => {
    expect(time2index(new Date(d_2020_02_02_Z), new Date(d_2020_02_03_Z))).toBe(24)
  })
  it('prev day is -24', () => {
    expect(time2index(d_2020_02_03_Z, d_2020_02_02_Z)).toBe(-24)
  })
  it('Madrid offset is an hour in winter', () => {
    expect(time2index(d_2020_02_02_M, d_2020_02_02_Z)).toBe(1)
  })
  it('Madrid offset is two hours in summer', () => {
    expect(time2index(d_2020_08_02_M, d_2020_08_02_Z)).toBe(2)
  })
  it('Summer daylight day has 23 hours', () => {
    expect(time2index(pre_summer_daylight, post_summer_daylight)).toBe(23)
  })
  it('Winter daylight day has 25 hours', () => {
    expect(time2index(pre_winter_daylight, post_winter_daylight)).toBe(25)
  })
  // TODO: Unexpected inputs
})

describe('index2time', () => {
  it('Winter daylight day has 25 hours', () => {
    expect(index2time(pre_summer_daylight, 1)).toStrictEqual(
      new Date('2020-03-29T01:00:00'),
    )
    expect(index2time(pre_summer_daylight, 2)).toStrictEqual(
      new Date('2020-03-29T02:00:00'),
    )
    expect(index2time(pre_summer_daylight, 2)).toStrictEqual(
      new Date('2020-03-29T03:00:00'), // advanced
    )
    expect(index2time(pre_summer_daylight, 3)).toStrictEqual(
      new Date('2020-03-29T04:00:00'),
    )
  })
  // TODO: Unexpected inputs
})

describe('timeInterval', () => {
  it('Day time interval, current start of day', () => {
    expect(timeInterval('DAILY', new Date('2020-03-02T01:00:00'))).toStrictEqual([
      new Date('2020-03-02T01:00:00'),
      new Date('2020-03-03T01:00:00'),
    ])
  })
  it('Day time interval, within day', () => {
    expect(timeInterval('DAILY', new Date('2020-03-02T09:00:00'))).toStrictEqual([
      new Date('2020-03-02T01:00:00'),
      new Date('2020-03-03T01:00:00'),
    ])
  })
  it('Day time interval, within day in UTC offset affects', () => {
    expect(timeInterval('DAILY', new Date('2020-03-01T23:10:00Z'))).toStrictEqual([
      new Date('2020-03-02T01:00:00'),
      new Date('2020-03-03T01:00:00'),
    ])
  })
  it('Day time interval, within day in UTC offset does not affect', () => {
    expect(timeInterval('DAILY', new Date('2020-03-02T22:10:00Z'))).toStrictEqual([
      new Date('2020-03-02T01:00:00'),
      new Date('2020-03-03T01:00:00'),
    ])
  })
  it('Month time interval, within month', () => {
    expect(timeInterval('MONTHLY', new Date('2020-03-02T22:10:00Z'))).toStrictEqual([
      new Date('2020-03-01T01:00:00'),
      new Date('2020-04-01T01:00:00'),
    ])
  })
  it('Year time interval, within year', () => {
    expect(timeInterval('YEARLY', new Date('2020-03-02T22:10:00Z'))).toStrictEqual([
      new Date('2020-01-01T01:00:00'),
      new Date('2021-01-01T01:00:00'),
    ])
  })
  it('Week time interval, monday', () => {
    expect(timeInterval('WEEKLY', new Date('2020-03-02T22:10:00Z'))).toStrictEqual([
      new Date('2020-03-02T01:00:00'),
      new Date('2020-03-09T01:00:00'),
    ])
  })
  it('Week time interval, tuesday', () => {
    expect(timeInterval('WEEKLY', new Date('2020-03-03T22:10:00Z'))).toStrictEqual([
      new Date('2020-03-02T01:00:00'),
      new Date('2020-03-09T01:00:00'),
    ])
  })
  it('Week time interval, sunday', () => {
    expect(timeInterval('WEEKLY', new Date('2020-03-08T22:10:00Z'))).toStrictEqual([
      new Date('2020-03-02T01:00:00'),
      new Date('2020-03-09T01:00:00'),
    ])
  })
  it('Week time interval, sunday, crossing months', () => {
    expect(timeInterval('WEEKLY', new Date('2020-03-01T22:10:00Z'))).toStrictEqual([
      new Date('2020-02-24T01:00:00'),
      new Date('2020-03-02T01:00:00'),
    ])
  })
})

describe('timeSlice', () => {
  it('no offset', () => {
    const baseDate = new Date(d_2020_08_02_M)
    const base = 1596319200000 // baseDate.getTime()
    expect(timeSlice(baseDate, [1, 2, 3, 4, 5, 6], 0, 6)).toStrictEqual([
      { value: 1, date: base + 0 * 3600000 },
      { value: 2, date: base + 1 * 3600000 },
      { value: 3, date: base + 2 * 3600000 },
      { value: 4, date: base + 3 * 3600000 },
      { value: 5, date: base + 4 * 3600000 },
      { value: 6, date: base + 5 * 3600000 },
    ])
  })
  it('offsets inside array', () => {
    const baseDate = new Date(d_2020_08_02_M)
    const base = 1596319200000 // baseDate.getTime()
    expect(timeSlice(baseDate, [1, 2, 3, 4, 5, 6], 2, 4)).toStrictEqual([
      { value: 3, date: base + 2 * 3600000 },
      { value: 4, date: base + 3 * 3600000 },
    ])
  })
  it('starting before the data', () => {
    const baseDate = new Date(d_2020_08_02_M)
    const base = 1596319200000 // baseDate.getTime()
    expect(timeSlice(baseDate, [1, 2, 3, 4, 5, 6], -2, 4)).toStrictEqual([
      { value: 1, date: base + 0 * 3600000 },
      { value: 2, date: base + 1 * 3600000 },
      { value: 3, date: base + 2 * 3600000 },
      { value: 4, date: base + 3 * 3600000 },
    ])
  })
  it('ending after the data', () => {
    const baseDate = new Date(d_2020_08_02_M)
    const base = 1596319200000 // baseDate.getTime()
    expect(timeSlice(baseDate, [1, 2, 3, 4, 5, 6], 0, 8)).toStrictEqual([
      { value: 1, date: base + 0 * 3600000 },
      { value: 2, date: base + 1 * 3600000 },
      { value: 3, date: base + 2 * 3600000 },
      { value: 4, date: base + 3 * 3600000 },
      { value: 5, date: base + 4 * 3600000 },
      { value: 6, date: base + 5 * 3600000 },
    ])
  })
})
