!function(){var t={16:function(){var t;t=jQuery,Craft.RecoveryCodesSetup=Craft.Auth2fa.extend({$generateRecoveryCodesBtn:null,$downloadRecoveryCodes:null,init:function(t,e){this.setSettings(e,Craft.RecoveryCodesSetup.defaults),this.slideout=t,this.initSlideout(),this.$generateRecoveryCodesBtn=this.slideout.$container.find("#generate-recovery-codes"),this.$downloadRecoveryCodes=this.slideout.$container.find("#download-recovery-codes"),this.addListener(this.$generateRecoveryCodesBtn,"click","onGenerateRecoveryCodesBtn"),this.$downloadRecoveryCodes.length>0&&this.addListener(this.$downloadRecoveryCodes,"submit","onDownloadRecoveryCodesBtn")},onGenerateRecoveryCodesBtn:function(e){t(e.currentTarget).hasClass("disabled")||confirm(Craft.t("app","Are you sure you want to generate new recovery codes? All current codes will stop working."))&&(this.showStatus(Craft.t("app","Waiting for elevated session"),""),Craft.elevatedSessionManager.requireElevatedSession(this.generateRecoveryCodes.bind(this),this.failedElevation.bind(this)))},onDownloadRecoveryCodesBtn:function(e){e.preventDefault(),t(e.currentTarget).hasClass("disabled")||(this.showStatus(Craft.t("app","Waiting for elevated session"),""),Craft.elevatedSessionManager.requireElevatedSession(this.downloadRecoveryCodes.bind(this),this.failedElevation.bind(this)))},failedElevation:function(){this.clearStatus()},generateRecoveryCodes:function(){var t=this;this.clearStatus(),Craft.sendActionRequest("POST",this.settings.generateRecoveryCodes).then((function(e){t.clearStatus(),e.data.verified?(Craft.cp.displaySuccess(Craft.t("app","Recovery codes generated.")),e.data.html&&(t.slideout.$container.html(e.data.html),t.init(t.slideout))):t.showStatus(Craft.t("app","Something went wrong!"))})).catch((function(e){var n=e.response;t.showStatus(n.data.message)}))},downloadRecoveryCodes:function(){var t=this;this.clearStatus(),Craft.downloadFromUrl("POST",Craft.getActionUrl(this.settings.downloadRecoveryCodes),this.$downloadRecoveryCodes.serialize()).then((function(e){t.clearStatus(),Craft.cp.displaySuccess(Craft.t("app","Recovery codes downloaded."))}))}},{defaults:{downloadRecoveryCodes:"auth/download-recovery-codes",generateRecoveryCodes:"auth/generate-recovery-codes"}})}},e={};function n(r){var a=e[r];if(void 0!==a)return a.exports;var i=e[r]={exports:{}};return t[r](i,i.exports,n),i.exports}!function(){"use strict";function t(t){const e=new Uint8Array(t);let n="";for(const t of e)n+=String.fromCharCode(t);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function e(t){const e=t.replace(/-/g,"+").replace(/_/g,"/"),n=(4-e.length%4)%4,r=e.padEnd(e.length+n,"="),a=atob(r),i=new ArrayBuffer(a.length),o=new Uint8Array(i);for(let t=0;t<a.length;t++)o[t]=a.charCodeAt(t);return i}function r(){return void 0!==(null===window||void 0===window?void 0:window.PublicKeyCredential)&&"function"==typeof window.PublicKeyCredential}function a(t){const{id:n}=t;return{...t,id:e(n),transports:t.transports}}function i(t){return"localhost"===t||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(t)}class o extends Error{constructor(t,e="WebAuthnError"){super(t),this.name=e}}const s=new class{createNewAbortSignal(){this.controller&&this.controller.abort("Cancelling existing WebAuthn API call for new one");const t=new AbortController;return this.controller=t,t.signal}},u=["cross-platform","platform"];function l(t){if(t&&!(u.indexOf(t)<0))return t}async function c(n,u=!1){var c,d;if(!r())throw new Error("WebAuthn is not supported in this browser");let h;0!==(null===(c=n.allowCredentials)||void 0===c?void 0:c.length)&&(h=null===(d=n.allowCredentials)||void 0===d?void 0:d.map(a));const f={...n,challenge:e(n.challenge),allowCredentials:h},p={};if(u){if(!await async function(){const t=window.PublicKeyCredential;return void 0!==t.isConditionalMediationAvailable&&t.isConditionalMediationAvailable()}())throw Error("Browser does not support WebAuthn autofill");if(document.querySelectorAll("input[autocomplete*='webauthn']").length<1)throw Error('No <input> with `"webauthn"` in its `autocomplete` attribute was detected');p.mediation="conditional",f.allowCredentials=[]}let v;p.publicKey=f,p.signal=s.createNewAbortSignal();try{v=await navigator.credentials.get(p)}catch(t){throw function({error:t,options:e}){const{publicKey:n}=e;if(!n)throw Error("options was missing required publicKey property");if("AbortError"===t.name){if(e.signal===(new AbortController).signal)return new o("Authentication ceremony was sent an abort signal","AbortError")}else if("NotAllowedError"===t.name);else if("SecurityError"===t.name){const t=window.location.hostname;if(!i(t))return new o(`${window.location.hostname} is an invalid domain`,"SecurityError");if(n.rpId!==t)return new o(`The RP ID "${n.rpId}" is invalid for this domain`,"SecurityError")}else if("UnknownError"===t.name)return new o("The authenticator was unable to process the specified options, or could not create a new assertion signature","UnknownError");return t}({error:t,options:p})}if(!v)throw new Error("Authentication was not completed");const{id:y,rawId:w,response:g,type:m}=v;let C;var S;return g.userHandle&&(S=g.userHandle,C=new TextDecoder("utf-8").decode(S)),{id:y,rawId:t(w),response:{authenticatorData:t(g.authenticatorData),clientDataJSON:t(g.clientDataJSON),signature:t(g.signature),userHandle:C},type:m,clientExtensionResults:v.getClientExtensionResults(),authenticatorAttachment:l(v.authenticatorAttachment)}}async function d(){return!!r()&&PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}function h(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var f;f=jQuery,Craft.Auth2fa=Garnish.Base.extend({$auth2faLoginFormContainer:null,$auth2faSetupFormContainer:null,$alternative2faLink:null,$alternative2faTypesContainer:null,$viewSetupBtns:null,$errors:null,slideout:null,$removeSetupButton:null,$closeButton:null,$verifyButton:null,init:function(t){this.setSettings(t,Craft.Auth2fa.defaults),this.$auth2faLoginFormContainer=f("#auth-2fa-form"),this.$auth2faSetupFormContainer=f("#auth-2fa-setup"),this.$viewSetupBtns=this.$auth2faSetupFormContainer.find("button.auth-2fa-view-setup"),this.$errors=f("#login-errors"),this.addListener(this.$viewSetupBtns,"click","onViewSetupBtnClick")},show2faForm:function(t,e){this.$auth2faLoginFormContainer.html("").append(t),e.addClass("auth-2fa"),f("#login-form-buttons").hide();var n=this.$auth2faLoginFormContainer.find(".submit");this.connectAlternative2fa(),this.onSubmitResponse(n)},getCurrent2faType:function(t){var e=t.attr("data-2fa-type");return void 0===e&&(e=null),e},initSlideout:function(){var t=this;this.$errors=this.slideout.$container.find(".so-notice"),this.$closeButton=this.slideout.$container.find("button.close"),this.$verifyButton=this.slideout.$container.find("#auth2fa-verify"),this.$removeSetupButton=this.slideout.$container.find("#auth-2fa-remove-setup"),this.addListener(this.$removeSetupButton,"click","onRemoveSetup"),this.addListener(this.$closeButton,"click","onClickClose"),this.addListener(this.$verifyButton,"click","onVerify"),this.addListener(this.slideout.$container,"keypress",(function(e){e.keyCode===Garnish.RETURN_KEY&&t.$verifyButton.trigger("click")}))},onViewSetupBtnClick:function(t){var e=this,n=f(t.currentTarget);n.disable(),t.preventDefault();var a={selectedMethod:this.getCurrent2faType(n)};Craft.sendActionRequest("POST",this.settings.setupSlideoutHtml,{data:a}).then((function(t){e.slideout=new Craft.Slideout(t.data.html),e.initSlideout(),"craft\\auth\\type\\WebAuthn"===a.selectedMethod&&r()&&new Craft.WebAuthnSetup(e.slideout),"craft\\auth\\type\\RecoveryCodes"===a.selectedMethod&&new Craft.RecoveryCodesSetup(e.slideout),e.slideout.on("close",(function(t){e.$removeSetupButton=null,e.slideout=null,n.enable()}))})).catch((function(t){var e=t.response;Craft.cp.displayError(e.data.message),n.enable()}))},onClickClose:function(t){this.slideout.close()},onRemoveSetup:function(t){var e=this;t.preventDefault();var n=this.getCurrent2faType(this.slideout.$container.find("#setup-form-2fa"));void 0===n&&(n=null);var r={currentMethod:n};confirm(Craft.t("app","Are you sure you want to delete this setup?"))&&Craft.sendActionRequest("POST",this.settings.removeSetup,{data:r}).then((function(e){f(t.currentTarget).remove(),Craft.cp.displayNotice(Craft.t("app","2FA setup removed."))})).catch((function(t){Craft.cp.displayError(t.response.data.message)})).finally((function(){e.slideout.close()}))},onVerify:function(t){var e=this;t.preventDefault();var n=this.slideout.$container.find("#auth2fa-verify");n.addClass("loading");var r={auth2faFields:{},currentMethod:null};r.auth2faFields=this._get2faFields(this.slideout.$container),r.currentMethod=this._getCurrentMethodInput(this.slideout.$container),Craft.sendActionRequest("POST",this.settings.saveSetup,{data:r}).then((function(t){e.onSubmitResponse(n),Craft.cp.displayNotice(Craft.t("app","2FA settings saved.")),e.slideout.close()})).catch((function(t){var r=t.response;e.onSubmitResponse(n),e.showStatus(r.data.message),Craft.cp.displayError(r.data.message)}))},onSubmitResponse:function(t){t.removeClass("loading")},showStatus:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"error";this.clearStatus(),"error"==e?this.$errors.addClass("error"):this.$errors.removeClass("error"),this.$errors.text(t)},clearStatus:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;null!==t?t.empty():this.$errors.empty()},verify2faCode:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n={auth2faFields:{},currentMethod:null},r=new Craft.Auth2fa;return n.auth2faFields=r._get2faFields(t),n.currentMethod=r._getCurrentMethodInput(t),Craft.sendActionRequest("POST","users/verify-2fa",{data:n}).then((function(t){return e?Promise.resolve({success:!0}):Promise.resolve({success:!0,returnUrl:t.data.returnUrl})})).catch((function(t){var e=t.response;return Promise.reject({success:!1,error:e.data.message})}))},onAlternative2faTypeClick:function(t){this.clearStatus();var e=f(t.currentTarget);e.attr("disabled",!0).disable();var n=this.getCurrent2faType(this.$auth2faLoginFormContainer.find("#verifyContainer"));null===n&&(this.$alternative2faLink.hide(),this.showStatus(Craft.t("app","No alternative 2FA methods available.")));var r={currentMethod:n};this.getAlternative2faTypes(r,e)},getAlternative2faTypes:function(t,e){var n=this;Craft.sendActionRequest("POST",this.settings.fetchAlternative2faTypes,{data:t}).then((function(t){void 0!==t.data.alternativeTypes&&n.showAlternative2faTypes(t.data.alternativeTypes)})).catch((function(t){var e=t.response;n.showStatus(e.data.message)})).finally((function(){e.attr("disabled",!1).enable()}))},showAlternative2faTypes:function(t){var e=this;this.$alternative2faTypesContainer.empty();var n=Object.entries(t).map((function(t){var e,n,r=(n=2,function(t){if(Array.isArray(t))return t}(e=t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,a,i=[],o=!0,s=!1;try{for(n=n.call(t);!(o=(r=n.next()).done)&&(i.push(r.value),!e||i.length!==e);o=!0);}catch(t){s=!0,a=t}finally{try{o||null==n.return||n.return()}finally{if(s)throw a}}return i}}(e,n)||function(t,e){if(t){if("string"==typeof t)return h(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?h(t,e):void 0}}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}());return{key:r[0],value:r[1]}}));n.length>0?n.forEach((function(t){e.$alternative2faTypesContainer.append('<li><button class="alternative-2fa-type" type="button" value="'+t.key+'">'+t.value.name+"</button></li>")})):this.showStatus(Craft.t("app","No alternative 2FA methods available.")),this.$alternative2faLink.hide().after(this.$alternative2faTypesContainer),this.addListener(f(".alternative-2fa-type"),"click","onSelectAlternative2faType")},onSelectAlternative2faType:function(t){var e=this,n=f(t.currentTarget);n.attr("disabled",!0).disable();var r={selectedMethod:f(t.currentTarget).attr("value")};Craft.sendActionRequest("POST",this.settings.loadAlternative2faType,{data:r}).then((function(t){void 0!==t.data.auth2faForm&&(e.$auth2faLoginFormContainer.html("").append(t.data.auth2faForm),e.connectAlternative2fa(),e.onSubmitResponse())})).catch((function(t){t.response})).finally((function(){n.attr("disabled",!1).enable()}))},connectAlternative2fa:function(){this.$alternative2faLink=this.$auth2faLoginFormContainer.find("#alternative-2fa"),this.$alternative2faTypesContainer=this.$auth2faLoginFormContainer.find("#alternative-2fa-types"),this.addListener(this.$alternative2faLink,"click","onAlternative2faTypeClick")},_get2faFields:function(t){var e={};return t.find('input[name^="auth2faFields[').each((function(t,n){var r=f(n).attr("id");e[r]=f(n).val()})),e},_getCurrentMethodInput:function(t){return t.find('input[name="currentMethod"').val()}},{defaults:{fetchAlternative2faTypes:"auth/fetch-alternative-2fa-types",loadAlternative2faType:"auth/load-alternative-2fa-type",setupSlideoutHtml:"auth/setup-slideout-html",saveSetup:"auth/save-setup",removeSetup:"auth/remove-setup"}}),n(16),function(t){Craft.WebAuthnLogin=Garnish.Base.extend({$submitBtn:null,$errors:null,webAuthnPlatformAuthenticatorSupported:!0,init:function(){var e=this;this.$submitBtn=t("#webauthn-login"),this.$errors=t("#login-errors"),r()?d().then((function(t){t||(e.webAuthnPlatformAuthenticatorSupported=!1)})).catch((function(t){e.showError(t)})).finally((function(){e.addListener(e.$submitBtn,"click","auth"),e.$submitBtn=new Garnish.MultiFunctionBtn(e.$submitBtn,{changeButtonText:!0})})):this.$submitBtn.disable()},supportCheck:function(){var t=!0;return this.webAuthnPlatformAuthenticatorSupported||(t=confirm(Craft.t("app","In this browser, you can only use a security key with an external (roaming) authenticator like Yubikey or Titan Key."))),t},auth:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"login";t.preventDefault(),this.supportCheck()&&(this.$submitBtn.busyEvent(),this.clearErrors(),this.startAuthentication(!1,n).then((function(t){e.$submitBtn.successEvent(),null!=t.returnUrl&&(window.location.href=t.returnUrl)})).catch((function(t){e.$submitBtn.failureEvent(),e.processFailure(t.error)})))},startAuthentication:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"login";return Craft.sendActionRequest("POST","users/start-webauthn-login",{}).then((function(r){var a=r.data.authenticationOptions;try{return c(a).then((function(r){return Promise.resolve(t.verifyAuthentication(a,r,e,n))})).catch((function(t){return Promise.reject({success:!1,error:t})}))}catch(t){return Promise.reject({success:!1,error:t})}})).catch((function(t){var e;return e=void 0!==t.error?t.error:t.response.data.message,Promise.reject({success:!1,error:e})}))},verifyAuthentication:function(t,e,n,r){var a={authenticationOptions:JSON.stringify(t),authResponse:JSON.stringify(e)},i="users/webauthn-verify";return"elevateSessionWebAuthn"==r&&(i="users/start-elevated-session",a.passwordless=!0,a.passwordlessMethod="WebAuthn"),Craft.sendActionRequest("POST",i,{data:a}).then((function(t){return n?Promise.resolve({success:!0}):Promise.resolve({success:!0,returnUrl:t.data.returnUrl})})).catch((function(t){var e=t.response;return Promise.reject({success:!1,error:e.data.message})}))},processFailure:function(t){this.showError(t),this.$submitBtn.failureEvent()},showError:function(e){this.clearErrors(),t('<p style="display: none;">'+e+"</p>").appendTo(this.$errors).velocity("fadeIn")},clearErrors:function(){this.$errors.empty()}}),new Craft.WebAuthnLogin}(jQuery),function(n){Craft.WebAuthnSetup=Craft.Auth2fa.extend({$addSecurityKeyBtn:null,$keysTable:null,webAuthnPlatformAuthenticatorSupported:!0,init:function(t,e){var a=this;this.setSettings(e,Craft.WebAuthnSetup.defaults),this.slideout=t,this.initSlideout(),this.$addSecurityKeyBtn=n("#add-security-key"),this.$keysTable=this.slideout.$container.find("#webauthn-security-keys"),r()?d().then((function(t){t||(a.webAuthnPlatformAuthenticatorSupported=!1)})).catch((function(t){a.showError(t)})).finally((function(){a.addListener(a.$addSecurityKeyBtn,"click","onAddSecurityKeyBtn")})):(Craft.cp.displayError(Craft.t("app","This browser does not support WebAuthn.")),this.$addSecurityKeyBtn.disable()),null!==this.$keysTable&&this.addListener(this.$keysTable.find(".delete"),"click","onDeleteSecurityKey")},onAddSecurityKeyBtn:function(t){if(!n(t.currentTarget).hasClass("disabled")){var e=!0;this.webAuthnPlatformAuthenticatorSupported||(e=confirm(Craft.t("app","In this browser, you can only use a security key with an external (roaming) authenticator like Yubikey or Titan Key."))),e&&(this.showStatus(Craft.t("app","Waiting for elevated session"),""),Craft.elevatedSessionManager.requireElevatedSession(this.startRegistration.bind(this),this.failedElevation.bind(this)))}},failedElevation:function(){this.clearStatus()},startRegistration:function(){var n=this;this.clearStatus(),Craft.sendActionRequest("POST",this.settings.generateRegistrationOptions).then((function(u){var c=u.data.registrationOptions;try{n.showStatus(Craft.t("app","Starting registration"),"");var d=Craft.escapeHtml(prompt(Craft.t("app","Please enter a name for the security key")));(async function(n){var u,c;if(!r())throw new Error("WebAuthn is not supported in this browser");const d={publicKey:{...n,challenge:e(n.challenge),user:{...n.user,id:(c=n.user.id,(new TextEncoder).encode(c))},excludeCredentials:null===(u=n.excludeCredentials)||void 0===u?void 0:u.map(a)}};let h;d.signal=s.createNewAbortSignal();try{h=await navigator.credentials.create(d)}catch(t){throw function({error:t,options:e}){var n,r;const{publicKey:a}=e;if(!a)throw Error("options was missing required publicKey property");if("AbortError"===t.name){if(e.signal===(new AbortController).signal)return new o("Registration ceremony was sent an abort signal","AbortError")}else if("ConstraintError"===t.name){if(!0===(null===(n=a.authenticatorSelection)||void 0===n?void 0:n.requireResidentKey))return new o("Discoverable credentials were required but no available authenticator supported it","ConstraintError");if("required"===(null===(r=a.authenticatorSelection)||void 0===r?void 0:r.userVerification))return new o("User verification was required but no available authenticator supported it","ConstraintError")}else{if("InvalidStateError"===t.name)return new o("The authenticator was previously registered","InvalidStateError");if("NotAllowedError"===t.name);else{if("NotSupportedError"===t.name)return 0===a.pubKeyCredParams.filter((t=>"public-key"===t.type)).length?new o('No entry in pubKeyCredParams was of type "public-key"',"NotSupportedError"):new o("No available authenticator supported any of the specified pubKeyCredParams algorithms","NotSupportedError");if("SecurityError"===t.name){const t=window.location.hostname;if(!i(t))return new o(`${window.location.hostname} is an invalid domain`,"SecurityError");if(a.rp.id!==t)return new o(`The RP ID "${a.rp.id}" is invalid for this domain`,"SecurityError")}else if("TypeError"===t.name){if(a.user.id.byteLength<1||a.user.id.byteLength>64)return new o("User ID was not between 1 and 64 characters","TypeError")}else if("UnknownError"===t.name)return new o("The authenticator was unable to process the specified options, or could not create a new credential","UnknownError")}}return t}({error:t,options:d})}if(!h)throw new Error("Registration was not completed");const{id:f,rawId:p,response:v,type:y}=h;let w;return"function"==typeof v.getTransports&&(w=v.getTransports()),{id:f,rawId:t(p),response:{attestationObject:t(v.attestationObject),clientDataJSON:t(v.clientDataJSON),transports:w},type:y,clientExtensionResults:h.getClientExtensionResults(),authenticatorAttachment:l(h.authenticatorAttachment)}})(c).then((function(t){n.verifyRegistration(t,d)})).catch((function(t){n.showStatus(Craft.t("app","Registration failed:")+" "+t.message)}))}catch(t){n.showStatus(t)}})).catch((function(t){var e=t.response;n.showStatus(e.data.message)}))},verifyRegistration:function(t,e){var n=this;this.showStatus(Craft.t("app","Starting verification"),"");var r={credentials:JSON.stringify(t),credentialName:e};Craft.sendActionRequest("POST",this.settings.verifyRegistration,{data:r}).then((function(t){n.clearStatus(),t.data.verified?(Craft.cp.displaySuccess(Craft.t("app","Security key registered.")),t.data.html&&(n.slideout.$container.html(t.data.html),n.init(n.slideout))):n.showStatus(Craft.t("app","Something went wrong!"))})).catch((function(t){var e=t.response;n.showStatus(e.data.message)}))},onDeleteSecurityKey:function(t){var e=this;t.preventDefault();var r=n(t.currentTarget).attr("data-uid"),a=n(t.currentTarget).parents("tr").find('[data-name="credentialName"]').text(),i={uid:r},o=confirm(Craft.t("app","Are you sure you want to delete ‘{credentialName}‘ security key?",{credentialName:a}));void 0!==r&&o&&Craft.sendActionRequest("POST",this.settings.deleteSecurityKey,{data:i}).then((function(t){Craft.cp.displaySuccess(t.data.message),t.data.html&&(e.slideout.$container.html(t.data.html),e.init(e.slideout))})).catch((function(t){var n=t.response;e.showStatus(n.data.message)}))}},{defaults:{generateRegistrationOptions:"auth/generate-registration-options",verifyRegistration:"auth/verify-registration",deleteSecurityKey:"auth/delete-security-key"}})}(jQuery)}()}();
//# sourceMappingURL=auth.js.map