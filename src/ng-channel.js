/*global angular */
define(function(require) {
    'use strict';

    var module = angular.module('ngChannel', []);

    module.factory('$channelFactory', require('service/channelFactory'));

    return module;
});
