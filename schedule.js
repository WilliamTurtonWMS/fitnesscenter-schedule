(() => {
  'use strict';
  const config = window.SCHEDULE_CONFIG;
  const status = document.getElementById('status');
  let lastSuccess = null;
  const node = (tag, cls, text) => { const el = document.createElement(tag); if(cls) el.className=cls; if(text) el.textContent=text; return el; };
  const dateParts = value => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value); return m ? new Date(+m[3], +m[1]-1, +m[2],12) : null; };
  const niceDate = value => { const date=dateParts(value); return date ? date.toLocaleDateString('en-US',{month:'long',day:'numeric'}) : value; };
  function render(rows) {
    const days=[]; let day;
    for(const row of rows) {
      if(!/^(BEFORE|DURING|AFTER) SCHOOL$/i.test((row[4] || '').trim())) continue;
      if(row[1] && row[2]) { day={name:row[1],date:row[2],blocks:[]}; days.push(day); }
      if(!day) throw new Error('Missing day');
      day.blocks.push({name:row[4],hours:row[5],team:row[6],open:row[7]});
    }
    if(!days.length) throw new Error('No schedule rows');
    const fragment=document.createDocumentFragment();
    const today=new Intl.DateTimeFormat('en-US',{timeZone:config.timeZone}).format(new Date());
    for(const day of days) {
      const article=node('article','day'), head=node('div','day-head'), title=node('div');
      title.append(node('h2','',day.name),node('p','date',niceDate(day.date))); head.append(title);
      if(day.date===today) head.append(node('span','tag','TODAY'));
      article.append(head);
      for(const block of day.blocks) {
        const section=node('section','block'); section.append(node('h3','',block.name));
        const hours=node('p','hours');
        (block.hours||'').split('\n').forEach((line,i)=>{if(i) hours.append(document.createElement('br'));hours.append(node('span',line.includes('CLOSED')?'closed':'',line));});section.append(hours);
        const details=node('div','details');
        const list = (value, cls) => {
          if(!value) return node('p','detail-value empty','—');
          const ul=node('ul','detail-value '+cls);
          value.split('\n').filter(t=>t.trim()).forEach(t=>ul.append(node('li','',t)));
          return ul;
        };
        const team=node('div','training-box');team.append(node('p','detail-label','Team Training:'),list(block.team,'team-times'));
        const open=node('div','training-box');open.append(node('p','detail-label','Open Training Start Times:'));
        const times=/Please/.test(block.open||'') ? node('p','detail-value period-note',block.open) : list(block.open,'open-times');
        open.append(times);details.append(team,open);section.append(details);article.append(section);
      }
      fragment.append(article);
    }
    document.getElementById('schedule').replaceChildren(fragment);
    document.getElementById('range').textContent=niceDate(days[0].date)+' – '+niceDate(days[days.length-1].date);
    const notice=rows.find(r=>(r[1]||'').startsWith('Students'));
    document.getElementById('notice').textContent=notice ? notice[1] : '';
  }
  if(config.logoUrl) {const logo=document.getElementById('logo');logo.src=config.logoUrl;logo.hidden=false;logo.onerror=()=>{logo.hidden=true;};}
  render(window.SCHEDULE_SNAPSHOT.rows);
  status.textContent='Saved preview · '+window.SCHEDULE_SNAPSHOT.captured+' · Connecting…';
  let active=false, sequence=0;
  function refresh() {
    if(active) return; active=true;
    const script=document.createElement('script'), callback='scheduleReply'+(++sequence);
    const cleanup=()=>{active=false;clearTimeout(timer);script.remove();delete window[callback];};
    const failed=()=>{cleanup();status.textContent=lastSuccess?'Connection interrupted · Last updated '+lastSuccess:'Connection unavailable · Saved preview '+window.SCHEDULE_SNAPSHOT.captured;};
    const timer=setTimeout(failed,12000);
    window[callback]=response=>{try {
      if(response.status!=='ok'||!response.table) throw new Error('Invalid feed');
      const rows=response.table.rows.map(r=>Array.from({length:8},(_,i)=>{const c=r.c[i];return c ? String(c.f ?? c.v ?? '') : '';}));
      render(rows);lastSuccess=new Date().toLocaleString('en-US',{timeZone:config.timeZone,month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
      status.textContent='Schedule updated '+lastSuccess;
      document.documentElement.dataset.scheduleReady='true';cleanup();
    }catch {failed();}};
    const url=new URL('https://docs.google.com/spreadsheets/d/'+config.sheetId+'/gviz/tq');
    url.search=new URLSearchParams({gid:config.gid,range:config.range,headers:'0',tqx:'out:json;responseHandler:'+callback,_:String(Date.now())});
    script.src=url;script.onerror=failed;document.head.append(script);
  }
  refresh();setInterval(refresh,config.refreshMs);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
