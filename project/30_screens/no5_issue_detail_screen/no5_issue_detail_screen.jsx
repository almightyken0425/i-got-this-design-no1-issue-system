// 工單詳情採閱讀優先。標題與狀態置頂，右側資訊，左側關聯及歷史。
// 同模組 Spec no2_screens/no5_issue_detail_screen.md 的行為維持。
// 欄位點選後編輯，Enter 儲存，Escape 或取消放棄草稿，失敗保留輸入。
// 關聯與工時表單收合，歷史依執行者、變更內容、時間垂直排列。
// 姓名不可得時用短編號區分帳號，完整識別碼保留為提示。
// variant → 資料與狀態。畫面本體只讀本表，不在 JSX 內散落 variant 判斷。
const ISSUE_DETAIL_VARIANTS = {
  default: {
    label: '預設',
    issueKey: ISSUE_DETAIL_ISSUE_KEY,
    fieldDefs: ISSUE_DETAIL_FIELD_DEFS_DEFAULT,
    fieldValues: ISSUE_DETAIL_FIELD_VALUES_DEFAULT,
    relations: ISSUE_DETAIL_RELATIONS_DEFAULT,
    changelog: ISSUE_DETAIL_CHANGELOG_DEFAULT,
  },
  resolution: {
    label: 'Status 轉終止狀態 · 結案原因選擇中',
    issueKey: ISSUE_DETAIL_ISSUE_KEY,
    fieldDefs: ISSUE_DETAIL_FIELD_DEFS_DEFAULT,
    fieldValues: ISSUE_DETAIL_FIELD_VALUES_DEFAULT,
    relations: ISSUE_DETAIL_RELATIONS_DEFAULT,
    changelog: ISSUE_DETAIL_CHANGELOG_DEFAULT,
    // 示意「曾送出一次遭拒」：面板保留上次已選項與禁止原因，可重選或取消。
    resolutionDemo: { targetLabel: '已封存', picked: 'wontfix', errorMessage: '此轉換被禁止：仍有未完成的子工單。' },
  },
  'readonly-heavy': {
    label: '多數欄位唯讀',
    issueKey: 'IGT-1028',
    fieldDefs: ISSUE_DETAIL_FIELD_DEFS_READONLY_HEAVY,
    fieldValues: {
      title: '開發順序表的甘特超期標示', status: '已完成', resolution: '已完成',
      assignee: '王世昌', point: 3, reporter: '王世昌', createdAt: '2026-07-10',
    },
    relations: ISSUE_DETAIL_RELATIONS_DEFAULT,
    changelog: ISSUE_DETAIL_CHANGELOG_DEFAULT,
  },
  empty: {
    label: '無關聯 · 無異動歷史',
    issueKey: 'IGT-1041',
    fieldDefs: ISSUE_DETAIL_FIELD_DEFS_DEFAULT,
    fieldValues: {
      title: 'CSV 匯入的欄位對應精靈', status: '待處理', resolution: null,
      assignee: '林巧薇', point: 5, reporter: '林巧薇', createdAt: '2026-08-01',
    },
    relations: ISSUE_DETAIL_RELATIONS_EMPTY,
    changelog: [],
  },
};

// 供 canvas router 生成 artboard 用；順序即建議的並陳順序。
const ISSUE_DETAIL_SCREEN_VARIANTS = ['default', 'resolution', 'readonly-heavy', 'empty'];

