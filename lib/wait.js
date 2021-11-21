module.exports = async function wait (time) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve()
    }, time)
    skipWait = () => {
      clearTimeout(timeout)
      resolve()
    }
  })
}
