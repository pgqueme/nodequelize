var readCredentials = ['{{auth.read.user}}', '{{auth.read.password}}'];
var writeCredentials = ['{{auth.write.user}}', '{{auth.write.password}}'];
var deleteCredentials = ['{{auth.delete.user}}', '{{auth.delete.password}}'];

exports.read = readCredentials;
exports.write = writeCredentials;
exports.delete = deleteCredentials;