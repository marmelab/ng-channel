/*global define,describe,it,beforeEach,expect,inject,jasmine,waitsFor,runs*/

(function() {
    'use strict';

    describe('Service: $channelFactory', function () {

        var $channelFactory,
            $rootScope,
            $q,
            channel;

        beforeEach(module('ngChannel'));

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $channelFactory = $injector.get('$channelFactory');
            channel = $channelFactory();
        }));

        it('should call all piped subscribers', function() {
            var subscriber1 = jasmine.createSpy('subscriber1').andReturn('Ho Yeah!');
            var subscriber2 = jasmine.createSpy('subscriber2');
            var subscriber3 = jasmine.createSpy('subscriber3');

            channel.pipe(subscriber1).pipe(subscriber3);
            channel.pipe(subscriber2);
            channel.send('Yeah Ho!');

            $channelFactory.asyncCallbackFactory().flush();
            expect(subscriber1).toHaveBeenCalledWith('Yeah Ho!');
            expect(subscriber2).toHaveBeenCalledWith('Yeah Ho!');
            expect(subscriber3).toHaveBeenCalledWith('Ho Yeah!');
        });

        it('should allow to pipe channel', function() {
            var subscriber1 = jasmine.createSpy('subscriber1').andReturn('Ho Yeah!');
            var subscriber2 = jasmine.createSpy('subscriber2');
            var channel2 = $channelFactory();

            channel.pipe(subscriber1).pipe(channel2);
            channel2.pipe(subscriber2);
            channel.send('Yeah Ho!');
            $channelFactory.asyncCallbackFactory().flush();

            expect(subscriber1).toHaveBeenCalledWith('Yeah Ho!');
            expect(subscriber2).toHaveBeenCalledWith('Ho Yeah!');

            channel.pipe(channel2);
            subscriber2.reset();
            subscriber1.andReturn('Ho Yeah again!');

            channel.send('Yeah Ho again!');
            $channelFactory.asyncCallbackFactory().flush();

            expect(subscriber2).toHaveBeenCalledWith('Yeah Ho again!');
            expect(subscriber2).toHaveBeenCalledWith('Ho Yeah again!');
        });

        it('should allow to pipe multiple subscribers at once', function() {
            var subscriber1 = jasmine.createSpy('subscriber1').andReturn('Ho Yeah!');
            var subscriber2 = jasmine.createSpy('subscriber2');
            var subscriber3 = jasmine.createSpy('subscriber3');

            channel
                .pipeChain(subscriber1)
                .pipeChain(subscriber2)
                .pipeChain(subscriber3)
            ;

            channel.send('Yeah!');
            $channelFactory.asyncCallbackFactory().flush();

            expect(subscriber1).toHaveBeenCalledWith('Yeah!');
            expect(subscriber2).toHaveBeenCalledWith('Yeah!');
            expect(subscriber3).toHaveBeenCalledWith('Yeah!');
        });

        it('should handle when a subscriber returns a promise', function() {
            var deferred = $q.defer();
            var subscriber1 = jasmine.createSpy('subscriber1').andReturn(deferred.promise);
            var subscriber2 = jasmine.createSpy('subscriber2');

            channel.pipe(subscriber1).pipe(subscriber2);
            channel.send('Yeah!');
            $channelFactory.asyncCallbackFactory().flush();

            expect(subscriber1).toHaveBeenCalledWith('Yeah!');
            expect(subscriber2).not.toHaveBeenCalled();
            deferred.resolve('Ho!');
            $rootScope.$digest();

            expect(subscriber2).toHaveBeenCalledWith('Ho!');
        });

        it('should provide dependency injection for subscribers', function() {
            var subscriber = jasmine.createSpy('subscriber');
            var q;

            channel.pipe(['$q', function($q) {
                q = $q;
                return subscriber;
            }]);

            channel.send('Hey!');
            $channelFactory.asyncCallbackFactory().flush();

            expect(subscriber).toHaveBeenCalledWith('Hey!');
            expect(q).toBe($q);
        });
    });
}());
