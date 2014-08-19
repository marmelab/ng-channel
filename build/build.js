({
    baseUrl: "../src",
    name: "../bower_components/almond/almond.js",
    include: ['ng-channel'],
    insertRequire: ['ng-channel'],
    wrap: {
        startFile: '../build/start.frag',
        endFile: '../build/end.frag'
    },
    out: '../ng-channel.min.js'
})
