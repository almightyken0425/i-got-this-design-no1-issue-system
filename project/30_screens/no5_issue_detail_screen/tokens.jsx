// ─────────────────────────────────────────────────────────────
// ISSUE_DETAIL_SCREEN_TOKENS · 工單詳情頁的 composition 參數
//
// 只承載本畫面獨有的組裝值：畫面框寬、欄位區/關聯區/異動歷史區三段的
// 版面比例與間距、欄位列與異動歷史列的定寬直排、結案原因面板的節奏。
// 可重用的元件參數（按鈕、輸入框、Badge 等）留在既有 component_tokens，
// 本檔不重新定義、只引用。
//
// 值一律引用 atomic 階梯（SPACING / RADIUS / BORDER_WIDTH / CONTROL_HEIGHT /
// ICON_SIZE / TYPE_STYLES）或以階梯值相乘組出；離開階梯的值標 `// (literal: 原因)`。
// ─────────────────────────────────────────────────────────────

const ISSUE_DETAIL_SCREEN_TOKENS = {
  // 閱讀優先：標題與狀態置頂，內容與屬性分欄，窄版依序堆疊。
  CONTENT_MAX_WIDTH: SPACING['4xl'] * 24,
  RESPONSIVE_WIDTH: SPACING['4xl'] * 16,
  TITLE_TYPE: { ...TYPE_STYLES.pageTitle, size: TYPOGRAPHY.size['3xl'], lineHeight: SPACING['2xl'] },
  DETAIL_COLUMNS: 'minmax(0, 1fr) minmax(280px, 340px)', // (literal: 屬性側欄的可讀下界)
  CONTENT_GAP: SPACING.xl,
  EDIT_HEIGHT: SPACING['3xl'],
  MOBILE_PADDING: SPACING.lg,
  // ─── 畫面框 ───
  FRAME_WIDTH:        1280,          // (literal: 桌面瀏覽器基準寬，與其餘畫面同寬)
  CONTENT_PADDING_X:  SPACING['3xl'],
  CONTENT_PADDING_Y:  SPACING['2xl'],
  SECTION_GAP:        SPACING['2xl'],

  // ─── 標頭：返回 + IssueKey ───
  HEADER_GAP:      SPACING.sm,               // 8
  HEADER_KEY_TYPE: TYPE_STYLES.sectionTitle,

  // ─── 欄位區 / 關聯區並排 ───
  // 欄位區內容（定寬 label + 控件）比關聯區的編號清單長，比例吃 2:1。
  BODY_COLUMNS: '2fr 1fr',   // (literal: 版面比例，欄位區:關聯區，非階梯值)
  BODY_GAP:     SPACING.lg,  // 16

  // ─── 區塊容器（欄位區/關聯區/異動歷史區共用外框）───
  PANEL_PADDING:      SPACING.xl,
  PANEL_GAP:          SPACING.lg,
  PANEL_RADIUS:       RADIUS.lg,     // 8
  PANEL_BORDER_WIDTH: BORDER_WIDTH.hairline,
  PANEL_TITLE_TYPE:   TYPE_STYLES.cardTitle,

  // ─── 欄位區一列 ───
  FIELD_ROW_GAP:        SPACING.md,          // 12，label 與值的距離
  FIELD_ROW_MIN_HEIGHT: SPACING['3xl'],
  FIELD_LABEL_WIDTH:    SPACING['4xl'] * 2,  // 96，容得下最長欄位名 StoryPoint
  FIELD_VALUE_TYPE:     TYPE_STYLES.body,
  FIELD_CONFIRM_GAP:    SPACING.xs,          // 4，控件與確認鈕的貼齊間距

  // ─── 關聯區：母子鏈 + 其他型別分組 ───
  GROUP_TITLE_TYPE:    TYPE_STYLES.label,
  GROUP_GAP:           SPACING.sm,           // 8，分組標題與其項目清單的距離
  GROUP_STACK_GAP:     SPACING.md,           // 12，母子鏈叢集內「上層」與「子工單」兩個子分組的距離
  RELATION_NEST_INDENT: SPACING.sm,          // 8，母子鏈叢集下「上層」「子工單」相對叢集標題的縮排
  RELATION_ITEM_TYPE:  TYPE_STYLES.bodySm,
  RELATION_ITEM_GAP:   SPACING.xs,           // 4

  // ─── 異動歷史一列：時間 / 欄位標籤 / 舊值→新值 / 執行者 ───
  CHANGELOG_ROW_GAP:       SPACING.sm,           // 8，四個直排欄位間距
  CHANGELOG_ROW_PADDING_Y: SPACING.md,
  CHANGELOG_DIVIDER_WIDTH: BORDER_WIDTH.hairline,
  CHANGELOG_TIME_WIDTH:    SPACING['4xl'] * 3,   // 144，容得下 "2026-08-14 10:22"
  CHANGELOG_FIELD_WIDTH:   SPACING['4xl'] * 2,   // 96，與 FIELD_LABEL_WIDTH 同寬、呼應同一批欄位標籤
  CHANGELOG_TYPE:          TYPE_STYLES.bodySm,
  CHANGELOG_META_TYPE:     TYPE_STYLES.label,

  // ─── Status 轉終止狀態的結案原因面板（行內、緊接 Status 列，非浮層）───
  RESOLUTION_PANEL_GAP:          SPACING.sm,   // 8
  RESOLUTION_PANEL_PADDING:      SPACING.md,   // 12
  RESOLUTION_PANEL_RADIUS:       RADIUS.md,    // 6
  RESOLUTION_PANEL_BORDER_WIDTH: BORDER_WIDTH.hairline,
  RESOLUTION_PROMPT_TYPE:        TYPE_STYLES.bodySm,
  RESOLUTION_OPTION_HEIGHT:      CONTROL_HEIGHT.md,  // 28
  RESOLUTION_OPTION_PADDING_X:   SPACING.sm,         // 8
  RESOLUTION_OPTION_GAP:         SPACING.sm,         // 8
  RESOLUTION_OPTION_RADIUS:      RADIUS.sm,          // 4
  RESOLUTION_OPTION_TYPE:        TYPE_STYLES.bodySm,
  RESOLUTION_RADIO_SIZE:         ICON_SIZE.sm,       // 14
  RESOLUTION_RADIO_BORDER:       BORDER_WIDTH.hairline,
  RESOLUTION_RADIO_DOT_SIZE:     SPACING.sm,         // 8
  RESOLUTION_HINT_TYPE:          TYPE_STYLES.caption,
  RESOLUTION_FOOTER_GAP:         SPACING.xs,         // 4
};

Object.assign(window, { ISSUE_DETAIL_SCREEN_TOKENS });
