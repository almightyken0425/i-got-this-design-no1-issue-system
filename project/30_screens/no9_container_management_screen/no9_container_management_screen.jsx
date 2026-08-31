const CONTAINER_MANAGEMENT_TOKENS = {
  CONTENT_PADDING_X: SPACING.xl,
  CONTENT_PADDING_Y: SPACING.lg,
  SECTION_GAP: SPACING.md,
  PANEL_MIN_WIDTH: SPACING['3xl'] * 5,
  PANEL_PADDING: SPACING.md,
  PANEL_RADIUS: RADIUS.sm,
  ROW_GAP: SPACING.sm,
  ROW_MIN_HEIGHT: SPACING.md * 2,
  TITLE_TYPE: TYPE_STYLES.sectionTitle,
  BODY_TYPE: TYPE_STYLES.bodySm,
};

function ContainerManagementScreen({ theme = DEFAULT_THEME, variant = 'default' }) {
  const T = CONTAINER_MANAGEMENT_TOKENS;
  const readonly = variant === 'readonly';
  const [editing, setEditing] = React.useState(variant === 'creating' ? '管理域' : null);
  const [renaming, setRenaming] = React.useState(false);
  const [name, setName] = React.useState('');
  const [initialSetName, setInitialSetName] = React.useState('');
  const [key, setKey] = React.useState('');
  const [saved, setSaved] = React.useState(null);
  const panels = [
    { label: '團隊', items: ['產品團隊'] },
    { label: '產品', items: ['IGotThis', '第二產品'] },
    { label: '管理域', items: ['開發', '維護'] },
    { label: '工單集', items: ['產品待辦 · SECOND', '維護工作 · OPS'] },
  ];
  return <div style={{ background: theme.bg.canvas, color: theme.text.primary, padding: `${T.CONTENT_PADDING_Y}px ${T.CONTENT_PADDING_X}px`, display: 'flex', flexDirection: 'column', gap: T.SECTION_GAP, ...textStyle(T.BODY_TYPE) }}>
    <h1 style={{ margin: 0, ...textStyle(T.TITLE_TYPE) }}>組織管理</h1>
    <div style={{ color: theme.text.secondary }}>選擇團隊與產品，再管理所屬的管理域與工單集。</div>
    {saved && <div role="status">{saved}</div>}
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${T.PANEL_MIN_WIDTH}px, 1fr))`, gap: T.SECTION_GAP }}>
      {panels.map(panel => <section key={panel.label} style={{ background: theme.bg.surface, padding: T.PANEL_PADDING, border: `${BORDER_WIDTH.hairline}px solid ${theme.border.base}`, borderRadius: T.PANEL_RADIUS, display: 'flex', flexDirection: 'column', gap: T.ROW_GAP }}>
        <h2 style={{ margin: 0, ...textStyle(TYPE_STYLES.sectionTitle) }}>{panel.label}</h2>
        {panel.items.map((item, index) => <div key={item} style={{ display: 'flex', gap: T.ROW_GAP }}>
          <Button theme={theme} fullWidth label={item} variant={index === 0 ? 'secondary' : 'ghost'} style={{ minWidth: 0, whiteSpace: 'normal', height: 'auto', minHeight: T.ROW_MIN_HEIGHT, overflowWrap: 'anywhere' }} />
          {!readonly && <Button theme={theme} size="sm" label="改名" onClick={() => { setEditing(panel.label); setRenaming(true); setName(item.split(' · ')[0]); }} />}
        </div>)}
        {readonly ? <span style={{ color: theme.text.tertiary }}>此範圍僅供檢視</span> : <Button theme={theme} label={`新增${panel.label}`} iconLeft="plus" onClick={() => { setEditing(panel.label); setRenaming(false); setName(''); setInitialSetName(''); setKey(''); }} />}
      </section>)}
    </div>
    {editing && <div style={{ display: 'flex', flexDirection: 'column', gap: T.ROW_GAP, padding: T.PANEL_PADDING, background: theme.bg.surface, borderRadius: T.PANEL_RADIUS, border: `${BORDER_WIDTH.hairline}px solid ${theme.border.base}` }}>
      <h2 style={{ margin: 0, ...textStyle(T.TITLE_TYPE) }}>{renaming ? '改名' : '新增'}{editing}</h2>
      <label>名稱<TextInput theme={theme} value={name} onChange={setName} fullWidth /></label>
      {!renaming && editing === '管理域' && <label>初始工單集名稱<TextInput theme={theme} value={initialSetName} onChange={setInitialSetName} fullWidth /></label>}
      {!renaming && (editing === '管理域' || editing === '工單集') && <label>工單集 KEY<TextInput theme={theme} value={key} onChange={setKey} fullWidth /><span style={{ color: theme.text.tertiary }}>使用大寫英文、數字或底線。不可數字開頭。同公司內不可重複。</span></label>}
      <div style={{ display: 'flex', gap: T.ROW_GAP }}>
        <Button theme={theme} variant="primary" label="儲存" disabled={!name.trim() || (!renaming && editing === '管理域' && !initialSetName.trim()) || (!renaming && ['管理域', '工單集'].includes(editing) && !key.trim())} onClick={() => { setSaved('已儲存'); setEditing(null); }} />
        <Button theme={theme} variant="ghost" label="取消" onClick={() => setEditing(null)} />
      </div>
    </div>}
  </div>;
}

function ScreenContainerManagementSection() {
  return <DCSection id="screen-container-management" title="組織管理" subtitle="建立與改名逐層組織。操作依範圍權限開放。">
    {['default', 'creating', 'readonly'].map(variant => <DCFamily key={variant} id={`organization-${variant}`} title={variant}>
      {[THEME_LIGHT, THEME_DARK].map((theme, index) => <DCArtboard key={index} id={`organization-${variant}-${index}`} label={`${variant} · ${index === 0 ? 'light' : 'dark'}`} width={1280} height="auto">
        <ContainerManagementScreen theme={theme} variant={variant} />
      </DCArtboard>)}
    </DCFamily>)}
  </DCSection>;
}

Object.assign(window, { CONTAINER_MANAGEMENT_TOKENS, ContainerManagementScreen, ScreenContainerManagementSection });
