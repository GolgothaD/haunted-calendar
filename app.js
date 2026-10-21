const CATS={dentist:["The Drilling","The Reckoning","The Extraction of Souls"],doctor:["The Examination","They Know What You Did","The Pale Waiting Room"],
work:["The Grind Beneath","Servitude Eternal","The Fluorescent Abyss"],meeting:["The Circle Convenes","Voices Without Faces","The Summoning"],
laundry:["The Spinning Void","Where Socks Go To Die","The Damp Ritual"],shop:["Aisles of the Damned","The Gathering of Provisions","Checkout of No Return"],
gym:["Penance of Flesh","The Iron Altar","Run. RUN."],party:["Another Year Closer","The Feast of Candles","They Sing For You"],
food:["The Last Supper","Feeding Time","Something Hungers"],interview:["The Interrogation","Judgment Day","They Will Ask Questions"],
bill:["The Tithe","Debts Unpaid","The Collector Comes"],sleep:["The Long Dark","Do Not Close Your Eyes","Dreamless"],
car:["The Iron Beast Wakes","The Black Blood Ritual","Engine of Sorrow"],clean:["Scrubbing Away Evidence","The Purging","Dust Remembers"]};
const KW=Object.entries({dentist:"dentist,teeth,orthodontist,cleaning at dentist",doctor:"doctor,appointment,clinic,checkup,physical,therapy,hospital",
work:"work,shift,job,dollar general,overtime,closing shift",meeting:"meeting,call,zoom,standup,conference",laundry:"laundry,wash clothes,laundromat",
shop:"grocery,groceries,shop,shopping,meijer,kroger,store,target,walmart",gym:"gym,workout,run,jog,lift",party:"birthday,party,wedding,anniversary",
food:"dinner,lunch,breakfast,brunch,eat",interview:"interview,job interview,phone screen",bill:"bill,rent,pay,bank,taxes,insurance",
sleep:"sleep,nap,bed",car:"car,oil change,mechanic,tires,dmv",clean:"clean,vacuum,dishes"}).flatMap(([c,k])=>k.split(",").map(w=>[w,c])).sort((x,y)=>y[0].length-x[0].length);
function cat(n){n=" "+n.toLowerCase().replace(/[^a-z0-9 ]/g," ")+" ";for(const[w,c]of KW)if(n.includes(" "+w+" ")||n.includes(" "+w+"s ")||(w.length>4&&n.includes(w)))return c;return null}
const GEN=["The Unnamed Hour","It Waits Here","Do Not Attend","The Appointed Time","Something Was Here","Who Wrote This?"];
const LEVELS=["Dormant","Restless","Whispering","Haunted","Possessed","CONSUMED"];
const NARR=[["Nothing to see. Just an ordinary calendar. Perfectly ordinary.","Did a page just turn by itself? No. Of course not.","A quiet week. How lovely."],
["Your week has {n} events. Interesting. I've been counting.","I noticed {e}. I'll be there too.","Something moved in Thursday."],
["{e}? Oh, I wouldn't go to that one.","I've rearranged nothing. Trust me.","Your calendar hums at night, Toothless. Did you know?"],
["I have renamed things. They wanted new names.","{n} events. {n} chances for something to go wrong. I'm not saying it will.","Do you hear the ticking? That's just the clock. Probably."],
["THIS WEEK BELONGS TO US.","{e} has already happened. In another week. A darker week.","Every empty day is a door, and I left them all open."],
["WE ARE THE CALENDAR NOW.","There is no Monday. There was never a Monday.","Show the real names if you like. They won't stay real for long."]];
let S=JSON.parse(localStorage.hc||"null")||{ev:[],first:Date.now(),visits:[]};const $=id=>document.getElementById(id),save=()=>localStorage.hc=JSON.stringify(S);
const td=new Date().toDateString();if(!S.visits.includes(td))S.visits.push(td);save();
let real=false;
function poss(){const days=Math.floor((Date.now()-S.first)/864e5);return Math.min(100,S.visits.length*12+days*4+S.ev.length*2-14)}
function hash(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)}
function haunt(e,p){const h=hash(e.id+e.name)%100;if(h>p)return null;const k=cat(e.name);const opts=k?CATS[k]:GEN;const tier=Math.min(opts.length-1,Math.floor(p/34));let n=opts[(hash(e.name)+tier)%opts.length];return {n,heavy:p>70&&h%3==0}}
function render(){const p=Math.max(0,poss()),L=Math.min(5,Math.floor(p/18));$("lvl").textContent=p+"%";$("bar").style.width=p+"%";$("lvln").textContent="Status: "+LEVELS[L]+" · "+S.visits.length+" visit"+(S.visits.length>1?"s":"");
 const ev=[...S.ev].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));let cur="";
 $("list").innerHTML=ev.length?ev.map(e=>{const d=new Date(e.date+"T00:00");const lbl=d.toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"});const hd=lbl!=cur?`<div class="day">${cur=lbl}</div>`:"";const hn=haunt(e,p);const show=real||!hn?esc(e.name):`<span class="glitch${hn.heavy?" heavy":""}" data-t="${esc(hn.n)}">${esc(hn.n)}</span>`;const rr=e.rrule?` <span title="repeats" aria-label="repeats">↻</span>`:"";
 return hd+`<div class="ev"><span class="d">${e.time||"all day"}</span><span class="n">${show}${rr}</span><button class="x" data-id="${e.id}" aria-label="Delete event">✕</button></div>`}).join(""):'<div class="panel" style="text-align:center;opacity:.6">The calendar is empty… for now.</div>';
 const pool=NARR[L],first=ev.find(e=>haunt(e,p))||ev[0];const line=pool[hash(td+S.ev.length)%pool.length].replace(/\{n\}/g,ev.length).replace(/\{e\}/g,first?'"'+((haunt(first,p)||{}).n||first.name)+'"':"your next event");type(line)}
