module.exports = class Backlog {
  LOGIN_URL = 'https://apps.nulab.com/signin';
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

    //メールアドレスを入力
    await this.page.type('#email', this.ID);

    await this.page.waitFor(1000);

    //次へボタンクリック
    await this.page.click('#next');

    //少し待つ
    await this.page.waitFor(500);

    //PWDを入力
    await this.page.type('#password', this.PWD);

    // loginボタンをクリック
    await Promise.all([this.page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }), this.page.click('#signin')]);

     //backlogのリンクは別タブで開いてしまうので、gotoする
    await this.page.goto("https://enjoy-corp.backlog.com/dashboard");

  }
  /**
   * ページを閉じる
   */
  async close() {
    this.page.close();
  }
};
