// Original local database content, read 2026-10-18. IDs and actor are aliased.
// Preview-only adapter. No database or network writes.
window.__scenario='normal';window.__writes=[];window.__missing=[];
const stages=['待處理','處理中','審查中','已完成'];
const rows=[{id:'issue-0',issueTypeId:'type-a',key:'IGT-1',title:'工單A',status:'待處理',assignee:'',due:null,point:null,resolution:null},{id:'issue-1',issueTypeId:'type-a',key:'IGT-2',title:'工單B',status:'處理中',assignee:'',due:null,point:null,resolution:null}];
const fields=[['title','標題','text'],['status','狀態','text'],['resolution','結案原因','text'],['assignee','負責人','text'],['point','點數','number'],['due','到期日','date'],['StartTime','開始日期','date'],['EndTime','結束日期','date']].map(([name,label,valueType])=>({companyId:'company',name,label,valueType,fieldSetName:'基本',kind:'single',readonly:false,rollupable:false,rollupFn:null,tracked:true,system:false}));
const workflow={states:stages.map((name,i)=>({name,isTerminal:i===3,isInitial:i===0,sortOrder:i})),transitions:[['待處理','處理中'],['處理中','審查中'],['審查中','已完成'],['審查中','處理中']].map(([fromState,toState])=>({fromState,toState,requiredFields:[],requiredRole:null})),resolutionOptions:[{value:'不做'},{value:'已完成'}]};
const views=[{id:'view',name:'測試檢視',sourceMgmtIds:['mgmt'],filter:[],columnConfig:[],sortConfig:[],displayLevel:1,calendarName:null}];
const logs=[['issue-0','status',null,'待處理',1787813047620],['issue-1','status',null,'待處理',1787813148590],['issue-1','status','待處理','處理中',1787813198815],['issue-1','point',null,5,1787839863672],['issue-0','point',null,3,1787839865024],['issue-0','point',null,3,1787840502011],['issue-1','point',null,5,1787840505578]].map(([issueId,fieldName,oldValue,newValue,time],i)=>({issueId,id:'log-'+i,value:{fieldName,oldValue,newValue,actor:'preview-actor',time}}));
window.__snapshot=()=>({issues:rows.map(x=>({...x})),states:[...stages]});
window.fetch=async(input,init={})=>{
const p=new URL(String(input),'https://comparison.invalid').pathname,method=init.method||'GET';
const out=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
if(window.__scenario==='loading')await new Promise(r=>setTimeout(r,800));
if(method!=='GET')window.__writes.push({path:p,method,body:init.body});
if(window.__scenario==='error'&&p.endsWith('/workspace-issues'))return out({error:{code:'OFFLINE',message:'暫時無法載入，請重試。'}},503);
if(p==='/api/auth/me')return out({account:{id:'preview-actor',name:'原始操作者',email:'preview@example.invalid'}});
if(p==='/api/accounts/me')return out({defaultCalendarName:null});
if(p==='/api/calendars')return out({calendars:[]});
if(p==='/api/views')return out({views:window.__scenario==='no-view'?[]:views});
if(p==='/api/workspace')return out({companyId:'company',issueTypeId:'type-a',issueSetId:'set',states:workflow.states});
if(p==='/api/views/kanban-columns')return out({columns:stages.map(name=>({name}))});
if(p.endsWith('/workspace-issues'))return out({issues:window.__scenario==='empty'?[]:rows,excludedCount:0,permissionExcludedCount:0});
if(p.endsWith('/workflow'))return out(workflow);
if(p==='/api/issue-types')return out({issueTypes:[{id:'type-a',name:'task',label:'工單',fieldSets:['基本']}]});
if(p==='/api/fields/defs')return out({fieldDefs:fields});
if(p==='/api/relations/types')return out({relationTypes:[]});
if(p.startsWith('/api/relations/edges/'))return out({relations:[]});
const id=p.match(/\/(issue-\d+)/)?.[1],row=rows.find(r=>r.id===id);
if(p.endsWith('/context'))return out({canEdit:window.__scenario!=='readonly',rollups:[],worklogs:[]});
if(p.endsWith('/fields')&&row)return out({fieldValues:fields.map(f=>({fieldName:f.name,value:row[f.name]??null}))});
if(p.endsWith('/changelog'))return out({changeLog:logs.filter(x=>x.issueId===id)});
if(method==='PATCH'&&p.startsWith('/api/workspace/issues/')&&row){const patch=JSON.parse(init.body);if(window.__scenario==='save-error')return out({error:{code:'PREVIEW_ERROR',message:'更新失敗，原資料已保留。'}},422);if(patch.status&&patch.status!==row.status&&!workflow.transitions.some(t=>t.fromState===row.status&&t.toState===patch.status))return out({error:{code:'INVALID_TRANSITION',message:'目前狀態無法轉換至此階段。'}},422);if(patch.status==='已完成'&&!patch.resolution)return out({error:{code:'RESOLUTION_REQUIRED',message:'請選擇結案原因。'}},422);Object.assign(row,patch);return out({issue:row});}
if(method==='PUT'&&p.includes('/fields/')&&row){row[p.split('/').pop()]=JSON.parse(init.body).value;return out({fieldValue:{}});}
if(p.startsWith('/api/issues/')&&row)return out({issue:{id:row.id,issueKey:row.key,issueTypeId:'type-a',companyId:'company',issueSetId:'set'}});
window.__missing.push(p);return out({error:{code:'PREVIEW_ONLY',message:'這項操作需回到產品內完成。'}},404);
};
