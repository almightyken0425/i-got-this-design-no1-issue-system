window.DEMO_TASKS = [
 {id:'WEB-128',title:'首頁資訊架構與內容排序',label:'設計',status:0,person:'林',name:'林以安',priority:'中',due:'10/16',note:'整理首頁的主要內容與導覽順序，確認手機與桌面閱讀動線。'},
 {id:'WEB-129',title:'整理品牌素材與圖片規範',label:'內容',status:0,person:'陳',name:'陳沛庭',priority:'低',due:'10/17',note:'統一圖片比例、檔案命名與替代文字，讓製作團隊能快速取用。'},
 {id:'WEB-124',title:'建立共用元件與互動狀態',label:'設計',status:1,person:'林',name:'林以安',priority:'高',due:'10/15',note:'涵蓋按鈕、輸入欄位、選取、載入與錯誤等必要狀態。'},
 {id:'WEB-125',title:'完成專案總覽頁面',label:'開發',status:1,person:'許',name:'許哲維',priority:'高',due:'10/16',note:'依確認的畫面層次完成總覽頁，包含任務篩選與小螢幕適配。'},
 {id:'WEB-121',title:'檢查手機版導覽體驗',label:'設計',status:2,person:'吳',name:'吳佳穎',priority:'中',due:'10/14',note:'確認單手操作、焦點順序與較長文字的顯示方式。'},
 {id:'WEB-122',title:'確認產品文案與語氣',label:'內容',status:2,person:'陳',name:'陳沛庭',priority:'中',due:'10/14',note:'讓動作名稱、提示與錯誤訊息保持一致。'},
 {id:'WEB-117',title:'團隊訪談與需求整理',label:'研究',status:3,person:'林',name:'林以安',priority:'中',due:'10/12',note:'已完成五位團隊成員訪談，並整理出主要工作流程。'},
 {id:'WEB-118',title:'確認網站改版目標',label:'企劃',status:3,person:'吳',name:'吳佳穎',priority:'低',due:'10/12',note:'目標為縮短尋找資訊的時間，改善內容層次與視覺一致性。'}
];
window.ICONS = {
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 board:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m6-16v16"/>',list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',down:'<path d="m6 9 6 6 6-6"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',check:'<path d="m5 12 4 4L19 6"/>',
 star:'<path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4L2.8 9.7l6.4-.9Z"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
 inbox:'<path d="M3 4h18v16H3zM3 13h5l2 3h4l2-3h5"/>',
 people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-3-5"/>',
 chat:'<path d="M21 11a8 8 0 0 1-8 8H7l-4 3V5a2 2 0 0 1 2-2h8a8 8 0 0 1 8 8Z"/>',
 flag:'<path d="M5 22V3m0 0c4-4 10 4 14 0v10c-4 4-10-4-14 0"/>',
 expand:'<path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/>',compare:'<rect x="2" y="4" width="8" height="16" rx="1"/><rect x="14" y="4" width="8" height="16" rx="1"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',link:'<path d="m10 14 4-4m-6 1-3 3a4 4 0 0 0 6 6l3-3m-4-10 3-3a4 4 0 0 1 6 6l-3 3"/>'
};
window.icon = (name, cls='') => `<svg class="icon ${cls}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.grid}</svg>`;
