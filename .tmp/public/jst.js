this["JST"] = this["JST"] || {};

this["JST"]["assets/templates/directives/inviteDirective.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n\tInvite to :\n\t<label for=\'message\'>Add invitation mesage, if you want:</label><br/>\n\t<textarea rows="3" cols="40" ng-model=\'new.message\' class=\'form-control\' id=\'message\'></textarea><br/>\n\t<button class=\'btn btn-success\' ng-click=\'send(userId, projectId)\'>Invite!</button>\n</div>';

}
return __p
};

this["JST"]["assets/templates/home/invites.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div \t\t\t\n\t\t\tng-controller=\'InviteController as inviteCtrl\' \n\t\t\tng-show=\'inviteCtrl.invitations.length\'\n\t\t\tng-init=\'inviteCtrl.loadInvites()\'>\n\t\t\t<h3>Invitations to projects</h3>\n\t\t\t\t<ul>\n\t\t\t\t\t<li ng-repeat=\'invite in inviteCtrl.invitations\'>\n\t\t\t\t\t\t<a href="/project/{{invite.project.id}}" target="_blank"><strong>{{invite.project.name}}</strong></a>\n\t\t\t\t\t\tby \n\t\t\t\t\t\t<a href="/profile/{{invite.inviter.id}}" target="_blank">{{invite.inviter.name}}</a> (<em>{{invite.createdAt | date}}</em>)<br/>\n\t\t\t\t\t\t<span ng-show=\'invite.message\'>{{invite.message}}</span>\n\t\t\t\t\t\t<div ng-hide=\'invite.isDeclined\'>\n\t\t\t\t\t\t<button class=\'btn btn-success\' ng-click=\'inviteCtrl.accept(invite.id)\'>Accept</button>\n\t\t\t\t\t\t<button class=\'btn btn-danger\' ng-click=\'inviteCtrl.decline(invite.id)\'>Decline</button>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div ng-show=\'invite.isDeclined\'>\n\t\t\t\t\t\t\tDeclined.\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\n\t\t\t</div>';

}
return __p
};

this["JST"]["assets/templates/home/requests.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div \t\t\t\n\t\t\tng-controller=\'MembershipRequestController as requestCtrl\' \n\t\t\tng-show=\'requestCtrl.requests.length\'\n\t\t\tng-init=\'requestCtrl.loadRequests()\'>\n\t\t\t<h3>Requests for membership</h3>\n\t\t\t\t<ul>\n\t\t\t\t\t<li ng-repeat=\'request in requestCtrl.requests\'>\n\t\t\t\t\t\t<a href="/profile/{{request.user.id}}" target="_blank"><strong>{{request.user.name}}</strong></a>\n\t\t\t\t\t\tto <a href="/project/{{request.project.id}}" target="_blank">{{request.project.name}}</a> (<em>{{request.createdAt | date}}</em>)<br/>\n\t\t\t\t\t\t<span ng-show=\'request.message\'>{{request.message}}</span>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t<button class=\'btn btn-success\' ng-click=\'requestCtrl.accept(request.id)\'>Accept</button>\n\t\t\t\t\t\t<button class=\'btn btn-danger\' ng-click=\'requestCtrl.decline(request.id)\'>Decline</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>';

}
return __p
};