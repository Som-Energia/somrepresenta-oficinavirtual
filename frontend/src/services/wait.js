/**
Returns a promise that resolves in the specified time
in miliseconds.
This enables the following idioms:

wait(2000).then(()=>runMyDelayedCode())

async function f() {
  await wait(2000)
  runMyDelayedCode()
}


*/
export default function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}
