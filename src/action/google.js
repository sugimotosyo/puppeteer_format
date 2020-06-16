module.exports = class Backlog {
  LOGIN_URL = 'https://www.google.com';
  ID = '';
  PWD = '';

  /**
   * constructor
   */
  constructor() {
    //初期化
    this.page = {};
  }

  /**
   * init
   * ページの作成
   * @param {*} browser
   */
  async init(browser) {
    //ページ作成
    const page = await browser.newPage();
    //navigator.webdriverを削除して、ログインできるようにする。
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', () => {});
      delete navigator.__proto__.webdriver;
    });
    this.page = page;
  }

  async login() {
    await this.page.goto(this.LOGIN_URL);

    //ログインボタンをクリックする
    await Promise.all([this.page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }), this.page.click('#gb_70')]);

    //メールアドレスを入力
    await this.page.type('#identifierId', this.ID);

    await Promise.all([this.page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }), this.page.click('#identifierNext')]);
    //少し待つ
    await this.page.waitFor(1000);

    //PWDを入力
    await this.page.type('input[name="password"]', this.PWD);
    // 次へボタンクリック
    await Promise.all([this.page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }), this.page.click('#passwordNext')]);
  }
  /**
   * ページを閉じる
   */
  async close() {
    this.page.close();
  }
};
