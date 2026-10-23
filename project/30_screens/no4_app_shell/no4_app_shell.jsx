// ─────────────────────────────────────────────────────────────
// AppShell · 應用外殼
//
// 角色：三個工作檢視共用的外框。左側直欄由上而下四段——品牌、當前檢視、
// 畫面形態導覽、帳號；右側是內容區，掛當前形態的畫面。
//
// 存在理由：檢視選擇是跨畫面的狀態，不屬於任一畫面。放進外殼後，
// 切換畫面形態不會丟失當前檢視，選檢視也不必在三個畫面各做一次。
//
// 對側 spec：no3_product_specs/no1_issue_system/no2_screens/no4_app_shell.md
//   佈局五段（品牌 / 當前檢視 / 畫面形態導覽 / 帳號 / 內容）與互動全條逐條對位，
//   含新增檢視表單展開 / 收合、日曆選用、帳號預設日曆設定。
//   當前檢視不隨畫面形態變動，規則本體在 ViewLogic / selectCurrentView；
//   日曆解析規則在 ViewLogic / resolveViewCalendar，本畫面只負責選用與設定入口。
//
// 消費元件：
//   20_components/no1_controls.jsx — Select（檢視選擇 / 新增檢視表單三層與日曆 / 帳號預設日曆）、
//     TextInput（新增檢視表單的檢視名稱）、Button（新增檢視 / 建立 / 取消 / 主題 / 登出）
//   20_components/no2_data_display.jsx — EmptyState（無檢視時的內容區）
//   導覽項與新增檢視表單不抽元件：只有外殼用得到，抽出去會是只有一個消費端的空殼層。
//
// Variants：
//   default   — 三張檢視、當前為開發總表、形態停在清單表格
//   empty     — 名下無任何檢視，選擇器收起、內容區出 EmptyState
//   dev-order — 當前形態切到開發順序表，示意選取態隨形態走、檢視不變
//   add-view  — 新增檢視表單展開，示意檢視名稱、資料來源三層、日曆選用與建立 / 取消
//
// 兩條硬規（與元件檔同源）：
//   1. 一切視覺值引用 token。幾何走 APP_SHELL_TOKENS（其值全數由 SPACING /
//      RADIUS / TYPE_STYLES / CONTROL_HEIGHT / BORDER_WIDTH / MOTION 階梯組出），
//      色彩走傳入的 theme 物件。本檔無 hex、無未標註的裸數字
//   2. 畫面吃 theme 參數（預設 DEFAULT_THEME），THEME_LIGHT 與 THEME_DARK 同一份
//      JSX 都能渲染；畫面自身不讀 theme.id、不做主題分支
// ─────────────────────────────────────────────────────────────

// ─── Screen 級 token ─────────────────────────────────────────
const APP_SHELL_TOKENS = {
  BASE_WIDTH:  1280,                       // (literal: 桌面瀏覽器基準寬，與其餘畫面同寬)
  BASE_HEIGHT: 720,                        // (literal: 外殼要看滿版比例，故給定高)

  SIDEBAR_WIDTH:        SPACING['4xl'] * 4 + SPACING.lg,  // 200
  SIDEBAR_PADDING:      SPACING.lg,          // 12
  SIDEBAR_GAP:          SPACING.xl,          // 16
  SIDEBAR_BORDER_WIDTH: BORDER_WIDTH.hairline,

  BRAND_TYPE:      TYPE_STYLES.sectionTitle,
  BRAND_META_TYPE: TYPE_STYLES.caption,
  BRAND_GAP:       SPACING['2xs'],           // 4

  GROUP_TYPE:    TYPE_STYLES.overline,
  GROUP_GAP:     SPACING.sm,                 // 8，區標題與其內容的距離
  SECTION_GAP:   SPACING['2xs'],             // 4，同區內各列的距離

  NAV_ITEM_HEIGHT:    SPACING['3xl'],     // 32
  NAV_ITEM_PADDING_X: SPACING.sm,            // 8
  NAV_ITEM_GAP:       SPACING.sm,            // 8
  NAV_ITEM_RADIUS:    RADIUS.sm,
  NAV_ITEM_TYPE:      TYPE_STYLES.body,
  /** 選取態的左側指示條，與表格選取列同一個語彙。 */
  NAV_ACCENT_WIDTH:  BORDER_WIDTH.focus,
  NAV_ACCENT_HEIGHT: SPACING.lg,             // 16

  CONTENT_PADDING: SPACING.xl,               // 24
  /** 內容區佔位條，示意畫面掛載處，非實際畫面內容。 */
  PLACEHOLDER_RADIUS:     RADIUS.md,
  PLACEHOLDER_BORDER:     BORDER_WIDTH.hairline,
  PLACEHOLDER_LABEL_TYPE: TYPE_STYLES.caption,

  /** 新增檢視表單：行內展開於當前檢視區，子區塊底比照 toolbar 用 surface_dim。 */
  ADD_FORM_GAP:     SPACING.xs,               // 4，表單內欄位間距
  ADD_FORM_PADDING: SPACING.sm,               // 8
  ADD_FORM_RADIUS:  RADIUS.sm,

  TRANSITION_MS:     MOTION.duration.instant,
  TRANSITION_EASING: MOTION.easing.standard,
};

