// ─────────────────────────────────────────────────────────────
// TypeDefinitionScreen · 型別定義畫面
//
// 角色：管理欄位組、欄位定義，與工單型別的欄位組配方。分「欄位」「工單型別」
// 兩個分頁，前者左欄選欄位組、右欄列該組欄位；後者列工單型別與已勾選配方。
//
// 對側 spec：no3_product_specs/no1_issue_system/no2_screens/no6_type_definition_screen.md
//   佈局四段（頁面工具列 / 欄位組清單 / 欄位清單 / 工單型別清單）與互動十條
//   （切換分頁 / 選取欄位組 / 新增與刪除欄位組 / 新增與編輯與刪除欄位 /
//   新增工單型別 / 編輯工單型別配方）逐條對位。
//
// 消費元件：
//   20_components/no3_gantt_nav.jsx — Toolbar（工具列容器）、
//                                     LevelSwitcher（分頁切換，少量固定選項、
//                                     切換頻繁，語意同「顯示層級」）
//   20_components/no1_controls.jsx  — Button（各新增入口）、Badge（系統標示）
//   20_components/no2_data_display.jsx — DataTable（欄位清單、工單型別清單）、
//                                     EmptyState（尚未選取欄位組）
//
// Variants：
//   default        — 欄位分頁，已選取「專案」欄位組，右欄列出該組兩個欄位
//   empty-selection — 欄位分頁，尚未選取任何欄位組，右欄出引導提示
//   types           — 工單型別分頁，列出 task 與 bug 兩個型別與各自配方
//
// 兩條硬規（與元件檔同源）：
//   1. 一切視覺值引用 token。幾何走 TYPE_DEFINITION_TOKENS（其值全數由 SPACING /
//      RADIUS / TYPE_STYLES / CONTROL_HEIGHT 階梯組出），色彩走傳入的 theme 物件。
//      本檔無 hex、無未標註的裸數字
//   2. 畫面吃 theme 參數（預設 DEFAULT_THEME），THEME_LIGHT 與 THEME_DARK 同一份
//      JSX 都能渲染；畫面自身不讀 theme.id、不做主題分支
//
// 操作欄無編輯 / 刪除 glyph 可用（ControlGlyph 目前無 pencil / trash），
// 改用文字 Button（label「編輯」「移除」「編輯配方」），不新增共用圖示。
// ─────────────────────────────────────────────────────────────

// ─── Screen 級 token ─────────────────────────────────────────
const TYPE_DEFINITION_TOKENS = {
  BASE_WIDTH:          1280,               // (literal: 桌面瀏覽器基準寬，與其餘畫面同寬)
  CONTENT_PADDING_X:   SPACING.xl,          // 24
  CONTENT_PADDING_Y:   SPACING.lg,          // 16
  SECTION_GAP:         SPACING.md,          // 12
  SCREEN_TITLE_TYPE:   TYPE_STYLES.sectionTitle,
  FIELD_SET_COL_WIDTH: SPACING['3xl'] * 5,  // 200，對齊 AppShell 側欄寬基準
  COLUMN_GAP:          SPACING.xl,          // 24，欄位組清單與欄位清單之間
  ROW_HEIGHT:          CONTROL_HEIGHT.lg,   // 32
  ROW_PADDING_X:       SPACING.sm,          // 8
  ROW_RADIUS:          RADIUS.sm,
  ROW_GAP:             SPACING.sm,          // 8
  ROW_TYPE:            TYPE_STYLES.bodySm,
  ACTION_GAP:          SPACING.xs,          // 4
  GROUP_LABEL_TYPE:    TYPE_STYLES.overline,
  GROUP_GAP:           SPACING.sm,          // 8
};

const TD = TYPE_DEFINITION_TOKENS;

// ─── 擬真 fixture ────────────────────────────────────────────
// 欄位組 / 欄位 / 工單型別在 impl 端來自 FieldSetDefs / FieldDefs /
// IssueTypeDefinitions，canvas 以固定值代替，形狀對齊 spec 對三者的引用方式。

const TD_FIELD_SETS = [
  { id: 'basic',   name: '基本', system: true },
  { id: 'project', name: '專案', system: false },
  { id: 'vcs',     name: '版控', system: false },
  { id: 'quality', name: '品質', system: false },
];

