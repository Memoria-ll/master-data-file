# master-data-file

アークナイツに関する各種データを公開するリポジトリです。

このリポジトリは、Memoria-ll が利用するデータの公開・参照を主目的としています。

## ディレクトリ構成

| パス | 内容 | 更新・作成方法 |
| --- | --- | --- |
| `arknights-data/master/` | オペレーター等のマスターデータ | 各種Wiki等の公開情報を参照し、手動で整理・作成 |
| `arknights-data/stage/` | ステージ・ドロップ統計関連データ | Penguin Statistics から毎日6時頃に取得・更新 |
| `arknights-data/statistics/` | オペレーター育成状況等の統計データ | 明日方舟一图流から毎日6時頃に取得・更新 |

更新時刻は目安であり、取得元の状態や更新処理の都合により前後する場合があります。

## データソース

### master

`arknights-data/master/` 配下のデータは、各種Wiki等で公開されている情報を参照し、Memoria-ll が手動で整理・作成しています。

ゲーム内の名称・数値・その他の原著作物に関する権利は、それぞれの権利者に帰属します。

### stage

`arknights-data/stage/` 配下のデータは [Penguin Statistics](https://penguin-stats.io/) を取得元としています。

Penguin Statistics の公開APIドキュメントでは、データ利用について [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/) が案内されています。

### statistics

`arknights-data/statistics/` 配下のデータは [明日方舟一图流](https://ark.yituliu.cn/) を取得元としています。

明日方舟一图流では、別途明示されているものを除き、コンテンツを [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/) のもとで提供しています。

## 利用について

このリポジトリ内のデータを、第三者のアプリケーション・サービス・データセット等の取得元として利用することは推奨していません。

特に `stage` および `statistics` のデータを利用したい場合は、このリポジトリを経由せず、それぞれの取得元から直接取得してください。

- `stage`: [Penguin Statistics](https://penguin-stats.io/)
- `statistics`: [明日方舟一图流](https://ark.yituliu.cn/)

各取得元のデータを利用する場合は、それぞれが定めるライセンス・利用条件に従ってください。このリポジトリの公開によって、取得元または権利者の利用条件を変更したり、追加の権利を付与したりするものではありません。

`master` 配下についても、ゲーム内情報や各種公開情報を参照して作成しているため、用途に応じて原典・権利者の情報を確認してください。

## Attribution / Credits

- [Penguin Statistics](https://penguin-stats.io/)
- [明日方舟一图流](https://ark.yituliu.cn/)
- Arknights / アークナイツおよび関連する名称・画像・ゲームデータ等の権利は、それぞれの権利者に帰属します。

## Disclaimer

このリポジトリは非公式のファンプロジェクトであり、Hypergryph、Yostar その他の公式運営・権利者とは関係ありません。

データの正確性、完全性、最新性を保証するものではありません。本リポジトリの利用によって生じた損害について、管理者は責任を負いません。
