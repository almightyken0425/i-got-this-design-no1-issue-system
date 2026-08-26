// ─────────────────────────────────────────────────────────────
// WorkflowTransitionScreen · 流程轉換規則管理
//
// 角色：管理工單型別的狀態流程定義——狀態、轉換（含執行者角色與必填欄位）、
// 結案原因三個子清單。左欄選工單型別，右側三區塊並列（同一型別的三個面向，
// 不用分頁切換，資訊量小、一次看全更省互動成本）。
//
// 對側 spec：no3_product_specs/no1_issue_system/no3_logics/no4_workflow_logic.md
//   updateWorkflowDefinition 定義可調整項目：WorkflowStates 可加可改可刪、
//   WorkflowTransitions 可加可改可刪（含轉換條件的執行者角色與必填欄位）、
//   起始／終止狀態可重新指定、ResolutionOptions 可加可改可刪。三清單皆無
//   system 鎖定（不同於欄位定義的系統欄不可刪），故全清單列一律有編輯／移除。
//
// 消費元件：
//   20_components/no3_gantt_nav.jsx — Toolbar
//   20_components/no1_controls.jsx  — Button、Badge（起始／終止標示）
//   20_components/no2_data_display.jsx — DataTable、EmptyState
//
// Variants：
//   default         — task 型別已選，三狀態、含一條帶 requiredRole／
//                      requiredFields 的轉換（展示本畫面要解決的核心能力）、
//                      兩個結案原因
//   empty-selection — 尚未選取任何工單型別，右側出引導提示
//
// 兩條硬規（與元件檔同源）：
//   1. 一切視覺值引用 token。幾何走 WORKFLOW_TRANSITION_TOKENS（其值全數由
//      SPACING／RADIUS／TYPE_STYLES／CONTROL_HEIGHT 階梯組出），色彩走傳入
//      的 theme 物件。本檔無 hex、無未標註的裸數字
//   2. 畫面吃 theme 參數（預設 DEFAULT_THEME），THEME_LIGHT 與 THEME_DARK
//      同一份 JSX 都能渲染；畫面自身不讀 theme.id、不做主題分支
//
// 操作欄無編輯／刪除 glyph 可用（ControlGlyph 目前無 pencil／trash），
// 改用文字 Button（label「編輯」「移除」），比照 TypeDefinitionScreen 同一套。
// ─────────────────────────────────────────────────────────────

// ─── Screen 級 token ─────────────────────────────────────────
const WORKFLOW_TRANSITION_TOKENS = {
  BASE_WIDTH:        1280,               // (literal: 桌面瀏覽器基準寬，與其餘畫面同寬)
  CONTENT_PADDING_X: SPACING.xl,          // 24
  CONTENT_PADDING_Y: SPACING.lg,          // 16
  SECTION_GAP:       SPACING.lg,          // 16，三區塊之間
  SCREEN_TITLE_TYPE: TYPE_STYLES.sectionTitle,
  TYPE_COL_WIDTH:    SPACING['3xl'] * 5,  // 200，對齊 TypeDefinitionScreen 側欄寬基準
  COLUMN_GAP:        SPACING.xl,          // 24，型別清單與內容區之間
  ROW_HEIGHT:        CONTROL_HEIGHT.lg,   // 32
  ROW_PADDING_X:     SPACING.sm,          // 8
  ROW_RADIUS:        RADIUS.sm,
  ROW_TYPE:          TYPE_STYLES.bodySm,
  ACTION_GAP:        SPACING.xs,          // 4
  GROUP_LABEL_TYPE:  TYPE_STYLES.overline,
  GROUP_GAP:         SPACING.sm,          // 8
  SUBSECTION_TITLE_TYPE: TYPE_STYLES.label,
};

const WT = WORKFLOW_TRANSITION_TOKENS;

