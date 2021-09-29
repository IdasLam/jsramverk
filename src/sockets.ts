import socketIOClient from 'socket.io-client'

const ENDPOINT = window.location.hostname.includes('localhost')
    ? 'http://127.0.0.1:1337'
    : 'https://jsramverk-editor-idla18.azurewebsites.net'

const socket = socketIOClient(ENDPOINT, { withCredentials: true, autoConnect: false })

export default socket
