gyro.stopTracking() // Stop periodic calls
gyro.calibrate() // Calibrate measurement during the page loading
const speed = 0.01 // A arbitrary speed ...
let lastTimestamp = null
const refresh = function (timestamp) {
  if (lastTimestamp !== null) {
    // execute only if timestamp is valued
    const delay = timestamp - lastTimestamp // duration since the last call
    const o = gyro.getOrientation() // retrieves the last measures
    const step = speed * delay
    // Apply step on the background-position in our example, but
    // you can use directly the angles for a CSS rotation property
    // for instance.
  }
  lastTimestamp = timestamp // save current timestamp for the next call
  window.requestAnimationFrame(refresh) // call for the next refresh (max 60 times per seconde)
}
window.requestAnimationFrame(refresh) // first call