const A = APP_SHELL_TOKENS;

// ─── 擬真 fixture ────────────────────────────────────────────
// impl 端檢視清單來自當前帳號名下的檢視，canvas 以固定值代替。

const APP_SHELL_VIEWS = [
  { value: 'dev-all', label: '開發總表' },
  { value: 'igt',     label: 'IGotThis 工單' },
  { value: 'ssg',     label: 'SuSuGiGi 記帳' },
];

// 畫面形態三項，與 SCREEN_GROUPS 的 Work Views 對應。
const APP_SHELL_MODES = [
  { id: 'list',      label: '工單清單' },
  { id: 'kanban',    label: '工單看板' },
  { id: 'dev-order', label: '開發順序表' },
];

const APP_SHELL_ACCOUNT = '成員甲';

// 新增檢視表單：資料來源三層與日曆選用的假清單，canvas 示意逐層收窄用。
// impl 端清單來自容器樹與日曆定義查詢，canvas 以固定值代替。
const APP_SHELL_TEAMS    = [{ value: 'team-core', label: 'Core' }, { value: 'team-growth', label: 'Growth' }];
const APP_SHELL_PRODUCTS = [{ value: 'prod-igt', label: 'IGotThis' }, { value: 'prod-ssg', label: 'SuSuGiGi' }];
const APP_SHELL_MGMTS    = [{ value: 'mgmt-web', label: 'Web' }, { value: 'mgmt-ios', label: 'iOS' }];
const APP_SHELL_CALENDARS = [{ value: 'tw', label: '台灣' }, { value: 'us', label: '美國' }];
const APP_SHELL_DEFAULT_CALENDAR = 'tw';

const APP_SHELL_VARIANTS = {
  default:     { views: APP_SHELL_VIEWS, currentView: 'dev-all', mode: 'kanban' },
  empty:       { views: [],              currentView: null,      mode: 'list' },
  'dev-order': { views: APP_SHELL_VIEWS, currentView: 'dev-all', mode: 'dev-order' },
  'add-view':  { views: APP_SHELL_VIEWS, currentView: 'dev-all', mode: 'list', addFormOpen: true },
};

// ─── 內部工具（AS_ 前綴避免與其他畫面 / 元件檔的全域名稱相撞）───

function AS_type(t) {
  return {
    fontSize:      t.size,
    fontWeight:    t.weight,
    lineHeight:    `${t.lineHeight}px`,
    letterSpacing: t.letterSpacing,
  };
}

// ─── 導覽項 ──────────────────────────────────────────────────

function AppShellNavItem({ theme, label, active, onClick }) {
  const [hover, setHover] = React.useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: A.NAV_ITEM_GAP,
        height: A.NAV_ITEM_HEIGHT,
        padding: `0 ${A.NAV_ITEM_PADDING_X}px`,
        border: 'none',
        borderRadius: A.NAV_ITEM_RADIUS,
        cursor: 'pointer',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        background: active
          ? theme.state.selected.bg
          : hover
            ? theme.state.hover.bg
            : 'transparent',
        color: active ? theme.state.selected.fg : theme.text.secondary,
        fontFamily: FONT_FAMILY.base,
        ...AS_type(A.NAV_ITEM_TYPE),
        fontWeight: active ? TYPE_STYLES.bodyMedium.weight : A.NAV_ITEM_TYPE.weight,
        transition: `background ${A.TRANSITION_MS}ms ${A.TRANSITION_EASING}`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: A.NAV_ACCENT_WIDTH,
          height: A.NAV_ACCENT_HEIGHT,
          flexShrink: 0,
          borderRadius: RADIUS.full,
          background: active ? theme.state.selected.border : 'transparent',
        }}
      />
      {label}
    </button>
  );
}

