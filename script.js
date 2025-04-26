// ゲームの状態を管理する変数
let gameState = {
    score: 0,
    clickValue: 1,
    upgrades: {
        upgrade1: { level: 0, cost: 10, value: 1 },
        upgrade2: { level: 0, cost: 50, value: 5 },
        upgrade3: { level: 0, cost: 100, value: 10 }
    }
};

// DOM要素の取得
const scoreElement = document.getElementById('score');
const clickValueElement = document.getElementById('click-value');
const cookieElement = document.getElementById('cookie');

// アップグレード要素の取得
const upgrade1Cost = document.getElementById('upgrade1-cost');
const upgrade2Cost = document.getElementById('upgrade2-cost');
const upgrade3Cost = document.getElementById('upgrade3-cost');

const buyUpgrade1 = document.getElementById('buy-upgrade1');
const buyUpgrade2 = document.getElementById('buy-upgrade2');
const buyUpgrade3 = document.getElementById('buy-upgrade3');

// セーブとリセットボタン
const saveButton = document.getElementById('save-game');
const resetButton = document.getElementById('reset-game');

// クッキーをクリックしたときの処理
cookieElement.addEventListener('click', () => {
    gameState.score += gameState.clickValue;
    updateScore();
    animateCookieClick();
});

// クリックアニメーション
function animateCookieClick() {
    cookieElement.classList.add('clicked');
    // クリック音を再生
    const clickSound = document.getElementById('clickSound');
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
    setTimeout(() => {
        cookieElement.classList.remove('clicked');
    }, 100);
}

// スコアの更新
function updateScore() {
    scoreElement.textContent = Math.floor(gameState.score);
    clickValueElement.textContent = gameState.clickValue;
    updateUpgradeButtons();
}

// アップグレードボタンの状態更新
function updateUpgradeButtons() {
    buyUpgrade1.disabled = gameState.score < gameState.upgrades.upgrade1.cost;
    buyUpgrade2.disabled = gameState.score < gameState.upgrades.upgrade2.cost;
    buyUpgrade3.disabled = gameState.score < gameState.upgrades.upgrade3.cost;
    
    upgrade1Cost.textContent = Math.floor(gameState.upgrades.upgrade1.cost);
    upgrade2Cost.textContent = Math.floor(gameState.upgrades.upgrade2.cost);
    upgrade3Cost.textContent = Math.floor(gameState.upgrades.upgrade3.cost);
}

// アップグレード購入処理
buyUpgrade1.addEventListener('click', () => purchaseUpgrade('upgrade1'));
buyUpgrade2.addEventListener('click', () => purchaseUpgrade('upgrade2'));
buyUpgrade3.addEventListener('click', () => purchaseUpgrade('upgrade3'));

function purchaseUpgrade(upgradeId) {
    const upgrade = gameState.upgrades[upgradeId];
    
    if (gameState.score >= upgrade.cost) {
        gameState.score -= upgrade.cost;
        upgrade.level++;
        gameState.clickValue += upgrade.value;
        
        // 価格の上昇（レベルが上がるごとに1.5倍に）
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        
        updateScore();
    }
}

// ゲームの保存
saveButton.addEventListener('click', saveGame);

function saveGame() {
    try {
        localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
        alert('ゲームが保存されました！');
    } catch (error) {
        console.error('ゲームの保存中にエラーが発生しました:', error);
        alert('ゲームの保存中にエラーが発生しました。');
    }
}

// ゲームのリセット
resetButton.addEventListener('click', () => resetGame(false));

function resetGame(skipConfirm = false) {
    if (skipConfirm || confirm('本当にゲームをリセットしますか？進行状況は失われます。')) {
        gameState = {
            score: 0,
            clickValue: 1,
            upgrades: {
                upgrade1: { level: 0, cost: 10, value: 1 },
                upgrade2: { level: 0, cost: 50, value: 5 },
                upgrade3: { level: 0, cost: 100, value: 10 }
            }
        };
        updateScore();
        localStorage.removeItem('cookieClickerSave');
    }
}

// ゲームのロード
function loadGame() {
    try {
        const savedGame = localStorage.getItem('cookieClickerSave');
        if (savedGame) {
            gameState = JSON.parse(savedGame);
            updateScore();
        }
    } catch (error) {
        console.error('ゲームのロード中にエラーが発生しました:', error);
        alert('ゲームのロード中にエラーが発生しました。');
        resetGame(true);
    }
}

// ページ読み込み時にゲームをロード
window.addEventListener('load', loadGame);