// ─── 擬真 fixture ────────────────────────────────────────────
// 工單型別 / 狀態 / 轉換 / 結案原因在 impl 端來自 IssueTypeDefinitions /
// WorkflowStates / WorkflowTransitions / ResolutionOptions，canvas 以固定值
// 代替，形狀對齊 spec 對四者的引用方式。

const WT_ISSUE_TYPES = [
  { id: 'task', name: 'task', label: '一般任務' },
  { id: 'bug',  name: 'bug',  label: '缺陷' },
];

const WT_STATES_BY_TYPE = {
  task: [
    { id: 's1', name: '待處理', isTerminal: false },
    { id: 's2', name: '處理中', isTerminal: false },
    { id: 's3', name: '已關閉', isTerminal: true },
  ],
  bug: [
    { id: 's1', name: '待處理', isTerminal: false },
    { id: 's2', name: '已關閉', isTerminal: true },
  ],
};

const WT_TRANSITIONS_BY_TYPE = {
  task: [
    { id: 't1', from: '待處理', to: '處理中', requiredRole: '', requiredFields: '' },
    { id: 't2', from: '處理中', to: '已關閉', requiredRole: '管理員', requiredFields: '結案原因' },
  ],
  bug: [
    { id: 't1', from: '待處理', to: '已關閉', requiredRole: '', requiredFields: '' },
  ],
};

const WT_RESOLUTIONS_BY_TYPE = {
  task: [
    { id: 'r1', value: '已完成' },
    { id: 'r2', value: '不做' },
  ],
  bug: [
    { id: 'r1', value: '已修復' },
    { id: 'r2', value: '不重現' },
  ],
};

const WORKFLOW_TRANSITION_VARIANTS = {
  default: { selectedTypeId: 'task' },
  'empty-selection': { selectedTypeId: null },
};

// ─── 內部工具（WT_ 前綴避免與其他畫面／元件檔的全域名稱相撞）───

function WT_type(t) {
  return {
    fontSize:      t.size,
    fontWeight:    t.weight,
    lineHeight:    `${t.lineHeight}px`,
    letterSpacing: t.letterSpacing,
  };
}

// ─── WT_IssueTypeRow ─── 工單型別清單一列
// 區域性小元件：選取態清單列，比照 TypeDefinitionScreen 的 TD_FieldSetRow，
// 少了 system 標示（工單型別本身的系統標示屬 TypeDefinitionScreen 職責，
// 本畫面只借用型別清單做流程選取入口，不重複那個標示）。
function WT_IssueTypeRow({ theme, name, selected, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center',
        width: '100%', height: WT.ROW_HEIGHT,
        padding: `0 ${WT.ROW_PADDING_X}px`,
        border: 'none', borderRadius: WT.ROW_RADIUS,
        background: selected ? theme.state.selected.bg : (hover ? theme.state.hover.bg : 'transparent'),
        color: selected ? theme.state.selected.fg : theme.text.primary,
        cursor: 'pointer', textAlign: 'left',
        fontFamily: FONT_FAMILY.base,
        ...WT_type(WT.ROW_TYPE),
        transition: `background ${CONTROL_SHARED_TOKENS.TRANSITION_MS}ms ${CONTROL_SHARED_TOKENS.TRANSITION_EASING}`,
      }}
    >
      {name}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// WorkflowTransitionScreen · 畫面主元件