// ─── 區標題 ──────────────────────────────────────────────────

function AppShellGroupLabel({ theme, children }) {
  return (
    <span
      style={{
        fontFamily: FONT_FAMILY.base,
        ...AS_type(A.GROUP_TYPE),
        color: theme.text.tertiary,
        padding: `0 ${A.NAV_ITEM_PADDING_X}px`,
      }}
    >
      {children}
    </span>
  );
}

// ─── 新增檢視表單 ────────────────────────────────────────────
// 行內展開於「當前檢視」區塊內，取代新增檢視入口。
// 對側 spec：no4_app_shell.md「新增檢視表單」——檢視名稱、資料來源的組織範圍
// （Team/Product/Mgmt 逐層選擇，選到哪層即該層為範圍）、日曆選用（留白跟隨帳號預設）。

function AppShellAddViewForm({ theme, onCancel, onCreate }) {
  const [name, setName] = React.useState('');
  const [teamId, setTeamId] = React.useState(undefined);
  const [productId, setProductId] = React.useState(undefined);
  const [mgmtId, setMgmtId] = React.useState(undefined);
  const [calendarName, setCalendarName] = React.useState(undefined);

  // 換上層選擇時下層失效，比照容器樹「僅屬一個上層」的嚴格歸屬。
  const onTeamChange = (id) => { setTeamId(id); setProductId(undefined); setMgmtId(undefined); };
  const onProductChange = (id) => { setProductId(id); setMgmtId(undefined); };

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: A.ADD_FORM_GAP,
        padding: A.ADD_FORM_PADDING,
        borderRadius: A.ADD_FORM_RADIUS,
        background: theme.bg.surface_dim,
      }}
    >
      <TextInput theme={theme} size="sm" placeholder="檢視名稱" value={name} onChange={setName} fullWidth />
      <Select
        theme={theme} size="sm" prefix="Team" options={APP_SHELL_TEAMS}
        value={teamId} onChange={onTeamChange} fullWidth
      />
      <Select
        theme={theme} size="sm" prefix="Product" options={APP_SHELL_PRODUCTS}
        value={productId} onChange={onProductChange} disabled={teamId === undefined} fullWidth
      />
      <Select
        theme={theme} size="sm" prefix="Mgmt" options={APP_SHELL_MGMTS}
        value={mgmtId} onChange={setMgmtId} disabled={productId === undefined} fullWidth
      />
      <Select
        theme={theme} size="sm" prefix="日曆" options={APP_SHELL_CALENDARS}
        value={calendarName} placeholder="跟隨帳號預設" onChange={setCalendarName} fullWidth
      />
      <div style={{ display: 'flex', gap: A.ADD_FORM_GAP }}>
        <Button theme={theme} variant="primary" size="sm" label="建立" onClick={onCreate} />
        <Button theme={theme} variant="ghost" size="sm" label="取消" onClick={onCancel} />
      </div>
    </div>
  );
}

// ─── 畫面 ────────────────────────────────────────────────────

