let socket = null;

export const connectSocket = () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/reload-api'
        + '/', "http"
    )
    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }

  return socket;
};
