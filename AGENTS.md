# IGotThis 工單系統設計規則

- 本 repo 是 Module Design git
- 產品為 IGotThis
- module id 為 `no1_issue_system`
- 工件形式為 React HTML workbench

## 多層配對

- Product git 承載上游決策
- Spec git 仲裁資料與邏輯
- 本 repo 仲裁視覺與互動
- Impl git 跟進設計定案
- 配對以 `product-scope` 的註冊表為準

---

## 工件結構

- `project/i-got-this.html`
  - 是瀏覽器入口
- `90_workbench/app.jsx`
  - 承載 router
  - 群組常數是導覽真相
- `10_foundations/`
  - 承載原子 token
- `10_foundations/component_tokens/`
  - 承載元件狀態映射
- `10_foundations/visualizers/`
  - 只讀活 token
- `20_components/`
  - 承載元件與 showcase
- `30_screens/`
  - 承載畫面工件
- `50_explorations/`
  - 承載隔離探索

---

## 命名規則

- remote repo 使用 `i-got-this-design-no1-issue-system`。
- 入口檔使用產品 slug `project/i-got-this.html`。
- Design stage 目錄固定使用兩位數 `NN_lowercase_snake_case`。
- stage 內目錄與檔案使用 `lowercase_snake_case`。
- 有順序的工件使用 `noN_lowercase_snake_case`，序號不補零。
- React export 與瀏覽器全域識別字保留程式碼慣例。
- `AGENTS.md`、`CLAUDE.md` 與 `README.md` 保留平台約定名稱。

---

## 設計仲裁

- token 決議寫入 Foundations
- 元件決議寫入 Components
- 畫面決議寫入 Screens
- Impl 跟隨 export 名稱
- Spec 跟隨視覺狀態
- Explorations 不牽動下游
- Data Model 由 Spec 仲裁
- Logic 由 Spec 仲裁

---

## 設計錨點

- 採 F4 緊湊模組形式與白、冷灰、藍配色。
- 主色為 `#4663D2`，白底承載內容，模組底為 `#F8F9FB`。
- Light 是預設主題，深色採同系列冷灰與藍。
- 色值由 Foundations 仲裁，舊色階識別名保留相容用途。
- 控件、卡片、模組圓角依序為 10px、11px、18px。
- 圖像與結構優先，表單、錯誤與危險操作保留必要文字。
- 禁止 checkbox、radio 與仿造選取框。單選用選單，多選用加入與移除。
- 未提供真實縮圖時使用工單型別圖示。
- 第一批改版為外殼、看板與工單詳情。其他畫面待使用者比較後延伸。

---

## 設計待辦

- login screen 已定案：`30_screens/no7_login_screen/`，login／register 兩 variant，供 impl 逐名對齊
- AddViewForm 日曆選用設定入口已由 impl 端接上（既有 Select 元件組裝），design 未另立專屬工件
- ListScreen 篩選按鈕點擊後的條件編輯面板已定案：比照既有 `ColumnConfigPanel` 模式，錨定按鈕下方 absolute 定位、點外部收合，不開新的 popover 元件；面板內每列一個條件（欄位下拉＋值輸入＋移除鈕），「新增條件」／「套用」／「取消」三顆按鈕，開啟時帶入目前已套用條件；後端 `FilterCondition` 只認 `equals`、多條件全 AND，面板不呈現不存在的運算子選項。量體屬既有 impl 自訂範圍，design 不另立專屬 JSX 工件（比照 AddViewForm 前例）
- 篩選入口與已套用條件展示已定案，可先實作，不必等面板
- workflow 轉換規則管理畫面已定案：`30_screens/no8_workflow_transition_screen/`，左欄選工單型別、右側狀態／轉換／結案原因三區塊，供 impl 逐名對齊

---

## 原生工作規則

- 任何改動先使用 `product-scope`
- Markdown 改動使用 `doc-markdown`
- JSX 不套用 `code-spec`
- 同步範圍依註冊表 sub mapping
- 跨層 branch 名稱必須一致
- 配對 commit 內容必須一致

---

## 相容與漂移控制

- `AGENTS.md` 是本目錄的規則真相
- `CLAUDE.md` 只保留 Claude Code 入口
- 產品規則不得複製回相容入口
- 漂移檢查確認相容入口只含導向規則
