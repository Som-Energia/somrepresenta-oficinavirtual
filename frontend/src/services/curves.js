/**
 * Returns the offset in hours of the timestamp from the referenceTimestamp
 *
 * Usefull to obtain the index in an array of continuous time series values.
 */
function time2index(referenceTimestamp, timestamp, step_mm = 60) {
  return (new Date(timestamp) - new Date(referenceTimestamp)) / step_mm / 60 / 1000
}

/**
 * Returns a new time value after adding 'index' hours to the referenceTimestamp
 *
 * Useful to get timestamp of the nth value in an array of continuous time series
 * values.
 */
function index2time(referenceTimestamp, index, step_mm = 60) {
  return new Date(new Date(referenceTimestamp).getTime() + index * step_mm * 60 * 1000)
}

/**
 * Given the first timestamp as Date and an array of sequencial values,
 * returns an array of point objects having as attributes
 * 'value' with each value and 'date' with the corresponding timestamp
 * in miliseconds since epoch.
 * By default, the gap between values is set to an hour in milliseconds.
 *
 * This representation is used for compatibility with legacy widgets.
 * For more performance, use indexes with time2index and index2time.
 */
function array2datapoints(first_timestamp, values, step_mm = 60) {
  const base = first_timestamp.getTime()
  return values.map((value, i) => {
    return {
      date: base + i * step_mm * 60 * 1000,
      value,
    }
  })
}

function timeInterval(scope, current_date) {
  const start = new Date(current_date)
  start.setHours(1)
  start.setMinutes(0)
  start.setSeconds(0)
  start.setMilliseconds(0)

  if (scope === 'MONTHLY') {
    start.setDate(1)
  }
  if (scope === 'YEARLY') {
    start.setDate(1) // Month days are 1 based
    start.setMonth(0) // Month are 0 based
  }
  if (scope === 'WEEKLY') {
    var weekday_shift = (start.getDay() + 6) % 7
    start.setDate(start.getDate() - weekday_shift)
  }

  const end = new Date(start)
  switch (scope) {
    case 'DAILY':
      end.setDate(end.getDate() + 1)
      break
    case 'MONTHLY':
      end.setMonth(end.getMonth() + 1)
      break
    case 'YEARLY':
      end.setFullYear(end.getFullYear() + 1)
      break
    case 'WEEKLY':
      end.setDate(end.getDate() + 7)
      break
  }
  return [start, end]
}

function timeSlice(timeOffset, values, indexStart, indexEnd, step_mm = 60) {
  var adjustedIndexStart = Math.max(0, indexStart)
  const newTimeOffset = index2time(timeOffset, adjustedIndexStart, step_mm)
  console.log('timeSlice step_ms',step_mm)
  return array2datapoints(newTimeOffset, values.slice(adjustedIndexStart, indexEnd), step_mm)
}

function sliceIndexes(offsetDate, period, currentTime, step_mm = 60) {
  var [startTime, endTime] = timeInterval(period, currentTime)
  var startIndex = time2index(offsetDate, startTime, step_mm)
  var endIndex = time2index(offsetDate, endTime, step_mm)
  return [startIndex, endIndex]
}

export { time2index, index2time, array2datapoints, timeInterval, timeSlice, sliceIndexes }
export default {
  time2index,
  index2time,
  array2datapoints,
  timeInterval,
  timeSlice,
  sliceIndexes,
}
