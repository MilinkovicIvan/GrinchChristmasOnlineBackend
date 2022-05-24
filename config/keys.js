// if status is in production than get info from prod.js
// else take from dev.js
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod.js');
}
else {
    module.exports = require('./dev.js');
}