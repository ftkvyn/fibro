this["JST"] = this["JST"] || {};

this["JST"]["assets/templates/directives/inviteDirective.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n\tInvite to :\n\t<label for=\'message\'>Add invitation mesage, if you want:</label><br/>\n\t<textarea rows="3" cols="40" ng-model=\'new.message\' class=\'form-control\' id=\'message\'></textarea><br/>\n\t<button class=\'btn btn-success\' ng-click=\'send(userId, projectId)\'>Invite!</button>\n</div>';

}
return __p
};