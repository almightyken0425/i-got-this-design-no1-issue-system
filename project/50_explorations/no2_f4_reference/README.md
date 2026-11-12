# I Got This F4 改版交接

本包保存使用者選定的 01-F4 緊湊模組版，以及下一個 session 可沿用的改版標準。入口為 [F4 Canvas](index.html)，內含畫板、標準、套用三個頁籤。[獨立畫板](prototype.html) 保留互動示範。

## 已確認方向

- 目標是 I Got This 的 `no1_issue_system`，不是官網。
- 採 F4 的元件形式與 F1 的白、冷灰、藍配色。
- 優先以圖像、圖示與結構傳達語意。必要文字保持精簡。
- 禁止 checkbox、radio，以及外觀相似的方框、圓圈與勾選控制。
- 圖示保留可及名稱。表單、錯誤與危險動作仍需必要文字。
- 本次完成設計參考與交接。實際產品畫面尚未重構。

以上來自本任務使用者的明確選擇。Design 根目錄 AGENTS.md 的暖色、非純白與小圓角屬舊版視覺基準。執行本次改版時以使用者選定 F4 的新方向為準，資料與流程仍依有效 Spec。正式採用時同步更新 Design 的視覺錨點，避免新舊來源衝突。

## 來源與責任

| 內容 | 唯一來源與用途 |
| --- | --- |
| 已選外觀 | prototype.html 與 assets，保存可互動的 F4 參考。 |
| 核心視覺角色 | tokens.css，畫板與標準頁色票共同讀取。 |
| 使用標準 | index.html 的標準頁，涵蓋文字、元件、互動、適配與禁止事項。 |
| 匯入追溯 | provenance.json，記錄原型來源、選定路由、來源雜湊及 Design 基底。 |
| 產品能力 | Product Map、Spec 與現行 Impl，不能由示範內容推定需求。 |

原探索目錄 `~/Doc/project_management_prototype/` 已依使用者指示刪除，8891 預覽服務已停止。F4 參考包保留。本包不依賴原始目錄、外部圖庫、字體或套件。完整 Design 工作台則沿用既有 React 與 Babel 載入方式。

tokens.css 是此探索包的候選值來源。正式實作前將角色遷入 Foundations，再讓參考頁讀正式來源，不在 Design 與 Impl 各維護一份任意值。assets 內原始樣式作為外觀追溯，不是正式產品的共用元件庫。

forma 品牌、網站改版、人物、Sprint、日期、八張任務與四階段都是示範。不可將自由狀態切換、假動態或 localStorage 控制器搬入產品。進度環只有在產品有真實計算定義時才呈現。沒有縮圖的工單用型別圖示，不捏造附件或內容預覽。

## 工作區與範圍

本次 Design 工作區為 `~/Doc/ai-company-worktrees/igotthis-f4-design-reference/design-no1-issue-system/`。分支是 `feat/igotthis-f4-design-reference`，基底為 `2795205`。交付時未提交、合併或推送。新 session 必須讀這個工作區，不能只在 main 尋找本包。

另一個進行中的主題 `igotthis-issue-type-behavior` 已有 Design 與 Impl 工作區。開始改版前先核對它的相關差異與最新狀態，保留其功能及未提交成果。

| 層 | 正式 checkout |
| --- | --- |
| Product | `~/Doc/ai-company/product/i-got-this/` |
| Design | `~/Doc/ai-company/product/i-got-this/no4_product_designs/no1_issue_system/` |
| Spec | `~/Doc/ai-company/product/i-got-this/no3_product_specs/no1_issue_system/` |
| Impl | `~/Doc/ai-company/product/i-got-this/no5_product_development/no1_issue_system/` |

需求根因是改善外觀與文字密度，對應 Product Map `no2_product_planning/no2_product_map/no1_module_analysis.md` 的 view_layer 與 web_shell。既有產品能力足以支撐這次視覺改版，不新增產品需求。

本次實際改動是 Design 的隔離探索，加上載入它所需的入口與 router。未改正式 Foundations、Components、Screens、資料模型或邏輯。Spec 與 Impl 本輪不需要跟進。quality_owner 明確為 none，沒有 Quality git。Debug 影響為 none，示範只寫獨立的瀏覽器儲存。

## 對應實際畫面

Design 路徑相對本 repo 根目錄。Impl 路徑相對 Impl repo 根目錄。Spec 畫面行為入口是 `no2_screens/`，接手時讀取有效檔案再改行為。

