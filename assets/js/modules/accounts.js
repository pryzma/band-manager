/*
* assets/js/modules/accounts.js
*/
'use strict'
// TODO : find out way to use import (can't use if this is fetched)
//import component from '../components'
//import {api} from '../server'



const accounts = (()=>{
  const accountsData = {
    url : 'api/accounts',
    modify : (account) =>{
      const activated = account.isActivated == 0 ? 'No' : 'Yes',
            profile =  account.profile ? account.profile : 'Manager'

      return {
        id : account.id,
        name : `${account.firstName} ${account.lastName}`,
        profile : profile,
        date : moment(account.createdAt).fromNow(),
        activated : activated
      }
    },
    callback : (data) => {
      application.object.accounts.data = data;
      accountsDashboardBadge();
    }
  },
  addAccount = function(){
    component.form.post({
       el : 'addAccountForm',
       url : 'api/accounts'
     },(res) => {
       //fetchAccountsData()
       //$('#addAccountForm').html(`Account <b>${res.data.firstName} ${res.data.lastName}</b> is created and a verification e-mail to activate this account  has been sent to <b>${res.data.email}</b>`)
       window.location.hash = '#accounts';
       setTimeout(()=>{
         component.alert({
           class : 'success',
           message : `<i class="fas fa-user-check"></i> Account <b>${res.data.firstName} ${res.data.lastName}</b> created. Activation e-mail to ${res.data.lastName} has been sent. You will be notified by e-mail when this account has been activated by reciever.`
         });
       },500);
     });
   },
   accountsDashboardBadge = () => {
     const accountsDataLength = application.object.accounts.data.length;
       let accountsDashboardBadgeLabel
       if(accountsDataLength === 0){
         accountsDashboardBadgeLabel = 'No Accounts added'
       }else if(accountsDataLength === 1){
         accountsDashboardBadgeLabel = 'One Account added'
       }else{
         accountsDashboardBadgeLabel = `${accountsDataLength} Accounts added`
       }
       application.object.accounts.badge = accountsDashboardBadgeLabel;
       
   },
   /*
   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
   async function accountsDashboardBadge(fetchOptions){
     await fetchOptions;
     return `${result.length} Accounts added`;
   }
   */
   getAccount = (id) => {
     if(application.object.accounts.data){
      return application.object.accounts.data.filter((account)=>account.id === id)[0];
     }else{ // fetch data if not available
       component.api(accountsData,(data)=>{
        application.object.accounts.data = data;
        getAccount(id)
       })
     }
   },
   // accountView
   accountView =(id) => {
     
     const account = getAccount(id);
     // account profile
     if(!account.profile) account.profile = 'Manager';
     component.modal({
       title : account.name,
       body : component.nav.tabs([
        { label : '<i class="fas fa-user"></i> Account', content : 'This account was created '+ account.date },
        { label : '<i class="fas fa-user-shield"></i> Profile', content : 'This account has profile '+ account.profile },
        { label : '<i class="fas fa-address-book"></i> Contact',content: account.contact}
      ]),
       buttons : [{ 
         txt : '<i class="fas fa-user-times"></i> Delete Account', 
         class : 'danger',
         confirm : {
           title : '<i class="fas fa-user-times"></i> Delete Account',
           msg : `Are you sure you want to delete this account? <b class="text-danger">You can not undo this action</b><hr>`,
           placement : 'bottom',
           confirm : () => accountDelete(id,()=>{
             accountsOverview();
             component.alert({
               class : 'primary',
               message : `<i class="fas fa-user-times"></i> Account <b>${account.name}</b> deleted`
             })
           }),
           hideOnConfirm : true
         }
       }]
     })
   },
   accountDelete = (id,callback) => {
    fetch('api/accounts', {
       method : 'DELETE',
       body : JSON.stringify({id : id}),
       headers: {'content-type': 'application/json'},
    }).then((event)=> {
         console.log(`Account ${id} was deleted`)
         if(callback)callback();
    }).catch(err=>console.error(err));
   },
   accountsOverview = () => {
     
     component.table({
       model : 'account',
       el: '#overviewTable',
       class : 'table-striped table-hover',
       data: accountsData,
       cols : {
         name : { label : 'Name' },
         profile : { label : 'Profile'},
         date : { label : 'Created' },
         activated : { label : 'Activated' }
       },
       methods: {
         onRowClick : (event) => {
           accountView(event.target.parentElement.id);         
         }
       }
     })
   }
  application.add('accounts',{
    name : 'Accounts',
    color : 'rgb(118, 165, 175)',
    default : accountsOverview,
    template : 'overview',
    add : { 
      default : addAccount,
      name : 'Create Account',
      template : 'addAccount'
    },
    get : getAccount
  },() => {
    component.api(accountsData);
  });
})();