//
// props:
//   variant  'default' | 'empty-selection'
//   theme    THEME_LIGHT | THEME_DARK（預設 DEFAULT_THEME）
// ─────────────────────────────────────────────────────────────
function WorkflowTransitionScreen({ variant = 'default', theme = DEFAULT_THEME }) {
  const config = WORKFLOW_TRANSITION_VARIANTS[variant] || WORKFLOW_TRANSITION_VARIANTS.default;
  const [selectedTypeId, setSelectedTypeId] = React.useState(config.selectedTypeId);

  const selectedType = WT_ISSUE_TYPES.find((t) => t.id === selectedTypeId) || null;
  const states = selectedTypeId ? (WT_STATES_BY_TYPE[selectedTypeId] || []) : [];
  const transitions = selectedTypeId ? (WT_TRANSITIONS_BY_TYPE[selectedTypeId] || []) : [];
  const resolutions = selectedTypeId ? (WT_RESOLUTIONS_BY_TYPE[selectedTypeId] || []) : [];

  const stateColumns = [
    { key: 'name', label: '狀態', type: 'text' },
    {
      key: 'isTerminal', label: '', type: 'text',
      render: (value) => value ? <Badge theme={theme} label="終止" tone="neutral" dot={false} /> : null,
    },
    {
      key: 'actions', label: '', type: 'text', align: 'right',
      render: () => (
        <div style={{ display: 'flex', gap: WT.ACTION_GAP, justifyContent: 'flex-end' }}>
          <Button theme={theme} variant="ghost" size="sm" label="編輯" />
          <Button theme={theme} variant="ghost" size="sm" label="移除" />
        </div>
      ),
    },
  ];
  const stateRows = states.map((s) => ({ id: s.id, cells: { name: s.name, isTerminal: s.isTerminal } }));

  const transitionColumns = [
    {
      key: 'path', label: '轉換', type: 'text',
      render: (value, row) => `${row.cells.from} → ${row.cells.to}`,
    },
    { key: 'requiredRole', label: '限定角色', type: 'text' },
    { key: 'requiredFields', label: '必填欄位', type: 'text' },
    {
      key: 'actions', label: '', type: 'text', align: 'right',
      render: () => (
        <div style={{ display: 'flex', gap: WT.ACTION_GAP, justifyContent: 'flex-end' }}>
          <Button theme={theme} variant="ghost" size="sm" label="編輯" />
          <Button theme={theme} variant="ghost" size="sm" label="移除" />
        </div>
      ),
    },
  ];
  const transitionRows = transitions.map((t) => ({
    id: t.id,
    cells: {
      from: t.from, to: t.to,
      requiredRole: t.requiredRole || '不限',
      requiredFields: t.requiredFields || '無',
    },
  }));

  const resolutionColumns = [
    { key: 'value', label: '結案原因', type: 'text' },
    {
      key: 'actions', label: '', type: 'text', align: 'right',
      render: () => <Button theme={theme} variant="ghost" size="sm" label="移除" />,
    },
  ];
  const resolutionRows = resolutions.map((r) => ({ id: r.id, cells: { value: r.value } }));

  const toolbarLeft = (
    <span style={{ ...WT_type(WT.SCREEN_TITLE_TYPE), color: theme.text.primary, whiteSpace: 'nowrap' }}>
      流程轉換規則
    </span>
  );

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      display: 'flex', flexDirection: 'column',
      background: theme.bg.base,
      color: theme.text.primary,
      fontFamily: FONT_FAMILY.base,
    }}>
      <Toolbar theme={theme} left={toolbarLeft} />

      <div style={{
        display: 'flex', gap: WT.COLUMN_GAP, alignItems: 'flex-start',
        padding: `${WT.CONTENT_PADDING_Y}px ${WT.CONTENT_PADDING_X}px`,
      }}>
        {/* 工單型別清單 */}
        <div style={{
          width: WT.TYPE_COL_WIDTH, flexShrink: 0,
          display: 'flex', flexDirection: 'column', gap: WT.GROUP_GAP,
        }}>
          <span style={{ ...WT_type(WT.GROUP_LABEL_TYPE), color: theme.text.tertiary, padding: `0 ${WT.ROW_PADDING_X}px` }}>
            工單型別
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: WT.ACTION_GAP }}>
            {WT_ISSUE_TYPES.map((t) => (
              <WT_IssueTypeRow
                key={t.id} theme={theme} name={t.label}
                selected={t.id === selectedTypeId}
                onClick={() => setSelectedTypeId(t.id)}
              />
            ))}
          </div>
        </div>

        {/* 三區塊：狀態 / 轉換 / 結案原因 */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: WT.SECTION_GAP }}>
          {selectedType === null ? (
            <EmptyState
              theme={theme}
              title="尚未選取工單型別"
              description="從左側選一個工單型別，檢視與管理該型別的流程轉換規則。"
            />
          ) : (
            <React.Fragment>
              <div style={{ display: 'flex', flexDirection: 'column', gap: WT.GROUP_GAP }}>
                <span style={{ ...WT_type(WT.SUBSECTION_TITLE_TYPE), color: theme.text.secondary }}>狀態</span>
                <DataTable theme={theme} columns={stateColumns} rows={stateRows} />
                <Button theme={theme} variant="secondary" size="sm" iconLeft="plus" label="新增狀態" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: WT.GROUP_GAP }}>
                <span style={{ ...WT_type(WT.SUBSECTION_TITLE_TYPE), color: theme.text.secondary }}>轉換</span>
                <DataTable theme={theme} columns={transitionColumns} rows={transitionRows} />
                <Button theme={theme} variant="secondary" size="sm" iconLeft="plus" label="新增轉換" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: WT.GROUP_GAP }}>
                <span style={{ ...WT_type(WT.SUBSECTION_TITLE_TYPE), color: theme.text.secondary }}>結案原因</span>
                <DataTable theme={theme} columns={resolutionColumns} rows={resolutionRows} />
                <Button theme={theme} variant="secondary" size="sm" iconLeft="plus" label="新增結案原因" />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Canvas section · Screens > WorkflowTransitionScreen
