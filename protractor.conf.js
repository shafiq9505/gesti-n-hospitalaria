// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
    allScriptsTimeout: 60000,
    specs: [
        './e2e/**/*-spec.ts'
    ],
    suites: {
      patient: './e2e/patient-register/**/*-spec.ts'
    },
    capabilities: {
        'browserName': 'chrome'
    },
    directConnect: true,
    baseUrl: 'http://localhost:4200/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 60000,
        print: function() {}
    },
    onPrepare() {
        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
        });

        by.addLocator('formControlName', function(value, opt_parentElement, opt_rootSelector) {
          var using = opt_parentElement || document;
          return using.querySelectorAll('[formControlName="' + value +'"]');
        });
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        browser.ignoreSynchronization = true;
        jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    }
};