function AppShell({ variant = 'default', theme = DEFAULT_THEME }) {
  const preset = APP_SHELL_VARIANTS[variant] ?? APP_SHELL_VARIANTS.default;
  const [currentView, setCurrentView] = React.useState(preset.currentView);
  const [mode, setMode] = React.useState(preset.mode);
  const [showAddForm, setShowAddForm] = React.useState(preset.addFormOpen ?? false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [calendar, setCalendar] = React.useState(APP_SHELL_DEFAULT_CALENDAR);
  const [dark, setDark] = React.useState(theme.id === 'dark');
  const activeTheme = dark ? THEME_DARK : THEME_LIGHT;
  const nav = [...APP_SHELL_MODES, { id: 'types', label: '型別管理' }, { id: 'workflow', label: '流程轉換規則' }, { id: 'organization', label: '組織管理' }];
  const icons = { list: 'list', kanban: 'kanban', 'dev-order': 'timeline', types: 'types', workflow: 'workflow', organization: 'organization' };
  return <div style={{ containerType: 'inline-size' }}><div className="f4-design-shell" style={{ display: 'flex', gap: F4_LAYOUT.railGap, padding: SPACING.lg, height: A.BASE_HEIGHT, boxSizing: 'border-box', background: activeTheme.bg.base, fontFamily: FONT_FAMILY.base, color: activeTheme.text.primary }}>
    <style>{`
      .f4-design-workspace { min-width: 0; flex: 1; display: flex; flex-direction: column; }
      .f4-design-content { flex: 1; min-width: 0; overflow: auto; }
      .f4-design-nav { display: flex; flex-direction: column; gap: 8px; }
      @container (max-width: ${F4_LAYOUT.mobileBreakpoint}px) {
        .f4-design-shell { flex-direction: column; padding: 0 !important; gap: 0 !important; }
        .f4-design-rail { order: 2; width: 100% !important; padding: 6px 0 !important; border-radius: 0 !important; }
        .f4-design-brand { display: none; }
        .f4-design-workspace { min-height: 0; }
        .f4-design-nav { flex-direction: row; justify-content: space-evenly; width: 100%; }
      }
    `}</style>
    <aside className="f4-design-rail" style={{ width: F4_LAYOUT.rail, flexShrink: 0, borderRadius: F4_LAYOUT.moduleRadius, background: activeTheme.bg.surface_hover, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACING.sm, paddingTop: SPACING.lg }}>
      <strong className="f4-design-brand" style={{ paddingBottom: SPACING.lg, color: activeTheme.primary.main }}>IG↗</strong>
      <nav className="f4-design-nav" aria-label="主導覽">{nav.map(item => <button type="button" key={item.id} aria-label={item.label} title={item.label} onClick={() => setMode(item.id)} style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, border: 0, borderRadius: F4_LAYOUT.controlRadius, background: mode === item.id ? activeTheme.state.selected.bg : 'transparent', color: mode === item.id ? activeTheme.primary.main : activeTheme.text.secondary }}><F4Icon name={icons[item.id]} /></button>)}</nav>
    </aside>
    <main className="f4-design-workspace">
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: SPACING.sm, padding: `${SPACING.sm}px ${SPACING.lg}px ${SPACING.lg}px`, position: 'relative' }}>
        <Select theme={activeTheme} label="當前檢視" options={preset.views} value={currentView} onChange={setCurrentView} placeholder="尚無檢視" />
        <button type="button" aria-label={showAddForm ? '取消新增檢視' : '新增檢視'} title={showAddForm ? '取消新增檢視' : '新增檢視'} onClick={() => setShowAddForm(!showAddForm)} style={{ width: F4_LAYOUT.touchTarget, height: F4_LAYOUT.touchTarget, border: 0, borderRadius: RADIUS.sm, background: activeTheme.bg.surface_hover, color: activeTheme.text.secondary }}><F4Icon name={showAddForm ? 'close' : 'plus'} /></button>
        <button aria-label="帳號設定" title="帳號設定" onClick={() => setSettingsOpen(!settingsOpen)} style={{ marginLeft: 'auto', border: 0, background: activeTheme.bg.surface_hover, padding: 12, borderRadius: 10, color: activeTheme.text.secondary }}><F4Icon name="account" /></button>
      {showAddForm && <div style={{ position: 'absolute', top: '100%', left: SPACING.lg, zIndex: 30, width: 'min(440px, calc(100vw - 32px))', maxHeight: 'calc(100dvh - 160px)', overflowY: 'auto', boxSizing: 'border-box', padding: SPACING.lg, borderRadius: RADIUS.lg, border: `1px solid ${activeTheme.border.base}`, background: activeTheme.bg.surface }}><AppShellAddViewForm theme={activeTheme} onCancel={() => setShowAddForm(false)} onCreate={() => setShowAddForm(false)} /></div>}
      {settingsOpen && <section style={{ position: 'absolute', right: SPACING.lg, top: '100%', zIndex: 40, width: 'min(280px, calc(100vw - 32px))', boxSizing: 'border-box', padding: SPACING.lg, background: activeTheme.bg.surface, border: `1px solid ${activeTheme.border.base}`, borderRadius: RADIUS.lg, display: 'flex', flexDirection: 'column', gap: SPACING.md }}><p>{APP_SHELL_ACCOUNT}</p><Select theme={activeTheme} prefix="日曆" value={calendar} options={APP_SHELL_CALENDARS} onChange={setCalendar} /><Button theme={activeTheme} label="切換主題" onClick={() => setDark(!dark)} /><Button theme={activeTheme} variant="ghost" label="登出" /></section>}
      </header>
      <div className="f4-design-content">{preset.views.length === 0 ? <EmptyState theme={activeTheme} title="尚無檢視" description="從上方新增檢視。" /> : mode === 'kanban' ? <KanbanScreen theme={activeTheme} /> : <div style={{ padding: SPACING['2xl'] }}><h1>{nav.find(n => n.id === mode)?.label}</h1><p>{preset.views.find(v => v.value === currentView)?.label}</p></div>}
      </div>
    </main>
  </div></div>;
}

