import io from 'socket.io-client';

export let socket;

let reconnection = true,
    reconnectionDelay = 0,
    reconnectionTry = 0;

export function init() {
    socket = io(process.env.REACT_APP_API_URL, {
        transports: ['websocket'],
        upgrade: false,
    });
    socket.on('connect', function (e) {
        routesClient(socket);
    });

    socket.on('connect_error', function (e) {
        reconnectionTry++;
        console.log('Reconnection attempt #' + reconnectionTry);
    });

    return false;
}

function routesClient(socket) {
    console.log('connected');

    socket.on('test', function (e) {
        console.log(e);
        socket.emit('test', 'pong');
    });

    socket.on('disconnect', function () {
        socket.disconnect();
        console.log('client disconnected');
        if (reconnection === true) {
            setTimeout(function () {
                console.log('client trying reconnect');
                init();
            }, reconnectionDelay);
        }
    });

    return false;
}

export function initClient() {
    init();
}
window.onload = function () {
    initClient();
};
