
console.log('Starting to join notification channel');
const socket = io.socket;
function connectSocket() {
  socket.get('/notification/join', (data) => {
    console.log('/notification/join', data);
  });
}

connectSocket()
socket.on('reconnect', () => {
  console.log('socket reconnect');
  connectSocket();
});

function getParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function noty(data) {
  let options = {
    type: 'warning',
    layout: 'topRight', //top
    theme: 'mint',// bootstrap-v3
    text: 'msg',
    timeout: 3000,
    // progressBar: true,
    closeWith: ['click', 'button'],
    animation: {
      open: 'noty_effects_open',
      close: 'noty_effects_close'
    },
    id: false,
    force: false,
    killer: false,
    queue: 'global',
    container: false,
    buttons: [],
    // sounds: {
    //   sources: [],
    //   volume: 1,
    //   conditions: []
    // },
    // titleCount: {
    //   conditions: []
    // },
    modal: false
  };

  options.text = data.text;
  if(data.type)
    options.type = data.type;
  if(data.layout)
    options.layout = data.layout;
  new Noty(options).show();
}