const TD_FIELDS_BY_SET = {
  basic: [
    { id: 'title', name: 'Title', label: '標題', valueType: '文字', kind: '單值', tracked: false, rollup: '', system: true },
  ],
  project: [
    { id: 'storypoint', name: 'StoryPoint', label: '估點', valueType: '數字', kind: '單值', tracked: true, rollup: '加總', system: false },
    { id: 'externaltool', name: 'ExternalTool', label: '外部工具', valueType: '布林', kind: '單值', tracked: false, rollup: '', system: false },
  ],
  vcs: [
    { id: 'branchname', name: 'BranchName', label: '對應分支', valueType: '文字', kind: '單值', tracked: false, rollup: '', system: false },
    { id: 'commitno', name: 'CommitNo', label: '指向提交', valueType: '文字', kind: '單值', tracked: false, rollup: '', system: false },
  ],
  quality: [
    { id: 'testnotes', name: 'TestNotes', label: '測試備註', valueType: '長文', kind: '單值', tracked: false, rollup: '', system: false },
  ],
};

const TD_ISSUE_TYPES = [
  { id: 'task', name: 'task', label: '一般任務', system: true, fieldSets: ['基本', '專案', '版控'] },
  { id: 'bug',  name: 'bug',  label: '缺陷',     system: false, fieldSets: ['基本', '品質'] },
];

const TD_TABS = [
  { id: 'fields', label: '欄位' },
  { id: 'types',  label: '工單型別' },
  { id: 'relations', label: '關聯型別' },
  { id: 'calendars', label: '工作日曆' },
];

// 新分頁沿用表格與行內表單。名稱、週規則、日期例外分成獨立操作區，
// 錯誤顯示在該區並保留草稿。沒有 typeAdmin 時表單與寫入按鈕不呈現。
// 日曆被選用後才影響工期，不以新增日曆替使用者更換檢視或帳號預設。
function TDPlanningTab({ tab, theme }) {
  const [name, setName] = React.useState('台灣工作週');
  const [off, setOff] = React.useState(['SAT', 'SUN']);
  const [date, setDate] = React.useState('2026-10-10');
  const [working, setWorking] = React.useState(false);
  const [exceptions, setExceptions] = React.useState([]);
  if (tab === 'relations') return <div style={{ display: 'flex', flexDirection: 'column', gap: TD.GROUP_GAP }}>
    <DataTable theme={theme} columns={[{ key: 'name', label: '名稱', type: 'key' }, { key: 'rules', label: '規則', type: 'text' }]}
      rows={[{ id: 'children', cells: { name: 'Children', rules: '獨佔、禁環、彙總' } }, { id: 'related', cells: { name: 'RelatedTo', rules: '對稱' } }]} />
    <TextInput theme={theme} placeholder="關聯型別名稱" />
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: TD.ROW_GAP }}>
      {['獨佔', '禁環', '有序', '對稱', '彙總'].map(label => <Checkbox key={label} theme={theme} label={label} />)}
    </div>
    <Button theme={theme} label="新增關聯型別" />
  </div>;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: TD.GROUP_GAP }}>
    <Select theme={theme} prefix="日曆" value="台灣工作週" options={[{ value: '台灣工作週', label: '台灣工作週' }]} />
    <TextInput theme={theme} placeholder="新日曆名稱" value={name} onChange={setName} />
    <Button theme={theme} variant="secondary" label="新增日曆" />
    <span style={{ ...TD_type(TD.GROUP_LABEL_TYPE), color: theme.text.secondary }}>每週休假日</span>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: TD.ROW_GAP }}>
      {[['MON','一'],['TUE','二'],['WED','三'],['THU','四'],['FRI','五'],['SAT','六'],['SUN','日']].map(([key,label]) =>
        <Checkbox key={key} theme={theme} label={`週${label}`} checked={off.includes(key)} onChange={checked => setOff(checked ? [...off,key] : off.filter(day => day !== key))} />)}
    </div>
    <Button theme={theme} label="儲存週規則" />
    <span style={{ ...TD_type(TD.GROUP_LABEL_TYPE), color: theme.text.secondary }}>日期例外</span>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: TD.ROW_GAP }}>
      <TextInput theme={theme} value={date} onChange={setDate} placeholder="YYYY-MM-DD" />
      <Checkbox theme={theme} label="工作日" checked={working} onChange={setWorking} />
      <Button theme={theme} label="儲存例外" onClick={() => setExceptions([...exceptions.filter(item => item.date !== date), { date, working }])} />
    </div>
    {exceptions.map(item => <div key={item.date} style={{ display: 'flex', alignItems: 'center', gap: TD.ROW_GAP }}>
      <span>{item.date} · {item.working ? '工作日' : '休假日'}</span>
      <Button theme={theme} variant="ghost" label="移除例外" onClick={() => setExceptions(exceptions.filter(value => value.date !== item.date))} />
    </div>)}
  </div>;
}

const TYPE_DEFINITION_VARIANTS = {
  default: {
    tab: 'fields',
    selectedFieldSetId: 'project',
  },
  'empty-selection': {
    tab: 'fields',
    selectedFieldSetId: null,
  },
  types: {
    tab: 'types',
    selectedFieldSetId: 'project',
  },
};

// ─── 內部工具（TD_ 前綴避免與其他畫面 / 元件檔的全域名稱相撞）───

