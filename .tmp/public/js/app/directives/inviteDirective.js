fibroApp.directive('inviteDirective', function () {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment         
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: ''
        },
        templateUrl: '/templates/directives/inviteDirective.html',
        controller: function(){
            
        }, //Embed a custom controller in the directive        
    }
});