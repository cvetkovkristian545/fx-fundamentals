/* FX Fundamentals: optional reader accounts (Firebase Auth + Firestore).
   Progress lives in localStorage as before; when a reader signs in, every
   book key (b..., fx-...) is mirrored to users/{uid} and restored on any device.
   Without a filled-in firebase-config.js this file does nothing. */
(function(){
  var C=window.FX_FIREBASE;if(!C||!C.apiKey)return;
  var BG=(document.documentElement.lang||"").slice(0,2)==="bg";
  var V="10.12.2",BASE="https://www.gstatic.com/firebasejs/"+V+"/";
  var KEY=/^(b|fx-)/,SKIP=/^fx-(sync-|home-y)/;
  var LS=window.localStorage,auth,db,user=null,timer=null,applying=false;
  var T=BG?{
    acct:"Акаунт",title:"Вход / акаунт",signedAs:"Влязъл: ",yours:"Твоят акаунт",inAs:"Влязъл си като",gacc:"Google акаунт",
    saved:"✓ Напредъкът ти се пази в облака",last:" · последно ",tip:"Влез със същия акаунт на телефона или компютъра и продължи оттам, докъдето си стигнал.",
    sync:"Синхронизирай сега",out:"Изход",fine:"Пазим само имейла ти и напредъка в книгата: отметки, куизове, маркери, дневник. Без реклами и без споделяне.",del:"Изтрий акаунта и данните",
    keep:"Запази напредъка си",keepP:"С акаунт отметките, куизовете, маркерите и дневникът ти се пазят и на всяко устройство.",google:"Вход с Google",orEmail:"или с имейл",
    email:"Имейл",pw:"Парола (поне 6 знака)",signin:"Вход",signup:"Нов акаунт",forgot:"Забравена парола",without:"Без акаунт книгата работи както досега, а напредъкът остава само в този браузър.",
    close:"Затвори",needEmail:"Напиши имейла си отгоре.",resetSent:"Изпратихме ти имейл за нова парола.",synced:"Синхронизирано.",
    confirmDel:"Да изтрием ли акаунта и целия запазен напредък? Това не може да се върне.",loadFail:"Не успях да заредя акаунтите. Провери връзката.",locale:"bg-BG",
    err:{"auth/invalid-email":"Невалиден имейл.","auth/missing-password":"Въведи парола.","auth/weak-password":"Паролата трябва да е поне 6 знака.",
      "auth/email-already-in-use":"Вече има акаунт с този имейл. Натисни „Вход“.","auth/invalid-credential":"Грешен имейл или парола.","auth/wrong-password":"Грешен имейл или парола.",
      "auth/user-not-found":"Няма акаунт с този имейл.","auth/too-many-requests":"Твърде много опити. Опитай след малко.","auth/popup-closed-by-user":"Прозорецът за вход беше затворен.",
      "auth/requires-recent-login":"За изтриване излез, влез отново и опитай пак.","auth/network-request-failed":"Няма връзка с интернет.",
      "auth/unauthorized-domain":"Този адрес още не е разрешен във Firebase (Authorized domains)."},oops:"Нещо се обърка"
  }:{
    acct:"Account",title:"Sign in / account",signedAs:"Signed in: ",yours:"Your account",inAs:"You're signed in as",gacc:"Google account",
    saved:"✓ Your progress is saved in the cloud",last:" · last at ",tip:"Sign in with the same account on your phone or computer and carry on where you left off.",
    sync:"Sync now",out:"Sign out",fine:"We store only your email and your progress in the book: ticks, quizzes, marks, journal. No ads, no sharing.",del:"Delete account and data",
    keep:"Save your progress",keepP:"With an account, your ticks, quizzes, marks and journal are kept on every device.",google:"Sign in with Google",orEmail:"or with email",
    email:"Email",pw:"Password (at least 6 characters)",signin:"Sign in",signup:"Create account",forgot:"Forgot password",without:"Without an account the book works as before, and your progress stays in this browser only.",
    close:"Close",needEmail:"Type your email above first.",resetSent:"We've sent you an email to reset your password.",synced:"Synced.",
    confirmDel:"Delete your account and all saved progress? This can't be undone.",loadFail:"Couldn't load accounts. Check your connection.",locale:"en-GB",
    err:{"auth/invalid-email":"That email doesn't look right.","auth/missing-password":"Enter a password.","auth/weak-password":"The password needs at least 6 characters.",
      "auth/email-already-in-use":"There's already an account with this email. Press Sign in.","auth/invalid-credential":"Wrong email or password.","auth/wrong-password":"Wrong email or password.",
      "auth/user-not-found":"No account with this email.","auth/too-many-requests":"Too many attempts. Try again in a moment.","auth/popup-closed-by-user":"The sign-in window was closed.",
      "auth/requires-recent-login":"To delete, sign out, sign in again and retry.","auth/network-request-failed":"No internet connection.",
      "auth/unauthorized-domain":"This address isn't allowed in Firebase yet (Authorized domains)."},oops:"Something went wrong"
  };

  function load(f){return new Promise(function(ok,no){var s=document.createElement("script");s.src=BASE+f;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
  function sdk(){if(window.firebase&&firebase.firestore)return Promise.resolve();
    return load("firebase-app-compat.js").then(function(){return Promise.all([load("firebase-auth-compat.js"),load("firebase-firestore-compat.js")])})}
  function mine(k){return KEY.test(k)&&!SKIP.test(k)}
  function snapshot(){var o={};try{for(var i=0;i<LS.length;i++){var k=LS.key(i);if(mine(k))o[k]=LS.getItem(k)}}catch(e){}return o}
  function meta(k,v){try{if(v===undefined)return LS.getItem("fx-sync-"+k);LS.setItem("fx-sync-"+k,v)}catch(e){}}

  /* mirror every book write to the cloud, debounced */
  var set0=Storage.prototype.setItem,rm0=Storage.prototype.removeItem;
  function touched(store,k){if(applying||!user||store!==LS||!mine(k))return;meta("dirty","1");clearTimeout(timer);timer=setTimeout(push,1500)}
  Storage.prototype.setItem=function(k,v){set0.call(this,k,v);touched(this,k)};
  Storage.prototype.removeItem=function(k){rm0.call(this,k);touched(this,k)};

  function ref(){return db.collection("users").doc(user.uid)}
  function push(){if(!user)return Promise.resolve();var now=Date.now();
    return ref().set({data:snapshot(),updated:now,email:user.email||""}).then(function(){meta("at",String(now));meta("dirty","0");paint()}).catch(function(e){console.warn("sync",e)})}
  function apply(data){var changed=false;applying=true;
    try{Object.keys(data).forEach(function(k){if(mine(k)&&LS.getItem(k)!==data[k]){LS.setItem(k,data[k]);changed=true}})}catch(e){}
    applying=false;return changed}
  function pull(){
    return ref().get().then(function(d){
      var r=d.exists?d.data():null;
      if(meta("uid")!==user.uid){
        /* first sign-in on this device: keep local-only progress, the cloud wins where both have a value */
        var changed=r&&r.data?apply(r.data):false;meta("uid",user.uid);return push().then(function(){return changed});
      }
      if(r&&r.updated>(+meta("at")||0)&&meta("dirty")!=="1"){var ch=apply(r.data||{});meta("at",String(r.updated));return ch}
      if(meta("dirty")==="1"||!r)return push().then(function(){return false});
      return false;
    }).then(function(changed){
      /* reload once so the page redraws with the restored progress */
      var k="fx-sync-reloaded";if(changed&&!sessionStorage.getItem(k)){sessionStorage.setItem(k,"1");location.reload()}else sessionStorage.removeItem(k)})
      .catch(function(e){console.warn("sync",e)});
  }
  function signOutClear(){
    return push().then(function(){applying=true;
      try{Object.keys(snapshot()).forEach(function(k){if(k!=="fx-theme")LS.removeItem(k)})}catch(e){}
      applying=false;meta("uid","");meta("at","0");meta("dirty","0");return auth.signOut()}).then(function(){location.reload()});
  }

  /* UI: a floating account button in the same stack as BG/search/Aa, plus a dialog */
  var css='.acct-btn{bottom:222px}.acct-btn.on{border-color:var(--bull)!important;box-shadow:0 0 0 2px var(--bull),0 2px 10px rgba(0,0,0,.18)}'+
    '.acct-dlg{border:1px solid var(--line);border-radius:var(--r,14px);background:var(--paper);color:var(--fg);padding:22px;width:min(92vw,380px);font-family:var(--f-body)}'+
    '.acct-dlg::backdrop{background:rgba(10,14,20,.55)}.acct-dlg h2{margin:0 0 6px;font-family:var(--f-display)}.acct-dlg p{margin:.4em 0;font-size:.92rem}'+
    '.acct-dlg input{width:100%;box-sizing:border-box;margin:6px 0;padding:10px 12px;border:1px solid var(--line);border-radius:var(--r-s,10px);background:var(--bg);color:var(--fg);font:inherit}'+
    '.acct-dlg .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.acct-dlg button{font:600 .9rem var(--f-mono);padding:10px 14px;border-radius:var(--r-s,10px);border:1px solid var(--line);background:var(--bg);color:var(--fg);cursor:pointer}'+
    '.acct-dlg button.pri{background:#2563eb;color:#fff;border-color:#2563eb}.acct-dlg .g{width:100%}.acct-dlg .msg{min-height:1.2em;color:var(--bear,#c0392b);font-size:.85rem}'+
    '.acct-dlg .ok{color:var(--bull)}.acct-dlg .fine{font-size:.78rem;opacity:.75}.acct-dlg .x{position:absolute;right:12px;top:10px;border:0;background:none;font-size:1.2rem}'+
    '@media print{.acct-btn{display:none!important}}';
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  var ICON='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>';
  var btn=document.createElement("button");btn.className="float-btn acct-btn";btn.type="button";btn.innerHTML=ICON;btn.setAttribute("aria-label",T.acct);document.body.appendChild(btn);
  var dlg=document.createElement("dialog");dlg.className="acct-dlg";document.body.appendChild(dlg);
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function errText(e){var c=(e&&e.code)||"";return T.err[c]||T.oops+" ("+(c||"error")+")."}
  function paint(){
    btn.classList.toggle("on",!!user);btn.title=user?T.signedAs+(user.email||T.gacc):T.title;
    if(!dlg.open)return;
    if(user){var at=+meta("at")||0;
      dlg.innerHTML='<button class="x" type="button" aria-label="'+T.close+'">✕</button><h2>'+T.yours+'</h2><p>'+T.inAs+' <b>'+esc(user.email||T.gacc)+'</b>.</p>'+
        '<p class="ok">'+T.saved+(at?T.last+new Date(at).toLocaleTimeString(T.locale,{hour:"2-digit",minute:"2-digit"}):"")+'.</p><p>'+T.tip+'</p>'+
        '<div class="row"><button type="button" data-a="sync">'+T.sync+'</button><button type="button" data-a="out" class="pri">'+T.out+'</button></div>'+
        '<p class="msg"></p><p class="fine">'+T.fine+' <a href="#" data-a="del">'+T.del+'</a></p>';
    }else{
      dlg.innerHTML='<button class="x" type="button" aria-label="'+T.close+'">✕</button><h2>'+T.keep+'</h2><p>'+T.keepP+'</p>'+
        '<button type="button" class="g pri" data-a="google">'+T.google+'</button><p class="fine" style="text-align:center">'+T.orEmail+'</p>'+
        '<input type="email" autocomplete="email" placeholder="'+T.email+'" id="acEm"><input type="password" autocomplete="current-password" placeholder="'+T.pw+'" id="acPw">'+
        '<div class="row"><button type="button" class="pri" data-a="in">'+T.signin+'</button><button type="button" data-a="up">'+T.signup+'</button><button type="button" data-a="reset">'+T.forgot+'</button></div>'+
        '<p class="msg"></p><p class="fine">'+T.without+'</p>';
    }
  }
  function msg(t,ok){var m=dlg.querySelector(".msg");if(m){m.textContent=t;m.className="msg"+(ok?" ok":"")}}
  dlg.addEventListener("click",function(e){
    var a=e.target.closest("[data-a]"),x=e.target.closest(".x");if(x){dlg.close();return}if(!a)return;e.preventDefault();
    var act=a.getAttribute("data-a"),em=(dlg.querySelector("#acEm")||{}).value,pw=(dlg.querySelector("#acPw")||{}).value;
    var go={
      google:function(){var p=new firebase.auth.GoogleAuthProvider();return auth.signInWithPopup(p).catch(function(err){if(err&&err.code==="auth/popup-blocked"){meta("redirect","1");return auth.signInWithRedirect(p)}throw err})},
      "in":function(){return auth.signInWithEmailAndPassword((em||"").trim(),pw||"")},
      up:function(){return auth.createUserWithEmailAndPassword((em||"").trim(),pw||"")},
      reset:function(){if(!em){msg(T.needEmail);return Promise.resolve()}return auth.sendPasswordResetEmail(em.trim()).then(function(){msg(T.resetSent,true)})},
      sync:function(){return push().then(function(){msg(T.synced,true)})},
      out:function(){return signOutClear()},
      del:function(){if(!confirm(T.confirmDel))return Promise.resolve();
        var u=user;return ref().delete().then(function(){return u.delete()}).then(function(){meta("uid","");meta("at","0");location.reload()})}
    }[act];
    if(go)go().catch(function(err){msg(errText(err))});
  });
  btn.addEventListener("click",function(){if(!auth){btn.disabled=true;start().then(function(){btn.disabled=false;open()},function(){btn.disabled=false;alert(T.loadFail)});return}open()});
  function open(){if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","");paint()}

  var started=null;
  function start(){if(started)return started;
    started=sdk().then(function(){
      if(!firebase.apps.length)firebase.initializeApp(C);auth=firebase.auth();db=firebase.firestore();auth.languageCode=BG?"bg":"en";
      return new Promise(function(ok){auth.onAuthStateChanged(function(u){var was=user;user=u;paint();
        if(u&&(!was||was.uid!==u.uid))pull();ok()})});
    });started.catch(function(){started=null});return started}
  /* load the SDK right away only for readers who signed in before (or are returning from a Google redirect) */
  if(meta("uid")||meta("redirect")==="1"){meta("redirect","0");start().catch(function(){})}
  else paint();
  window.addEventListener("pagehide",function(){if(user&&meta("dirty")==="1")push()});
})();
