define(["models/MainMenu"],function(t){return{mainMenuAction:["$scope","$location","dbg","navi",function(e,n,r,i){e.menus=t,e.backPossible=!1,e.open=function(e){i.open(t[e].module,t[e].action||"index",t[e].parameters||[])},e.updateActive=function(){var n=i.getCurrent();null!==n&&(t.markActive(n.module,n.action),e.backPossible=i.isBackPossible())},i.bind(i.Event.STACK_CHANGED,function(){e.updateActive()}),e.updateActive()}]}});