import { NewsnerdPage } from './app.po';

describe('newsnerd App', function() {
  let page: NewsnerdPage;

  beforeEach(() => {
    page = new NewsnerdPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
