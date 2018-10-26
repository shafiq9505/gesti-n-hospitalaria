import { PatientRegistryPage, ScreenShot, LoginPage } from '../app.po';
var faker = require('faker');

describe('Patient Registry', () => {

  let page: PatientRegistryPage;
  let loginPage: LoginPage;
  let screenshot: ScreentShot;

  beforeEach(() => {
      page = new PatientRegistryPage();
      loginPage = new LoginPage();
      screenshot = new ScreenShot();
  });

  it('should register patient successfully', () => {

    loginPage.login();
    // expect(loginPage.getTitle()).toEqual('LOGIN TO YOUR ACCOUNT');

    // expect(element(by.id('title')).getText()).toEqual('LOGIN TO YOUR ACCOUNT');

    element(by.formControlName('email')).sendKeys('hazim@p2digital.com');

    element(by.formControlName('password')).sendKeys('dig62xai');

    element(by.css('.submit-button')).click();

    var urlChanged = function(dom) {
      return browser.getCurrentUrl().then(function(url) {
        return url === browser.baseUrl + 'branches';
      });
    };
    browser.wait(urlChanged, 10000);

    // expect(element(by.id('pagetitle'))).toEqual('Team Patients');

    // browser.sleep(2000);

    // page.navigateTo();
    element(by.id('menutoolbar')).click();
    element(by.id('Patient Register')).click();

    // element(by.id('register-patient')).click();

    var urlChanged = function(dom) {
      return browser.getCurrentUrl().then(function(url) {
        return url === browser.baseUrl + 'patient-register';
      });
    };
    browser.wait(urlChanged, 10000);

    expect(page.getTitle()).toEqual('Patient Registration');

    //fill in the form
    // element(by.css("input[formControl='fname']")).sendKeys('Mohd Hazim Nordin');
    element(by.formControlName('fname')).sendKeys(faker.name.firstName());

    element(by.formControlName('lname')).sendKeys(faker.name.lastName());

    browser.takeScreenshot().then(function (png) {
            screenshot.write(png, './e2e/snapshots/section1.png');
          });


    // Generate 14 digit IC Number
    element(by.formControlName('ic')).sendKeys(Math.floor(Math.random()*90000000000000) + 10000000000000);
    element(by.formControlName('mrn')).sendKeys('MRN1001');
    element(by.formControlName('birthday')).sendKeys('01-27-1978');
    element.all(by.formControlName('sex')).get(0).click();
    element(by.formControlName('alamat')).sendKeys(faker.address.streetAddress());
    element(by.formControlName('bandar')).sendKeys(faker.address.city());
    element(by.formControlName('poskod')).sendKeys(faker.address.zipCode());
    element(by.formControlName('negeri')).sendKeys(faker.address.county());

    element(by.formControlName('negara')).click();
    $('.mat-option[value="Malaysia"]').click();
    element(by.id('s1next')).click();

    browser.wait(function() {
      return element(by.id('Section2')).isPresent();
    }, 5000);


    expect(element(by.id("Section2")).getText()).toBe('Citizenship:');

    element(by.formControlName('citizen')).all(by.tagName('mat-radio-button')).get(1).click();

    // element.all(by.css('ethnic_radio')).get(1).click();
    element(by.formControlName('ethnic')).all(by.tagName('mat-radio-button')).get(1).click();

    element(by.formControlName('religion')).all(by.tagName('mat-radio-button')).get(1).click();

    element(by.formControlName('marital')).click();
    $('.mat-option[value="married"]').click();

    element(by.formControlName('living')).sendKeys('Father');
    element(by.formControlName('accommodation')).sendKeys('House');

    element(by.formControlName('education')).all(by.tagName('mat-radio-button')).get(1).click();

    element(by.formControlName('fee')).click();
    $('.mat-option[value="True"]').click();

    element(by.formControlName('work')).click();
    $('.mat-option[value="accounting"]').click();

    browser.takeScreenshot().then(function (png) {
            screenshot.write(png, './e2e/snapshots/section2.png');
          });

    browser.wait(function() {
      return element(by.id('s2next')).getAttribute('disabled').then(function(value){
        return value == null;
      });
    }, 5000);

    // expect(element(by.id('s2next')).getAttribute('disabled')).toBe(null);

    element(by.id('s2next')).click();


    browser.wait(function() {
      return element(by.id('Section3')).isPresent();
    }, 5000);



    // element(by.formControlName('allergies')).click();
    element(by.id("allergy-0")).click();

    element(by.id("allergy-3")).click();
    browser.takeScreenshot().then(function (png) {
            screenshot.write(png, './e2e/snapshots/section3.png');
          });

    element(by.formControlName('admission')).click();
    $('.mat-option[value="walk-in"]').click();

    browser.wait(function() {
      return element(by.id('s3next')).getAttribute('disabled').then(function(value){
        return value == null;
      });
    }, 5000);

    element(by.id('s3next')).click();

    browser.wait(function() {
      return element(by.id('Section4')).isPresent();
    }, 5000);

    element(by.formControlName('famfname')).sendKeys(faker.name.firstName());
    element(by.formControlName('famlname')).sendKeys(faker.name.lastName());

    element(by.formControlName('relationship')).all(by.tagName('mat-radio-button')).get(1).click();

    element(by.formControlName('contact')).sendKeys(faker.phone.phoneNumber());
    element(by.formControlName('address1')).sendKeys(faker.address.streetAddress());
    element(by.formControlName('city')).sendKeys(faker.address.city());
    element(by.formControlName('postcode')).sendKeys(faker.address.zipCode());
    element(by.formControlName('state')).sendKeys(faker.address.county());

    element(by.formControlName('country2')).click();
    $('.mat-option[value="Malaysia"]').click();

    browser.takeScreenshot().then(function (png) {
            screenshot.write(png, './e2e/snapshots/section4.png');
          });


    browser.wait(function() {
      return element(by.id('s4next')).getAttribute('disabled').then(function(value){
        return value == null;
      });
    }, 5000);

    element(by.id('s4next')).click();

    browser.sleep(5000);

    var urlChanged = function(dom) {
      return browser.getCurrentUrl().then(function(url) {
        return url === browser.baseUrl + 'branches';
      });
    };
    browser.wait(urlChanged, 10000);

  });

});
