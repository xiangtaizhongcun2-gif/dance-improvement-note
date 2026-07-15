# Dance Improvement Note

Dance Improvement Note は、ダンス練習の振り返りと改善点の確認を支援するための iPhone 向けアプリです。

## 使用技術

- Expo SDK 57
- React Native 0.86
- React 19
- TypeScript（strict mode）
- Expo Router
- npm

## 必要環境

- Node.js 22.13.x 以上
- npm
- iPhone で確認する場合は Expo Go アプリ

## インストール方法

```bash
npm install
```

## 起動方法

```bash
npm start
```

## iPhone での確認方法

1. iPhone に Expo Go をインストールします。
2. PC と iPhone を同じネットワークに接続します。
3. `npm start` を実行します。
4. ターミナルまたはブラウザに表示される QR コードを iPhone で読み取ります。

## 現在の実装範囲

Issue #1「Expo Project Setup」の範囲として、以下を実装しています。

- Expo / React Native / TypeScript / Expo Router の初期セットアップ
- TypeScript strict mode の有効化
- 4つのタブ画面
  - ホーム
  - 練習記録
  - 改善点
  - ランキング
- ホーム画面の初期表示
  - Dance Improvement Note
  - 次回意識すること
  - まだ改善点が登録されていません
  - 練習記録を追加すると、ここに改善点が表示されます
- ホーム以外の仮画面
- 白を基調にしたシンプルなUI
- Safe Area 対応

以下はまだ実装していません。

- 練習記録の入力フォーム
- データ保存
- AsyncStorage
- 改善点の登録処理
- 改善点の集計
- ランキング処理
- 動画登録
- ログイン
- クラウド同期
- 通知
- iPhoneウィジェット
- expo-widgets
- EAS Build