function TD_type(t) {
  return {
    fontSize:      t.size,
    fontWeight:    t.weight,
    lineHeight:    `${t.lineHeight}px`,
    letterSpacing: t.letterSpacing,
  };
}

// ─── TD_FieldSetRow ─── 欄位組清單一列
// 區域性小元件：選取態 + 系統標示的清單列，現有元件組沒有對應件，
// 且只有本畫面用得到，故留在畫面檔內。
function TD_FieldSetRow({ theme, name, system, selected, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', height: TD.ROW_HEIGHT,
        padding: `0 ${TD.ROW_PADDING_X}px`,
        border: 'none', borderRadius: TD.ROW_RADIUS,
        background: selected ? theme.state.selected.bg : (hover ? theme.state.hover.bg : 'transparent'),
        color: selected ? theme.state.selected.fg : theme.text.primary,
        cursor: 'pointer', textAlign: 'left',
        fontFamily: FONT_FAMILY.base,
        ...TD_type(TD.ROW_TYPE),
        transition: `background ${CONTROL_SHARED_TOKENS.TRANSITION_MS}ms ${CONTROL_SHARED_TOKENS.TRANSITION_EASING}`,
      }}
    >
      <span>{name}</span>
      {system && <Badge theme={theme} label="系統" tone="neutral" dot={false} />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// TypeDefinitionScreen · 畫面主元件
//
// props:
//   variant  'default' | 'empty-selection' | 'types'
//   theme    THEME_LIGHT | THEME_DARK（預設 DEFAULT_THEME）
// ─────────────────────────────────────────────────────────────
function TypeDefinitionScreen({ variant = 'default', theme = DEFAULT_THEME }) {
  const config = TYPE_DEFINITION_VARIANTS[variant] || TYPE_DEFINITION_VARIANTS.default;
  const [tab, setTab] = React.useState(config.tab);
  const [selectedFieldSetId, setSelectedFieldSetId] = React.useState(config.selectedFieldSetId);

  const selectedFieldSet = TD_FIELD_SETS.find((fs) => fs.id === selectedFieldSetId) || null;
  const fields = selectedFieldSetId ? (TD_FIELDS_BY_SET[selectedFieldSetId] || []) : [];

  const fieldColumns = [
    { key: 'name', label: '識別名稱', type: 'key' },
    { key: 'label', label: '顯示名稱', type: 'text' },
    { key: 'valueType', label: '值型別', type: 'text' },
    { key: 'kind', label: '形狀', type: 'text' },
    { key: 'tracked', label: '追蹤', type: 'text' },
    { key: 'rollup', label: '可彙總', type: 'text' },
    {
      key: 'actions', label: '', type: 'text', align: 'right',
      render: (value, row) => row.cells.system ? (
        <Badge theme={theme} label="系統" tone="neutral" dot={false} />
      ) : (
        <div style={{ display: 'flex', gap: TD.ACTION_GAP, justifyContent: 'flex-end' }}>
          <Button theme={theme} variant="ghost" size="sm" label="編輯" />
          <Button theme={theme} variant="ghost" size="sm" label="移除" />
        </div>
      ),
    },
  ];

  const fieldRows = fields.map((f) => ({
    id: f.id,
    cells: {
      name: f.name, label: f.label, valueType: f.valueType, kind: f.kind,
      tracked: f.tracked ? '開' : '', rollup: f.rollup, system: f.system,
    },
  }));

  const typeColumns = [
    { key: 'label', label: '顯示名稱', type: 'text' },
    {
      key: 'system', label: '', type: 'text',
      render: (value) => value ? <Badge theme={theme} label="系統" tone="neutral" dot={false} /> : null,
    },
    { key: 'fieldSets', label: '欄位組配方', type: 'text' },
    {
      key: 'actions', label: '', type: 'text', align: 'right',
      render: () => <Button theme={theme} variant="ghost" size="sm" label="編輯配方" />,
    },
  ];

  const typeRows = TD_ISSUE_TYPES.map((t) => ({
    id: t.id,
    cells: { label: t.label, system: t.system, fieldSets: t.fieldSets.join('、') },
  }));

  const toolbarLeft = (
    <React.Fragment>
      <span style={{ ...TD_type(TD.SCREEN_TITLE_TYPE), color: theme.text.primary, whiteSpace: 'nowrap' }}>
        型別定義
      </span>
      <LevelSwitcher theme={theme} levels={TD_TABS} value={tab} onChange={setTab} ariaLabel="切換分頁" />
    </React.Fragment>
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
        display: 'flex', flexDirection: 'column', gap: TD.SECTION_GAP,
        padding: `${TD.CONTENT_PADDING_Y}px ${TD.CONTENT_PADDING_X}px`,
      }}>
        {tab === 'fields' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: TD.COLUMN_GAP, alignItems: 'flex-start' }}>
            {/* 欄位組清單 */}
            <div style={{
              width: TD.FIELD_SET_COL_WIDTH, flexShrink: 0,
              display: 'flex', flexDirection: 'column', gap: TD.GROUP_GAP,
            }}>
              <span style={{ ...TD_type(TD.GROUP_LABEL_TYPE), color: theme.text.tertiary, padding: `0 ${TD.ROW_PADDING_X}px` }}>
                欄位組
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: TD.ACTION_GAP }}>
                {TD_FIELD_SETS.map((fs) => (
                  <TD_FieldSetRow
                    key={fs.id} theme={theme} name={fs.name} system={fs.system}
                    selected={fs.id === selectedFieldSetId}
                    onClick={() => setSelectedFieldSetId(fs.id)}
                  />
                ))}
              </div>
              <Button theme={theme} variant="secondary" size="sm" iconLeft="plus" fullWidth label="新增欄位組" />
            </div>

            {/* 欄位清單 */}
            <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: TD.GROUP_GAP }}>
              {selectedFieldSet === null ? (
                <EmptyState
                  theme={theme}
                  title="尚未選取欄位組"
                  description="從左側選一個欄位組，檢視與管理組內的欄位定義。"
                />
              ) : (
                <React.Fragment>
                  <DataTable theme={theme} columns={fieldColumns} rows={fieldRows} />
                  <Button theme={theme} variant="secondary" size="sm" iconLeft="plus" label="新增欄位" />
                </React.Fragment>
              )}
            </div>
          </div>
        ) : tab === 'types' ? (
          <React.Fragment>
            <DataTable theme={theme} columns={typeColumns} rows={typeRows} />
            <Button theme={theme} variant="secondary" size="sm" iconLeft="plus" label="新增工單型別" />
          </React.Fragment>
        ) : <TDPlanningTab key={tab} tab={tab} theme={theme} />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Canvas section · Screens > TypeDefinitionScreen