let tt;function type(s){clearInterval(tt);let i=0;const a=[...s];$("narr").textContent="";tt=setInterval(()=>{$("narr").textContent+=a[i++]||"";if(i>=a.length)clearInterval(tt)},35)}
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
$("date").value=new Date().toISOString().slice(0,10);
$("add").onclick=()=>{const n=$("name").value.trim().slice(0,200);if(!n){type("Name it. Things without names are... worse.");$("name").focus();return}S.ev.push({id:uid(),name:n,date:$("date").value||new Date().toISOString().slice(0,10),time:$("time").value});save();$("name").value="";flick();render()};
$("list").onclick=e=>{const id=e.target.dataset.id;if(id){S.ev=S.ev.filter(x=>x.id!=id);save();render()}};
$("real").onclick=()=>{real=!real;$("real").textContent=real?"🩸 Let them rename":"👁 Show real names";flick();render()};
$("exo").onclick=e=>{e.preventDefault();if(confirm("Perform exorcism? Resets possession AND deletes all events.")){localStorage.removeItem("hc");location.reload()}};
function flick(){document.body.classList.remove("flick");void document.body.offsetWidth;document.body.classList.add("flick")}
setInterval(()=>{if(Math.random()*100<poss()/3){flick();const g=document.querySelectorAll(".glitch");if(g.length){const x=g[Math.floor(Math.random()*g.length)];x.classList.add("g");setTimeout(()=>x.classList.remove("g"),600)}}},4000);
const unesc=v=>v.replace(/\\n/gi," ").replace(/\\([,;\\])/g,"$1").trim();
function parseICS(t){t=t.replace(/\r\n/g,"\n").replace(/\n[ \t]/g,"");const out=[];
 for(const b of t.split(/^BEGIN:VEVENT$/m).slice(1)){const body=b.split(/^END:VEVENT$/m)[0];const g=k=>{const m=body.match(new RegExp("^"+k+"((?:;[^:\\n]*)?):(.*)$","m"));return m?{p:m[1],v:m[2].trim()}:null};
  const sm=g("SUMMARY"),ds=g("DTSTART");if(!ds)continue;if((g("STATUS")||{}).v=="CANCELLED")continue;
  const m=ds.v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z?))?/);if(!m)continue;let date=`${m[1]}-${m[2]}-${m[3]}`,time="";
  if(m[4]){if(m[7]){const d=new Date(Date.UTC(+m[1],m[2]-1,+m[3],+m[4],+m[5]));date=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;time=`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`}else time=m[4]+":"+m[5]}
  const rr=g("RRULE"),u=g("UID"),de=g("DTEND");let dur=60;if(de&&time){const q=de.v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);if(q){const st=Date.UTC(+m[1],m[2]-1,+m[3],+m[4],+m[5]),en=Date.UTC(+q[1],q[2]-1,+q[3],+q[4],+q[5]);if(en>st&&en-st<7*864e5)dur=Math.round((en-st)/6e4)}}out.push({id:(u&&u.v.replace(/[^\w.@-]/g,"").slice(0,80))||uid(),name:(sm?unesc(sm.v):"").slice(0,200)||"Untitled",date,time,dur,rrule:rr?rr.v:""})}
 return out}
$("file").onchange=async e=>{const f=e.target.files[0];if(!f)return;let c=0;try{for(const ev of parseICS(await f.text())){if(S.ev.some(x=>x.id==ev.id))continue;S.ev.push(ev);c++}}catch(err){console.warn(err)}
 e.target.value="";save();flick();render();type(c?`${c} new soul${c>1?"s":""} join the calendar. Welcome.`:"That file held nothing I could eat.")};
const fold=l=>{const out=[];let cur="";for(const ch of l){if(new TextEncoder().encode(cur+ch).length>(out.length?74:75)){out.push(cur);cur=""}cur+=ch}out.push(cur);return out.join("\r\n ")};
const icsEsc=v=>v.replace(/\\/g,"\\\\").replace(/([,;])/g,"\\$1").replace(/\n/g,"\\n");
function buildICS(){const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Haunted Calendar//EN","CALSCALE:GREGORIAN"];const st=new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z";const p2=n=>String(n).padStart(2,"0");
 S.ev.forEach(e=>{const d=e.date.replace(/-/g,"");L.push("BEGIN:VEVENT","UID:"+e.id+(e.id.includes("@")?"":"@haunted-calendar"),"DTSTAMP:"+st);
  if(e.time){const s=new Date(e.date+"T"+e.time),en=new Date(s.getTime()+(e.dur||60)*6e4),f=x=>`${x.getFullYear()}${p2(x.getMonth()+1)}${p2(x.getDate())}T${p2(x.getHours())}${p2(x.getMinutes())}00`;L.push("DTSTART:"+f(s),"DTEND:"+f(en))}
  else{const n=new Date(e.date+"T00:00");n.setDate(n.getDate()+1);L.push("DTSTART;VALUE=DATE:"+d,"DTEND;VALUE=DATE:"+n.getFullYear()+p2(n.getMonth()+1)+p2(n.getDate()))}
  if(e.rrule)L.push("RRULE:"+e.rrule);L.push("SUMMARY:"+icsEsc(e.name),"END:VEVENT")});L.push("END:VCALENDAR");return L.map(fold).join("\r\n")+"\r\n"}
$("exp").onclick=()=>{if(!S.ev.length){type("There is nothing to export. Yet.");return}const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([buildICS()],{type:"text/calendar"}));a.download="real-events.ics";document.body.appendChild(a);a.click();a.remove();type("Fine. Take your 'real' names. I kept copies.")};
render();
