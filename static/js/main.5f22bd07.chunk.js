(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{116:function(e,t,n){e.exports=n.p+"static/media/default-artwork.6bba9800.png"},349:function(e,t){e.exports={transformUrl:function(e){var t=e.replace(/^.*\/track\//,"spotify:track:");return t.match(/spotify:track/g)?t:null}}},391:function(e,t,n){e.exports=n(723)},438:function(e,t){},578:function(e,t,n){},633:function(e,t,n){},649:function(e,t,n){},651:function(e,t,n){},652:function(e,t,n){},653:function(e,t,n){},700:function(e,t,n){},721:function(e,t,n){},722:function(e,t,n){},723:function(e,t,n){"use strict";n.r(t);var a={};n.r(a),n.d(a,"updateToken",(function(){return J})),n.d(a,"clearToken",(function(){return H})),n.d(a,"addNewTrack",(function(){return Q})),n.d(a,"addCurrentTrack",(function(){return X})),n.d(a,"syncSocialData",(function(){return W})),n.d(a,"addTrackList",(function(){return Z})),n.d(a,"removeFromTracklist",(function(){return $})),n.d(a,"updateProgressTimer",(function(){return ee})),n.d(a,"wsConnect",(function(){return te})),n.d(a,"wsConnecting",(function(){return ne})),n.d(a,"wsConnected",(function(){return ae})),n.d(a,"wsDisconnect",(function(){return re})),n.d(a,"wsDisconnected",(function(){return ce})),n.d(a,"mopidyConnected",(function(){return ie})),n.d(a,"mopidyDisconnected",(function(){return oe})),n.d(a,"getCurrentTrack",(function(){return le})),n.d(a,"getTimePosition",(function(){return ue})),n.d(a,"getState",(function(){return se})),n.d(a,"getTrackList",(function(){return me})),n.d(a,"clearTrackList",(function(){return de})),n.d(a,"startPlaying",(function(){return fe})),n.d(a,"stopPlaying",(function(){return Ee})),n.d(a,"pausePlaying",(function(){return be})),n.d(a,"nextPlaying",(function(){return ke})),n.d(a,"previousPlaying",(function(){return pe})),n.d(a,"getVolume",(function(){return Ce})),n.d(a,"updateVolume",(function(){return ge})),n.d(a,"updatePlaybackState",(function(){return ve})),n.d(a,"setVolume",(function(){return he}));var r=n(0),c=n.n(r),i=n(22),o=n.n(i),l=n(23),u=n(49),s=n(115),m=n.n(s),d=n(347),f=n(158),E=n(159),b=n(168),k=n(160),p=n(170),C=function(e){function t(e){var n;return Object(f.a)(this,t),(n=Object(b.a)(this,Object(k.a)(t).call(this,e))).state={hasError:!1},n}return Object(p.a)(t,e),Object(E.a)(t,[{key:"componentDidCatch",value:function(e,t){this.setState({hasError:!0})}},{key:"render",value:function(){return this.state.hasError?c.a.createElement("h1",null,"Ouch! I broke a bit."):this.props.children}}]),t}(c.a.Component),g=C,v=c.a.createContext(),h=v,y=n(348),O=n.n(y),N="playback.getCurrentTrack",T="event:trackPlaybackStarted",S="event:playbackStateChanged",D="tracklist.getTracks",j="tracklist.add",_="tracklist.remove",P="tracklist.clear",A="playback.getTimePosition",w="playback.getState",R="playback.play",I="playback.stop",x="playback.pause",U="playback.next",L="playback.previous",M="playing",V="paused",B="stopped",z="mixer.setVolume",K="mixer.getVolume",Y="event:volumeChanged",q="validationError",F={ADD_CURRENT_TRACK:"actionAddCurrentTrack",ADD_TRACKS:"actionAddTracks",CONNECT:"actionConnect",CONNECTING:"actionConnecting",CONNECTED:"actionConnected",DISCONNECT:"actionDisconnect",DISCONNECTED:"actionDisconnected",DROP_TYPES:["__NATIVE_URL__"],SEND:"actionSend",STORE_TOKEN:"actionStoreToken",CLEAR_STORE_TOKEN:"actionClearStoreToken",UPDATE_VOLUME:"actionUpdateVolume",UPDATE_PLAYBACK_STATE:"actionPlaybackState",UPDATE_PROGRESS_TIMER:"actionUpdateProgressTimer",MOPIDY_CONNECTED:"actionMopidyConnected",MOPIDY_DISCONNECTED:"actionMopidyDisconnected",SYNC_SOCIAL_DATA:"syncSocialData"},G=n(349),J=function(e){return{type:F.STORE_TOKEN,token:e}},H=function(){return{type:F.CLEAR_STORE_TOKEN}},Q=function(e){var t=Object(G.transformUrl)(e);return{type:F.SEND,key:j,params:{uri:t}}},X=function(e){return{type:F.ADD_CURRENT_TRACK,track:e}},W=function(e){return{type:F.SYNC_SOCIAL_DATA,track:e}},Z=function(e){return{type:F.ADD_TRACKS,list:e}},$=function(e){return{type:F.SEND,key:_,params:{uri:[e]}}},ee=function(e,t){return t===1/0&&(t=0),{type:F.UPDATE_PROGRESS_TIMER,position:e,duration:t}},te=function(){return{type:F.CONNECT}},ne=function(){return{type:F.CONNECTING}},ae=function(){return{type:F.CONNECTED}},re=function(){return{type:F.DISCONNECT}},ce=function(){return{type:F.DISCONNECTED}},ie=function(){return{type:F.MOPIDY_CONNECTED}},oe=function(){return{type:F.MOPIDY_DISCONNECTED}},le=function(){return{type:F.SEND,key:N}},ue=function(){return{type:F.SEND,key:A}},se=function(){return{type:F.SEND,key:w}},me=function(){return{type:F.SEND,key:D}},de=function(){return{type:F.SEND,key:P}},fe=function(){return{type:F.SEND,key:R}},Ee=function(){return{type:F.SEND,key:I}},be=function(){return{type:F.SEND,key:x}},ke=function(){return{type:F.SEND,key:U}},pe=function(){return{type:F.SEND,key:L}},Ce=function(){return{type:F.SEND,key:K}},ge=function(e){return{type:F.UPDATE_VOLUME,volume:e}},ve=function(e){return{type:F.UPDATE_PLAYBACK_STATE,state:e}},he=function(e){return{type:F.SEND,key:z,params:[Number(e)]}},ye="actionVote",Oe="castVote",Ne="voteCasted",Te="actionTrackSearch",Se="searchGetTracks",De="actionStoreSearchResults",je="actionStoreSearchQuery",_e="actionToggleSearchSidebar",Pe="actionRemoveFromSearchResults",Ae=n(350),we=n.n(Ae),Re=function(e){var t=Math.floor(e/6e4),n=(e%6e4/1e3).toFixed(0);return t+":"+(n<10?"0":"")+n},Ie=function(e){return.001*e},xe=function(e){return{type:_e,open:e}},Ue=function(e){return{type:je,query:e}},Le=function(e,t){return{type:Te,key:Se,params:{query:e,options:t}}},Me="authenticationTokenInvalid",Ve={decode:function(e){return JSON.parse(e)},encodeToJson:function(e,t,n){return JSON.stringify({jwt:e,key:t,data:n})}},Be={success:function(e){return s.notify.show(e,"success",3e3,{})},warning:function(e){return s.notify.show(e,"warning",3e3,{})}},ze=function(e,t){e.dispatch(ve(t))},Ke=function(e,t,n){var a=Ve.decode(t),r=a.key,c=a.data;switch(r){case Me:console.log("AUTHENTICATION_TOKEN_INVALID: ".concat(c.error)),e.dispatch(H());break;case N:case T:c&&c.track&&function(e,t,n){t.dispatch(X(e)),t.dispatch(W(e));var a=n.set(0,e.length);t.getState().jukebox.playbackState===M&&a.start()}(c.track,e,n);break;case S:case w:!function(e,t,n){switch(t){case V:case B:ze(e,t),n.stop(),Be.success("Jukebox Halted");break;case M:ze(e,t),n.start()}}(e,c,n);break;case D:!function(e,t){t.dispatch(Z(e))}(c,e);break;case j:var i=c.track;Be.success("Adding: ".concat(i.name," / ").concat(i.album.name," by ").concat(i.artist.name));break;case U:case L:e.dispatch(le());break;case K:e.dispatch(ge(c));break;case Y:e.dispatch(ge(c)),Be.success("Volume Changed");break;case A:n.set(c);break;case Se:e.dispatch({type:De,results:c});break;case Ne:c&&e.dispatch(W(c));break;case q:Be.warning(c);break;default:console.log("Unknown message: ".concat(r," body: ").concat(c))}},Ye={loadInitial:function(e){["getCurrentTrack","getTimePosition","getState","getTrackList","getVolume"].forEach((function(t){e.dispatch(a[t]())}))}},qe=function(){var e="http://".concat("jukebox-api-prod.local",":").concat("8080"),t=null,n=null;return function(r){return function(c){return function(i){var o=function(){return Ve.encodeToJson(r.getState().settings.token,i.key,i.params)},l=function(e){if(JSON.parse(e).online)return r.dispatch(ie()),Ye.loadInitial(r);r.dispatch(oe())},u=function(e){n=function(e,t){return we()({callback:function(n,a){e.dispatch(t.updateProgressTimer(n,a))},fallbackTargetFrameRate:1,disableRequestAnimationFrame:!0})}(r,a),r.dispatch(ae())},s=function(e){return r.dispatch(re())},m=function(e){return Ke(r,e,n)},d=function(e){return Ke(r,e,n)},f=function(e){return Ke(r,e,n)};switch(i.type){case F.CONNECT:return null!=t&&t.close(),(t=O()(e,{transports:["websocket"]})).on("vote",f),t.on("search",d),t.on("mopidy",l),t.on("message",m),t.on("connect",u),t.on("disconnect",s),void r.dispatch(ne());case F.DISCONNECT:return n&&n.reset(),void r.dispatch(ce());case F.SEND:return t.emit("message",o());case Te:return t.emit("search",o());case ye:return t.emit("vote",o());default:return c(i)}}}}}(),Fe=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case F.ADD_CURRENT_TRACK:return t.track;case F.SYNC_SOCIAL_DATA:return Object.assign({},e,{addedBy:t.track.addedBy,metrics:t.track.metrics});default:return e}},Ge=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(t.type){case F.ADD_TRACKS:return t.list.map((function(e){return e.track}));case F.SYNC_SOCIAL_DATA:return e.map((function(e){return e.uri===t.track.uri?Object.assign({},e,{addedBy:t.track.addedBy,metrics:t.track.metrics}):e}));default:return e}},Je={position:0,duration:0,remaining:0},He=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Je,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case F.UPDATE_PROGRESS_TIMER:return{position:t.position,duration:t.duration,remaining:t.duration-t.position};default:return e}},Qe={online:!1,mopidyOnline:!1,volume:0,playbackState:B},Xe=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Qe,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case F.CONNECTED:return Object.assign({},e,{online:!0});case F.DISCONNECTED:return Object.assign({},e,{online:!1});case F.MOPIDY_CONNECTED:return Object.assign({},e,{mopidyOnline:!0});case F.MOPIDY_DISCONNECTED:return Object.assign({},e,{mopidyOnline:!1});case F.UPDATE_VOLUME:return Object.assign({},e,{volume:t.volume});case F.UPDATE_PLAYBACK_STATE:return Object.assign({},e,{playbackState:t.state});default:return e}},We={token:null},Ze=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:We,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case F.STORE_TOKEN:return t.token===e.token?e:Object.assign({},e,{token:t.token});case F.CLEAR_STORE_TOKEN:return Object.assign({},e,{token:null});default:return e}},$e=n(381),et={searchSideBarOpen:!1,query:"",limit:20,offset:0,total:0,results:[]},tt=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:et,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case Pe:return Object($e.a)({},e,{results:e.results.filter((function(e){return e.track.uri!==t.uri}))});case _e:return Object.assign({},e,{searchSideBarOpen:t.open});case je:return Object.assign({},e,{query:t.query});case De:var n=t.results.tracks;return Object.assign({},e,{limit:n.limit,offset:n.offset,total:n.total>1e4?1e4:n.total,results:n.items});default:return e}},nt=Object(u.combineReducers)({track:Fe,tracklist:Ge,timer:He,jukebox:Xe,settings:Ze,search:tt}),at=n(737),rt=n(91),ct=n(161),it=n.n(ct),ot=n(233),lt={refresh:function(e,t){return ot.b((function(){e.reloadAuthResponse().then((function(e){return t(e.id_token)}),(function(e){return console.warn("Token un-refreshable: ",e.message)}))}),27e5)},clear:function(e){e&&ot.a(e)}},ut=n(751),st=n(736),mt=n(750),dt=n(749),ft=n(747),Et=n(62),bt=function(e){return c.a.createElement(ft.a,{onClick:e.onClick,animated:"vertical",className:"jb-previous-button",disabled:e.disabled},c.a.createElement(ft.a.Content,{hidden:!0},"Prev"),c.a.createElement(ft.a.Content,{visible:!0},c.a.createElement(Et.a,{name:"step backward"})))},kt=function(e){return c.a.createElement(ft.a,{onClick:e.onClick,animated:"vertical",className:"jb-next-button",disabled:e.disabled},c.a.createElement(ft.a.Content,{hidden:!0},"Next"),c.a.createElement(ft.a.Content,{visible:!0},c.a.createElement(Et.a,{name:"step forward"})))},pt=function(e){var t=e.disabled,n=e.onPrevious,a=e.onNext;return c.a.createElement(c.a.Fragment,null,c.a.createElement(bt,{onClick:n,disabled:t}),c.a.createElement(kt,{onClick:a,disabled:t}))},Ct=function(e){return c.a.createElement(ft.a,{onClick:e.onClick,animated:"vertical",disabled:e.state===M||e.disabled,active:e.state===M,className:"jb-play-button"},c.a.createElement(ft.a.Content,{hidden:!0},"Play"),c.a.createElement(ft.a.Content,{visible:!0},c.a.createElement(Et.a,{name:"play"})))},gt=function(e){return c.a.createElement(ft.a,{onClick:e.onClick,animated:"vertical",disabled:e.state===V||e.state===B||e.disabled,active:e.state===V,className:"jb-pause-button"},c.a.createElement(ft.a.Content,{hidden:!0},"Pause"),c.a.createElement(ft.a.Content,{visible:!0},c.a.createElement(Et.a,{name:"pause"})))},vt=function(e){return c.a.createElement(ft.a,{onClick:e.onClick,animated:"vertical",disabled:e.state===B||e.disabled,active:e.state===B,className:"jb-stop-button"},c.a.createElement(ft.a.Content,{hidden:!0},"Stop"),c.a.createElement(ft.a.Content,{visible:!0},c.a.createElement(Et.a,{name:"stop"})))},ht=function(e){var t=Object(l.c)((function(e){return e.jukebox})),n=e.disabled,a=e.onPlay,r=e.onPause,i=e.onStop,o=e.onPrevious,u=e.onNext;return c.a.createElement("span",null,c.a.createElement(pt,{disabled:n,onPrevious:o,onNext:u}),c.a.createElement(Ct,{onClick:a,state:t.playbackState,disabled:n}),c.a.createElement(gt,{onClick:r,state:t.playbackState,disabled:n}),c.a.createElement(vt,{onClick:i,state:t.playbackState,disabled:n}))},yt=(n(578),function(e){function t(){return Object(f.a)(this,t),Object(b.a)(this,Object(k.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(E.a)(t,[{key:"render",value:function(){var e=this.props,t=e.connectDropTarget,n=e.isOver;return t(c.a.createElement("div",null,n?c.a.createElement("div",{className:"drag-is-over"},c.a.createElement("p",null,"Drop da track")):null,this.props.children))}}]),t}(r.Component)),Ot=Object(rt.DropTarget)((function(e){return e.accepts}),{drop:function(e,t){e.onDrop&&e.onDrop(e,t)}},(function(e,t){return{connectDropTarget:e.dropTarget(),isOver:t.isOver()}}))(yt),Nt=function(e){var t=e.disabled,n=e.onDrop,a=e.children;return t?a:c.a.createElement(rt.DragDropContextProvider,{backend:it.a},c.a.createElement(Ot,{accepts:F.DROP_TYPES,onDrop:n},a))},Tt=n(745),St=n(382),Dt=n(169),jt=n(378),_t=n(743),Pt=n(742),At=n(165),wt=n.n(At),Rt=(n(633),function(e){return c.a.createElement(_t.a,{className:"added-by-list"},e.map((function(e,t){var n=e.user?e.user.fullname:"User unknown";return c.a.createElement(_t.a.Item,{key:t},It(e),c.a.createElement(_t.a.Content,null,c.a.createElement(_t.a.Description,null,c.a.createElement("strong",null,wt()(e.addedAt,"dd mmm yyyy @ h:MM tt"))," - ",n)))})))}),It=function(e){return e&&e.user&&e.user.picture?c.a.createElement(St.a,{avatar:!0,className:"added_by_avatar_image",src:e.user.picture}):c.a.createElement(Et.a,{name:"user"})},xt=function(e){var t=e.users,n=void 0===t?[]:t,a=It(n[0]);return n.length?c.a.createElement(Pt.a,{wide:!0,content:Rt(n),trigger:a}):a},Ut=(n(649),function(e){return Math.round(e/10-5)}),Lt=function(e){return c.a.createElement(_t.a,null,e.votes.map((function(e,t){var n=e.user?e.user.fullname:"User unknown",a=c.a.createElement(Dt.a,{circular:!0,size:"mini"},Ut(e.vote));return c.a.createElement(_t.a.Item,{key:t},Mt(e),c.a.createElement(_t.a.Content,null,c.a.createElement(_t.a.Description,null,c.a.createElement("strong",null,wt()(e.at,"dd mmm yyyy @ h:MM tt"))," - ",n," ",a)))})))},Mt=function(e){return e&&e.user&&e.user.picture?c.a.createElement(St.a,{avatar:!0,className:"voted_by_avatar_image",src:e.user.picture}):null},Vt=function(e){var t="green",n="thumbs up",a=Ut(e.total);return a<0&&(n="thumbs down"),a<0&&(t="red"),c.a.createElement(Dt.a,{className:"track-label vote-track-label",size:e.size||"tiny",color:t,icon:n,content:a,ribbon:e.ribbon?"right":null})},Bt=function(e){var t=e.votes?e.votes.length:0;return e.show?t<1?Vt(e):c.a.createElement(Pt.a,{wide:"very",content:Lt(e),trigger:Vt(e)}):null},zt=n(379),Kt=function(){var e=Object(l.c)((function(e){return e.timer})),t=Object(l.c)((function(e){return e.track})),n=function(e){if(0===e.duration)return 0;var t=Ie(e.position),n=Ie(e.duration),a=Math.round(t/n*100);return isNaN(a)?0:a}(e);return c.a.createElement("div",{className:"progress-container"},c.a.createElement("span",{className:"remaining-text"},Re(e.remaining)),c.a.createElement("span",{className:"track-length"},Re(t.length)),c.a.createElement(zt.a,{percent:n}))},Yt=n(116),qt=n.n(Yt),Ft=n(231),Gt=(n(650),n(651),{0:{style:{color:"red"},label:c.a.createElement(Et.a,{name:"thumbs down",color:"red"})},50:c.a.createElement(Et.a,{name:"handshake"}),100:{style:{color:"green"},label:c.a.createElement(Et.a,{name:"thumbs up",color:"green"})}}),Jt=function(e){var t=e.split(":").pop();return"https://open.spotify.com/track/".concat(t)},Ht=function(e){var t=" (".concat(e.album.year,")");return c.a.createElement(Tt.a.Description,null,e.album.name,t)},Qt=function(e){var t=e.map((function(e){return e.vote}));return t.length<1?0:Object(Ft.mean)(Object(Ft.flatten)(t))},Xt=function(e){return e>50?"#21ba45":e<50?"red":"gray"},Wt=function(e){return e.metrics?c.a.createElement(Bt,{total:e.metrics.votesAverage,show:e.metrics.votes>0,ribbon:!0}):null},Zt=function(e){var t=e.track,n=e.onVote,a=e.userID;if(!t)return c.a.createElement(Tt.a,null,c.a.createElement(St.a,{src:qt.a}),c.a.createElement(Tt.a.Content,null,c.a.createElement(Tt.a.Header,null,"Nothing playing"),c.a.createElement(Tt.a.Description,null,"Drag some music here or press play.")));var r,i=t.addedBy,o=void 0===i?[]:i,l=o[0]&&o[0].votes||[],u=t.metrics&&t.metrics.plays,s=l.find((function(e){return e.user._id===a})),m=s?s.vote:null;return c.a.createElement(Tt.a,null,c.a.createElement(St.a,{src:t.image||qt.a,label:c.a.createElement(Wt,{metrics:t.metrics})}),c.a.createElement(Tt.a.Content,null,c.a.createElement(Kt,null),c.a.createElement(Tt.a.Header,null,t.name),c.a.createElement(Tt.a.Meta,null,t.artist.name),c.a.createElement(Ht,{album:t.album})),c.a.createElement(Tt.a.Content,{extra:!0},c.a.createElement("div",{className:"track-rating-container"},c.a.createElement(jt.a,{disabled:!a,dots:!0,value:m,included:!1,marks:Gt,step:10,onChange:(r=t.uri,function(e){return n(r,e/10)}),handleStyle:{borderColor:Xt(m),backgroundColor:Xt(m)}}))),c.a.createElement(Tt.a.Content,{extra:!0},c.a.createElement(Dt.a,{size:"mini"},"Added",c.a.createElement(Dt.a.Detail,null,o.length)),c.a.createElement(Dt.a,{size:"mini"},"Played",c.a.createElement(Dt.a.Detail,null,u)),c.a.createElement(Bt,{size:"mini",show:l.length>0,total:Qt(l),votes:l})),c.a.createElement(Tt.a.Content,{extra:!0},c.a.createElement(xt,{users:t.addedBy}),c.a.createElement("a",{className:"track-uri",href:Jt(t.uri),target:"_blank",rel:"noopener noreferrer"},t.uri)))},$t=function(){var e=Object(r.useContext)(h).googleUser,t=Object(l.c)((function(e){return e.track})),n=Object(l.b)();return c.a.createElement(Zt,{userID:e&&e.googleId,track:t,onVote:function(e,t){return n(function(e,t){return{type:ye,key:Oe,params:{uri:e,vote:t}}}(e,t))}})},en=(n(652),function(){var e=Object(r.useContext)(h),t=e.googleUser,n=e.signIn,a=e.signOut,i=c.a.createElement(ft.a,{icon:"power off",floated:"right",onClick:function(){return n()},className:"jb-settings-toggle",title:"Login using Google"});return t&&t.profileObj&&(i=c.a.createElement(St.a,{rounded:!0,size:"mini",floated:"right",title:t.profileObj.name,src:t.profileObj.imageUrl,onClick:function(){return a()}})),c.a.createElement(c.a.Fragment,null,i)}),tn=n(4),nn=n.n(tn),an=n(741),rn=(n(653),function(e){var t,n;return e.isCurrent&&(t="current-image"),e.onClick&&!e.isCurrent&&(n="Click to remove from playlist",t="remove-image"),c.a.createElement(St.a,{bordered:!0,className:t,size:e.hasBeenPlayed?"small":"tiny",src:e.src,title:n,onClick:e.onClick,inline:!0})}),cn=function(e){var t,n,a=e.image?e.image:qt.a,r=e.disabled||e.isCurrent?void 0:(t=e.uri,n=e.onClick,function(){return n(t)});return c.a.createElement(rn,{src:a,isCurrent:e.isCurrent,onClick:r,hasBeenPlayed:e.hasBeenPlayed})},on=function(e){return c.a.createElement(_t.a.Header,{as:"h4"},e.name)},ln=function(e){return c.a.createElement(_t.a.Description,null,c.a.createElement(an.a,{as:"a",className:"track-search-link",onClick:e.onClick},e.artistName)," ",c.a.createElement("small",null,"(",Re(e.trackLength),")"))},un=function(e){return e.metrics?c.a.createElement(Bt,{total:e.metrics.votesAverage,show:e.metrics.votes>0}):null},sn=function(e){return e.metrics?c.a.createElement(Dt.a,{className:"track-label",size:"tiny"},"Played ",c.a.createElement(Dt.a.Detail,null,e.metrics.plays)):null},mn=function(e){var t=!1;return e.tracks.map((function(n,a){var r,i,o=n.addedBy,l=(r=e.current,i=n.uri,r&&r.uri===i);return l&&(t=t||!0),c.a.createElement(_t.a.Item,{className:nn()({"current-track":l}),key:"".concat(a).concat(n.uri)},c.a.createElement(cn,{disable:e.disabled,uri:n.uri,image:n.image,isCurrent:l,onClick:e.onRemove,hasBeenPlayed:t}),c.a.createElement(_t.a.Content,{className:nn()({"track-info":!t})},c.a.createElement(on,{name:n.name}),c.a.createElement(ln,{artistName:n.artist.name,trackLength:n.length,onClick:e.onArtistSearch(n.artist.name)}),c.a.createElement(un,{metrics:n.metrics}),c.a.createElement(sn,{metrics:n.metrics}),c.a.createElement(xt,{users:o})))}))},dn=function(e){return e.tracks?c.a.createElement(_t.a,{relaxed:"very",divided:!0},c.a.createElement(mn,{disabled:e.disabled,tracks:e.tracks,current:e.currentTrack,onRemove:e.onRemoveTrack,onArtistSearch:e.onArtistSearch})):null},fn=function(e){var t=e.onClick,n=e.disabled;return c.a.createElement(ft.a,{animated:"vertical",floated:"right",onClick:t,disabled:n},c.a.createElement(ft.a.Content,{hidden:!0},"Search"),c.a.createElement(ft.a.Content,{visible:!0},c.a.createElement(Et.a,{name:"search"})))},En=function(e,t){if((e+=2)<=100)return function(){t(e)}},bn=function(e,t){if((e-=2)>=0)return function(){t(e)}},kn=function(e){return c.a.createElement(ft.a,{className:"jb-volume-down",onClick:bn(e.volume,e.onChange),disabled:e.disabled},c.a.createElement(Et.a,{name:"volume down"}))},pn=function(e){return c.a.createElement(ft.a,{className:"jb-volume-up",onClick:En(e.volume,e.onChange),disabled:e.disabled},c.a.createElement(Et.a,{name:"volume up"}))},Cn=function(e){var t=e.disabled,n=e.onVolumeChange,a=Object(l.c)((function(e){return e.jukebox}));return c.a.createElement(ft.a.Group,{floated:"right"},c.a.createElement(kn,{volume:a.volume,onChange:n,disabled:t}),c.a.createElement(ft.a.Or,{text:a.volume}),c.a.createElement(pn,{volume:a.volume,onChange:n,disabled:t}))},gn=n(380),vn=n(739),hn=function(e){var t=c.a.useState(!1),n=Object(gn.a)(t,2),a=n[0],r=n[1];if(e.disabled)return null;return c.a.createElement(c.a.Fragment,null,c.a.createElement(Dt.a,{horizontal:!0,size:"mini",as:"a",color:"red",onClick:function(){return r(!0)},className:"jb-clear-button"},"CLEAR"),c.a.createElement(vn.a,{content:"Are you sure you want to nuke the playlist?",cancelButton:"No thanks",confirmButton:"Do it!",open:a,onCancel:function(){return r(!1)},onConfirm:function(t){e.onClear(t),r(!1)}}))},yn=n(748),On=n(738),Nn=n(744),Tn=(n(700),function(e){return e.metrics?c.a.createElement(Bt,{size:"mini",total:e.metrics.votesAverage,show:e.metrics.votes>0}):null}),Sn=function(e){return c.a.createElement("div",{className:nn()("search-list-item",{disabled:e.track.explicit}),onClick:e.track.explicit?void 0:e.onClick},c.a.createElement(St.a,{floated:"left",src:e.track.image,size:"tiny",title:"Click to add - ".concat(e.track.name," - ").concat(e.track.artist.name),className:"search-list-item__image",disabled:e.track.explicit}),c.a.createElement(_t.a.Content,null,c.a.createElement("div",{className:"search-list-item__header"},e.track.name," - ",e.track.artist.name),c.a.createElement("div",{className:"search-list-item__content"},e.track.album.name),c.a.createElement(Tn,{metrics:e.track.metrics})))},Dn=function(e){return e.tracks.map((function(t){return c.a.createElement(Sn,{key:t.track.uri,track:t.track,onClick:function(){return e.onAddTrack(t.track.uri)}})}))},jn=function(e){var t=e.visible,n=e.onClose,a=e.results,i=e.onSubmit,o=e.query,l=e.onQueryChange,u=e.onAddTrack,s=e.totalPages,m=e.onPageChange,d=Object(r.useRef)(null);return c.a.createElement(yn.a.Pushable,null,c.a.createElement(yn.a,{animation:"overlay",icon:"labeled",inverted:"true",vertical:"true",visible:t,width:"very wide",direction:"right",className:"sidebar-search",onShow:function(){return d.current.focus()}},c.a.createElement(On.a,{inverted:!0,onSubmit:i},c.a.createElement(On.a.Field,null,c.a.createElement("label",{required:!0},"SEARCH"),c.a.createElement("input",{ref:d,placeholder:"track, artist or album",onChange:l,value:o})),c.a.createElement(ft.a,{type:"submit",fluid:!0},"Submit")),c.a.createElement(st.a,{horizontal:!0},c.a.createElement(dt.a,{as:"h4",inverted:!0},"Results")),s>0&&c.a.createElement(Nn.a,{className:"search-list-pagination",defaultActivePage:1,firstItem:null,lastItem:null,pointing:!0,secondary:!0,totalPages:s,onPageChange:m}),c.a.createElement(_t.a,{divided:!0,relaxed:!0,inverted:!0,size:"tiny"},c.a.createElement(Dn,{tracks:a,onAddTrack:u}))),c.a.createElement(yn.a.Pusher,{dimmed:t,onClick:t?n:null},e.children))},_n=function(e){var t=Object(l.c)((function(e){return e.search})),n=Object(l.b)(),a=function(e){n(function(e){return{type:Pe,uri:e}}(e)),n(Q(e))},r=function(e){var a={offset:(e.activePage-1)*t.limit,limit:t.limit};n(Le(t.query,a))};return c.a.createElement(jn,{visible:t.searchSideBarOpen,onClose:function(){return n(xe(!1))},onSubmit:function(){return r({activePage:1})},onAddTrack:function(e){return a(e)},onQueryChange:function(e){return n(Ue(e.target.value))},onPageChange:function(e,t){return r(t)},results:t.results,totalPages:Math.round(t.total/t.limit),query:t.query},e.children)},Pn=(n(721),function(e){var t=e.online,n=e.disabled,a=e.onPlay,r=e.onStop,i=e.onPause,o=e.onNext,l=e.onPrevious,u=e.onVolumeChange,s=e.onDrop,m=e.onTracklistClear,d=e.onSearchClick,f=e.tracklist,E=e.currentTrack,b=e.onRemoveTrack,k=e.onArtistSearch;return c.a.createElement(ut.a.Dimmable,{blurring:!0,dimmed:!t},c.a.createElement(Nt,{disabled:n,onDrop:s},c.a.createElement(_n,null,c.a.createElement(at.a,{className:"header-wrapper",fluid:!0},c.a.createElement(en,null),c.a.createElement(Cn,{disabled:n,onVolumeChange:u}),c.a.createElement(fn,{onClick:d,disabled:n}),c.a.createElement(ht,{disabled:n,onPlay:a,onStop:r,onPause:i,onNext:o,onPrevious:l})),c.a.createElement(st.a,null),c.a.createElement(at.a,{className:"body-wrapper",fluid:!0},c.a.createElement(mt.a,{stackable:!0,columns:2,className:"dashboard-grid"},c.a.createElement(mt.a.Column,{width:4},c.a.createElement(dt.a,{size:"small"},"Current Track"),c.a.createElement($t,null)),c.a.createElement(mt.a.Column,{width:8},c.a.createElement(dt.a,{size:"small"},"Playlist ",c.a.createElement(hn,{disabled:n,onClear:m})),c.a.createElement(dn,{disabled:n,tracks:f,currentTrack:E,onRemoveTrack:b,onArtistSearch:k})))))))}),An=Object(rt.DragDropContext)(it.a)((function(){var e=Object(l.c)((function(e){return e.jukebox})),t=Object(l.c)((function(e){return e.tracklist})),n=Object(l.c)((function(e){return e.track})),a=Object(l.b)(),i=Object(r.useContext)(h),o=i.isSignedIn,u=i.googleUser,s=!(o&&e.mopidyOnline),m=Object(r.useRef)(),d=Object(r.useRef)();Object(r.useEffect)((function(){return a(te()),function(){a(re())}}),[a]),o&&u.tokenId!==m.current&&(m.current=u.tokenId,d.current=lt.refresh(u,(function(e){a(J(e))})),a(J(m.current))),o||(m.current=void 0,lt.clear(d.current),a(H()));var f=Object(r.useCallback)((function(){return a(fe())}),[a]),E=Object(r.useCallback)((function(){return a(Ee())}),[a]),b=Object(r.useCallback)((function(){return a(be())}),[a]),k=Object(r.useCallback)((function(){return a(ke())}),[a]),p=Object(r.useCallback)((function(){return a(pe())}),[a]),C=Object(r.useCallback)((function(e){return a(he(e))}),[a]),g=Object(r.useCallback)((function(e,t){t&&a(Q(t.getItem().urls[0]))}),[a]),v=Object(r.useCallback)((function(){return a(de())}),[a]),y=Object(r.useCallback)((function(){return a(xe(!0))}),[a]),O=Object(r.useCallback)((function(e){return a($(e))}),[a]),N=Object(r.useCallback)((function(e){return function(t){var n={offset:0};a(Le(e,n)),a(Ue(e)),a(xe(!0))}}),[a]);return c.a.createElement(Pn,{online:e.online,disabled:s,onPlay:f,onStop:E,onPause:b,onNext:k,onPrevious:p,onVolumeChange:C,onDrop:g,onTracklistClear:v,onSearchClick:y,tracklist:t,currentTrack:n,onRemoveTrack:O,onArtistSearch:N})})),wn=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||u.compose,Rn=Object(u.createStore)(nt,wn(Object(u.applyMiddleware)(qe))),In=function(){var e=Object(d.useGoogleLogin)({clientId:"383651533710-l72a24lkiulclgqes5mkgt5ujb2rspiu.apps.googleusercontent.com",hostedDomain:"kyanmedia.com"});return c.a.createElement(l.a,{store:Rn},c.a.createElement(at.a,{fluid:!0},c.a.createElement(h.Provider,{value:e},c.a.createElement(g,null,c.a.createElement(m.a,null),c.a.createElement(An,null)))))};n(722);o.a.render(c.a.createElement(In,null),document.getElementById("root"))}},[[391,1,2]]]);
//# sourceMappingURL=main.5f22bd07.chunk.js.map