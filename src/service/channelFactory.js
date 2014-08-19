/* global angular*/
define(function(require) {
    'use strict';

    var configurable = require('../util/configurable');

    var channelFactory = function($$asyncCallback, $injector) {
        var config = {
            asyncCallbackFactory: $$asyncCallback
        };


        var model = function() {
            return (function() {
                var subscribers = [];
                var send = function(message) {
                    return function() {
                        angular.forEach(subscribers, function(entry) {
                            var result = entry.subscriber(message);

                            if (result !== undefined && entry.postChannel !== undefined) {
                                if (result.then && typeof(result.then) === 'function') {

                                    return result.then(function(result) {
                                        entry.postChannel.send(result, true);
                                    });
                                }

                                entry.postChannel.send(result, true);
                            }
                        });
                    };
                };

                var channel = {
                    pipe: function(subscriber, multiple) {
                        multiple = multiple === true ? true : false;
                        var isChannel = subscriber.send && typeof(subscriber.send) === 'function';
                        if (isChannel) {
                            // If the subscriber is also a channel we link them together
                            subscriber = (function(subscriber) {
                                return function(message) {
                                    subscriber.send(message);
                                };
                            }(subscriber));
                        } else if (subscriber.length) {
                            subscriber = $injector.invoke(subscriber);
                        }

                        var postChannel = multiple || isChannel ? undefined : model();
                        subscribers.push({
                            subscriber: subscriber,
                            postChannel: postChannel
                        });
                        return multiple ? channel : (isChannel ? subscriber : postChannel);
                    },
                    pipeChain: function(subscriber) {
                        return channel.pipe(subscriber, true);
                    },
                    send: function(message, sync) {
                        sync = sync === true ? true : false;
                        if (sync) {
                            send(message)();
                            return;
                        }
                        config.asyncCallbackFactory(send(message));
                        return channel;
                    }
                };

                return channel;
            }());
        };

        configurable(model, config);

        return model;
    };

    channelFactory.$inject = ['$$asyncCallback', '$injector'];

    return channelFactory;
});
