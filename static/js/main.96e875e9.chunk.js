(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{116:function(e,t,n){e.exports=n.p+"static/media/default-artwork.6bba9800.png"},350:function(e,t){e.exports={transformUrl:function(e){var t=e.replace(/^.*\/track\//,"spotify:track:");return t.match(/spotify:track/g)?t:null}}},391:function(e,t,n){e.exports=n(723)},438:function(e,t){},578:function(e,t,n){},633:function(e,t,n){},649:function(e,t,n){},651:function(e,t,n){},652:function(e,t,n){},699:function(e,t,n){},700:function(e,t,n){},721:function(e,t,n){},722:function(e,t,n){},723:function(e,t,n){"use strict";n.r(t);var a={};n.r(a),n.d(a,"updateToken",(function(){return H})),n.d(a,"clearToken",(function(){return Q})),n.d(a,"addNewTrack",(function(){return X})),n.d(a,"addCurrentTrack",(function(){return W})),n.d(a,"syncSocialData",(function(){return Z})),n.d(a,"addTrackList",(function(){return $})),n.d(a,"removeFromTracklist",(function(){return ee})),n.d(a,"updateProgressTimer",(function(){return te})),n.d(a,"wsConnect",(function(){return ne})),n.d(a,"wsConnecting",(function(){return ae})),n.d(a,"wsConnected",(function(){return re})),n.d(a,"wsDisconnect",(function(){return ce})),n.d(a,"wsDisconnected",(function(){return ie})),n.d(a,"mopidyConnected",(function(){return oe})),n.d(a,"mopidyDisconnected",(function(){return le})),n.d(a,"getCurrentTrack",(function(){return ue})),n.d(a,"getTimePosition",(function(){return se})),n.d(a,"getState",(function(){return me})),n.d(a,"getTrackList",(function(){return de})),n.d(a,"clearTrackList",(function(){return fe})),n.d(a,"startPlaying",(function(){return Ee})),n.d(a,"stopPlaying",(function(){return be})),n.d(a,"pausePlaying",(function(){return ke})),n.d(a,"nextPlaying",(function(){return pe})),n.d(a,"previousPlaying",(function(){return Ce})),n.d(a,"getVolume",(function(){return ve})),n.d(a,"updateVolume",(function(){return ge})),n.d(a,"updatePlaybackState",(function(){return he})),n.d(a,"setVolume",(function(){return ye}));var r=n(0),c=n.n(r),i=n(22),o=n.n(i),l=n(23),u=n(50),s=n(115),m=n.n(s),d=n(348),f=n(158),E=n(159),b=n(169),k=n(160),p=n(171),C=function(e){function t(e){var n;return Object(f.a)(this,t),(n=Object(b.a)(this,Object(k.a)(t).call(this,e))).state={hasError:!1},n}return Object(p.a)(t,e),Object(E.a)(t,[{key:"componentDidCatch",value:function(e,t){this.setState({hasError:!0})}},{key:"render",value:function(){return this.state.hasError?c.a.createElement("h1",null,"Ouch! I broke a bit."):this.props.children}}]),t}(c.a.Component),v=C,g=c.a.createContext(),h=g,y=n(349),O=n.n(y),N="playback.getCurrentTrack",T="event:trackPlaybackStarted",S="event:playbackStateChanged",D="event:trackPlaybackResumed",j="tracklist.getTracks",A="tracklist.add",_="tracklist.remove",P="tracklist.clear",R="playback.getTimePosition",w="playback.getState",I="playback.play",x="playback.stop",U="playback.pause",L="playback.next",M="playback.previous",V="playing",z="paused",B="stopped",K="mixer.setVolume",Y="mixer.getVolume",q="event:volumeChanged",F="validationError",G={ADD_CURRENT_TRACK:"actionAddCurrentTrack",ADD_TRACKS:"actionAddTracks",CONNECT:"actionConnect",CONNECTING:"actionConnecting",CONNECTED:"actionConnected",DISCONNECT:"actionDisconnect",DISCONNECTED:"actionDisconnected",DROP_TYPES:["__NATIVE_URL__"],SEND:"actionSend",STORE_TOKEN:"actionStoreToken",CLEAR_STORE_TOKEN:"actionClearStoreToken",UPDATE_VOLUME:"actionUpdateVolume",UPDATE_PLAYBACK_STATE:"actionPlaybackState",UPDATE_PROGRESS_TIMER:"actionUpdateProgressTimer",MOPIDY_CONNECTED:"actionMopidyConnected",MOPIDY_DISCONNECTED:"actionMopidyDisconnected",SYNC_SOCIAL_DATA:"syncSocialData"},J=n(350),H=function(e){return{type:G.STORE_TOKEN,token:e}},Q=function(){return{type:G.CLEAR_STORE_TOKEN}},X=function(e){var t=Object(J.transformUrl)(e);return{type:G.SEND,key:A,params:{uris:[t]}}},W=function(e){return{type:G.ADD_CURRENT_TRACK,track:e}},Z=function(e){return{type:G.SYNC_SOCIAL_DATA,track:e}},$=function(e){return{type:G.ADD_TRACKS,list:e}},ee=function(e){return{type:G.SEND,key:_,params:{criteria:{uri:[e]}}}},te=function(e,t){return t===1/0&&(t=0),{type:G.UPDATE_PROGRESS_TIMER,position:e,duration:t}},ne=function(){return{type:G.CONNECT}},ae=function(){return{type:G.CONNECTING}},re=function(){return{type:G.CONNECTED}},ce=function(){return{type:G.DISCONNECT}},ie=function(){return{type:G.DISCONNECTED}},oe=function(){return{type:G.MOPIDY_CONNECTED}},le=function(){return{type:G.MOPIDY_DISCONNECTED}},ue=function(){return{type:G.SEND,key:N}},se=function(){return{type:G.SEND,key:R}},me=function(){return{type:G.SEND,key:w}},de=function(){return{type:G.SEND,key:j}},fe=function(){return{type:G.SEND,key:P}},Ee=function(){return{type:G.SEND,key:I}},be=function(){return{type:G.SEND,key:x}},ke=function(){return{type:G.SEND,key:U}},pe=function(){return{type:G.SEND,key:L}},Ce=function(){return{type:G.SEND,key:M}},ve=function(){return{type:G.SEND,key:Y}},ge=function(e){return{type:G.UPDATE_VOLUME,volume:e}},he=function(e){return{type:G.UPDATE_PLAYBACK_STATE,state:e}},ye=function(e){return{type:G.SEND,key:K,params:[Number(e)]}},Oe="actionVote",Ne="castVote",Te="voteCasted",Se="actionTrackSearch",De="searchGetTracks",je="actionStoreSearchResults",Ae="actionStoreSearchQuery",_e="actionToggleSearchSidebar",Pe="actionRemoveFromSearchResults",Re=n(351),we=n.n(Re),Ie=function(e){var t=Math.floor(e/6e4),n=(e%6e4/1e3).toFixed(0);return t+":"+(n<10?"0":"")+n},xe=function(e){return.001*e},Ue=function(e){return{type:_e,open:e}},Le=function(e){return{type:Ae,query:e}},Me=function(e,t){return{type:Se,key:De,params:{query:e,options:t}}},Ve="authenticationTokenInvalid",ze={decode:function(e){return JSON.parse(e)},encodeToJson:function(e,t,n){return JSON.stringify({jwt:e,key:t,data:n})}},Be={success:function(e){return s.notify.show(e,"success",3e3,{})},warning:function(e){return s.notify.show(e,"warning",3e3,{})}},Ke=function(e,t){e.dispatch(he(t))},Ye=function(e,t,n){var a=ze.decode(t),r=a.key,c=a.data;switch(r){case Ve:console.error("AUTHENTICATION_TOKEN_INVALID: ".concat(c.error)),e.dispatch(Q());break;case N:case T:c&&c.track&&function(e,t,n){t.dispatch(W(e)),t.dispatch(Z(e));var a=n.set(0,e.length);t.getState().jukebox.playbackState===V&&a.start()}(c.track,e,n);break;case S:case w:!function(e,t,n){switch(t){case z:case B:Ke(e,t),n.stop(),Be.success("Jukebox Halted");break;case V:Ke(e,t),n.start()}}(e,c,n);break;case j:!function(e,t){t.dispatch($(e))}(c,e);break;case A:var i=c.track;Be.success("Adding: ".concat(i.name," / ").concat(i.album.name," by ").concat(i.artist.name));break;case L:case M:e.dispatch(ue());break;case Y:e.dispatch(ge(c));break;case q:e.dispatch(ge(c)),Be.success("Volume Changed");break;case R:n.set(c);break;case De:e.dispatch({type:je,results:c});break;case Te:c&&e.dispatch(Z(c));break;case F:Be.warning(c);break;case D:n.set(c)}},qe={loadInitial:function(e){["getCurrentTrack","getState","getTrackList","getVolume","getTimePosition"].forEach((function(t){e.dispatch(a[t]())}))}},Fe=function(){var e="http://".concat("jukebox-api-prod.local",":").concat("8080"),t=null,n=null;return function(r){return function(c){return function(i){var o=function(){return ze.encodeToJson(r.getState().settings.token,i.key,i.params)},l=function(e){if(JSON.parse(e).online)return r.dispatch(oe()),qe.loadInitial(r);r.dispatch(le())},u=function(e){n=function(e,t){return we()({callback:function(n,a){e.dispatch(t.updateProgressTimer(n,a))},fallbackTargetFrameRate:1,disableRequestAnimationFrame:!0})}(r,a),r.dispatch(re())},s=function(e){return r.dispatch(ce())},m=function(e){return Ye(r,e,n)},d=function(e){return Ye(r,e,n)},f=function(e){return Ye(r,e,n)};switch(i.type){case G.CONNECT:return null!=t&&t.close(),(t=O()(e,{transports:["websocket"]})).on("vote",f),t.on("search",d),t.on("mopidy",l),t.on("message",m),t.on("connect",u),t.on("disconnect",s),void r.dispatch(ae());case G.DISCONNECT:return n&&n.reset(),void r.dispatch(ie());case G.SEND:return t.emit("message",o());case Se:return t.emit("search",o());case Oe:return t.emit("vote",o());default:return c(i)}}}}}(),Ge=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case G.ADD_CURRENT_TRACK:return t.track;case G.SYNC_SOCIAL_DATA:return Object.assign({},e,{addedBy:t.track.addedBy,metrics:t.track.metrics});default:return e}},Je=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(t.type){case G.ADD_TRACKS:return t.list.map((function(e){return e.track}));case G.SYNC_SOCIAL_DATA:return e.map((function(e){return e.uri===t.track.uri?Object.assign({},e,{addedBy:t.track.addedBy,metrics:t.track.metrics}):e}));default:return e}},He={position:0,duration:0,remaining:0},Qe=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:He,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case G.UPDATE_PROGRESS_TIMER:return{position:t.position,duration:t.duration,remaining:t.duration-t.position};default:return e}},Xe={online:!1,mopidyOnline:!1,volume:0,playbackState:B},We=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Xe,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case G.CONNECTED:return Object.assign({},e,{online:!0});case G.DISCONNECTED:return Object.assign({},e,{online:!1});case G.MOPIDY_CONNECTED:return Object.assign({},e,{mopidyOnline:!0});case G.MOPIDY_DISCONNECTED:return Object.assign({},e,{mopidyOnline:!1});case G.UPDATE_VOLUME:return Object.assign({},e,{volume:t.volume});case G.UPDATE_PLAYBACK_STATE:return Object.assign({},e,{playbackState:t.state});default:return e}},Ze={token:null},$e=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Ze,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case G.STORE_TOKEN:return t.token===e.token?e:Object.assign({},e,{token:t.token});case G.CLEAR_STORE_TOKEN:return Object.assign({},e,{token:null});default:return e}},et=n(381),tt={searchSideBarOpen:!1,query:"",limit:20,offset:0,total:0,results:[]},nt=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:tt,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case Pe:return Object(et.a)({},e,{results:e.results.filter((function(e){return e.track.uri!==t.uri}))});case _e:return Object.assign({},e,{searchSideBarOpen:t.open});case Ae:return Object.assign({},e,{query:t.query});case je:var n=t.results.tracks;return Object.assign({},e,{limit:n.limit,offset:n.offset,total:n.total>1e4?1e4:n.total,results:n.items});default:return e}},at=Object(u.combineReducers)({track:Ge,tracklist:Je,timer:Qe,jukebox:We,settings:$e,search:nt}),rt=n(737),ct=n(91),it=n(161),ot=n.n(it),lt=n(234),ut={refresh:function(e,t){return lt.b((function(){e.reloadAuthResponse().then((function(e){return console.info("Token refreshed OK"),t(e.id_token)}),(function(e){return console.warn("Token un-refreshable: ",e.message)}))}),27e5)},clear:function(e){e&&lt.a(e)}},st=n(749),mt=n(736),dt=n(750),ft=n(751),Et=n(748),bt=n(62),kt=function(e){return c.a.createElement(Et.a,{onClick:e.onClick,animated:"vertical",className:"jb-previous-button",disabled:e.disabled},c.a.createElement(Et.a.Content,{hidden:!0},"Prev"),c.a.createElement(Et.a.Content,{visible:!0},c.a.createElement(bt.a,{name:"step backward"})))},pt=function(e){return c.a.createElement(Et.a,{onClick:e.onClick,animated:"vertical",className:"jb-next-button",disabled:e.disabled},c.a.createElement(Et.a.Content,{hidden:!0},"Next"),c.a.createElement(Et.a.Content,{visible:!0},c.a.createElement(bt.a,{name:"step forward"})))},Ct=function(e){var t=e.disabled,n=e.onPrevious,a=e.onNext;return c.a.createElement(c.a.Fragment,null,c.a.createElement(kt,{onClick:n,disabled:t}),c.a.createElement(pt,{onClick:a,disabled:t}))},vt=function(e){return c.a.createElement(Et.a,{onClick:e.onClick,animated:"vertical",disabled:e.state===V||e.disabled,active:e.state===V,className:"jb-play-button"},c.a.createElement(Et.a.Content,{hidden:!0},"Play"),c.a.createElement(Et.a.Content,{visible:!0},c.a.createElement(bt.a,{name:"play"})))},gt=function(e){return c.a.createElement(Et.a,{onClick:e.onClick,animated:"vertical",disabled:e.state===z||e.state===B||e.disabled,active:e.state===z,className:"jb-pause-button"},c.a.createElement(Et.a.Content,{hidden:!0},"Pause"),c.a.createElement(Et.a.Content,{visible:!0},c.a.createElement(bt.a,{name:"pause"})))},ht=function(e){return c.a.createElement(Et.a,{onClick:e.onClick,animated:"vertical",disabled:e.state===B||e.disabled,active:e.state===B,className:"jb-stop-button"},c.a.createElement(Et.a.Content,{hidden:!0},"Stop"),c.a.createElement(Et.a.Content,{visible:!0},c.a.createElement(bt.a,{name:"stop"})))},yt=function(e){var t=Object(l.c)((function(e){return e.jukebox})),n=e.disabled,a=e.onPlay,r=e.onPause,i=e.onStop,o=e.onPrevious,u=e.onNext;return c.a.createElement("span",null,c.a.createElement(Ct,{disabled:n,onPrevious:o,onNext:u}),c.a.createElement(vt,{onClick:a,state:t.playbackState,disabled:n}),c.a.createElement(gt,{onClick:r,state:t.playbackState,disabled:n}),c.a.createElement(ht,{onClick:i,state:t.playbackState,disabled:n}))},Ot=(n(578),function(e){function t(){return Object(f.a)(this,t),Object(b.a)(this,Object(k.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(E.a)(t,[{key:"render",value:function(){var e=this.props,t=e.connectDropTarget,n=e.isOver;return t(c.a.createElement("div",null,n?c.a.createElement("div",{className:"drag-is-over"},c.a.createElement("p",null,"Drop da track")):null,this.props.children))}}]),t}(r.Component)),Nt=Object(ct.DropTarget)((function(e){return e.accepts}),{drop:function(e,t){e.onDrop&&e.onDrop(e,t)}},(function(e,t){return{connectDropTarget:e.dropTarget(),isOver:t.isOver()}}))(Ot),Tt=function(e){var t=e.disabled,n=e.onDrop,a=e.children;return t?a:c.a.createElement(ct.DragDropContextProvider,{backend:ot.a},c.a.createElement(Nt,{accepts:G.DROP_TYPES,onDrop:n},a))},St=n(745),Dt=n(382),jt=n(170),At=n(379),_t=n(744),Pt=n(743),Rt=n(165),wt=n.n(Rt),It=(n(633),function(e){return c.a.createElement(_t.a,{className:"added-by-list"},e.map((function(e,t){var n=e.user?e.user.fullname:"User unknown";return c.a.createElement(_t.a.Item,{key:t},xt(e),c.a.createElement(_t.a.Content,null,c.a.createElement(_t.a.Description,null,c.a.createElement("strong",null,wt()(e.addedAt,"dd mmm yyyy @ h:MM tt"))," - ",n)))})))}),xt=function(e){return e&&e.user&&e.user.picture?c.a.createElement(Dt.a,{avatar:!0,className:"added_by_avatar_image",src:e.user.picture}):c.a.createElement(bt.a,{name:"user"})},Ut=function(e){var t=e.users,n=void 0===t?[]:t,a=xt(n[0]);return n.length?c.a.createElement(Pt.a,{wide:!0,content:It(n),trigger:a}):a},Lt=(n(649),function(e){return Math.round(e/10-5)}),Mt=function(e){return c.a.createElement(_t.a,null,e.votes.map((function(e,t){var n=e.user?e.user.fullname:"User unknown",a=c.a.createElement(jt.a,{circular:!0,size:"mini"},Lt(e.vote));return c.a.createElement(_t.a.Item,{key:t},Vt(e),c.a.createElement(_t.a.Content,null,c.a.createElement(_t.a.Description,null,c.a.createElement("strong",null,wt()(e.at,"dd mmm yyyy @ h:MM tt"))," - ",n," ",a)))})))},Vt=function(e){return e&&e.user&&e.user.picture?c.a.createElement(Dt.a,{avatar:!0,className:"voted_by_avatar_image",src:e.user.picture}):null},zt=function(e){var t=!0,n="grey",a="thumbs up",r=Lt(e.total);return r<0&&(a="thumbs down"),r>4&&(n="green",t=!1),r<-4&&(n="red",t=!1),c.a.createElement(jt.a,{className:"track-label vote-track-label",size:e.size||"tiny",color:n,basic:t,icon:a,content:r,ribbon:e.ribbon?"right":null})},Bt=function(e){var t=e.votes?e.votes.length:0;return e.show?t<1?zt(e):c.a.createElement(Pt.a,{wide:"very",content:Mt(e),trigger:zt(e)}):null},Kt=n(380),Yt=function(){var e=Object(l.c)((function(e){return e.timer})),t=Object(l.c)((function(e){return e.track})),n=function(e){if(0===e.duration)return 0;var t=xe(e.position),n=xe(e.duration),a=Math.round(t/n*100);return isNaN(a)?0:a}(e);return c.a.createElement("div",{className:"progress-container"},c.a.createElement("span",{className:"remaining-text"},Ie(e.remaining)),c.a.createElement("span",{className:"track-length"},Ie(t.length)),c.a.createElement(Kt.a,{percent:n}))},qt=n(116),Ft=n.n(qt),Gt=n(232),Jt=(n(650),n(651),{0:{style:{color:"red"},label:c.a.createElement(bt.a,{name:"thumbs down",color:"red"})},50:c.a.createElement(bt.a,{name:"handshake"}),100:{style:{color:"green"},label:c.a.createElement(bt.a,{name:"thumbs up",color:"green"})}}),Ht=function(e){var t=e.split(":").pop();return"https://open.spotify.com/track/".concat(t)},Qt=function(e){var t=" (".concat(e.album.year,")");return c.a.createElement(St.a.Description,null,e.album.name,t)},Xt=function(e){var t=e.map((function(e){return e.vote}));return t.length<1?0:Object(Gt.mean)(Object(Gt.flatten)(t))},Wt=function(e){return e>50?"#21ba45":e<50?"red":"gray"},Zt=function(e){return e.metrics?c.a.createElement(Bt,{total:e.metrics.votesAverage,show:e.metrics.votes>0,ribbon:!0}):null},$t=function(e){return c.a.createElement(jt.a,{size:"mini"},"Added",c.a.createElement(jt.a.Detail,null,e.count))},en=function(e){return e.metrics?c.a.createElement(jt.a,{size:"mini"},"Played",c.a.createElement(jt.a.Detail,null,e.metrics.plays)):null},tn=function(e){return e.metrics?c.a.createElement(jt.a,{size:"mini"},"Activity",c.a.createElement(jt.a.Detail,null,e.metrics.votes)):null},nn=function(e){var t=e.track,n=e.onVote,a=e.userID;if(!t)return c.a.createElement(St.a,null,c.a.createElement(Dt.a,{src:Ft.a}),c.a.createElement(St.a.Content,null,c.a.createElement(St.a.Header,null,"Nothing playing"),c.a.createElement(St.a.Description,null,"Drag some music here or press play.")));var r,i=t.addedBy,o=void 0===i?[]:i,l=o[0]&&o[0].votes||[],u=l.find((function(e){return e.user._id===a})),s=u?u.vote:null;return c.a.createElement(St.a,null,c.a.createElement(Dt.a,{src:t.image||Ft.a,label:c.a.createElement(Zt,{metrics:t.metrics})}),c.a.createElement(St.a.Content,null,c.a.createElement(Yt,null),c.a.createElement(St.a.Header,null,t.name),c.a.createElement(St.a.Meta,null,t.artist.name),c.a.createElement(Qt,{album:t.album})),c.a.createElement(St.a.Content,{extra:!0},c.a.createElement("div",{className:"track-rating-container"},c.a.createElement(At.a,{disabled:!a,dots:!0,value:s,included:!1,marks:Jt,step:10,onChange:(r=t.uri,function(e){return n(r,e/10)}),handleStyle:{borderColor:Wt(s),backgroundColor:Wt(s)}}))),c.a.createElement(St.a.Content,{extra:!0},c.a.createElement($t,{count:o.length}),c.a.createElement(en,{metrics:t.metrics}),c.a.createElement(tn,{metrics:t.metrics}),c.a.createElement(Bt,{size:"mini",show:l.length>0,total:Xt(l),votes:l})),c.a.createElement(St.a.Content,{extra:!0},c.a.createElement(Ut,{users:t.addedBy}),c.a.createElement("a",{className:"track-uri",href:Ht(t.uri),target:"_blank",rel:"noopener noreferrer"},t.uri)))},an=function(){var e=Object(r.useContext)(h).googleUser,t=Object(l.c)((function(e){return e.track})),n=Object(l.b)();return c.a.createElement(nn,{userID:e&&e.googleId,track:t,onVote:function(e,t){return n(function(e,t){return{type:Oe,key:Ne,params:{uri:e,vote:t}}}(e,t))}})},rn=(n(652),function(){var e=Object(r.useContext)(h),t=e.googleUser,n=e.signIn,a=e.signOut,i=c.a.createElement(Et.a,{icon:"power off",floated:"right",onClick:function(){return n()},className:"jb-settings-toggle",title:"Login using Google"});return t&&t.profileObj&&(i=c.a.createElement(Dt.a,{rounded:!0,size:"mini",floated:"right",title:t.profileObj.name,src:t.profileObj.imageUrl,onClick:function(){return a()}})),c.a.createElement(c.a.Fragment,null,i)}),cn=n(4),on=n.n(cn),ln=n(741),un=n(742),sn=n(168),mn=n(739),dn=function(e){var t=c.a.useState(!1),n=Object(sn.a)(t,2),a=n[0],r=n[1];return c.a.createElement(c.a.Fragment,null,c.a.createElement(ln.a.Action,{className:"remove-track",onClick:function(){return r(!0)}},"Remove"),c.a.createElement(mn.a,{content:"Are you sure you want to remove: ".concat(e.name),cancelButton:"No thanks",confirmButton:"Do it!",open:a,onCancel:function(){return r(!1)},onConfirm:function(t){e.onClick(t),r(!1)}}))},fn=(n(699),function(e){return c.a.createElement(ln.a.Avatar,{className:e.isCurrent?"current-image":null,src:e.src})}),En=function(e){var t=e.image?e.image:Ft.a;return c.a.createElement(fn,{src:t,isCurrent:e.isCurrent})},bn=function(e){return c.a.createElement(ln.a.Author,null,e.name)},kn=function(e){return c.a.createElement(ln.a.Text,null,c.a.createElement(un.a,{as:"a",className:"track-search-link",onClick:e.onClick},e.artistName)," ",c.a.createElement("small",null,"(",Ie(e.trackLength),")"))},pn=function(e){if(!e.metrics)return null;var t=e.metrics.votes>0;return t?c.a.createElement(ln.a.Action,{as:"span"},c.a.createElement(Bt,{total:e.metrics.votesAverage,show:t})):null},Cn=function(e){if(e.isCurrent||e.disabled)return null;var t,n;return c.a.createElement(dn,{uri:e.uri,name:e.name,onClick:(t=e.uri,n=e.onClick,function(){return n(t)})})},vn=function(e){var t=!0,n="grey";return e.metrics?(e.metrics.plays>0&&(t=!1,n=null),c.a.createElement(ln.a.Action,{as:"span"},c.a.createElement(jt.a,{className:"track-label",size:"tiny",color:n,basic:t},"Played ",c.a.createElement(jt.a.Detail,null,e.metrics.plays)))):null},gn=function(e){var t=!1;return e.tracks.map((function(n,a){var r,i,o=n.addedBy,l=(r=e.current,i=n.uri,r&&r.uri===i);return l&&(t=t||!0),c.a.createElement(ln.a,{className:on()({"current-track":l}),key:"".concat(a).concat(n.uri)},c.a.createElement(En,{image:n.image,isCurrent:l}),c.a.createElement(ln.a.Content,{className:on()({"track-info":!t})},c.a.createElement(bn,{name:n.name}),c.a.createElement(kn,{artistName:n.artist.name,trackLength:n.length,onClick:e.onArtistSearch(n.artist.name)}),c.a.createElement(ln.a.Actions,null,c.a.createElement(pn,{metrics:n.metrics}),c.a.createElement(vn,{metrics:n.metrics}),c.a.createElement(ln.a.Action,null,c.a.createElement(Ut,{users:o})),c.a.createElement(Cn,{uri:n.uri,name:n.name,disabled:e.disabled,isCurrent:l,onClick:e.onRemove}))))}))},hn=function(e){return e.tracks?c.a.createElement(ln.a.Group,{size:"small"},c.a.createElement(gn,{disabled:e.disabled,tracks:e.tracks,current:e.currentTrack,onRemove:e.onRemoveTrack,onArtistSearch:e.onArtistSearch})):null},yn=function(e){var t=e.onClick,n=e.disabled;return c.a.createElement(Et.a,{animated:"vertical",floated:"right",onClick:t,disabled:n},c.a.createElement(Et.a.Content,{hidden:!0},"Search"),c.a.createElement(Et.a.Content,{visible:!0},c.a.createElement(bt.a,{name:"search"})))},On=function(e,t){if((e+=5)<=100)return function(){t(e)}},Nn=function(e,t){if((e-=5)>=0)return function(){t(e)}},Tn=function(e){return c.a.createElement(Et.a,{className:"jb-volume-down",onClick:Nn(e.volume,e.onChange),disabled:e.disabled},c.a.createElement(bt.a,{name:"volume down"}))},Sn=function(e){return c.a.createElement(Et.a,{className:"jb-volume-up",onClick:On(e.volume,e.onChange),disabled:e.disabled},c.a.createElement(bt.a,{name:"volume up"}))},Dn=function(e){var t=e.disabled,n=e.onVolumeChange,a=Object(l.c)((function(e){return e.jukebox}));return c.a.createElement(Et.a.Group,{floated:"right"},c.a.createElement(Tn,{volume:a.volume,onChange:n,disabled:t}),c.a.createElement(Et.a.Or,{text:a.volume}),c.a.createElement(Sn,{volume:a.volume,onChange:n,disabled:t}))},jn=function(e){var t=c.a.useState(!1),n=Object(sn.a)(t,2),a=n[0],r=n[1];if(e.disabled)return null;return c.a.createElement(c.a.Fragment,null,c.a.createElement(jt.a,{horizontal:!0,size:"mini",as:"a",color:"red",onClick:function(){return r(!0)},className:"jb-clear-button"},"CLEAR"),c.a.createElement(mn.a,{content:"Are you sure you want to nuke the playlist?",cancelButton:"No thanks",confirmButton:"Do it!",open:a,onCancel:function(){return r(!1)},onConfirm:function(t){e.onClear(t),r(!1)}}))},An=n(752),_n=n(738),Pn=n(746),Rn=(n(700),function(e){return e.metrics?c.a.createElement(Bt,{size:"mini",total:e.metrics.votesAverage,show:e.metrics.votes>0}):null}),wn=function(e){return c.a.createElement("div",{className:on()("search-list-item",{disabled:e.track.explicit}),onClick:e.track.explicit?void 0:e.onClick},c.a.createElement(Dt.a,{floated:"left",src:e.track.image,size:"tiny",title:"Click to add - ".concat(e.track.name," - ").concat(e.track.artist.name),className:"search-list-item__image",disabled:e.track.explicit}),c.a.createElement(_t.a.Content,null,c.a.createElement("div",{className:"search-list-item__header"},e.track.name," - ",e.track.artist.name),c.a.createElement("div",{className:"search-list-item__content"},e.track.album.name),c.a.createElement(Rn,{metrics:e.track.metrics})))},In=function(e){return e.tracks.map((function(t){return c.a.createElement(wn,{key:t.track.uri,track:t.track,onClick:function(){return e.onAddTrack(t.track.uri)}})}))},xn=function(e){var t=e.visible,n=e.onClose,a=e.results,i=e.onSubmit,o=e.query,l=e.onQueryChange,u=e.onAddTrack,s=e.totalPages,m=e.onPageChange,d=Object(r.useRef)(null);return c.a.createElement(An.a.Pushable,null,c.a.createElement(An.a,{animation:"overlay",icon:"labeled",inverted:"true",vertical:"true",visible:t,width:"very wide",direction:"right",className:"sidebar-search",onShow:function(){return d.current.focus()}},c.a.createElement(_n.a,{inverted:!0,onSubmit:i},c.a.createElement(_n.a.Field,null,c.a.createElement("label",{required:!0},"SEARCH"),c.a.createElement("input",{ref:d,placeholder:"track, artist or album",onChange:l,value:o})),c.a.createElement(Et.a,{type:"submit",fluid:!0},"Submit")),c.a.createElement(mt.a,{horizontal:!0},c.a.createElement(ft.a,{as:"h4",inverted:!0},"Results")),s>0&&c.a.createElement(Pn.a,{className:"search-list-pagination",defaultActivePage:1,firstItem:null,lastItem:null,pointing:!0,secondary:!0,totalPages:s,onPageChange:m}),c.a.createElement(_t.a,{divided:!0,relaxed:!0,inverted:!0,size:"tiny"},c.a.createElement(In,{tracks:a,onAddTrack:u}))),c.a.createElement(An.a.Pusher,{dimmed:t,onClick:t?n:null},e.children))},Un=function(e){var t=Object(l.c)((function(e){return e.search})),n=Object(l.b)(),a=function(e){n(function(e){return{type:Pe,uri:e}}(e)),n(X(e))},r=function(e){var a={offset:(e.activePage-1)*t.limit,limit:t.limit};n(Me(t.query,a))};return c.a.createElement(xn,{visible:t.searchSideBarOpen,onClose:function(){return n(Ue(!1))},onSubmit:function(){return r({activePage:1})},onAddTrack:function(e){return a(e)},onQueryChange:function(e){return n(Le(e.target.value))},onPageChange:function(e,t){return r(t)},results:t.results,totalPages:Math.round(t.total/t.limit),query:t.query},e.children)},Ln=(n(721),function(e){var t=e.online,n=e.disabled,a=e.onPlay,r=e.onStop,i=e.onPause,o=e.onNext,l=e.onPrevious,u=e.onVolumeChange,s=e.onDrop,m=e.onTracklistClear,d=e.onSearchClick,f=e.tracklist,E=e.currentTrack,b=e.onRemoveTrack,k=e.onArtistSearch;return c.a.createElement(st.a.Dimmable,{blurring:!0,dimmed:!t},c.a.createElement(Tt,{disabled:n,onDrop:s},c.a.createElement(Un,null,c.a.createElement(rt.a,{className:"header-wrapper",fluid:!0},c.a.createElement(rn,null),c.a.createElement(Dn,{disabled:n,onVolumeChange:u}),c.a.createElement(yn,{onClick:d,disabled:n}),c.a.createElement(yt,{disabled:n,onPlay:a,onStop:r,onPause:i,onNext:o,onPrevious:l})),c.a.createElement(mt.a,null),c.a.createElement(rt.a,{className:"body-wrapper",fluid:!0},c.a.createElement(dt.a,{stackable:!0,columns:2,className:"dashboard-grid"},c.a.createElement(dt.a.Column,{width:4},c.a.createElement(ft.a,{size:"small"},"Current Track"),c.a.createElement(an,null)),c.a.createElement(dt.a.Column,{width:8},c.a.createElement(ft.a,{size:"small"},"Playlist ",c.a.createElement(jn,{disabled:n,onClear:m})),c.a.createElement(hn,{disabled:n,tracks:f,currentTrack:E,onRemoveTrack:b,onArtistSearch:k})))))))}),Mn=Object(ct.DragDropContext)(ot.a)((function(){var e=Object(l.c)((function(e){return e.jukebox})),t=Object(l.c)((function(e){return e.tracklist})),n=Object(l.c)((function(e){return e.track})),a=Object(l.b)(),i=Object(r.useContext)(h),o=i.isSignedIn,u=i.googleUser,s=!(o&&e.mopidyOnline),m=Object(r.useRef)(),d=Object(r.useRef)();Object(r.useEffect)((function(){return a(ne()),function(){a(ce())}}),[a]),o&&u.tokenId!==m.current&&(m.current=u.tokenId,d.current=ut.refresh(u,(function(e){a(H(e))})),a(H(m.current))),o||(m.current=void 0,ut.clear(d.current),a(Q()));var f=Object(r.useCallback)((function(){return a(Ee())}),[a]),E=Object(r.useCallback)((function(){return a(be())}),[a]),b=Object(r.useCallback)((function(){return a(ke())}),[a]),k=Object(r.useCallback)((function(){return a(pe())}),[a]),p=Object(r.useCallback)((function(){return a(Ce())}),[a]),C=Object(r.useCallback)((function(e){return a(ye(e))}),[a]),v=Object(r.useCallback)((function(e,t){t&&a(X(t.getItem().urls[0]))}),[a]),g=Object(r.useCallback)((function(){return a(fe())}),[a]),y=Object(r.useCallback)((function(){return a(Ue(!0))}),[a]),O=Object(r.useCallback)((function(e){return a(ee(e))}),[a]),N=Object(r.useCallback)((function(e){return function(t){var n={offset:0};a(Me(e,n)),a(Le(e)),a(Ue(!0))}}),[a]);return c.a.createElement(Ln,{online:e.online,disabled:s,onPlay:f,onStop:E,onPause:b,onNext:k,onPrevious:p,onVolumeChange:C,onDrop:v,onTracklistClear:g,onSearchClick:y,tracklist:t,currentTrack:n,onRemoveTrack:O,onArtistSearch:N})})),Vn=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||u.compose,zn=Object(u.createStore)(at,Vn(Object(u.applyMiddleware)(Fe))),Bn=function(){var e=Object(d.useGoogleLogin)({clientId:"383651533710-l72a24lkiulclgqes5mkgt5ujb2rspiu.apps.googleusercontent.com",hostedDomain:"kyanmedia.com"});return c.a.createElement(l.a,{store:zn},c.a.createElement(rt.a,{fluid:!0},c.a.createElement(h.Provider,{value:e},c.a.createElement(v,null,c.a.createElement(m.a,null),c.a.createElement(Mn,null)))))};n(722);o.a.render(c.a.createElement(Bn,null),document.getElementById("root"))}},[[391,1,2]]]);
//# sourceMappingURL=main.96e875e9.chunk.js.map