// 兩個 variant × 兩主題共四張 artboard，皆為 live JSX。
// ─────────────────────────────────────────────────────────────
function ScreenWorkflowTransitionSection() {
  const W = WORKFLOW_TRANSITION_TOKENS.BASE_WIDTH;
  return (
    <DCSection
      id="screen-workflow-transition"
      title="WorkflowTransitionScreen · 流程轉換規則"
      subtitle="對側 spec：no3_logics/no4_workflow_logic.md。左欄選工單型別，右側狀態／轉換／結案原因三區塊並列。"
    >
      <DCFamily
        id="wt-default" title="Default"
        subtitle="task 型別已選，「處理中 → 已關閉」轉換帶限定角色與必填欄位，示範本畫面要解決的核心能力。"
      >
        <DCArtboard id="wt-default-light" label="default · THEME_LIGHT (live)" width={W} height="auto">
          <WorkflowTransitionScreen variant="default" theme={THEME_LIGHT} />
        </DCArtboard>
        <DCArtboard id="wt-default-dark" label="default · THEME_DARK (live)" width={W} height="auto">
          <WorkflowTransitionScreen variant="default" theme={THEME_DARK} />
        </DCArtboard>
      </DCFamily>

      <DCFamily
        id="wt-boundary" title="Boundary"
        subtitle="empty-selection 為尚未選取任何工單型別，右側換成引導提示。"
      >
        <DCArtboard id="wt-empty-light" label="empty-selection · THEME_LIGHT (live)" width={W} height="auto">
          <WorkflowTransitionScreen variant="empty-selection" theme={THEME_LIGHT} />
        </DCArtboard>
        <DCArtboard id="wt-empty-dark" label="empty-selection · THEME_DARK (live)" width={W} height="auto">
          <WorkflowTransitionScreen variant="empty-selection" theme={THEME_DARK} />
        </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

Object.assign(window, {
  WORKFLOW_TRANSITION_TOKENS,
  WT_ISSUE_TYPES, WT_STATES_BY_TYPE, WT_TRANSITIONS_BY_TYPE, WT_RESOLUTIONS_BY_TYPE,
  WORKFLOW_TRANSITION_VARIANTS,
  WorkflowTransitionScreen, ScreenWorkflowTransitionSection,
});
