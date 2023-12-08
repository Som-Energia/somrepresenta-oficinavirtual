/**
Subscriptable source for log and error messages.

This module provides functions to send messages
and a function to receive such messages,
to decouple providers and consumers.

Sources of messages just call one of the message functions:

- error(message)
- warn(message)
- success(message)
- info(message)
- log(message)

Presenters of such messages subscribe() a function
that will receive message objects.

- `level`: 'error', 'warning', 'info', 'success' or undefined (for log)
- `message`: a string to be displayed

IMPORTANT: `subscribe()` returns a function to unsubscribe. Use it.

*/

const _subscribers = new Set()
function _notify(message, level) {
  _subscribers.forEach((l) => l({ message, level }))
}

function subscribe(subscriber) {
  _subscribers.add(subscriber)
  return () => _subscribers.delete(subscriber)
}

function log(message) {
  _notify(message, undefined)
}

function error(message) {
  _notify(message, 'error')
}

function warn(message) {
  _notify(message, 'warning')
}

function info(message) {
  _notify(message, 'info')
}

function success(message) {
  _notify(message, 'success')
}

// Default handler, use the console
const disableConsoleMessages = subscribe(({ message, level }) => {
  const actions = {
    log: () => console.log(message),
    error: () => console.error('Error:', message),
    warning: () => console.warn('Warning:', message),
    info: () => console.info('Info:', message),
    success: () => console.log('Success:', message),
  }[level || 'log']()
})

export { error, warn, success, info, log, subscribe, disableConsoleMessages }
