/*
* assets/js/main.js
*/
'use strict'
const main = (function(){
  requirejs([
    'application',
    'modules/dashboard',
    'modules/shows',
    'modules/options',
    'modules/rehearsals',
    'modules/blockdates',
    'modules/profiles',
    'agendamanager'
  ],()=> {
    application.init(agendamanager);
  });
})();
