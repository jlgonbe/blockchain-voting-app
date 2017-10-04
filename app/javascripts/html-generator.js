'use strict';

let addAlert = (type, message) => {
    return '<div class="alert alert-' + type + ' alert-dismissable">' +
             '<a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>' +
             '<h4>' + message + '</h4>' +
           '</div>';
};

module.exports = {
    addAlert: addAlert
};
