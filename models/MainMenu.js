define([],function(){var t=[{name:"contacts",module:"phonebook",action:"contacts"},{name:"add-contact",module:"phonebook",action:"add-contact"}];return t.markActive=function(t,e){for(var n=0;this.length>n;n++)this[n].active=!1,this[n].module===t&&this[n].action===e&&(this[n].active=!0)},t});