function IssueDetailScreen({ variant = 'default', theme = DEFAULT_THEME }) {
  const T = ISSUE_DETAIL_SCREEN_TOKENS;
  const config = ISSUE_DETAIL_VARIANTS[variant] || ISSUE_DETAIL_VARIANTS.default;

  const [fieldValues, setFieldValues] = React.useState(config.fieldValues);
  const [resolutionTarget, setResolutionTarget] = React.useState(config.resolutionDemo ? config.resolutionDemo.targetLabel : null);
  const [picked, setPicked] = React.useState(config.resolutionDemo ? config.resolutionDemo.picked : null);
  const [resolutionError, setResolutionError] = React.useState(config.resolutionDemo ? config.resolutionDemo.errorMessage : undefined);
  const [rollupMode, setRollupMode] = React.useState('manual');
  const [confirmAuto, setConfirmAuto] = React.useState(false);
  const [relationKey, setRelationKey] = React.useState('');
  const [addedRelations, setAddedRelations] = React.useState([]);
  const [hours, setHours] = React.useState('');
  const [worklogs, setWorklogs] = React.useState([2.5]);

  const commitField = (name, nextValue) => {
    setFieldValues((v) => ({ ...v, [name]: nextValue }));
  };

  // 選到非終止狀態：直接寫入。選到終止狀態：不動 fieldValues，改開結案原因面板——
  // 對應 Spec「IF 取消選擇：Status 維持原值」，未確認前本就不該碰真正的值。
  const onStatusChange = (nextValue) => {
    const opt = ISSUE_DETAIL_STATUS_OPTIONS.find((o) => o.value === nextValue);
    if (!opt) return;
    if (opt.isTerminal) {
      setResolutionTarget(nextValue);
      setPicked(null);
      setResolutionError(undefined);
      return;
    }
    setResolutionTarget(null);
    commitField('status', nextValue);
  };

  const onResolutionConfirm = (resolutionId) => {
    if (!resolutionTarget) return;
    const opt = ISSUE_DETAIL_RESOLUTIONS.find((r) => r.id === resolutionId);
    setFieldValues((v) => ({ ...v, status: resolutionTarget, resolution: opt ? opt.label : resolutionId }));
    setResolutionTarget(null);
    setPicked(null);
    setResolutionError(undefined);
  };

  const onResolutionCancel = () => {
    setResolutionTarget(null);
    setPicked(null);
    setResolutionError(undefined);
  };

  // 面板開啟中，Select 顯示的是「正等待確認的目標」而非已提交值；
  // 取消後 resolutionTarget 歸零，落回真正的已提交狀態，值從未被動過。
  const displayedStatus = resolutionTarget || fieldValues.status;

  function renderField(def) {
    const raw = fieldValues[def.name];

    if (def.name === 'point' && !def.readonly) {
      return <div style={{ display: 'flex', flexDirection: 'column', gap: T.GROUP_GAP, flex: 1 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: T.FIELD_ROW_GAP }}>
          {rollupMode === 'auto' ? <IssueDetailReadOnlyValue theme={theme} text="8" /> :
            <IssueDetailEditableField theme={theme} value={String(raw ?? '')} onCommit={text => commitField('point', Number(text))} />}
          <Select theme={theme} prefix="模式" value={rollupMode} options={[{ value: 'manual', label: '手動' }, { value: 'auto', label: '自動' }]}
            onChange={mode => mode === 'auto' ? setConfirmAuto(true) : setRollupMode(mode)} />
        </div>
        {rollupMode === 'manual' && <span style={{ ...issueDetailType(T.RESOLUTION_HINT_TYPE), color: theme.text.secondary }}>下級合計 8 點 · 差距 {8 - Number(raw || 0)} 點</span>}
        {confirmAuto && <div style={{ display: 'flex', gap: T.GROUP_GAP, alignItems: 'center' }}>
          <span>自動彙總會取代目前主值。</span>
          <Button theme={theme} label="確認切換" onClick={() => { setRollupMode('auto'); setConfirmAuto(false); }} />
          <Button theme={theme} variant="ghost" label="取消" onClick={() => setConfirmAuto(false)} />
        </div>}
      </div>;
    }

    if (def.name === 'status') {
      return (
        <Select
          theme={theme} options={ISSUE_DETAIL_STATUS_OPTIONS}
          value={displayedStatus} onChange={onStatusChange}
        />
      );
    }

    if (def.name === 'resolution') {
      // Resolution 只隨一次真正的 Status 轉換一併寫入，本畫面不給獨立輸入框；
      // 空值顯示對齊 Spec 線框圖的「尚未結案」而非泛用的「(無)」。
      return <IssueDetailReadOnlyValue theme={theme} text={raw ? String(raw) : '尚未結案'} />;
    }

    if (def.readonly) {
      return <IssueDetailReadOnlyValue theme={theme} text={issueDetailDisplayValue(raw)} />;
    }

    return (
      <IssueDetailEditableField
        theme={theme}
        value={raw === null || raw === undefined ? '' : String(raw)}
        onCommit={(text) => {
          if (def.name === 'point') {
            const trimmed = text.trim();
            if (trimmed === '') { commitField('point', null); return; }
            const parsed = Number(trimmed);
            if (Number.isFinite(parsed)) commitField('point', parsed);
            return;
          }
          commitField(def.name, text);
        }}
      />
    );
  }

  const rel = config.relations;
  const hasParentChild = rel.parents.length > 0 || rel.children.length > 0;
  const relationsEmpty = !hasParentChild && rel.otherGroups.length === 0;

  return (
    <div className="issue-design" style={{ width: '100%', minHeight: '100%', containerType: 'inline-size', background: theme.bg.surface, color: theme.text.primary, fontFamily: FONT_FAMILY.base }}>
      <style>{`
        .design-edit-hint { opacity: 0; }
        .design-issue-editable:hover .design-edit-hint, .design-issue-editable:focus-visible .design-edit-hint { opacity: 1; }
        .design-issue-editable:hover { background: ${theme.bg.surface_hover} !important; }
        .issue-design * { box-sizing: border-box; }
        .issue-design select { width: 100%; }
        .issue-design-content { max-width: ${T.CONTENT_MAX_WIDTH}px; margin: 0 auto; padding: ${T.CONTENT_PADDING_Y}px ${T.CONTENT_PADDING_X}px; }
        .issue-design-body { display: grid; grid-template-columns: ${T.DETAIL_COLUMNS}; gap: ${T.CONTENT_GAP}px; }
        .issue-design-properties { grid-column: 2; grid-row: 1; }
        .issue-design-main { grid-column: 1; grid-row: 1; min-width: 0; }
        @container (max-width: ${T.RESPONSIVE_WIDTH}px) {
          .design-edit-hint { opacity: 1; }
          .issue-design-content { padding: ${T.MOBILE_PADDING}px; }
          .issue-design-body { display: flex; flex-direction: column; gap: 0; }
          .issue-design-panel { padding: 16px !important; }
        }
      `}</style>
      <div className="issue-design-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: T.HEADER_GAP, color: theme.text.secondary }}><Button theme={theme} variant="ghost" label="← 返回" /><span>/</span><span style={{ fontFamily: FONT_FAMILY.mono }}>{config.issueKey}</span></div>
        <h1 style={{ ...issueDetailType(T.TITLE_TYPE), margin: `${SPACING.xl}px 0 ${SPACING.md}px`, overflowWrap: 'anywhere' }}><IssueDetailEditableField theme={theme} value={fieldValues.title} onCommit={text => commitField('title', text)} /></h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.md, alignItems: 'center', margin: `${SPACING.lg}px 0 ${SPACING['2xl']}px` }}>
          <Select theme={theme} prefix="狀態" options={ISSUE_DETAIL_STATUS_OPTIONS} value={displayedStatus} onChange={onStatusChange} />
          {fieldValues.resolution && <span>{fieldValues.resolution}</span>}
        </div>
        {resolutionTarget && <IssueDetailResolutionPanel theme={theme} targetLabel={resolutionTarget} options={ISSUE_DETAIL_RESOLUTIONS} picked={picked} errorMessage={resolutionError} onPick={setPicked} onCancel={onResolutionCancel} onConfirm={onResolutionConfirm} />}
        <div className="issue-design-body">
          <aside className="issue-design-properties">
            <IssueDetailSectionPanel theme={theme} title="工單資訊">
              {config.fieldDefs.filter(def => !['title', 'status'].includes(def.name)).map(def => <IssueDetailFieldRow key={def.name} theme={theme} label={def.label}>{renderField(def)}</IssueDetailFieldRow>)}
            </IssueDetailSectionPanel>
            <IssueDetailSectionPanel theme={theme} title="工時">
              <div><strong style={issueDetailType(T.TITLE_TYPE)}>{worklogs.reduce((sum, value) => sum + value, 0)}</strong> 小時</div>
              <details><summary style={{ cursor: 'pointer', color: theme.primary.main }}>填報工時</summary><TextInput theme={theme} value={hours} onChange={setHours} placeholder="工時，小時" /><Button theme={theme} label="填報工時" disabled={!(Number(hours) > 0)} onClick={() => { setWorklogs([...worklogs, Number(hours)]); setHours(''); }} /></details>
            </IssueDetailSectionPanel>
          </aside>
          <div className="issue-design-main">
            <IssueDetailSectionPanel theme={theme} title="關聯工單">
              <IssueDetailRelationGroup theme={theme} title="上層工單" items={rel.parents} />
              <IssueDetailRelationGroup theme={theme} title="子工單" items={rel.children} />
              {rel.otherGroups.map(group => <IssueDetailRelationGroup key={group.id} theme={theme} title={group.typeName} items={group.items} />)}
              {relationsEmpty && <span style={{ color: theme.text.secondary }}>尚無關聯工單</span>}
              {addedRelations.map(key => <div key={key}>{key}<Button theme={theme} variant="ghost" label="移除" onClick={() => setAddedRelations(addedRelations.filter(item => item !== key))} /></div>)}
              <details><summary style={{ cursor: 'pointer', color: theme.primary.main }}>新增關聯</summary>
                <Select theme={theme} prefix="型別" value="Children" options={[{ value: 'Children', label: '子工單' }]} />
                <TextInput theme={theme} fullWidth placeholder="目標工單編號，例如 IGT-1042" value={relationKey} onChange={setRelationKey} />
                <Button theme={theme} label="新增關聯" disabled={!relationKey.trim()} onClick={() => { setAddedRelations([...addedRelations, relationKey.trim()]); setRelationKey(''); }} />
              </details>
            </IssueDetailSectionPanel>
            <IssueDetailSectionPanel theme={theme} title="異動歷史">
              {config.changelog.length ? config.changelog.map(entry => <IssueDetailChangeLogRow key={entry.id} theme={theme} entry={entry} />) : <span>尚無異動記錄</span>}
            </IssueDetailSectionPanel>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenIssueDetailSection() {
  return <DCSection id="screen-issue-detail" title="IssueDetailScreen · 工單詳情頁" subtitle="閱讀優先。點欄位編輯，窄版堆疊資訊、關聯與歷史。">
    {ISSUE_DETAIL_SCREEN_VARIANTS.map(variant => <DCFamily key={variant} id={`idd-${variant}`} title={ISSUE_DETAIL_VARIANTS[variant].label}>
      {[THEME_LIGHT, THEME_DARK].map(theme => <DCArtboard key={theme.id} id={`idd-${variant}-${theme.id}`} label={`${variant} · ${theme.id}`} width={ISSUE_DETAIL_SCREEN_TOKENS.FRAME_WIDTH} height="auto"><IssueDetailScreen variant={variant} theme={theme} /></DCArtboard>)}
    </DCFamily>)}
    <DCFamily id="idd-narrow" title="窄版"><DCArtboard id="idd-narrow-light" label="窄版 · 384px" width={SPACING['4xl'] * 8} height="auto"><IssueDetailScreen /></DCArtboard></DCFamily>
  </DCSection>;
}

Object.assign(window, {
  ISSUE_DETAIL_VARIANTS, ISSUE_DETAIL_SCREEN_VARIANTS,
  IssueDetailScreen, ScreenIssueDetailSection,
});
