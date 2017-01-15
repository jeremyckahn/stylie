require('!style-loader!raw-loader!sass-loader!../styles/main.sass');
const Stylie = require('stylie');

window.stylie = new Stylie(document.getElementById('stylie'));
