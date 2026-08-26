// ─────────────────────────────────────────────────────────────
// LoginScreen · 登入 / 註冊
//
// 角色：認證入口。單一 Company 模式下，首位使用者以「註冊」建立 Default
// Company 與帳號，其後皆以「登入」進入。兩種模式共用同一組卡片版面，欄位
// 只差「姓名」一欄（僅 register 顯示），底部切換連結互轉兩種模式。
//
// 對側 spec：帳號系統（account_system）屬地基層，無獨立畫面規格檔；本畫面
// 視覺定案由 design 端直接承載，impl 端逐名對齊即可，不虛構 spec 路徑。
//
// 消費元件：
//   20_components/no1_controls.jsx — Button（送出）、TextInput（欄位輸入）
//
// Variants：
//   login    — 卡片標題「登入以繼續」，Email + 密碼兩欄
//   register — 卡片標題「建立帳號以開始使用」，姓名 + Email + 密碼三欄
//
// 兩條硬規（與元件檔同源）：
//   1. 一切視覺值引用 token。幾何走 LOGIN_SCREEN_TOKENS（其值全數由 SPACING /
//      RADIUS / TYPE_STYLES / BORDER_WIDTH 階梯組出），色彩走傳入的 theme
//      物件。本檔無 hex、無未標註的裸數字
//   2. 畫面吃 theme 參數（預設 DEFAULT_THEME），THEME_LIGHT 與 THEME_DARK 同一份
//      JSX 都能渲染；畫面自身不讀 theme.id、不做主題分支
//
// TextInput 無 type 區分（無密碼遮罩），canvas 為靜態視覺展示，不影響定案：
// 密碼欄的遮罩行為屬瀏覽器原生 input[type=password]，由 impl 端逐名對齊時
// 在真實 <input> 補上，design 只仲裁排版與色彩。
// ─────────────────────────────────────────────────────────────

// ─── Screen 級 token ─────────────────────────────────────────
const LOGIN_SCREEN_TOKENS = {
  BASE_WIDTH:      720,                // (literal: canvas artboard 基準寬，卡片置中)
  FORM_WIDTH:      SPACING['3xl'] * 9, // 360
  FORM_PADDING:    SPACING.xl,         // 24
  FORM_GAP:        SPACING.lg,         // 16
  FORM_RADIUS:     RADIUS.lg,          // 8
  FIELD_GAP:       SPACING['2xs'],     // 2，label 與輸入框之間
  TITLE_TYPE:      TYPE_STYLES.sectionTitle,
  SUBTITLE_TYPE:   TYPE_STYLES.caption,
  FIELD_LABEL_TYPE: TYPE_STYLES.caption,
  SWITCH_TYPE:     TYPE_STYLES.caption,
  OUTER_PADDING:   SPACING['2xl'],     // 32，artboard 邊界到卡片
};

const LG = LOGIN_SCREEN_TOKENS;

// ─── LG_Field ─── label 在上、TextInput 在下
// 區域性小元件：登入頁專用的欄位排版，只有本畫面用得到，20_components 無對應件。
function LG_Field({ theme, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: LG.FIELD_GAP }}>
      <span style={{ ...typeStyleOf(LG.FIELD_LABEL_TYPE), color: theme.text.secondary }}>
        {label}
      </span>
      <TextInput theme={theme} value="" placeholder="" clearable={false} fullWidth />
    </div>
  );
}

// jsx 內型別樣式轉字面 CSS 的共用小工具，比照其餘畫面檔的 LS_type / KIND_LABEL 命名慣例。
function typeStyleOf(t) {
  return {
    fontSize:      t.size,
    fontWeight:    t.weight,
    lineHeight:    `${t.lineHeight}px`,
    letterSpacing: t.letterSpacing,
  };
}

// ─────────────────────────────────────────────────────────────
// LoginScreen · 畫面主元件
//
// props:
//   variant  'login' | 'register'
//   theme    THEME_LIGHT | THEME_DARK（預設 DEFAULT_THEME）
// ─────────────────────────────────────────────────────────────
function LoginScreen({ variant = 'login', theme = DEFAULT_THEME }) {
  const isRegister = variant === 'register';

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: LG.OUTER_PADDING,
        background: theme.bg.base,
        fontFamily: FONT_FAMILY.base,
      }}
    >
      <div
        style={{
          width: LG.FORM_WIDTH,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: LG.FORM_GAP,
          padding: LG.FORM_PADDING,
          background: theme.bg.surface,
          border: `${BORDER_WIDTH.hairline}px solid ${theme.border.base}`,
          borderRadius: LG.FORM_RADIUS,
          boxShadow: controlShadow(theme, 'level2'),
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: LG.FIELD_GAP }}>
          <span style={{ ...typeStyleOf(LG.TITLE_TYPE), color: theme.text.primary }}>
            IGotThis 工單系統
          </span>
          <span style={{ ...typeStyleOf(LG.SUBTITLE_TYPE), color: theme.text.tertiary }}>
            {isRegister ? '建立帳號以開始使用' : '登入以繼續'}
          </span>
        </div>

        {isRegister && <LG_Field theme={theme} label="姓名" />}
        <LG_Field theme={theme} label="Email" />
        <LG_Field theme={theme} label="密碼" />

        <Button
          theme={theme}
          variant="primary"
          fullWidth
          label={isRegister ? '註冊並進入' : '登入'}
        />

        <span
          style={{
            ...typeStyleOf(LG.SWITCH_TYPE),
            color: theme.primary.main,
            cursor: 'pointer',
          }}
        >
          {isRegister ? '已有帳號？改用登入' : '還沒有帳號？改用註冊'}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Canvas section · Screens > LoginScreen
// 兩個 variant × 兩主題共四張 artboard，皆為 live JSX。
// ─────────────────────────────────────────────────────────────
function ScreenLoginSection() {
  const W = LOGIN_SCREEN_TOKENS.BASE_WIDTH;
  return (
    <DCSection
      id="screen-login"
      title="LoginScreen · 登入 / 註冊"
      subtitle="認證入口，單一 Company 模式下共用同一張卡片，姓名欄僅 register 顯示。"
    >
      <DCFamily
        id="lg-login" title="Login"
        subtitle="既有帳號登入：Email + 密碼兩欄。"
      >
        <DCArtboard id="lg-login-light" label="login · THEME_LIGHT (live)" width={W} height="auto">
          <LoginScreen variant="login" theme={THEME_LIGHT} />
        </DCArtboard>
        <DCArtboard id="lg-login-dark" label="login · THEME_DARK (live)" width={W} height="auto">
          <LoginScreen variant="login" theme={THEME_DARK} />
        </DCArtboard>
      </DCFamily>

      <DCFamily
        id="lg-register" title="Register"
        subtitle="首位使用者建立 Default Company：姓名 + Email + 密碼三欄。"
      >
        <DCArtboard id="lg-register-light" label="register · THEME_LIGHT (live)" width={W} height="auto">
          <LoginScreen variant="register" theme={THEME_LIGHT} />
        </DCArtboard>
        <DCArtboard id="lg-register-dark" label="register · THEME_DARK (live)" width={W} height="auto">
          <LoginScreen variant="register" theme={THEME_DARK} />
        </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

Object.assign(window, {
  LOGIN_SCREEN_TOKENS,
  LoginScreen, ScreenLoginSection,
});
