import { Fuse2Page, UsersPage } from './app.po';

describe('Fuse2 App', () => {
    let page: Fuse2Page;
    let userPage: UsersPage;

    beforeEach(() => {
        page = new Fuse2Page();
        userPage = new UsersPage();
    });

    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('Welcome to app!');
    });

    it('should display the users title', () => {
      userPage.navigateTo();
      expect(userPage.getTitle()).toEqual('Users');
      //

      //

      //

      //

    })
});
