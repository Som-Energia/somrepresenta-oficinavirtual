/**
 * Returns the offset in hours of the timestamp from the referenceTimestamp
 *
 * Usefull to obtain the index in an array of continuous time series values.
 */
function time2index(referenceTimestamp, timestamp) {
  return (new Date(timestamp) - new Date(referenceTimestamp)) / 60 / 60 / 1000
}

/**
 * Returns a new time value after adding 'index' hours to the referenceTimestamp
 *
 * Useful to get timestamp of the nth value in an array of continuous time series
 * values.
 */
function index2time(referenceTimestamp, index) {
  return new Date(new Date(referenceTimestamp).getTime() + index * 60 * 60 * 1000)
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
function array2datapoints(first_timestamp, values, step_ms = 60 * 60 * 1000) {
  const base = first_timestamp.getTime()
  return values.map((value, i) => {
    return {
      date: base + i * step_ms,
      value,
    }
  })
}

export { time2index, index2time, array2datapoints }
export default { time2index, index2time, array2datapoints }
