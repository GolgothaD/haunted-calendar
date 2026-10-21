const MAP=[[/dentist|teeth/,["The Drilling","The Reckoning","The Extraction of Souls"]],[/doctor|appointment|clinic|checkup/,["The Examination","They Know What You Did","The Pale Waiting Room"]],
[/work|shift|job|dollar general/,["The Grind Beneath","Servitude Eternal","The Fluorescent Abyss"]],[/meeting|call|zoom/,["The Circle Convenes","Voices Without Faces","The Summoning"]],
[/laundry|wash/,["The Spinning Void","Where Socks Go To Die","The Damp Ritual"]],[/grocery|shop|meijer|kroger|store/,["Aisles of the Damned","The Gathering of Provisions","Checkout of No Return"]],
[/gym|workout|run/,["Penance of Flesh","The Iron Altar","Run. RUN."]],[/birthday|party/,["Another Year Closer","The Feast of Candles","They Sing For You"]],
[/dinner|lunch|breakfast|eat/,["The Last Supper","Feeding Time","Something Hungers"]],[/interview/,["The Interrogation","Judgment Day","They Will Ask Questions"]],
[/bill|rent|pay|bank/,["The Tithe","Debts Unpaid","The Collector Comes"]],[/sleep|nap|bed/,["The Long Dark","Do Not Close Your Eyes","Dreamless"]],
[/car|oil|mechanic/,["The Iron Beast Wakes","The Black Blood Ritual","Engine of Sorrow"]],[/clean/,["Scrubbing Away Evidence","The Purging","Dust Remembers"]]];
const GEN=["The Unnamed Hour","It Waits Here","Do Not Attend","The Appointed Time","Something Was Here","Ẅ̷h̴ö̸ ̸W̵r̷o̴t̸e̷ ̵T̶h̷i̶s̶?"];
const LEVELS=["Dormant","Restless","Whispering","Haunted","Possessed","CONSUMED"];
const NARR=[["Nothing to see. Just an ordinary calendar. Perfectly ordinary.","Did a page just turn by itself? No. Of course not.","A quiet week. How lovely."],
["Your week has {n} events. Interesting. I've been counting.","I noticed {e}. I'll be there too.","Something moved in Thursday."],
["{e}? Oh, I wouldn't go to that one.","I've rearranged nothing. Trust me.","Your calendar hums at night, Toothless. Did you know?"],
["I have renamed things. They wanted new names.","{n} events. {n} chances for something to go wrong. I'm not saying it will.","Do you hear the ticking? That's just the clock. Probably."],
["THIS WEEK BELONGS TO US.","{e} has already happened. In another week. A darker week.","Every empty day is a door, and I left them all open."],
["W̷E̴ ̷A̵R̵E̸ ̴T̷H̵E̶ ̴C̷A̷L̶E̶N̶D̷A̷R̴ ̶N̶O̸W̶.","There is no Monday. There was never a Monday.","Show the real names if you like. They won't stay real for long."]];
let S=JSON.parse(localStorage.hc||"null")||{ev:[],first:Date.now(),visits:[]};const $=id=>document.getElementById(id),save=()=>localStorage.hc=JSON.stringify(S);
const td=new Date().toDateString();if(!S.visits.includes(td))S.visits.push(td);save();
let real=false;
function poss(){const days=Math.floor((Date.now()-S.first)/864e5);return Math.min(100,S.visits.length*12+days*4+S.ev.length*2-14)}
function hash(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)}
function haunt(e,p){const h=hash(e.id+e.name)%100;if(h>p)return null;const m=MAP.find(([r])=>r.test(e.name.toLowerCase()));const opts=m?m[1]:GEN;const tier=Math.min(opts.length-1,Math.floor(p/34));let n=opts[(hash(e.name)+tier)%opts.length];if(p>80&&h%3==0)n=n.split("").map(c=>c+(Math.random()<.3?"̸":"")).join("");return n}
function render(){const p=Math.max(0,poss()),L=Math.min(5,Math.floor(p/18));$("lvl").textContent=p+"%";$("bar").style.width=p+"%";$("lvln").textContent="Status: "+LEVELS[L]+" · "+S.visits.length+" visit"+(S.visits.length>1?"s":"");
 const ev=[...S.ev].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));let cur="";
 $("list").innerHTML=ev.length?ev.map(e=>{const d=new Date(e.date+"T00:00");const lbl=d.toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"});const hd=lbl!=cur?`<div class="day">${cur=lbl}</div>`:"";const hn=haunt(e,p);const show=real||!hn?esc(e.name):`<span class="glitch">${esc(hn)}</span>`;
 return hd+`<div class="ev"><span class="d">${e.time||"all day"}</span><span class="n">${show}</span><button class="x" data-id="${e.id}">✕</button></div>`}).join(""):'<div class="panel" style="text-align:center;opacity:.6">The calendar is empty… for now.</div>';
 const pool=NARR[L],first=ev.find(e=>haunt(e,p))||ev[0];const line=pool[hash(td+S.ev.length)%pool.length].replace(/\{n\}/g,ev.length).replace(/\{e\}/g,first?'"'+(haunt(first,p)||first.name)+'"':"your next event");type(line)}