// ─── Section ─────────────────────────────────────────────────

function ScreenAppShellSection() {
  const W = A.BASE_WIDTH;

  return (
    <DCSection
      id="app-shell"
      title="AppShell · 應用外殼"
      subtitle="圖示導覽、頂部檢視與帳號入口。窄版導覽移至底部。"
      direction="column"
    >
      <DCFamily
        id="as-default"
        title="default"
        subtitle="三張檢視、當前為開發總表。切換左側畫面形態不改變當前檢視。"
        direction="column"
      >
        <DCArtboard id="as-default-light" label="default · THEME_LIGHT (live)" width={W} height="auto">
          <AppShell variant="default" theme={THEME_LIGHT} />
        </DCArtboard>
        <DCArtboard id="as-default-dark" label="default · THEME_DARK (live)" width={W} height="auto">
          <AppShell variant="default" theme={THEME_DARK} />
        </DCArtboard>
      </DCFamily>

      <DCFamily
        id="as-dev-order"
        title="dev-order"
        subtitle="形態停在開發順序表。選取態隨形態走，當前檢視恆定。"
        direction="column"
      >
        <DCArtboard id="as-dev-order-light" label="dev-order · THEME_LIGHT (live)" width={W} height="auto">
          <AppShell variant="dev-order" theme={THEME_LIGHT} />
        </DCArtboard>
      </DCFamily>

      <DCFamily
        id="as-empty"
        title="empty"
        subtitle="名下無檢視。選擇器收起、內容區出空狀態，不自動建檢視。"
        direction="column"
      >
        <DCArtboard id="as-empty-light" label="empty · THEME_LIGHT (live)" width={W} height="auto">
          <AppShell variant="empty" theme={THEME_LIGHT} />
        </DCArtboard>
        <DCArtboard id="as-empty-dark" label="empty · THEME_DARK (live)" width={W} height="auto">
          <AppShell variant="empty" theme={THEME_DARK} />
        </DCArtboard>
      </DCFamily>

      <DCFamily
        id="as-add-view"
        title="add-view"
        subtitle="新增檢視表單展開：檢視名稱、資料來源三層（Team/Product/Mgmt 逐層收窄）、日曆選用，留白跟隨帳號預設。"
        direction="column"
      >
        <DCArtboard id="as-add-view-light" label="add-view · THEME_LIGHT (live)" width={W} height="auto">
          <AppShell variant="add-view" theme={THEME_LIGHT} />
        </DCArtboard>
        <DCArtboard id="as-add-view-dark" label="add-view · THEME_DARK (live)" width={W} height="auto">
          <AppShell variant="add-view" theme={THEME_DARK} />
        </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

Object.assign(window, {
  APP_SHELL_TOKENS,
  APP_SHELL_VIEWS, APP_SHELL_MODES, APP_SHELL_ACCOUNT, APP_SHELL_VARIANTS,
  APP_SHELL_TEAMS, APP_SHELL_PRODUCTS, APP_SHELL_MGMTS,
  APP_SHELL_CALENDARS, APP_SHELL_DEFAULT_CALENDAR,
  AppShell, AppShellAddViewForm, ScreenAppShellSection,
});
