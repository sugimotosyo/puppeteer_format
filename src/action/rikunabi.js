module.exports = class Backlog {
  LOGIN_URL = 'https://saiyo.rikunabi.com/';
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
    await this.page.type('input[name="login_nm"]', this.ID);
    await this.page.type('input[name="pswd"]', this.PWD);

    //ログインボタン
    await Promise.all([this.page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }), this.page.click('.loginButton')]);
  }

  /**
   * こだわりアプローチの送信済み一覧からまとめてアプローチする。
   */
  async action1() {
    console.log("こだわりアプローチの送信済み一覧から、「メモあり」で絞り込んで、全件数面確でアプローチします。")
    console.log("action1 start")

    //こだわりアプローチのリンクをふむ
    let frames = await this.page.frames();
    const frame_1674 = frames.find((f) => f.url().indexOf('https://saiyo.rikunabi.com/rnc/docs/cc_s06540.jsp') >= 0);
    await frame_1674.waitForSelector('body > .globalMenu > .globalMenu__item:nth-child(2) > a');
    await frame_1674.click('body > .globalMenu > .globalMenu__item:nth-child(2) > a');

    //少し待つ
    await this.page.waitFor(3000);

    //送信済みタブをクリック
    await this.page.waitForSelector('.approachHeader > nav > .subMenu > .subMenuItem:nth-child(2) > .subMenuItemInner');
    await this.page.click('.approachHeader > nav > .subMenu > .subMenuItem:nth-child(2) > .subMenuItemInner');

    //少し待つ
    await this.page.waitFor(3000);

    //詳細な条件を表示する
    await this.page.waitForSelector('.approachFilterForm > .searchPanel > .searchPanelToggleSwitch > .searchPanelToggleBox > .svg-icon');
    await this.page.click('.approachFilterForm > .searchPanel > .searchPanelToggleSwitch > .searchPanelToggleBox > .svg-icon');

    //少し待つ
    await this.page.waitFor(3000);

    //メモありにチェックをつける
    await this.page.waitForSelector(
      '.searchPanelItem:nth-child(6) > td > .el-checkbox-group > .el-checkbox > .el-checkbox__input > .el-checkbox__inner'
    );
    await this.page.click(
      '.searchPanelItem:nth-child(6) > td > .el-checkbox-group > .el-checkbox > .el-checkbox__input > .el-checkbox__inner'
    );
    //少し待つ
    await this.page.waitFor(1000);

    //求職者を絞り込む
    await this.page.waitForSelector('div > table > .searchPanelItem > td > .button--secondary');
    await this.page.click('div > table > .searchPanelItem > td > .button--secondary');

    //少し待つ
    await this.page.waitFor(3000);

    //件数取得
    await this.page.waitForSelector('.contents > div > .utility:nth-child(1) > .pagination > .total');
    var target = await this.page.$('.contents > div > .utility:nth-child(1) > .pagination > .total');
    var pagenationStr = await (await target.getProperty('textContent')).jsonValue();
    var total = pagenationStr.replace('1〜50件 / ', '').replace('件', '');

    //最大ページ数
    var perPage = 50;
    var MaxPage = Math.ceil(parseInt(total) / perPage);

    //チェック入れていく
    for (var i = 0; i < MaxPage; i++) {

      //全て選択にチェック
      await this.page.waitForSelector('tr > .checkbox > .el-checkbox > .el-checkbox__input > .el-checkbox__inner');
      await this.page.click('tr > .checkbox > .el-checkbox > .el-checkbox__input > .el-checkbox__inner');

      //少し待つ
      await this.page.waitFor(1000);

      //まとめてアプローチプルダウンを開く
      await this.page.waitForSelector('.utility:nth-child(1) > .bulkActions > form > .el-select > .el-input > .el-input__icon');
      await this.page.click('.utility:nth-child(1) > .bulkActions > form > .el-select > .el-input > .el-input__icon');

      //少し待つ
      await this.page.waitFor(2000);

      //まとめてアプローチを選択
      await this.page.waitForSelector(
        'body > .el-select-dropdown > .el-scrollbar > .el-select-dropdown__wrap > .el-scrollbar__view > .el-select-dropdown__item:nth-child(2)'
      );
      await this.page.click(
        'body > .el-select-dropdown > .el-scrollbar > .el-select-dropdown__wrap > .el-scrollbar__view > .el-select-dropdown__item:nth-child(2)'
      );
        //少し待つ
        await this.page.waitFor(1000);

      // //実行するボタン押下
      await this.page.waitForSelector('div > .utility:nth-child(1) > .bulkActions > form > .button');
      await this.page.click('div > .utility:nth-child(1) > .bulkActions > form > .button');


      //少し待つ
      await this.page.waitFor(1000);


      //募集職種プルダウンをを開く
      await this.page.waitForSelector(
        '.el-form-item > .el-form-item__content > .approachModalMessageForm__jobCategorySelect > .el-input > .el-input__inner'
      );
      await this.page.click(
        '.el-form-item > .el-form-item__content > .approachModalMessageForm__jobCategorySelect > .el-input > .el-input__inner'
      );
      //少し待つ
      await this.page.waitFor(1000);


      //募集職種を選択する(中身のテキストで取得する)
      var list = await this.page.$$('body > .el-select-dropdown> .el-scrollbar > .el-select-dropdown__wrap > .el-scrollbar__view > .el-select-dropdown__item');
      var target = {}
      for (let i = 0; i < list.length; i++) {
        var text = await (await list[i].getProperty('textContent')).jsonValue();
        if(text == "N3 (正社員) 定着率90％以上の【システム開発/SE・PG】◎WEB面接可"){
          target = list[i]
        }
      }
      await target.click();
      //少し待つ
      await this.page.waitFor(1000);

      // //テンプレートプルダウンを開く
      await this.page.waitForSelector('.inputItem:nth-child(2) > .el-form-item > .el-form-item__content > .el-select > .el-input > .el-input__icon')
      await this.page.click('.inputItem:nth-child(2) > .el-form-item > .el-form-item__content > .el-select > .el-input > .el-input__icon')
      
      //少し待つ
      await this.page.waitFor(1000);

      //テンプレートを選択する
      var list = await this.page.$$('body > .el-select-dropdown> .el-scrollbar > .el-select-dropdown__wrap > .el-scrollbar__view > .el-select-dropdown__item');
      var target = {}
      for (let i = 0; i < list.length; i++) {
        var text = await (await list[i].getProperty('textContent')).jsonValue();
        if(text == "開発（SE）"){
          target = list[i]
        }
      }
      await target.click();
      //少し待つ
      await this.page.waitFor(1000);

      //面確でおくる
      await this.page.waitForSelector('.el-form > .submit > .optionInput > .el-checkbox > .el-checkbox__label')
      await this.page.click('.el-form > .submit > .optionInput > .el-checkbox > .el-checkbox__label')
      //少し待つ
      await this.page.waitFor(1000);

      //確認ボタンを押す
      await this.page.waitForSelector('.approachModal > .l-sub > .el-form > .submit > .button')
      await this.page.click('.approachModal > .l-sub > .el-form > .submit > .button')
      //少し待つ
      await this.page.waitFor(1000);


      // //編集に戻る
      // await this.page.waitForSelector('.modal > .container > .approachModalMessageConfirm > .submit > .button--negative')
      // await this.page.click('.modal > .container > .approachModalMessageConfirm > .submit > .button--negative')
      // await this.page.waitFor(1000);

      // //モーダルを閉じる
      // await this.page.waitForSelector('.approach > .modal:nth-child(4) > .container > .closeButton > .svg-icon')
      // await this.page.click('.approach > .modal:nth-child(4) > .container > .closeButton > .svg-icon')
      // await this.page.waitFor(1000);

      //送信する
      await this.page.waitForSelector('.modal > .container > .approachModalMessageConfirm > .submit > .button--primary')
      await this.page.click('.modal > .container > .approachModalMessageConfirm > .submit > .button--primary')
      await this.page.waitFor(5000);

      //閉じる
      await this.page.waitForSelector('.approach > .modal:nth-child(8) > .container > .closeButton > .svg-icon')
      await this.page.click('.approach > .modal:nth-child(8) > .container > .closeButton > .svg-icon')
      await this.page.waitFor(5000);
  
      

      //次ページへ行く
      await this.page.waitForSelector('div > .utility:nth-child(1) > .pagination > .button:nth-child(12) > .svg-icon')
      await this.page.click('div > .utility:nth-child(1) > .pagination > .button:nth-child(12) > .svg-icon')
      await this.page.waitFor(5000);

    }

    console.log("action1 end")
  }

  /**
   * ページを閉じる
   */
  async close() {
    this.page.close();
  }
};