| 責任 | Design | Impl |
| --- | --- | --- |
| 主題 | project/10_foundations/ | packages/web/src/theme/ |
| 元件 | project/20_components/ | packages/web/src/components/ |
| 外殼 | project/30_screens/no4_app_shell/ | packages/web/src/app/AppShell/ |
| 看板 | project/30_screens/no2_kanban_screen/ | packages/web/src/screens/KanbanScreen/ |
| 清單 | project/30_screens/no1_list_screen/ | packages/web/src/screens/ListScreen/ |
| 工單詳情 | project/30_screens/no5_issue_detail_screen/ | packages/web/src/screens/IssueDetailScreen/ |
| 開發順序表 | project/30_screens/no3_dev_order_screen/ | packages/web/src/screens/DevOrderScreen/ |
| 型別定義 | project/30_screens/no6_type_definition_screen/ | packages/web/src/screens/TypeDefinitionScreen/ |
| 登入 | project/30_screens/no7_login_screen/ | packages/web/src/screens/LoginScreen/ |
| 流程管理 | project/30_screens/no8_workflow_transition_screen/ | packages/web/src/screens/WorkflowTransitionScreen/ |
| 組織管理 | project/30_screens/no9_container_management_screen/ | packages/web/src/screens/ContainerManagementScreen/ |

## 建議實作順序

先盤點有效 Design、Spec 與 Impl，核對現有畫面、狀態、共用元件及尚未完成能力。依實際會改的 Git 建立或沿用同主題工作區，不直接改 main，不丟棄其他主題成果。

先將 F4 視覺角色對齊 Foundations，將圖示操作、橫式卡片與階段模組落入 Components，再更新代表 Screens。第一批建議完成 App Shell、Kanban、Issue Detail 的實際畫面，提供前後比較。

外殼保留八層容器與檢視導航。看板依真實 workflow 產生分組與可用動作，不能寫死四階段。詳情保留自訂欄位、關聯、異動歷史、必填檢查及有效狀態轉換。禁止 checkbox 與 radio 不代表刪除單選、多選與布林能力，分別改用選單、加入／移除及目前值的變更操作。

使用者確認第一批視覺效果後，再延伸清單、開發順序表、管理與登入畫面。表格與甘特圖維持原資訊結構，不因套版改成卡片牆。工程驗證遵守 Impl 的現行規則，測試資料庫缺失須明示，不得聲稱全套通過。

| 驗收面向 | 完成條件 |
| --- | --- |
| 風格 | 灰藍配色、淺灰模組、橫式卡片與少文字方向一致。 |
| 控制 | 沒有 checkbox、radio 或仿造選取框，原本的選擇功能仍可完成。 |
| 行為 | 保留欄位、權限、workflow、篩選與排序，沒有示範資料混入。 |
| 狀態 | 空資料、載入、錯誤、無權限與儲存中可辨識並能恢復。 |
| 輸入 | 鍵盤可操作、焦點可見、關閉詳情後回到入口，圖示有名稱。 |
| 尺寸 | 桌面、320px、390px、長標題與 200% 放大可用。 |

## 預覽與驗證狀態

入口檔是本目錄 index.html。完整 Design 工作台路由為 `project/i-got-this.html#explorations/f4-reference/baseline`。預期看到 F4 互動畫板、可讀取同源 token 的標準頁，以及 I Got This 畫面的套用對照。

本輪未啟動新預覽服務。集中 launch 登記位於公司主 checkout，寫入被 Registered-main write guard 擋下，既有設定未變更。瀏覽器的 URL 政策也禁止 file 協定。本輪沒有繞過保護，也沒有將工作目錄搬到其他 server 下。

原始 F4 曾完成畫面與互動驗證，但不能替代這份新包的瀏覽器驗證。新包已通過四份 JavaScript 的語法檢查、兩個 HTML 入口共 22 個本機引用檢查、Markdown 路徑檢查及 Git 差異格式檢查。這些檢查不能證明瀏覽器排版與操作正常。新入口與新標準頁尚未親眼驗證。後續預覽前需以獲准方式處理集中服務登記，使用登記的 port，不直接硬編新 port。

## 貼到新 session 的提示

```text
請依已選定 F4 方向改版 I Got This 的 no1_issue_system。

先讀：
~/Doc/ai-company-worktrees/igotthis-f4-design-reference/design-no1-issue-system/project/50_explorations/no2_f4_reference/README.md

再讀同目錄 index.html 的畫板、標準、套用，以及 tokens.css。
我已選 F4 緊湊模組形式、F1 白冷灰藍配色與少文字方向。
禁止 checkbox、radio 或外觀相似的方框、圓圈選取控制。
新方向取代舊暖色視覺基準，保留既有功能、資料、權限和 workflow。
畫板品牌、示範任務、四階段與日期不是產品需求。

先核對 Git、現行 Design／Spec／Impl 與 issue-type-behavior 主題，保留既有成果。
依 Foundations、Components、Screens 對齊後改前端，不把原型控制器搬進產品。
請先完成外殼、看板和工單詳情的實際畫面供我比較，驗證必要操作與狀態。
我確認第一批效果後再延伸其餘畫面。不要自行提交、合併或推送。
預覽登記與新參考包的瀏覽器驗證仍需按 README 的已知缺口處理。
```
