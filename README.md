<table>
        <tr>
            <td><img width="20" src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/archive.svg" alt="archived" /></td>
            <td><strong>Archived Repository</strong><br />
            This code is no longer maintained. Feel free to fork it, but use it at your own risks.
        </td>
        </tr>
</table>

ngChannel
===============

Brings channels to AngularJS.

# Installation

It is available with bower:

```
bower install ng-channel
```

Then add the retrieved files to your HTML layout:

```html
<script type="text/javascript" src="/path/to/bower_components/ng-channel/ng-channel.min.js"></script>
```

You can also use it with [RequireJS](http://requirejs.org/) as an AMD module.

Then add `ngChannel` as dependency for your AngularJS application:

```javascript
var app = angular.module('YOUR_APP', ['ngChannel']);
```

# Configuration

Out of the box, `ngChannel` uses `$$asyncCallback` from angular to call asynchronously the channels' subscribers. You can provide an another by calling `$channelFactory.asyncCallbackFactory(YOUR_FACTORY)`.

# Usage

ngChannel exposes a service `$channelFactory` to build channels:

```javascript
var channel = $channelFactory();
```

You can now `pipe` as many subscribers as you wish to your channel:

```javascript
channel.pipe(function(message) {
   // message is the one broadcasted in the channel
});

// if you wish you can use dependency injection
channel.pipe(['myService', function(myService) {
    return function(message) {
        // This is a subscriber but you can now deal with myService
    };
}]);
```

To send a message in the channel, call `send` method:

```javascript
channel.send('Yeah Ho!');
```

You can also pipe a channel with others channels:

```javascript
var otherChannel = $channelFactory();
channel.pipe(otherChannel);

otherChannel.pipe(function(message) {
   // this subcriber will also be triggered by any message send in `channel`
});
```

Furthermore you can pipe the output of a subscriber:

```javascript
channel.pipe(function(message) {
    return 'Ho!'
}).pipe(function(message) {
    // message is now `Ho!`
});

// If you wish you can also pipe it to another channel

channel.pipe(function(message) {
    return 'Ho!'
}).pipe(anotherChannel);
```

If you just want to add several subscribers at once on the same channel, you can use `pipeChain`:

```javascript
channel
    .pipeChain(function(message) {
        // it will receive message from channel
    })
    .pipeChain(function(message) {
        // it will receive message from channel and not from the previous subscriber
    });
```

Build
------

To rebuild the minified JavaScript you must run: `make build`.

Tests
-----
Install dependencies and run the unit tests:

```
make install
make test-spec
```

Contributing
------------

All contributions are welcome and must pass the tests. If you add a new feature, please write tests for it.

License
-------

This application is available under the MIT License, courtesy of [marmelab](http://marmelab.com).