let tt;function type(s){clearInterval(tt);let i=0;const a=[...s];$("narr").textContent="";tt=setInterval(()=>{$("narr").textContent+=a[i++]||"";if(i>=a.length)clearInterval(tt)},35)}
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
$("date").value=new Date().toISOString().slice(0,10);
$("add").onclick=()=>{const n=$("name").value.trim();if(!n)return;S.ev.push({id:uid(),name:n,date:$("date").value||new Date().toISOString().slice(0,10),time:$("time").value});save();$("name").value="";flick();render()};
$("list").onclick=e=>{const id=e.target.dataset.id;if(id){S.ev=S.ev.filter(x=>x.id!=id);save();render()}};
$("real").onclick=()=>{real=!real;$("real").textContent=real?"🩸 Let them rename":"👁 Show real names";flick();render()};
$("exo").onclick=e=>{e.preventDefault();if(confirm("Perform exorcism? Resets possession AND deletes all events.")){localStorage.removeItem("hc");location.reload()}};
function flick(){document.body.classList.remove("flick");void document.body.offsetWidth;document.body.classList.add("flick")}
setInterval(()=>{if(Math.random()*100<poss()/3){flick();const g=document.querySelectorAll(".glitch");if(g.length){const x=g[Math.floor(Math.random()*g.length)];x.classList.add("g");setTimeout(()=>x.classList.remove("g"),600)}}},4000);
$("file").onchange=async e=>{const f=e.target.files[0];if(!f)return;const t=(await f.text()).replace(/\r?\n[ \t]/g,"");let c=0;
 for(const b of t.split("BEGIN:VEVENT").slice(1)){const sm=b.match(/\nSUMMARY[^:]*:(.*)/),dm=b.match(/\nDTSTART[^:]*:(\d{8})(T(\d{4}))?/);if(!sm||!dm)continue;const d=dm[1];
 S.ev.push({id:uid(),name:sm[1].trim().replace(/\\,/g,",").replace(/\\n/g," "),date:`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`,time:dm[3]?dm[3].slice(0,2)+":"+dm[3].slice(2):""});c++}
 save();flick();render();type(c?`${c} new souls join the calendar. Welcome.`:"That file held nothing I could eat.")};
$("exp").onclick=()=>{const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Haunted Calendar//EN"];const st=new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z";
 S.ev.forEach(e=>{const d=e.date.replace(/-/g,"");L.push("BEGIN:VEVENT","UID:"+e.id+"@haunted-calendar","DTSTAMP:"+st);if(e.time){const t=e.time.replace(":","")+"00";const h=+e.time.slice(0,2)+1;L.push("DTSTART:"+d+"T"+t,"DTEND:"+d+"T"+String(Math.min(h,23)).padStart(2,"0")+e.time.slice(3,5)+"00")}else L.push("DTSTART;VALUE=DATE:"+d);
 L.push("SUMMARY:"+e.name.replace(/([,;\\])/g,"\\$1"),"END:VEVENT")});L.push("END:VCALENDAR");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([L.join("\r\n")],{type:"text/calendar"}));a.download="real-events.ics";a.click();type("Fine. Take your 'real' names. I kept copies.")};
render();
