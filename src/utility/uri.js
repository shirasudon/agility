// @format

export const getWebSocketURIFromPageURI = (loc, path) => {
  let newURI
  if (loc.protocol === 'https:') {
    newURI = 'wss:'
  } else {
    newURI = 'ws:'
  }
  newURI += '//' + loc.host
  newURI += path
  return newURI
}
