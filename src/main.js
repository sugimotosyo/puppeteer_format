const Backlog = require('./action/backlog');
const Google = require('./action/google');
const Rikunabi = require('./action/rikunabi');

//puppeteer
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth')();
puppeteer.use(pluginStealth);

//puppeteer launchOption
const launchOption = {
  headless: false,
  // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  // slowMo:500,
  args: [
    // ゲストセッションで操作する。
    // "--guest",
    // ウインドウサイズをデフォルトより大きめに。
    // '--window-size=1280,800',
    //最大化で表示
    // '--start-fullscreen',
    //情報バーの非表示
    // '--disable-infobars',
    //シークレットモード
    // '--incognito',
    //Sandbox
    // '--no-sandbox'
  ],
};

// puppeteer usage as normal
puppeteer.launch(launchOption).then(async (browser) => {
  console.log('Running puppeteer..start...');
  hundler(browser);
  console.log('Running puppeteer..end...');
});

// hundler ページを作成してacitonを呼び出す。
async function hundler(browser) {
  await Promise.all(
    [
      backlogAction(browser),
      googleAction(browser),
      rikunabiAction(browser),
    ]
  );
  await browser.close(); 
}

//backlognの操作
async function backlogAction(browser) {
  let backlog = new Backlog();
  await backlog.init(browser);
  await backlog.login();
  await backlog.close();
}

//googleの操作
async function googleAction(browser) {
  let google = new Google();
  await google.init(browser);
  await google.login();
  await google.close();
}

//rikunabiの操作
async function rikunabiAction(browser) {
  let rikunabi = new Rikunabi();
  await rikunabi.init(browser);
  await rikunabi.login();
  // await rikunabi.action1();
  await rikunabi.close();
}
