/* Shared engine for every page of the book: chapter registry, running head, navigation,
   quizzes, checklists, the Experienced Trader answer box and CSV export of tables.
   A chapter page sets <main class="book" data-ch="ID"> and, before loading this file,
   may define window.QUIZ = {easy:[...], mid:[...]}. */
(function(){
  var LANG="en";
  try{var _t=localStorage.getItem("fx-theme");if(_t)document.documentElement.setAttribute("data-theme",_t)}catch(e){}
  var LEVELS=["Level 0 Zero","Level 1 Foundations","Level 2 Reading the Market","Level 3 Fundamentals","Level 4 Getting Started","Level 5 The Mind","Level 6 Beyond Forex"];
  var PARTS=[
    {n:"0",t:"Start Here",lv:0},
    {n:"I",t:"Foundations",lv:1},
    {n:"II",t:"Reading the Market",lv:2},
    {n:"III",t:"Fundamentals and News",lv:3},
    {n:"IV",t:"Getting Started Step by Step",lv:4},
    {n:"V",t:"The Trader's Mind",lv:5},
    {n:"VI",t:"Money Beyond Forex",lv:6},
    {n:"—",t:"Appendices",lv:6}
  ];
  /* id, part index, label, title, ready */
  var CH=[
    ["0.1",0,"0.1","How to Use This Book",1],
    ["0.2",0,"0.2","Absolute Zero: Markets, Buyers, Sellers",1],
    ["0.3",0,"0.3","Start Here: Fast Track and First Backtest",1],
    ["1",1,"1","What Forex Is and Who Moves It",1],
    ["2",1,"2","The Mechanics of a Trade",1],
    ["3",1,"3","Candles and Charts",1],
    ["4",1,"4","Classic Price Action",1],
    ["5",1,"5","Thinking in Probabilities",1],
    ["6",2,"6","Market Structure",1],
    ["7",2,"7","Liquidity and SMC Zones",1],
    ["8",2,"8","Top-Down Analysis",1],
    ["9",2,"9","Sessions, Kill Zones and Volatility",1],
    ["10",2,"10","From Read to Decision: the 6-Step Framework",1],
    ["11",2,"11","Risk and Position Size",1],
    ["12",2,"12","Managing an Open Position",1],
    ["13",2,"13","News Risk Protocol",1],
    ["14",2,"14","A Day in the Market",1],
    ["15",2,"15","Advanced: Order Flow",1],
    ["16",3,"16","Economic Thinking",1],
    ["17",3,"17","Money, Banks, Inflation",1],
    ["18",3,"18","Central Banks and Interest Rates",1],
    ["19",3,"19","Reading the Economy and Forex Factory",1],
    ["20",3,"20","What Moves a Currency",1],
    ["20b",3,"21","Positioning and Sentiment",1],
    ["21",3,"22","Risk-On, Risk-Off and Intermarket Links",1],
    ["21b",3,"23","Intermarket in Depth",1],
    ["22",3,"24","How the Dollar System Is Built",1],
    ["23",3,"25","Geopolitics and World Order",1],
    ["24",3,"26","Basic Economics for the FX Trader",1],
    ["25",3,"27","Crises and Debt Cycles",1],
    ["26",3,"28","From Macro to a Market Read",1],
    ["27",3,"29","Case Files",1],
    ["S",4,"30","Trading Styles: Which One Is Yours",1],
    ["28",4,"31","Your Analysis Workspace",1],
    ["29",4,"32","Brokers, Demo Accounts, Platforms",1],
    ["30",4,"33","Prop Firms Compared",1],
    ["31",4,"34","The First 90 Days",1],
    ["32",5,"35","Psychology and Discipline",1],
    ["33",5,"36","Journal and Measurement",1],
    ["34",5,"37","Daily and Weekly Routine",1],
    ["35",6,"38","Personal Finance First",1],
    ["36",6,"39","Other Markets",1],
    ["37",6,"40","Crypto Basics",1],
    ["38",6,"41","Banks and Taxes in Bulgaria",1],
    ["A",7,"A","Sample Analyses",1],
    ["B",7,"B","Glossary EN/BG",1],
    ["C",7,"C","Checklists and Templates",1],
    ["D",7,"D","Tools and Links",1],
    ["E",7,"E","Case Library",1],
    ["F",7,"F","Currency Profiles",1],
    ["J",7,"J","Journal and Bias File",1],
    ["P",7,"P","Practice Room",1],
    ["X",7,"✎","Final Exam",1],
    ["K",7,"✦","Credits",1]
  ];
  function file(id){return id==="index"?"index.html":"ch"+String(id).replace(".","-")+".html"}
  var CHAPTERS=CH.map(function(c){return {id:c[0],part:c[1],label:c[2],title:c[3],ready:!!c[4],file:file(c[0])}});

  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);if(/^(b|fx-streak)/.test(k)&&typeof badgeWatch==="function")badgeWatch()}catch(e){return null}}
  var NS="http://www.w3.org/2000/svg";
  function svg(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
  function h(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
  function each(sel,fn,root){Array.prototype.forEach.call((root||document).querySelectorAll(sel),fn)}

  /* running head, top bar, chapter nav, footer */
  function frame(main){
    var id=main.getAttribute("data-ch");if(!id)return;
    var i=-1;CHAPTERS.forEach(function(c,k){if(c.id===id)i=k});if(i<0)return;
    var c=CHAPTERS[i],p=PARTS[c.part];
    var top=h("div","topbar");
    top.appendChild(h("a",null,"← Contents")).href="index.html";
    top.appendChild(h("span","label",(c.part<7?"Part "+p.n+" · ":"")+p.t));
    var run=h("div","runhead");
    run.appendChild(h("span","label","FX Fundamentals · Kristian Tsvetkov"));
    var ol=h("ol","levels");ol.setAttribute("aria-label","Where you are in the book");
    LEVELS.forEach(function(l,k){var li=h("li",k<p.lv?"done":(k===p.lv?"now":""),l);if(k===p.lv)li.setAttribute("aria-current","step");ol.appendChild(li)});
    run.appendChild(ol);
    main.insertBefore(run,main.firstChild);main.insertBefore(top,main.firstChild);
    var nav=h("nav","chapnav");nav.setAttribute("aria-label","Between chapters");
    var prev=CHAPTERS[i-1],next=CHAPTERS[i+1];
    var a1=h("a",null,prev?"← "+prev.label+" "+prev.title:"← Cover");a1.href=prev?prev.file:"index.html";nav.appendChild(a1);
    if(next){var a2=h("a",null,next.label+" "+next.title+" →");a2.href=next.ready?next.file:"index.html";if(!next.ready)a2.textContent=next.label+" "+next.title+" · soon";nav.appendChild(a2)}
    main.appendChild(nav);
    var ft=h("footer");ft.appendChild(h("span",null,"FX Fundamentals · Kristian Tsvetkov"));
    ft.appendChild(h("span",null,"Educational material, not investment advice · "+(c.part<7?"Chapter "+c.label+" of 38":"Appendix "+c.label)));
    main.appendChild(ft);
    document.title=document.title||c.title;
  }

  /* quizzes: data in window.QUIZ */
  function tier(id,qs,key){
    var box=document.getElementById(id);if(!box||!qs)return;
    var sc=box.querySelector(".score"),done=0,right=0;
    function upd(){if(sc)sc.textContent=right+" / "+qs.length+" correct"+(done<qs.length?" · answered "+done:"");if(done===qs.length)store(key,right+"/"+qs.length)}
    qs.forEach(function(item,qi){
      var d=h("div","q");d.appendChild(h("p",null,"<b>"+(qi+1)+".</b> "+item.q));
      var opts=h("div","opts"),fb=h("p","fb");fb.setAttribute("aria-live","polite");
      item.o.forEach(function(t,oi){
        var b=h("button","opt");b.type="button";b.textContent=t;
        b.addEventListener("click",function(){
          each(".opt",function(x,xi){x.disabled=true;if(xi===item.a)x.classList.add("right")},opts);
          if(oi!==item.a)b.classList.add("wrong");else right++;
          done++;fb.textContent=(oi===item.a?"Correct. ":"Not quite. ")+item.e;upd();
        });opts.appendChild(b);
      });
      d.appendChild(opts);d.appendChild(fb);box.appendChild(d);
    });upd();
  }
  function quizzes(id){
    var Q=window.QUIZ||{};
    each("section.quiz",function(sec){if(sec.querySelector(".quiz-drop"))return;var d=h("details","quiz-drop"),s=h("summary"),b=h("div","qz-body"),h2=sec.querySelector("h2");
      Array.prototype.slice.call(sec.children).forEach(function(c){if(c!==h2)b.appendChild(c)});if(h2)s.appendChild(h2);s.appendChild(h("span","qz-sub","Easy · Intermediate · Experienced Trader"));var c=h("span","drop-caret","▾");c.setAttribute("aria-hidden","true");s.appendChild(c);d.appendChild(s);d.appendChild(b);sec.appendChild(d);
      if(location.hash==="#qz")d.open=true;document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href="#qz"]');if(a)d.open=true})});
    tier("tierEasy",Q.easy,"b"+id+"-qe");tier("tierMid",Q.mid,"b"+id+"-qm");
    var mb=document.getElementById("modelBtn"),md=document.getElementById("model"),ka=document.getElementById("krisAns");
    if(ka){var s=store("b"+id+"-kris");if(s)ka.value=s;ka.addEventListener("input",function(){store("b"+id+"-kris",ka.value)})}
    if(mb&&md)mb.addEventListener("click",function(){var open=md.hidden;md.hidden=!open;mb.setAttribute("aria-expanded",open);mb.textContent=open?"Hide the sample answer":"Show a sample answer"});
  }
  function checks(id){
    var all=document.querySelectorAll(".checks input[type=checkbox]");
    function save(){var n=0;each(".checks input[type=checkbox]",function(c){if(c.checked)n++});store("b"+id+"-done",n+"/"+all.length)}
    each(".checks input[type=checkbox]",function(c,k){
      var key="b"+id+"-ck"+k;if(store(key)==="1")c.checked=true;
      c.addEventListener("change",function(){store(key,c.checked?"1":"0");save()});
    });
  }
  /* toggles: <button class="toggle" data-show="#sel" data-on="text" data-off="text"> */
  function toggles(){
    each("button[data-show]",function(b){
      var t=document.querySelector(b.getAttribute("data-show"));if(!t)return;
      var off=b.textContent,on=b.getAttribute("data-on")||off;b.setAttribute("aria-pressed","false");
      b.addEventListener("click",function(){var s=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",s);
        t.style.display=s?"":"none";if(t.hasAttribute("hidden"))t.hidden=!s;b.textContent=s?on:off});
      if(t.getAttribute("data-start")!=="on"){t.style.display="none"}else{b.setAttribute("aria-pressed","true");b.textContent=on}
    });
  }
  /* tabs: <div class="tabs" data-group="g"><button class="chip" data-tab="x"> ... <div class="pane" data-group="g" data-pane="x"> */
  function tabs(){
    each(".tabs[data-group]",function(t){
      var g=t.getAttribute("data-group");
      function show(x){each("button[data-tab]",function(b){b.setAttribute("aria-pressed",b.getAttribute("data-tab")===x)},t);
        each('.pane[data-group="'+g+'"]',function(p){p.hidden=p.getAttribute("data-pane")!==x})}
      each("button[data-tab]",function(b){b.addEventListener("click",function(){show(b.getAttribute("data-tab"))})},t);
      var f=t.querySelector("button[data-tab]");if(f)show(f.getAttribute("data-tab"));
    });
  }
  /* CSV export for every table.data inside .tablewrap */
  function csv(){
    each(".tablewrap",function(w){
      var t=w.querySelector("table");if(!t)return;
      var b=h("button","toggle xls","Download as CSV (Excel)");b.type="button";
      b.addEventListener("click",function(){
        var rows=[];each("tr",function(tr){var r=[];each("th,td",function(c){r.push('"'+c.textContent.trim().replace(/"/g,'""')+'"')},tr);rows.push(r.join(";"))},t);
        var data="﻿"+rows.join("\r\n"),name=(w.getAttribute("data-name")||"tablica")+".csv";
        saveFile(b,name,data);
      });
      w.appendChild(b);
    });
  }

  /* motion: reveal sections, draw diagrams, reading progress */
  function motion(main){
    var still=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(main.getAttribute("data-ch")){var bar=h("div","readbar");bar.setAttribute("aria-hidden","true");document.body.appendChild(bar);
      var tick=false;function prog(){tick=false;var d=document.documentElement,m=d.scrollHeight-d.clientHeight;bar.style.transform="scaleX("+(m>0?Math.min(1,d.scrollTop/m):0)+")"}
      window.addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(prog)}},{passive:true});prog()}
    if(still||!("IntersectionObserver" in window))return;
    function draw(root){
      each("svg path, svg line, svg polyline",function(p){
        if(p.closest("#coverCandles,.rp,.drill"))return;
        var st=p.getAttribute("stroke"),fill=p.getAttribute("fill");
        if(!st||st==="none"||p.getAttribute("stroke-dasharray")||(p.tagName==="path"&&fill&&fill!=="none"))return;
        p.setAttribute("pathLength","1");p.classList.add("draw-line");
        p.addEventListener("animationend",function(){p.classList.remove("draw-line");p.removeAttribute("pathLength")},{once:true});
      },root);
      each("svg rect",function(r,i){if(r.closest(".rp,.drill"))return;if((+r.getAttribute("width")||0)>400)return;r.classList.add("draw-grow");r.style.animationDelay=Math.min(i*0.04,0.8)+"s";
        r.addEventListener("animationend",function(){r.classList.remove("draw-grow");r.style.animationDelay=""},{once:true})},root);
      each("svg circle",function(c,i){if(c.closest(".rp,.drill"))return;c.classList.add("draw-pop");c.style.animationDelay=(0.3+Math.min(i*0.06,0.9))+"s";
        c.addEventListener("animationend",function(){c.classList.remove("draw-pop");c.style.animationDelay=""},{once:true})},root);
    }
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;io.unobserve(t);t.classList.add("in");if(t.querySelector("svg"))draw(t)})},{rootMargin:"0px 0px -8% 0px",threshold:0.05});
    var vh=window.innerHeight||800;
    each("section.sec, section.debrief, section.quiz, nav.toc .part",function(s){
      if(s.getBoundingClientRect().top<vh*0.9){if(s.querySelector("svg"))draw(s);return}
      s.classList.add("rv");io.observe(s)},main);
  }

  /* replays and drills: <div class="replay" data-rp="key"> with window.REPLAYS, <div class="drills" data-dr="key"> with window.DRILLS */
  var COL={bull:"var(--bull)",bear:"var(--bear)",liq:"var(--liq)",news:"var(--news)",ink:"var(--ink)",muted:"var(--muted)"};
  function chart(sv,cs,n,yr,ann,xl){
    while(sv.firstChild)sv.removeChild(sv.firstChild);
    var W=340,H=250,L=4,R=86,T=16,B=26,N=cs.length,cw=(W-L-R)/N;
    function X(i){return L+cw*(i+.5)}function Y(p){return T+(yr[1]-p)/(yr[1]-yr[0])*(H-T-B)}
    svg("line",{x1:L,x2:W-R,y1:H-B,y2:H-B,stroke:"var(--line)"},sv);
    (xl||[]).forEach(function(l){svg("line",{x1:X(l[0])-cw/2,x2:X(l[0])-cw/2,y1:T,y2:H-B,stroke:"var(--line)","stroke-dasharray":"2 4"},sv);
      svg("text",{x:X(l[0])-cw/2+3,y:H-8,"font-size":12,fill:"var(--muted)"},sv).textContent=l[1]});
    (ann||[]).forEach(function(a){if(a.t!=="zone")return;var x1=X(a.from)-cw/2,x2=a.to!=null?X(a.to)+cw/2:W-R;
      svg("rect",{x:x1,y:Y(Math.max(a.p1,a.p2)),width:Math.max(1,x2-x1),height:Math.abs(Y(a.p1)-Y(a.p2)),fill:COL[a.c||"liq"],opacity:.16},sv);
      if(a.label)svg("text",{x:a.right?x2-3:x1+3,"text-anchor":a.right?"end":"start",y:a.below?Y(Math.min(a.p1,a.p2))+14:Y(Math.max(a.p1,a.p2))-4,"font-size":13,fill:COL[a.c||"liq"]},sv).textContent=a.label});
    for(var i=0;i<n&&i<N;i++){var k=cs[i],up=k[3]>=k[0],c=up?COL.bull:COL.bear,x=X(i);
      svg("line",{x1:x,x2:x,y1:Y(k[1]),y2:Y(k[2]),stroke:c,"stroke-width":1.5},sv);
      svg("rect",{x:x-cw*.32,width:cw*.64,y:Y(Math.max(k[0],k[3])),height:Math.max(1.5,Math.abs(Y(k[0])-Y(k[3]))),fill:c},sv)}
    (ann||[]).forEach(function(a){var col=COL[a.c||"liq"];
      if(a.t==="level"){var x1=X(a.from||0)-cw/2,x2=a.to!=null?X(a.to)+cw/2:W-R+4,y=Y(a.p);
        svg("line",{x1:x1,x2:x2,y1:y,y2:y,stroke:col,"stroke-width":a.w||1.6,"stroke-dasharray":a.solid?"":"5 4"},sv);
        if(a.label)svg("text",{x:a.to!=null?x2+4:W-R+8,y:y+4+(a.dy||0),"font-size":13,fill:col,"font-weight":600},sv).textContent=a.label}
      else if(a.t==="mark"){var mx=X(a.i),my=Y(a.p),dn=a.pos==="down";
        svg("circle",{cx:mx,cy:my,r:5,fill:"none",stroke:col,"stroke-width":2},sv);
        svg("text",{x:mx,y:dn?my+18:my-10,"font-size":13,"text-anchor":a.anchor||"middle",fill:col,"font-weight":600},sv).textContent=a.label}});
    return {X:X,Y:Y,W:W,R:R,cw:cw};
  }
  function replays(){
    var RP=window.REPLAYS||{};
    each(".replay[data-rp]",function(box){
      var cfg=RP[box.getAttribute("data-rp")];if(!cfg)return;
      var cs=cfg.candles,st=cfg.steps,yr=cfg.y,k=0,n=st[0].at,timer=null,playing=false;
      var fig=h("figure","diagram rp");var sv=svg("svg",{viewBox:"0 0 340 250",role:"img","aria-label":cfg.title},fig);
      var txt=h("p","verdict rp-text");txt.setAttribute("aria-live","polite");fig.appendChild(txt);
      var ctl=h("div","rp-ctrl");
      var bPrev=h("button","chip","◀ Back"),bPlay=h("button","chip","▶ Play"),bNext=h("button","chip","Next ▶"),bRe=h("button","chip","↺ Restart"),pos=h("span","score","");
      [bPrev,bPlay,bNext,bRe].forEach(function(b){b.type="button";ctl.appendChild(b)});ctl.appendChild(pos);fig.appendChild(ctl);
      if(cfg.caption)fig.appendChild(h("figcaption",null,cfg.caption));
      box.appendChild(fig);
      function ann(){var a=[];st.forEach(function(s,i){if(i<=k&&s.at<=n)a=a.concat((s.draw||[]).filter(function(d){return d.until==null||k<=d.until}))});return a}
      function render(){chart(sv,cs,n,yr,ann(),cfg.x);txt.innerHTML="<b>"+(k+1)+" · "+st[k].h+"</b> "+st[k].text;pos.textContent="Step "+(k+1)+" of "+st.length;
        bPrev.disabled=k===0&&!playing;bNext.disabled=k===st.length-1}
      function stop(){playing=false;clearTimeout(timer);bPlay.textContent="▶ Play";bPlay.setAttribute("aria-pressed","false")}
      function go(i){stop();k=Math.max(0,Math.min(st.length-1,i));n=st[k].at;render()}
      function tick(){if(!playing)return;
        if(k<st.length-1&&n>=st[k+1].at){k++;render();timer=setTimeout(tick,2600);return}
        if(k<st.length-1){n++;render();timer=setTimeout(tick,280);return}
        stop();render()}
      bPlay.addEventListener("click",function(){if(playing){stop();render();return}
        if(k===st.length-1){k=0;n=Math.min(st[0].at,1)}playing=true;bPlay.textContent="❚❚ Pause";bPlay.setAttribute("aria-pressed","true");
        if(n<st[k].at)n=Math.max(1,n);tick()});
      bPrev.addEventListener("click",function(){go(k-1)});bNext.addEventListener("click",function(){go(k+1)});bRe.addEventListener("click",function(){go(0)});
      render();
    });
  }
  function drills(){
    var DR=window.DRILLS||{},RP=window.REPLAYS||{};
    each(".drills[data-dr]",function(box){
      var list=DR[box.getAttribute("data-dr")];if(!list)return;var ok=0,done=0,sc=h("p","verdict","");sc.setAttribute("aria-live","polite");
      list.forEach(function(d,di){
        var src=RP[d.src],card=h("div","drill");card.appendChild(h("p",null,"<b>Drill "+(di+1)+".</b> "+d.q));
        var fb=h("p","fb"),row=h("div","tabs"),sv=null,G=null,lines=[];
        if(src&&d.n){var fig=h("figure","diagram");sv=svg("svg",{viewBox:"0 0 340 250",role:"img","aria-label":d.q},fig);card.appendChild(fig);G=chart(sv,src.candles,d.n,src.y,d.show||[],src.x)}
        var L="ABCD";
        function pick(oi){if(card.dataset.done)return;card.dataset.done=1;done++;var r=oi===d.a;if(r)ok++;
          each("button",function(b,bi){b.disabled=true;if(bi===d.a)b.setAttribute("aria-pressed","true")},row);
          lines.forEach(function(g,gi){g.setAttribute("stroke",gi===d.a?"var(--bull)":(gi===oi?"var(--bear)":"var(--muted)"));g.setAttribute("stroke-dasharray",gi===d.a?"":"4 4");g.setAttribute("stroke-width",gi===d.a?3:1.5)});
          fb.textContent=(r?"Correct. ":"Not quite. ")+d.e;fb.style.color=r?"var(--bull)":"var(--bear)";
          sc.textContent="Drills: "+ok+" of "+done+(done===list.length?" correct. Done.":"")}
        d.o.forEach(function(o,oi){
          var b=h("button","chip",(o.p!=null?L[oi]+" · ":"")+o.t);b.type="button";b.addEventListener("click",function(){pick(oi)});row.appendChild(b);
          if(sv&&o.p!=null){var y=G.Y(o.p),x1=G.X(o.from||0)-G.cw/2,x2=G.W-G.R+4;
            var ln=svg("line",{x1:x1,x2:x2,y1:y,y2:y,stroke:"var(--ink)","stroke-width":1.5,"stroke-dasharray":"4 4"},sv);lines.push(ln);
            svg("text",{x:x2+6,y:y+4,"font-size":13,"font-weight":700,fill:"var(--ink)"},sv).textContent=L[oi];
            var hit=svg("line",{x1:x1,x2:x2+24,y1:y,y2:y,stroke:"transparent","stroke-width":18,style:"cursor:pointer"},sv);hit.addEventListener("click",function(){pick(oi)})}});
        card.appendChild(row);card.appendChild(fb);fb.setAttribute("aria-live","polite");box.appendChild(card)});
      box.appendChild(sc);
    });
  }

  /* live TradingView chart: <div class="tv" data-sym="FX:EURUSD,TVC:DXY" data-int="60"></div> */
  function tv(){
    each(".tv[data-sym]",function(box){
      var row=h("div","tabs tv-links");
      box.getAttribute("data-sym").split(",").forEach(function(sy){var a=h("a","chip","↗ "+(sy.split(":")[1]||sy)+" in TradingView");a.href="https://www.tradingview.com/chart/?symbol="+encodeURIComponent(sy);a.target="_blank";a.rel="noopener";row.appendChild(a)});
      box.appendChild(row);
    });
  }

  /* always open a page at its top, unless a #section was asked for */
  function toTop(){
    try{if("scrollRestoration" in history)history.scrollRestoration="manual"}catch(e){}
    if(location.hash)return;
    var m=document.querySelector("main.book"),home=m&&!m.getAttribute("data-ch");
    /* contents page: come back where the reader left it; chapters: always from the top */
    var y=0;if(home){try{y=+sessionStorage.getItem("fx-home-y")||0}catch(e){}
      var t=false;window.addEventListener("scroll",function(){if(t)return;t=true;setTimeout(function(){t=false;try{sessionStorage.setItem("fx-home-y",String(window.scrollY||0))}catch(e){}},150)},{passive:true});
      window.addEventListener("pagehide",function(){try{sessionStorage.setItem("fx-home-y",String(window.scrollY||0))}catch(e){}})}
    function up(){window.scrollTo(0,y);if(!y){document.documentElement.scrollTop=0;document.body.scrollTop=0}}
    up();window.addEventListener("load",up);window.addEventListener("pageshow",up);setTimeout(up,60);setTimeout(up,300);
  }
  /* audio recap read by the browser's own voice */
  function audio(main){
    var dz=main.querySelector(".dossier");if(!dz||!("speechSynthesis" in window))return;
    var parts=[],t=main.querySelector(".dossier h1");if(t)parts.push("Chapter "+(main.getAttribute("data-ch")||"")+". "+t.textContent+".");
    each(".sec",function(sec){var h2=sec.querySelector("h2"),p=sec.querySelector(".main > p");if(h2)parts.push(h2.textContent.replace(/[●]/g,"").replace(/^\s*[\d.]+\s*/,"")+".");if(p)parts.push(p.textContent)},main);
    var db=main.querySelectorAll(".debrief > ul:not(.checks) li");if(db.length){parts.push("What you take from this chapter.");Array.prototype.forEach.call(db,function(li){parts.push(li.textContent)})}
    var text=parts.join(" ").replace(/\s+/g," "),words=text.split(" ").length,mins=Math.max(1,Math.round(words/140));
    var box=h("div","listen"),b=h("button","chip","▶ Listen to the summary · ~"+mins+" min"),stopB=h("button","chip","■ Stop"),note=h("span","listen-note","");
    b.type=stopB.type="button";stopB.hidden=true;box.appendChild(b);box.appendChild(stopB);box.appendChild(note);
    var h1=dz.querySelector("h1");h1.parentNode.insertBefore(box,h1.nextSibling);
    var chunks=text.match(/[^.!?„“]+[.!?“]*\s*/g)||[text],state="idle";
    function voice(){var v=speechSynthesis.getVoices().filter(function(x){return /^en/i.test(x.lang)});return v[0]||null}
    function reset(){state="idle";b.textContent="▶ Listen to the summary · ~"+mins+" min";stopB.hidden=true}
    function play(){speechSynthesis.cancel();var v=voice();note.textContent=v?"":"If you hear nothing, your device has no English voice. Add one in the text-to-speech settings.";
      chunks.forEach(function(c,i){var u=new SpeechSynthesisUtterance(c.trim());u.lang="en-GB";if(v)u.voice=v;u.rate=1;if(i===chunks.length-1)u.onend=reset;speechSynthesis.speak(u)});
      state="play";b.textContent="❚❚ Pause";stopB.hidden=false}
    b.addEventListener("click",function(){
      if(state==="idle")play();
      else if(state==="play"){speechSynthesis.pause();state="pause";b.textContent="▶ Resume"}
      else{speechSynthesis.resume();state="play";b.textContent="❚❚ Pause"}});
    stopB.addEventListener("click",function(){speechSynthesis.cancel();reset()});
    window.addEventListener("pagehide",function(){speechSynthesis.cancel()});
  }

  /* session clock: <div class="sessclock"></div> */
  function tzOff(t,tz){var p={};new Intl.DateTimeFormat("en-US",{timeZone:tz,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).formatToParts(new Date(t)).forEach(function(x){p[x.type]=x.value});
    return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour%24,+p.minute,+p.second)-t}
  function zoned(t,tz){var o=tzOff(t,tz);return new Date(t+o)}
  function at(base,h,m,tz){var d=zoned(base,tz),g=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),h,m);return g-tzOff(g,tz)}
  function clocks(){
    var S=[["Sydney","Australia/Sydney",7,16,"var(--muted)"],["Tokyo","Asia/Tokyo",9,18,"var(--liq)"],["London","Europe/London",8,17,"var(--bull)"],["New York","America/New_York",8,17,"var(--news)"]];
    each(".sessclock",function(box){
      var head=h("p","clock-now",""),sv=svg("svg",{viewBox:"0 0 340 160",role:"img","aria-label":"Today's sessions in Sofia time"}),list=h("ul","clock-list");
      box.appendChild(head);box.appendChild(sv);box.appendChild(list);
      function fmt(t){return new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Sofia",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(t))}
      function dur(ms){var m=Math.round(ms/60000),hh=Math.floor(m/60);return (hh?hh+" h ":"")+(m%60)+" min"}
      function draw(){
        var now=Date.now(),sof=zoned(now,"Europe/Sofia"),day0=at(now,0,0,"Europe/Sofia"),ny=zoned(now,"America/New_York"),wd=ny.getUTCDay(),nh=ny.getUTCHours();
        var closed=wd===6||(wd===5&&nh>=17)||(wd===0&&nh<17);
        head.innerHTML="Sofia: <b>"+fmt(now)+"</b>"+(closed?" · <b style='color:var(--bear)'>The market is closed for the weekend</b>":"");
        while(sv.firstChild)sv.removeChild(sv.firstChild);
        var L=58,R=332,X=function(t){return L+(R-L)*Math.max(0,Math.min(1,(t-day0)/864e5))};
        [0,6,12,18,24].forEach(function(hh){var x=L+(R-L)*hh/24;svg("line",{x1:x,x2:x,y1:18,y2:136,stroke:"var(--line)"},sv);svg("text",{x:x,y:154,"font-size":11,"text-anchor":"middle",fill:"var(--muted)"},sv).textContent=(hh<10?"0":"")+hh+":00"});
        [[10,0,12,0,"London KZ"],[15,30,18,0,"NY KZ"]].forEach(function(k){var a=day0+(k[0]*60+k[1])*6e4,b=day0+(k[2]*60+k[3])*6e4;svg("rect",{x:X(a),y:18,width:X(b)-X(a),height:118,fill:"var(--news)",opacity:.12},sv)});
        list.innerHTML="";
        S.forEach(function(s,i){var y=24+i*28;svg("text",{x:0,y:y+12,"font-size":12,fill:"var(--fg)"},sv).textContent=s[0];
          [-1,0,1].forEach(function(dd){var o=at(now+dd*864e5,s[2],0,s[1]),c=at(now+dd*864e5,s[3],0,s[1]);if(c<day0||o>day0+864e5)return;
            svg("rect",{x:X(o),y:y,width:Math.max(1,X(c)-X(o)),height:16,rx:3,fill:s[4],opacity:.85},sv)});
          var o0=at(now,s[2],0,s[1]),c0=at(now,s[3],0,s[1]),open=!closed&&now>=o0&&now<c0,nxt=now<o0?o0:at(now+864e5,s[2],0,s[1]);
          list.appendChild(h("li",null,"<b style='color:"+s[4]+"'>"+s[0]+"</b> "+fmt(o0)+"–"+fmt(c0)+" · "+(open?"<b>open</b>, closes in "+dur(c0-now):"opens in "+dur(nxt-now))))});
        svg("line",{x1:X(now),x2:X(now),y1:16,y2:138,stroke:"var(--bear)","stroke-width":2},sv);
        svg("text",{x:X(now),y:12,"font-size":11,"text-anchor":X(now)>300?"end":"middle",fill:"var(--bear)"},sv).textContent="now";
      }
      draw();setInterval(draw,30000);
    });
  }
  /* economic calendar: <div class="ecal"></div> */
  function ecal(){
    each(".ecal",function(box){box.appendChild(h("p","tv-link",'Live economic calendar: <a href="https://www.forexfactory.com/calendar" target="_blank" rel="noopener">Forex Factory</a> (our main calendar) or <a href="https://www.investing.com/economic-calendar/" target="_blank" rel="noopener">Investing.com</a>. Set the time zone to Sofia (GMT+3).'))});
  }

  /* practice room: <div class="practice"></div> with window.PRACTICE and window.REPLAYS */
  function practice(){
    var P=window.PRACTICE,RP=window.REPLAYS||{};if(!P)return;
    each(".practice",function(box){
      var head=h("p","verdict pr-score",""),q=h("p","pr-q",""),fig=h("figure","diagram"),sv=svg("svg",{viewBox:"0 0 340 250",role:"img","aria-label":"Practice chart"},fig),
          row=h("div","tabs"),fb=h("p","fb"),nx=h("button","chip","Next ▶"),tags=h("p","tv-link","");
      fb.setAttribute("aria-live","polite");nx.type="button";
      [head,q,fig,row,fb,nx,tags].forEach(function(x){box.appendChild(x)});
      var st={n:+(store("bP-n")||0),ok:+(store("bP-ok")||0),run:0,best:+(store("bP-best")||0)},last=-1;
      function score(){head.innerHTML="Correct: <b>"+st.ok+" of "+st.n+"</b> · streak: <b>"+st.run+"</b> · best streak: <b>"+st.best+"</b>"}
      var pool=[];P.forEach(function(t,ti){t.qs.forEach(function(qq,qi){pool.push([ti,qi])})});
      function round(){
        var pick;do{pick=Math.floor(Math.random()*pool.length)}while(pool.length>1&&pick===last);last=pick;
        var t=P[pool[pick][0]],Q=t.qs[pool[pick][1]],src=RP[t.src],mir=Math.random()<.5?1:0,M=src.y[0]+src.y[1];
        function mp(p){return mir?M-p:p}
        var cs=src.candles.map(function(k){return mir?[M-k[0],M-k[2],M-k[1],M-k[3]]:k});
        var show=(Q.show||[]).map(function(a){var b={};for(var k in a)b[k]=a[k];if(b.p!=null)b.p=mp(b.p);if(b.p1!=null){b.p1=mp(a.p1);b.p2=mp(a.p2)}return b});
        var G=null;fig.hidden=!Q.n;if(Q.n)G=chart(sv,cs,Q.n,src.y,show,src.x);
        function tx(v){return Array.isArray(v)?v[mir]:v}
        q.innerHTML="<b>"+tx(t.name)+".</b> "+tx(Q.q);fb.textContent="";nx.hidden=true;row.innerHTML="";
        var ans=Array.isArray(Q.a)?Q.a[mir]:Q.a,order=Q.o.map(function(_,i){return i}).sort(function(){return Math.random()-.5}),L="ABCD",lines=[],done=false;
        function pick2(oi){if(done)return;done=true;var r=oi===ans;st.n++;if(r){st.ok++;st.run++;if(st.run>st.best)st.best=st.run}else st.run=0;
          store("bP-n",st.n);store("bP-ok",st.ok);store("bP-best",st.best);score();
          each("button",function(b){b.disabled=true;if(+b.dataset.oi===ans)b.setAttribute("aria-pressed","true")},row);
          lines.forEach(function(l){l[0].setAttribute("stroke",l[1]===ans?"var(--bull)":(l[1]===oi?"var(--bear)":"var(--muted)"));l[0].setAttribute("stroke-width",l[1]===ans?3:1.5);l[0].setAttribute("stroke-dasharray",l[1]===ans?"":"4 4")});
          fb.textContent=(r?"Correct. ":"Not quite. ")+tx(Q.e);fb.style.color=r?"var(--bull)":"var(--bear)";nx.hidden=false;nx.focus()}
        order.forEach(function(oi,pos){var o=Q.o[oi],b=h("button","chip",(o.p!=null&&G?L[pos]+" · ":"")+tx(o.t));b.type="button";b.dataset.oi=oi;b.addEventListener("click",function(){pick2(oi)});row.appendChild(b);
          if(G&&o.p!=null){var y=G.Y(mp(o.p)),x1=G.X(o.from||0)-G.cw/2,x2=G.W-G.R+4;
            var ln=svg("line",{x1:x1,x2:x2,y1:y,y2:y,stroke:"var(--ink)","stroke-width":1.5,"stroke-dasharray":"4 4"},sv);lines.push([ln,oi]);
            svg("text",{x:x2+6,y:y+4,"font-size":13,"font-weight":700,fill:"var(--ink)"},sv).textContent=L[pos];
            svg("line",{x1:x1,x2:x2+24,y1:y,y2:y,stroke:"transparent","stroke-width":18,style:"cursor:pointer"},sv).addEventListener("click",function(){pick2(oi)})}});
        tags.textContent="Scenario: "+tx(t.name)+(mir?" · mirrored":"");
      }
      nx.addEventListener("click",round);score();round();
    });
  }

  /* theme switch, floating bottom-right */
  function themeBtn(){
    var b=h("button","theme-btn");b.type="button";
    function eff(){var t=document.documentElement.getAttribute("data-theme");if(t)return t;return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}
    function lab(){var d=eff()==="dark";b.textContent=d?"☀":"☾";b.setAttribute("aria-label",d?"Light theme":"Dark theme");b.title=b.getAttribute("aria-label")}
    b.addEventListener("click",function(){var n=eff()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",n);store("fx-theme",n);lab();
      each(".tv[data-sym]",function(x){var on=x.querySelector('button[aria-pressed="true"]');if(on)on.click()})});
    lab();document.body.appendChild(b);
  }
  /* in-page chapter overview: goals, sections, terms, takeaways, progress */
  function chapterPanel(main,id){
    var c=CHAPTERS.filter(function(x){return x.id===id})[0];if(!c)return;
    var dlg=document.getElementById("chPanel");
    if(!dlg){dlg=h("dialog","ch-panel");dlg.id="chPanel";document.body.appendChild(dlg);
      dlg.addEventListener("click",function(e){if(e.target===dlg||e.target.closest(".cp-x"))dlg.close();var l=e.target.closest("a[data-go]");if(l){e.preventDefault();dlg.close();var t=document.getElementById(l.getAttribute("data-go"));if(t)t.scrollIntoView({behavior:"smooth",block:"start"})}})}
    var p=PARTS[c.part],words=(main.textContent||"").trim().split(/\s+/).length,mins=Math.max(3,Math.round(words/180));
    var h2s=[].slice.call(main.querySelectorAll(".sec h2[id]")),terms=[].slice.call(main.querySelectorAll(".rail .term"));
    var done=store("b"+id+"-done")||"",qe=store("b"+id+"-qe")||"",qm=store("b"+id+"-qm")||"";
    var full=done&&done.split("/")[0]===done.split("/")[1]&&+done.split("/")[1]>0,status=full?["Completed","var(--bull)"]:(done||qe||qm)?["In progress","var(--news)"]:["Not started","var(--muted)"];
    var o='<button class="cp-x" type="button" aria-label="Close">✕</button>'+
      '<span class="label">Chapter card · '+(c.part<7?"Part "+p.n:p.t)+'</span><h2>'+c.label+' · '+c.title+'</h2>'+
      '<div class="cp-stats"><span>⏱ ~'+mins+' min</span><span>§ '+h2s.length+' sections</span><span>◆ '+terms.length+' terms</span><span style="color:'+status[1]+'">● '+status[0]+'</span></div>';
    var cd=main.querySelector(".cando");if(cd)o+='<h3>After this chapter you will be able to</h3><ul class="cando">'+cd.innerHTML+'</ul>';
    if(h2s.length){o+='<h3>Contents</h3><ol class="cp-toc">';h2s.forEach(function(x){o+='<li><a href="#'+x.id+'" data-go="'+x.id+'">'+x.textContent.replace(/^[●\s]+/,"")+'</a></li>'});o+='</ol>'}
    var db=main.querySelector(".debrief > ul:not(.checks)");if(db)o+='<h3>What you take away</h3><ul>'+db.innerHTML+'</ul>';
    if(terms.length){o+='<h3>Key terms</h3><div class="cp-terms">';terms.forEach(function(t){var b=t.querySelector("b");o+='<span title="'+(t.textContent.replace(b?b.textContent:"","").trim().replace(/"/g,"&quot;"))+'">'+(b?b.textContent:"")+'</span>'});o+='</div>'}
    o+='<h3>Your progress</h3><div class="cp-stats"><span>Checklist: <b>'+(done||"0")+'</b></span><span>Easy quiz: <b>'+(qe||"–")+'</b></span><span>Intermediate quiz: <b>'+(qm||"–")+'</b></span></div>';
    var go=[["deb","To the debrief and checklist"],["qz","To the quiz"]].filter(function(x){return document.getElementById(x[0])});
    if(go.length){o+='<div class="cp-go">';go.forEach(function(x){o+='<a class="chip" href="#'+x[0]+'" data-go="'+x[0]+'">'+x[1]+' →</a>'});var w=main.querySelector(".watch");if(w&&w.id)o+='<a class="chip" href="#'+w.id+'" data-go="'+w.id+'">▶ Videos →</a>';o+='</div>'}
    dlg.innerHTML=o;if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","");
  }
  /* jump chip from the dossier to the chapter's YouTube box */
  function videoChip(main){
    var w=main.querySelector(".watch"),dz=main.querySelector(".dossier");if(!w||!dz)return;
    w.id=w.id||"videos";var box=dz.querySelector(".listen");if(!box){box=h("div","listen");var h1=dz.querySelector("h1");h1.parentNode.insertBefore(box,h1.nextSibling)}
    var n=w.querySelectorAll(".picks li").length,a=h("a","chip","▶ Videos"+(n?" ("+n+" recommended)":""));a.href="#"+w.id;
    a.addEventListener("click",function(e){e.preventDefault();w.scrollIntoView({behavior:"smooth",block:"start"})});box.appendChild(a);
  }
  /* printable summaries: a standalone file via downloads (inside the viewer), print dialog elsewhere */
  function sumSection(d,label,title){
    var o='<section><h2>'+label+' · '+title+'</h2>';
    var cd=d.querySelector(".cando");if(cd)o+='<p class="lb">After the chapter you will be able to</p><ul>'+cd.innerHTML+'</ul>';
    var db=d.querySelector(".debrief > ul:not(.checks)");if(db)o+='<p class="lb">What you take away</p><ul>'+db.innerHTML+'</ul>';
    var ck=d.querySelectorAll(".debrief .checks li");if(ck.length){o+='<p class="lb">Checklist</p><ul class="ck">';Array.prototype.forEach.call(ck,function(li){o+='<li>☐ '+li.textContent.trim().replace(/</g,"&lt;")+'</li>'});o+='</ul>'}
    return o+'</section>';
  }
  function sumDoc(title,body){
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><style>'+
      'body{font:15px/1.55 Georgia,serif;color:#1a1f1c;background:#fff;max-width:760px;margin:0 auto;padding:28px 18px}'+
      'header{border-bottom:2px solid #1f6b4a;margin-bottom:18px;padding-bottom:10px}header b{font:700 22px system-ui,sans-serif}header span{display:block;color:#666;font-size:13px}'+
      'section{border:1px solid #d9e2dc;border-radius:14px;padding:14px 18px;margin:0 0 16px;break-inside:avoid}h2{font:700 17px system-ui,sans-serif;margin:0 0 8px;color:#1f6b4a}'+
      '.lb{font:600 11px system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#777;margin:10px 0 2px}ul{margin:0;padding-left:20px}.ck{list-style:none;padding-left:4px}'+
      'button{font:600 14px system-ui,sans-serif;background:#1f6b4a;color:#fff;border:0;border-radius:10px;padding:10px 16px;cursor:pointer;margin-bottom:18px}'+
      'footer{color:#777;font-size:12px;margin-top:20px}@media print{button{display:none}body{padding:0}}'+
      '</style></head><body><button onclick="print()">⎙ Print / Save as PDF</button><header><b>FX Fundamentals</b><span>'+title+' · Kristian Tsvetkov</span></header>'+body+
      '<footer>Educational material, not investment advice.</footer></body></html>';
  }
  var dlP=null;
  function getDl(){if(!dlP)dlP=(window.claude&&typeof window.claude.use==="function")?window.claude.use("downloads").catch(function(){return null}):Promise.resolve(null);return dlP}
  getDl();
  function deliver(btn,file,title,body,cls){
    var old=btn.textContent;
    function say(t){btn.textContent=t;setTimeout(function(){btn.textContent=old},3500)}
    function viaPrint(){document.documentElement.classList.add(cls);
      function off(){document.documentElement.classList.remove(cls);window.removeEventListener("afterprint",off)}
      window.addEventListener("afterprint",off);window.print();setTimeout(off,1500)}
    getDl().then(function(dl){
      if(!dl){viaPrint();return}
      dl.save({filename:file,data:sumDoc(title,body)}).then(function(){say("✓ Downloaded. Open the file and press Print")},function(e){
        var c=e&&e.code;if(c==="declined")return;if(c==="rate_limited"){say("Wait a second and try again");return}viaPrint()});
    });
  }
  function printSum(main){
    var dz=main.querySelector(".dossier");if(!dz||!main.querySelector(".debrief"))return;
    var box=dz.querySelector(".listen");if(!box){box=h("div","listen");var h1=dz.querySelector("h1");h1.parentNode.insertBefore(box,h1.nextSibling)}
    var b=h("button","chip","⎙ Summary (PDF)");b.type="button";box.appendChild(b);
    var id=main.getAttribute("data-ch"),c=CHAPTERS.filter(function(x){return x.id===id})[0]||{label:id,title:document.title};
    b.addEventListener("click",function(){
      deliver(b,"FX-Fundamentals-gl-"+id+"-rezyume.html",c.label+" · "+c.title,sumSection(document,c.label,c.title),"print-sum")});
  }
  /* all summaries in one printout (contents page) */
  function printAll(btn){if(!btn)return;
    btn.addEventListener("click",function(){
      var old=btn.textContent;btn.textContent="Collecting the chapters…";btn.disabled=true;
      var host=document.getElementById("printAll");if(!host){host=h("div","print-all");host.id="printAll";document.body.appendChild(host)}host.innerHTML="";
      var list=CHAPTERS.filter(function(c){return c.part<7}),body="";
      Promise.all(list.map(function(c){return fetch(c.file).then(function(r){return r.text()}).catch(function(){return ""})})).then(function(pages){
        pages.forEach(function(t,i){if(!t)return;var d=new DOMParser().parseFromString(t,"text/html"),c=list[i],sec=h("section","pa-ch");
          var html=sumSection(d,c.label,c.title);body+=html;
          sec.innerHTML=html.replace(/^<section>|<\/section>$/g,"").replace(/class="lb"/g,'class="label"').replace(/class="ck"/g,'class="pa-checks"');
          host.appendChild(sec)});
        btn.textContent=old;btn.disabled=false;
        if(!host.children.length){btn.textContent="Could not load the chapters";return}
        deliver(btn,"FX-Fundamentals-vsichki-rezyumeta.html","All summaries and checklists",body,"print-all-on")});
    });
  }
  /* progress map on the contents page */
  function progressMap(box){
    var tot=0,doneN=0,qs=0,qn=0;var grid=h("div","pm-grid");
    PARTS.forEach(function(p,pi){CHAPTERS.filter(function(c){return c.part===pi}).forEach(function(c){
      var d=store("b"+c.id+"-done"),qe=store("b"+c.id+"-qe"),qm=store("b"+c.id+"-qm"),full=d&&d.split("/")[0]===d.split("/")[1]&&+d.split("/")[1]>0,part=d&&+d.split("/")[0]>0;
      if(c.part<7){tot++;if(full)doneN++}
      [qe,qm].forEach(function(x){if(x){var a=x.split("/");qs+=+a[0];qn+=+a[1]}});
      var cls=full?"pm-done":(part||qe||qm)?"pm-part":"";
      var a=h("a","pm-tile "+cls,'<b>'+c.label+'</b><span>'+(qe?qe.split("/")[0]+"/"+qe.split("/")[1]:"")+'</span>');a.href=c.file;
      a.title=c.title+(d?" · checklist "+d:"")+(qe?" · quiz "+qe:"")+(qm?" · intermediate "+qm:"");grid.appendChild(a)})});
    var pn=+(store("bP-n")||0),po=+(store("bP-ok")||0),pb=+(store("bP-best")||0),known=0;try{known=(JSON.parse(store("bB-known")||"[]")||[]).length}catch(e){}
    var stats=h("div","pm-stats");
    [["Completed chapters",doneN+" / "+tot],["Quizzes",qn?Math.round(qs/qn*100)+"%":"—"],["Practice Room",pn?po+" / "+pn+" · streak "+pb:"—"],["Learned terms",known||"—"]].forEach(function(s){stats.appendChild(h("div",null,"<span class='label'>"+s[0]+"</span><b>"+s[1]+"</b>"))});
    box.appendChild(stats);box.appendChild(grid);
    box.appendChild(h("p","fb","Green: the whole checklist is ticked. Yellow: chapter started. The number is your easy-quiz score."));
  }
  /* flashcards from the glossary: <div class="flash"></div> on the glossary page */
  function flash(){
    var G=window.GLOSS;if(!G)return;
    each(".flash",function(box){
      var known={};try{(JSON.parse(store("bB-known")||"[]")||[]).forEach(function(k){known[k]=1})}catch(e){}
      var filt=h("div","tabs"),card=h("button","fc-card"),meta=h("p","score",""),row=h("div","tabs"),part="all",deck=[],cur=null,flipped=false;card.type="button";
      var opts=[["all","All"]];PARTS.forEach(function(p,pi){if(pi<7)opts.push([String(pi),"Part "+p.n])});
      opts.forEach(function(o){var b=h("button","chip",o[1]);b.type="button";b.addEventListener("click",function(){part=o[0];build();each("button",function(x){x.setAttribute("aria-pressed",x===b?"true":"false")},filt)});if(o[0]==="all")b.setAttribute("aria-pressed","true");filt.appendChild(b)});
      var bNo=h("button","chip","↻ Again"),bYes=h("button","chip","✓ I know it"),bReset=h("button","chip","Reset learned cards");[bNo,bYes,bReset].forEach(function(b){b.type="button";row.appendChild(b)});
      [filt,card,meta,row].forEach(function(x){box.appendChild(x)});
      var partOf={};CHAPTERS.forEach(function(c){partOf[c.label]=c.part});
      function build(){deck=G.filter(function(g){return !known[g[0]]&&(part==="all"||String(partOf[g[2]])===part)});
        for(var i=deck.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=deck[i];deck[i]=deck[j];deck[j]=t}next()}
      function next(){cur=deck[0]||null;flipped=false;show()}
      function show(){var n=Object.keys(known).length;
        meta.textContent="Left: "+deck.length+" · learned "+n+" of "+G.length;
        if(!cur){card.innerHTML="<span class='fc-front'>No cards here. Pick another part or reset the learned cards.</span>";bYes.disabled=bNo.disabled=true;return}
        bYes.disabled=bNo.disabled=false;var parts=cur[0].split(" · "),front=parts[0],bg=parts.slice(1).join(" · ");
        card.innerHTML=flipped?"<span class='fc-bg'>"+(bg||front)+"</span><span class='fc-def'>"+cur[1]+"</span><span class='fc-ch'>chapter "+cur[2]+"</span>":"<span class='fc-front'>"+front+"</span><span class='fc-hint'>tap to flip</span>";
        card.classList.toggle("flipped",flipped)}
      card.addEventListener("click",function(){if(!cur)return;flipped=!flipped;show()});
      bYes.addEventListener("click",function(){if(!cur)return;known[cur[0]]=1;store("bB-known",JSON.stringify(Object.keys(known)));deck.shift();next()});
      bNo.addEventListener("click",function(){if(!cur)return;deck.push(deck.shift());next()});
      bReset.addEventListener("click",function(){known={};store("bB-known","[]");build()});
      build();
    });
  }

  /* small line icons, drawn for the book (viewBox 0 0 48 48) */
  var IC={
    book:'<path d="M8 10h14a4 4 0 0 1 4 4v26a3 3 0 0 0-3-3H8z"/><path d="M40 10H26a4 4 0 0 0-4 4v26a3 3 0 0 1 3-3h15z"/>',
    updown:'<path d="M15 38V12M9 18l6-6 6 6"/><path d="M33 10v26M27 30l6 6 6-6"/>',
    globe:'<circle cx="24" cy="24" r="15"/><path d="M9 24h30M24 9c5 5 5 25 0 30M24 9c-5 5-5 25 0 30"/>',
    swap:'<path d="M10 17h26l-6-6M38 31H12l6 6"/>',
    candles:'<path d="M13 8v32M35 6v34M24 14v24"/><rect x="9" y="16" width="8" height="14" rx="1.5"/><rect x="20" y="20" width="8" height="10" rx="1.5"/><rect x="31" y="12" width="8" height="16" rx="1.5"/>',
    levels:'<path d="M6 16h36M6 32h36" stroke-dasharray="4 4"/><path d="M8 38l8-10 8 6 8-14 8 4"/>',
    dice:'<rect x="9" y="9" width="30" height="30" rx="6"/><circle cx="17" cy="17" r="2" fill="currentColor"/><circle cx="31" cy="31" r="2" fill="currentColor"/><circle cx="24" cy="24" r="2" fill="currentColor"/>',
    zigzag:'<path d="M6 36l9-12 6 6 9-16 6 8 6-10"/><circle cx="30" cy="14" r="2.5"/><circle cx="21" cy="30" r="2.5"/>',
    drop:'<path d="M24 7c7 10 12 16 12 22a12 12 0 0 1-24 0c0-6 5-12 12-22z"/><path d="M18 30a6 6 0 0 0 6 6"/>',
    layers:'<path d="M24 8l16 8-16 8-16-8z"/><path d="M8 24l16 8 16-8M8 32l16 8 16-8"/>',
    clock:'<circle cx="24" cy="24" r="15"/><path d="M24 15v9l6 4"/>',
    check:'<rect x="10" y="7" width="28" height="34" rx="4"/><path d="M16 17l3 3 5-5M16 29l3 3 5-5M28 18h5M28 30h5"/>',
    shield:'<path d="M24 6l14 5v11c0 9-6 16-14 20-8-4-14-11-14-20V11z"/><path d="M18 24l4 4 8-8"/>',
    target:'<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="8"/><circle cx="24" cy="24" r="2" fill="currentColor"/>',
    bolt:'<rect x="8" y="10" width="32" height="30" rx="4"/><path d="M8 18h32M16 6v8M32 6v8"/><path d="M25 22l-5 8h6l-3 7"/>',
    sun:'<circle cx="24" cy="28" r="8"/><path d="M6 38h36M24 10v6M11 17l4 4M37 17l-4 4"/>',
    bars:'<path d="M10 40V26M18 40V16M26 40V22M34 40V10M42 40V30" stroke-width="5"/>',
    scale:'<path d="M24 8v32M14 40h20M10 14h28"/><path d="M10 14l-5 12h10zM38 14l-5 12h10z"/>',
    coin:'<ellipse cx="24" cy="14" rx="13" ry="5"/><path d="M11 14v8c0 3 6 5 13 5s13-2 13-5v-8M11 22v8c0 3 6 5 13 5s13-2 13-5v-8"/>',
    bank:'<path d="M6 18L24 8l18 10z"/><path d="M10 22v14M18 22v14M30 22v14M38 22v14M6 40h36"/>',
    dollar:'<circle cx="24" cy="24" r="15"/><path d="M29 17c-2-2-9-3-10 1s10 4 10 9-8 4-11 1M24 12v24"/>',
    crash:'<path d="M6 12l10 10 6-4 8 10 12 6"/><path d="M34 38h8v-8"/>',
    compass:'<circle cx="24" cy="24" r="15"/><path d="M30 18l-4 8-8 4 4-8z"/>',
    folder:'<path d="M6 14a3 3 0 0 1 3-3h9l4 4h17a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/>',
    monitor:'<rect x="6" y="8" width="36" height="24" rx="3"/><path d="M18 40h12M24 32v8"/><path d="M11 26l7-8 6 4 8-9 5 5"/>',
    trophy:'<path d="M16 8h16v10a8 8 0 0 1-16 0z"/><path d="M16 12H9a6 6 0 0 0 7 8M32 12h7a6 6 0 0 1-7 8M24 26v8M17 40h14"/>',
    flag:'<path d="M12 42V8"/><path d="M12 9h22l-5 7 5 7H12"/>',
    pulse:'<path d="M5 26h9l4-10 6 20 5-14 3 4h11"/>',
    pen:'<rect x="9" y="7" width="24" height="34" rx="3"/><path d="M15 15h12M15 21h12M15 27h6"/><path d="M40 18L28 38l-4 2 1-4 12-20z"/>',
    cup:'<path d="M10 18h22v12a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z"/><path d="M32 21h3a5 5 0 0 1 0 10h-3M16 7c-2 3 2 4 0 7M23 7c-2 3 2 4 0 7"/>',
    pie:'<circle cx="24" cy="24" r="15"/><path d="M24 9v15h15"/>',
    btc:'<circle cx="24" cy="24" r="15"/><path d="M19 15h7a4 4 0 0 1 0 8h-7zM19 23h8a4 4 0 0 1 0 8h-8zM19 15v16M22 12v3M26 12v3M22 31v3M26 31v3"/>',
    doc:'<path d="M12 6h17l9 9v27H12z"/><path d="M29 6v9h9M18 24h14M18 30h14M18 36h8"/>',
    lens:'<circle cx="21" cy="21" r="12"/><path d="M30 30l10 10"/><path d="M14 24l4-4 4 3 5-6"/>',
    link:'<path d="M20 28l8-8"/><path d="M22 14l3-3a7 7 0 0 1 10 10l-3 3M26 34l-3 3a7 7 0 0 1-10-10l3-3"/>',
    star:'<path d="M24 7l5 11 12 1-9 8 3 12-11-7-11 7 3-12-9-8 12-1z"/>',
    pencil:'<path d="M32 8l8 8-22 22-10 2 2-10z"/><path d="M28 12l8 8"/>',
    users:'<circle cx="18" cy="17" r="6"/><path d="M7 39c0-7 5-11 11-11s11 4 11 11"/><circle cx="33" cy="15" r="5"/><path d="M31 26c6 0 10 4 10 10"/>',
    network:'<circle cx="24" cy="10" r="4"/><circle cx="10" cy="36" r="4"/><circle cx="38" cy="36" r="4"/><circle cx="24" cy="26" r="3"/><path d="M24 14v9M21.5 28L13 33.5M26.5 28L35 33.5M14 36h20"/>',
    archive:'<rect x="7" y="9" width="34" height="9" rx="2"/><path d="M10 18v19a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V18"/><path d="M20 26h8"/>',
    cash:'<rect x="6" y="13" width="36" height="22" rx="3"/><circle cx="24" cy="24" r="5"/><path d="M12 19v0M36 29v0"/>'
  };
  var CHICON={"0.1":"book","0.2":"updown","0.3":"flag","1":"globe","2":"swap","3":"candles","4":"levels","5":"dice","6":"zigzag","7":"drop","8":"layers","9":"clock","10":"check","11":"shield","12":"target","13":"bolt","14":"sun","15":"bars","16":"scale","17":"coin","18":"bank","19":"bolt","20":"dollar","21":"swap","22":"dollar","23":"globe","24":"book","25":"crash","26":"compass","27":"folder","28":"monitor","29":"bank","30":"trophy","31":"flag","32":"pulse","33":"pen","34":"cup","35":"coin","36":"pie","37":"btc","38":"doc","A":"lens","B":"book","C":"check","D":"link","K":"star","S":"compass","J":"pen","P":"target","X":"pencil","20b":"users","21b":"network","E":"archive","F":"cash"};
  function icon(name,size,cls){var d=IC[name];if(!d)return null;var w=document.createElement("span");w.className="ic "+(cls||"");
    w.innerHTML='<svg viewBox="0 0 48 48" width="'+size+'" height="'+size+'" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';return w}
  /* reader highlighter: select text, press Mark; saved per page in localStorage */
  var HL=null;
  function highlighter(main,id){
    var key="fx-hl-"+LANG+"-"+(id||location.pathname.split("/").pop()||"index"),list=[];
    try{list=JSON.parse(store(key)||"[]")||[]}catch(e){list=[]}
    function nodes(){var out=[],w=document.createTreeWalker(main,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;
      if(!p||p.closest("svg,script,style,textarea,select,button,.hl-bar"))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});
      var n,pos=0;while((n=w.nextNode())){out.push({n:n,s:pos});pos+=n.nodeValue.length}return out}
    function full(ns){return ns.map(function(x){return x.n.nodeValue}).join("")}
    function wrap(s,e,k){var ns=nodes();ns.forEach(function(x){var a=Math.max(s,x.s),b=Math.min(e,x.s+x.n.nodeValue.length);if(b<=a)return;
      var t=x.n;if(b-x.s<t.nodeValue.length)t.splitText(b-x.s);if(a>x.s)t=t.splitText(a-x.s);if(!/\S/.test(t.nodeValue))return;
      var m=document.createElement("mark");m.className="hl";m.setAttribute("data-k",k);t.parentNode.insertBefore(m,t);m.appendChild(t)})}
    function unwrapAll(){each("mark.hl",function(m){var p=m.parentNode;while(m.firstChild)p.insertBefore(m.firstChild,m);p.removeChild(m);p.normalize()},main)}
    function paint(){unwrapAll();var txt=full(nodes());list=list.filter(function(r){
        if(txt.slice(r.s,r.e)!==r.t){var i=txt.indexOf(r.t);if(i<0)return false;r.s=i;r.e=i+r.t.length}return true});
      list.forEach(function(r,k){wrap(r.s,r.e,k)});
      var c=document.querySelector(".pp-hl-n");if(c)c.textContent=list.length}
    function save(){store(key,JSON.stringify(list));paint()}
    function offset(node,off){var ns=nodes();
      if(node.nodeType!==3){var r=document.createRange();r.setStart(main,0);r.setEnd(node,off);var len=0;
        ns.forEach(function(x){if(r.intersectsNode(x.n)&&r.comparePoint(x.n,x.n.nodeValue.length)<=0)len=x.s+x.n.nodeValue.length});return len}
      for(var i=0;i<ns.length;i++)if(ns[i].n===node)return ns[i].s+off;return -1}
    var bar=h("div","hl-bar");bar.hidden=true;document.body.appendChild(bar);var pend=null;
    function show(rect,html){bar.innerHTML=html;bar.hidden=false;var bw=bar.offsetWidth,x=Math.max(8,Math.min(innerWidth-bw-8,rect.left+rect.width/2-bw/2)),y=rect.top-bar.offsetHeight-8;
      if(y<8)y=rect.bottom+8;y=Math.max(8,Math.min(innerHeight-bar.offsetHeight-8,y));bar.style.left=x+"px";bar.style.top=y+"px"}
    function hide(){bar.hidden=true;pend=null}
    function check(){var sel=getSelection();if(!sel||sel.isCollapsed||!sel.rangeCount){if(pend&&pend.sel)hide();return}
      var r=sel.getRangeAt(0);if(!main.contains(r.commonAncestorContainer))return hide();
      var s=offset(r.startContainer,r.startOffset),e=offset(r.endContainer,r.endOffset);if(s<0||e<=s)return hide();
      var t=full(nodes()).slice(s,e);if(!/\S/.test(t))return hide();
      pend={sel:1,s:s,e:e,t:t};show(r.getBoundingClientRect(),'<button type="button" data-hl="add">🖍 '+(LANG==="bg"?"Маркирай":"Mark")+'</button>')}
    var tm;document.addEventListener("selectionchange",function(){clearTimeout(tm);tm=setTimeout(check,250)});
    bar.addEventListener("pointerdown",function(e){e.preventDefault()});
    bar.addEventListener("click",function(e){var b=e.target.closest("[data-hl]");if(!b||!pend)return;
      if(b.getAttribute("data-hl")==="add"){list=list.filter(function(r){return r.e<=pend.s||r.s>=pend.e});list.push({s:pend.s,e:pend.e,t:pend.t});list.sort(function(a,b){return a.s-b.s});
        try{getSelection().removeAllRanges()}catch(x){}}
      else list.splice(pend.k,1);
      save();hide()});
    main.addEventListener("click",function(e){var m=e.target.closest&&e.target.closest("mark.hl");if(!m)return;var sel=getSelection();if(sel&&!sel.isCollapsed)return;
      pend={k:+m.getAttribute("data-k"),el:m};show(m.getBoundingClientRect(),'<button type="button" data-hl="del">✕ '+(LANG==="bg"?"Премахни маркера":"Remove mark")+'</button>')});
    document.addEventListener("pointerdown",function(e){if(!bar.hidden&&!bar.contains(e.target)&&!(e.target.closest&&e.target.closest("mark.hl")))hide()});
    addEventListener("scroll",function(){if(bar.hidden||!pend)return;var el=pend.el||(getSelection().rangeCount&&getSelection().getRangeAt(0));if(el)show(el.getBoundingClientRect(),bar.innerHTML)},{passive:true});
    HL={count:function(){return list.length},clear:function(){list=[];save()}};
    paint();
  }
  function icons(main){
    var id=main.getAttribute("data-ch"),dz=main.querySelector(".dossier");
    if(id&&dz&&CHICON[id]&&!dz.querySelector(".ic")){var ic=icon(CHICON[id],56,"");if(!ic)return;
      /* the chapter icon opens an overview panel inside the page */
      var a=document.createElement("button");a.type="button";a.className="ic ic-dossier ic-link";
      a.title="Chapter card: goals, contents, terms, progress";a.setAttribute("aria-label","Open the chapter card");a.setAttribute("aria-haspopup","dialog");
      a.innerHTML=ic.innerHTML+'<span class="ic-badge" aria-hidden="true">i</span><span class="ic-hint" aria-hidden="true">Card</span>';
      a.addEventListener("click",function(){chapterPanel(main,id)});dz.appendChild(a)}
  }

  /* ---------- save a generated file: downloads capability in the viewer, plain download elsewhere ---------- */
  function saveFile(btn,file,data,okText){
    var old=btn?btn.textContent:"";
    function say(t){if(!btn)return;btn.textContent=t;setTimeout(function(){btn.textContent=old},3500)}
    function plain(){try{var ext=file.split(".").pop(),type={csv:"text/csv",html:"text/html",md:"text/markdown",txt:"text/plain"}[ext]||"application/octet-stream";
      var blob=new Blob([data],{type:type+";charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=file;document.body.appendChild(a);a.click();a.remove();say(okText||"Downloaded ✓")}
      catch(e){try{navigator.clipboard.writeText(data);say("Copied to clipboard ✓")}catch(e2){say("The browser blocked the download")}}}
    return getDl().then(function(dl){
      if(!dl){plain();return}
      return dl.save({filename:file,data:data}).then(function(){say(okText||"Downloaded ✓")},function(e){var c=e&&e.code;if(c==="declined")return;if(c==="rate_limited"){say("Wait a second and try again");return}plain()});
    });
  }
  function csvText(rows){return "\ufeff"+rows.map(function(r){return r.map(function(c){return '"'+String(c==null?"":c).replace(/"/g,'""')+'"'}).join(";")}).join("\r\n")}

  /* ---------- reading preferences: font size and calm mode ---------- */
  var FS=[15,17,19,21];
  function applyPrefs(){var d=document.documentElement,i=+(store("fx-fs")||1);if(!(i>=0&&i<FS.length))i=1;d.style.setProperty("--fs",FS[i]+"px");d.classList.toggle("no-motion",store("fx-calm")==="1")}
  applyPrefs();
  /* ---------- language switch: BG pages at the root, EN pages in en/ ---------- */
  function langBtn(){
    var f=location.pathname.split("/").pop();if(!/\.html$/.test(f))f="index.html";
    var a=h("a","float-btn lang-btn",LANG==="en"?"BG":"EN");a.href=(LANG==="en"?"bg/":"../")+f+location.hash;
    a.setAttribute("aria-label",LANG==="en"?"Прочети на български":"Read in English");a.title=a.getAttribute("aria-label");a.setAttribute("hreflang",LANG==="en"?"bg":"en");
    document.body.appendChild(a)}
  function prefsBtn(){
    var b=h("button","float-btn prefs-btn","Aa");b.type="button";b.setAttribute("aria-label","Text size and animations");b.title="Text size and animations";
    var pop=h("div","prefs-pop");pop.hidden=true;pop.setAttribute("role","dialog");pop.setAttribute("aria-label","Reading settings");
    function draw(){var i=+(store("fx-fs")||1),calm=store("fx-calm")==="1";
      pop.innerHTML='<span class="label">Text size</span><div class="pp-row"><button type="button" data-f="-1" aria-label="Smaller text">A−</button><span class="pp-val">'+["Small","Normal","Large","Extra large"][i]+'</span><button type="button" data-f="1" aria-label="Larger text">A+</button></div>'+
        '<label class="pp-calm"><input type="checkbox" '+(calm?"checked":"")+'> No animations</label>'+
        (HL?'<div class="pp-hl"><span>Your marks on this page: <b class="pp-hl-n">'+HL.count()+'</b></span><button type="button" data-hlclear>Clear</button></div>':'')}
    pop.addEventListener("click",function(e){e.stopPropagation();if(e.target.closest("[data-hlclear]")&&HL){HL.clear();draw();return}var f=e.target.closest("[data-f]");if(!f)return;var i=Math.min(FS.length-1,Math.max(0,+(store("fx-fs")||1)+ +f.getAttribute("data-f")));store("fx-fs",String(i));applyPrefs();draw()});
    pop.addEventListener("change",function(e){if(e.target.type==="checkbox"){store("fx-calm",e.target.checked?"1":"0");applyPrefs()}});
    b.addEventListener("click",function(e){e.stopPropagation();pop.hidden=!pop.hidden;if(!pop.hidden)draw()});
    document.addEventListener("click",function(e){if(!pop.hidden&&!pop.contains(e.target)&&e.target!==b)pop.hidden=true});
    document.body.appendChild(b);document.body.appendChild(pop);
  }

  /* ---------- search across the whole book ---------- */
  var IDX=null;
  function buildIndex(){
    if(IDX)return Promise.resolve(IDX);
    var list=CHAPTERS.filter(function(c){return c.ready});
    return Promise.all(list.map(function(c){return fetch(c.file).then(function(r){return r.text()}).catch(function(){return ""})})).then(function(pages){
      var out=[];
      pages.forEach(function(t,i){var c=list[i];out.push({k:"Chapter",t:c.label+" · "+c.title,s:"",href:c.file,w:3});if(!t)return;
        var d=new DOMParser().parseFromString(t,"text/html");
        Array.prototype.forEach.call(d.querySelectorAll(".sec"),function(sec){var h2=sec.querySelector("h2[id]");if(!h2)return;
          var txt=h2.textContent.replace(/^[●\s]+/,""),body=(sec.querySelector(".main")||sec).textContent.replace(/\s+/g," ");
          out.push({k:"Section",t:txt,s:c.label+" · "+c.title,href:c.file+"#"+h2.id,w:2,body:body.toLowerCase()});
          Array.prototype.forEach.call(sec.querySelectorAll(".term"),function(tm){var b=tm.querySelector("b");if(!b)return;
            out.push({k:"Term",t:b.textContent,s:tm.textContent.replace(b.textContent,"").trim(),href:c.file+"#"+h2.id,w:2.5,from:c.label})})})});
      IDX=out;return out});
  }
  function esc(s){return String(s).replace(/[&<>"]/g,function(ch){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]})}
  function searchUI(){
    var b=h("button","float-btn search-btn",'<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/></svg>');
    b.type="button";b.setAttribute("aria-label","Search the book (Ctrl+K)");b.title="Search the book (Ctrl+K)";document.body.appendChild(b);
    var dlg=h("dialog","search-dlg");dlg.innerHTML='<div class="sd-head"><input type="search" placeholder="Search a term, topic, chapter… (e.g. FVG, rates, stop)" aria-label="Search"><button type="button" class="cp-x" aria-label="Close">✕</button></div><div class="sd-res" aria-live="polite"></div>';
    document.body.appendChild(dlg);
    var inp=dlg.querySelector("input"),res=dlg.querySelector(".sd-res");
    function hl(s,ws){var o=esc(s);ws.forEach(function(w){if(w.length<2)return;o=o.replace(new RegExp("("+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig"),"<mark>$1</mark>")});return o}
    function run(){var q=inp.value.trim().toLowerCase();if(!IDX){res.innerHTML='<p class="fb">Loading the chapters…</p>';return}
      if(q.length<2){res.innerHTML='<p class="fb">Type at least 2 letters. Tip: <kbd>Ctrl</kbd>+<kbd>K</kbd> opens search from anywhere.</p>';return}
      var ws=q.split(/\s+/),hits=[];
      IDX.forEach(function(e){var hay=(e.t+" "+e.s).toLowerCase(),sc=0;
        if(ws.every(function(w){return hay.indexOf(w)>=0}))sc=e.w+(e.t.toLowerCase().indexOf(q)===0?2:0)+(e.t.toLowerCase().indexOf(q)>=0?1:0);
        else if(e.body&&ws.every(function(w){return e.body.indexOf(w)>=0}))sc=0.5;
        if(sc)hits.push([sc,e])});
      hits.sort(function(a,b){return b[0]-a[0]});hits=hits.slice(0,40);
      res.innerHTML=hits.length?hits.map(function(x){var e=x[1];return '<a class="sd-hit" href="'+e.href+'"><span class="sd-k">'+e.k+(e.from?" · "+e.from:"")+'</span><b>'+hl(e.t,ws)+'</b>'+(e.s?'<span>'+hl(e.s.length>140?e.s.slice(0,140)+"…":e.s,ws)+'</span>':'')+'</a>'}).join(""):'<p class="fb">Nothing found for “'+esc(q)+'”. Try a shorter word or a synonym.</p>'}
    var tmr;inp.addEventListener("input",function(){clearTimeout(tmr);tmr=setTimeout(run,120)});
    inp.addEventListener("keydown",function(e){if(e.key==="Escape"){e.preventDefault();dlg.close();return}if(e.key==="Enter"){var f=res.querySelector(".sd-hit");if(f)location.href=f.getAttribute("href")}});
    dlg.addEventListener("click",function(e){if(e.target===dlg||e.target.closest(".cp-x"))dlg.close();var a=e.target.closest(".sd-hit");if(a)dlg.close()});
    function open(){if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","");inp.focus();run();buildIndex().then(run)}
    b.addEventListener("click",open);
    Array.prototype.forEach.call(document.querySelectorAll("[data-open-search]"),function(x){x.addEventListener("click",function(e){e.preventDefault();open()})});
    document.addEventListener("keydown",function(e){if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();open()}
      else if(e.key==="/"&&!/input|textarea|select/i.test((document.activeElement||{}).tagName||"")){e.preventDefault();open()}});
  }

  /* ---------- streak: days the reader opened the book ---------- */
  function dayKey(d){d=d||new Date();return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
  function streak(){var days=[];try{days=JSON.parse(store("fx-days")||"[]")}catch(e){}
    var t=dayKey();if(days[days.length-1]!==t){days.push(t);days=days.slice(-120);store("fx-days",JSON.stringify(days))}
    var set={},n=0,d=new Date();days.forEach(function(x){set[x]=1});while(set[dayKey(d)]){n++;d.setDate(d.getDate()-1)}
    var best=Math.max(n,+(store("fx-streak-best")||0));store("fx-streak-best",String(best));return {now:n,best:best,total:days.length}}

  /* ---------- achievement badges ---------- */
  function stats(){
    var full=0,perfect=0,parts={};CHAPTERS.forEach(function(c){if(c.part>=7)return;parts[c.part]=parts[c.part]||[0,0];parts[c.part][1]++;
      var d=store("b"+c.id+"-done");if(d&&d.split("/")[0]===d.split("/")[1]&&+d.split("/")[1]>0){full++;parts[c.part][0]++}
      ["qe","qm"].forEach(function(k){var q=store("b"+c.id+"-"+k);if(q&&q.split("/")[0]===q.split("/")[1])perfect++})});
    var known=0;try{known=(JSON.parse(store("bB-known")||"[]")||[]).length}catch(e){}
    var trades=0;try{trades=(JSON.parse(store("bJ-trades")||"[]")||[]).length}catch(e){}
    var ex=[store("bX-qe"),store("bX-qm")],r=0,n=0;if(ex[0]&&ex[1])ex.forEach(function(x){var a=x.split("/");r+=+a[0];n+=+a[1]});
    var partsDone=Object.keys(parts).filter(function(k){return parts[k][0]===parts[k][1]}).length;
    return {full:full,total:CHAPTERS.filter(function(c){return c.part<7}).length,perfect:perfect,known:known,best:+(store("bP-best")||0),game:+(store("bG-best")||0),
      streak:+(store("fx-streak-best")||0),trades:trades,bias:+(store("bJ-bias-n")||0),exam:n?Math.round(r/n*100):0,partsDone:partsDone}}
  var BADGES=[
    ["first","🌱","First step","Complete one chapter's checklist",function(s){return s.full>=1}],
    ["five","📘","Five chapters","Complete 5 chapters",function(s){return s.full>=5}],
    ["part","🧩","A whole part","Complete every chapter in one part",function(s){return s.partsDone>=1}],
    ["half","⚖️","Halfway","Complete half the chapters",function(s){return s.full>=Math.ceil(s.total/2)}],
    ["all","🏁","The whole book","Complete every chapter",function(s){return s.full>=s.total}],
    ["quiz","🎯","Perfect quiz","Finish a quiz without a mistake",function(s){return s.perfect>=1}],
    ["quiz10","💎","10 perfect","10 quizzes without a mistake",function(s){return s.perfect>=10}],
    ["cards","🃏","Glossary 50","Learn 50 flashcards",function(s){return s.known>=50}],
    ["cards2","🧠","Glossary 200","Learn 200 flashcards",function(s){return s.known>=200}],
    ["run5","🔥","Streak 5","5 correct in a row in the Practice Room",function(s){return s.best>=5}],
    ["game","👁","Sharp Eye","200+ points in “Spot the Setup”",function(s){return s.game>=200}],
    ["days3","📅","3 days in a row","Open the book 3 days in a row",function(s){return s.streak>=3}],
    ["days7","🗓","7 days in a row","Open the book 7 days in a row",function(s){return s.streak>=7}],
    ["journal","📒","Journaler","Log 10 trades in the journal",function(s){return s.trades>=10}],
    ["bias","🧭","Bias file","Fill in 4 weekly bias files",function(s){return s.bias>=4}],
    ["exam","🎓","The exam","Final exam with 70%+",function(s){return s.exam>=70}]
  ];
  function earned(){var s=stats();return BADGES.filter(function(b){return b[4](s)}).map(function(b){return b[0]})}
  function toast(html){var t=h("div","fx-toast",html);document.body.appendChild(t);setTimeout(function(){t.classList.add("out")},3800);setTimeout(function(){t.remove()},4400)}
  var bTimer=null;
  function checkBadges(){var seen=[];try{seen=JSON.parse(store("fx-badges")||"null")}catch(e){}var now=earned();
    if(seen===null){store("fx-badges",JSON.stringify(now));return}
    var fresh=now.filter(function(id){return seen.indexOf(id)<0});
    if(fresh.length){store("fx-badges",JSON.stringify(now));fresh.forEach(function(id,i){var b=BADGES.filter(function(x){return x[0]===id})[0];setTimeout(function(){toast('<span class="ft-ic">'+b[1]+'</span><span><span class="label">New badge</span><b>'+b[2]+'</b></span>')},i*900)})}}
  function badgeWatch(){clearTimeout(bTimer);bTimer=setTimeout(checkBadges,400)}
  function badgeShelf(box){var have=earned(),o='<div class="bd-grid">';
    BADGES.forEach(function(b){var on=have.indexOf(b[0])>=0;o+='<div class="bd'+(on?" on":"")+'" title="'+esc(b[3])+'"><span class="bd-ic">'+(on?b[1]:"🔒")+'</span><b>'+b[2]+'</b><span>'+b[3]+'</span></div>'});
    box.innerHTML=o+'</div>';return [have.length,BADGES.length]}

  /* ---------- today card on the cover: streak, term of the day, task of the day ---------- */
  function todayCard(box){
    var st=streak(),seed=+dayKey().replace(/-/g,"");
    box.innerHTML='<div class="td-streak"><span class="td-fire">🔥</span><b>'+st.now+'</b><span>'+(st.now===1?"day":"days")+' in a row</span><small>record '+st.best+'</small></div>'+
      '<div class="td-term"><span class="label">Term of the day</span><button type="button" class="td-flip" aria-expanded="false"><b class="td-t">…</b><span class="td-d" hidden></span><small class="td-hint">tap to see the meaning</small></button></div>'+
      '<div class="td-task"><span class="label">Task of the day</span><a class="chip" href="chP.html#game">👁 Spot the Setup →</a><a class="chip" href="chB.html#sf">🃏 10 flashcards →</a></div>';
    var flip=box.querySelector(".td-flip");
    flip.addEventListener("click",function(){var d=flip.querySelector(".td-d"),o=d.hidden;d.hidden=!o;flip.querySelector(".td-hint").hidden=o;flip.setAttribute("aria-expanded",String(o))});
    fetch("chB.html").then(function(r){return r.text()}).then(function(t){var m=t.match(/window\.GLOSS=(\[[\s\S]*?\]);/);if(!m)return;var g=JSON.parse(m[1]),e=g[seed%g.length];
      flip.querySelector(".td-t").textContent=e[0];var d=flip.querySelector(".td-d");d.textContent=e[1];var a=h("a","td-src","→ Chapter "+e[2]);a.href="ch"+e[2].replace(".","-")+".html";flip.parentNode.appendChild(a)}).catch(function(){});
  }

  /* ---------- certificate of completion ---------- */
  function certificate(btn,name,info){
    var nm=esc(name||"Reader"),dt=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
    var doc='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Certificate · FX Fundamentals</title><style>'+
      '@page{size:A4 landscape;margin:0}body{margin:0;background:#0b1220;font-family:Georgia,serif;color:#0f1b33}'+
      '.c{width:1060px;max-width:96vw;margin:24px auto;background:#fff;border-radius:22px;padding:56px 64px;box-sizing:border-box;position:relative;box-shadow:0 0 0 10px #fff,0 0 0 14px #2563eb,0 0 0 18px #22d3ee,0 0 0 22px #6366f1,0 30px 80px rgba(0,0,0,.5);text-align:center}'+
      '.k{font:600 13px system-ui,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#2563eb}.t{font:800 48px system-ui,sans-serif;margin:10px 0 4px;background:linear-gradient(90deg,#1e3a8a,#2563eb,#22d3ee,#6366f1);-webkit-background-clip:text;background-clip:text;color:transparent}'+
      '.n{font:italic 44px Georgia,serif;margin:28px 0 6px;border-bottom:2px solid #c7d2fe;display:inline-block;padding:0 30px 6px}.p{font-size:18px;line-height:1.6;max-width:720px;margin:14px auto}'+
      '.row{display:flex;justify-content:space-around;margin-top:38px;font:14px system-ui,sans-serif;color:#475569}.row b{display:block;font:700 16px system-ui,sans-serif;color:#0f1b33;margin-bottom:4px}'+
      '.seal{position:absolute;right:48px;top:44px;width:96px;height:96px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#93c5fd,#2563eb 60%,#1e3a8a);color:#fff;display:grid;place-items:center;font:700 34px system-ui;box-shadow:0 0 24px rgba(37,99,235,.5)}'+
      'button{font:600 14px system-ui,sans-serif;background:#2563eb;color:#fff;border:0;border-radius:10px;padding:10px 16px;cursor:pointer;display:block;margin:16px auto}@media print{button{display:none}body{background:#fff}.c{margin:0 auto;box-shadow:0 0 0 6px #2563eb inset}}'+
      '</style></head><body><button onclick="print()">⎙ Print / Save as PDF</button><div class="c"><div class="seal">FX</div><div class="k">Certificate of Completion</div><div class="t">FX Fundamentals</div>'+
      '<div class="n">'+nm+'</div><p class="p">has successfully completed the interactive guide <b>FX Fundamentals</b>: all '+info.total+' chapters with checklists, from market structure and liquidity to central banks, risk and psychology, and the final exam with a score of <b>'+info.exam+'%</b>.</p>'+
      '<div class="row"><div><b>'+dt+'</b>Date</div><div><b>'+esc(info.code||"")+'</b>Code</div><div><b>Kristian Tsvetkov</b>Author</div></div></div></body></html>';
    return saveFile(btn,"FX-Fundamentals-sertifikat.html",doc,"✓ Downloaded. Open it and press Print");
  }

  window.Book={CHAPTERS:CHAPTERS,PARTS:PARTS,LEVELS:LEVELS,store:store,svg:svg,h:h,each:each,progressMap:progressMap,printAll:printAll,icon:icon,CHICON:CHICON,saveFile:saveFile,csvText:csvText,badgeShelf:badgeShelf,todayCard:todayCard,certificate:certificate,stats:stats,streak:streak};
  function init(){
    toTop();clocks();ecal();themeBtn();prefsBtn();searchUI();langBtn();streak();setTimeout(checkBadges,600);flash();var main=document.querySelector("main.book");if(!main)return;
    var id=main.getAttribute("data-ch");
    frame(main);icons(main);if(id){quizzes(id);checks(id)}toggles();tabs();csv();replays();drills();practice();tv();if(id){printSum(main);videoChip(main)}setTimeout(function(){motion(main);highlighter(main,id)},0);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