// 三個 variant × 兩主題共六張 artboard，皆為 live JSX。
// ─────────────────────────────────────────────────────────────
function ScreenTypeDefinitionSection() {
  const W = TYPE_DEFINITION_TOKENS.BASE_WIDTH;
  return (
    <DCSection
      id="screen-type-definition"
      title="TypeDefinitionScreen · 型別定義"
      subtitle="對側 spec：no2_screens/no6_type_definition_screen.md。欄位、工單型別兩分頁；欄位分頁左欄選欄位組、右欄列該組欄位。"
    >
      <DCFamily
        id="td-default" title="Default"
        subtitle="欄位分頁，已選取「專案」欄位組，右欄列出 StoryPoint 與 ExternalTool 兩個欄位。"
      >
        <DCArtboard id="td-default-light" label="default · THEME_LIGHT (live)" width={W} height="auto">
          <TypeDefinitionScreen variant="default" theme={THEME_LIGHT} />
        </DCArtboard>
        <DCArtboard id="td-default-dark" label="default · THEME_DARK (live)" width={W} height="auto">
          <TypeDefinitionScreen variant="default" theme={THEME_DARK} />
        </DCArtboard>
      </DCFamily>

      <DCFamily
        id="td-types" title="Types"
        subtitle="工單型別分頁。task 為系統型別（不可刪除，配方仍可調整）、bug 為自訂型別。"
      >
        <DCArtboard id="td-types-light" label="types · THEME_LIGHT (live)" width={W} height="auto">
          <TypeDefinitionScreen variant="types" theme={THEME_LIGHT} />
        </DCArtboard>
        <DCArtboard id="td-types-dark" label="types · THEME_DARK (live)" width={W} height="auto">
          <TypeDefinitionScreen variant="types" theme={THEME_DARK} />
        </DCArtboard>
      </DCFamily>

      <DCFamily
        id="td-boundary" title="Boundary"
        subtitle="empty-selection 為尚未選取任何欄位組，右欄換成引導提示。"
      >
        <DCArtboard id="td-empty-light" label="empty-selection · THEME_LIGHT (live)" width={W} height="auto">
          <TypeDefinitionScreen variant="empty-selection" theme={THEME_LIGHT} />
        </DCArtboard>
        <DCArtboard id="td-empty-dark" label="empty-selection · THEME_DARK (live)" width={W} height="auto">
          <TypeDefinitionScreen variant="empty-selection" theme={THEME_DARK} />
        </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

Object.assign(window, {
  TYPE_DEFINITION_TOKENS,
  TD_FIELD_SETS, TD_FIELDS_BY_SET, TD_ISSUE_TYPES, TD_TABS, TYPE_DEFINITION_VARIANTS,
  TypeDefinitionScreen, ScreenTypeDefinitionSection,
});
