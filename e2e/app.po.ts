import { browser, by, element } from 'protractor';
var fs = require('fs');

export class Fuse2Page {
    navigateTo() {
        return browser.get('/');
    }

    getParagraphText() {
        return element(by.css('app-root h1')).getText();
    }
}

export class UsersPage {

  navigateTo() {
    return browser.get('/users');
  }

  getTitle() {
    return element(by.id('usertitle')).getText();
  }
}

export class PatientRegistryPage {
  navigateTo() {
    return browser.get('/patient-register');
  }

  getTitle() {
    return element(by.id('pageTitle')).getText();
  }
}

export class LoginPage {
  login() {
    return browser.get('/login');
  }

  logout() {
    return browser.get('/logout');
  }

  getTitle() {
    return element(by.css('title')).getText();
  }

}

export class ScreenShot {
  write(data, filename) {
      var stream = fs.createWriteStream(filename);
      stream.write(new Buffer(data, 'base64'));
      stream.end();
  }
}
