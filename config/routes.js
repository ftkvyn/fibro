/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  
  '/profile/:id': 'ViewController.profile',

  '/profile/:id/edit': 'ViewController.editProfile',

  '/project/new' : 'ViewController.newProject',

  '/project/:id': 'ViewController.project',

  '/project/:id/edit': 'ViewController.editProject',

  '/post/new/:projectId' : 'ViewController.newPost',

  '/posts/forProject/:id': 'ViewController.projectPosts',

  '/post/:id': 'ViewController.post',

  '/post/:id/edit': 'ViewController.editPost',

  '/chats': 'ViewController.chats',

  '/search/user': 'ViewController.searchUser',
  
  '/search/project': 'ViewController.searchProject',

  '/chat/:type/:id': 'ViewController.chat',

  'get /api/chats/:skip/:count' : 'ChatController.find',

  'post /api/chat/markAsRead/:type/:id' : 'ChatController.markAsRead',

  'get /api/message/:type/:id': 'MessageController.find',

  'get /api/chat/users/:type/:id': 'ChatController.getChatUsers',

  'post /api/message/:type/:id': 'MessageController.create',

  'get /api/message/subscribe/:type/:id': 'MessageController.subscribe',

  'post /api/comment/:id': 'CommentController.create',

  'get /api/comment/subscribe/:id': 'CommentController.subscribe',

  'get /api/notifications/subscribe/': 'UserController.subscribe',

  '/': {
    view: 'home'
  },  

  'post /api/user/search' : 'UserController.search',

  'get /api/user/some/:count' : 'UserController.forMain',

  'post /api/user/image' : 'UserController.uploadImage',

  'get /api/user/forMain/:count' : 'UserController.forMain',

  'post /api/project/search' : 'ProjectController.search',

  'get /api/project/some/:count' : 'ProjectController.forMain',

  'get /api/project/forMain/:skip/:count' : 'ProjectController.forMain',

  'get /api/project/authored' : 'ProjectController.authoredProjects',

  'get /api/project/leave' : 'ProjectController.leave',

  'get /api/post/forMain/:skip/:count' : 'PostController.forMain',

  'get /api/invitation/forUser' : 'InvitationController.forCurrentUser',

  'post /api/invitation/accept/' : 'InvitationController.accept',

  'post /api/invitation/decline/' : 'InvitationController.decline',

  'get /api/membershipRequest/forAuthor/:id?': 'MembershipRequestController.findForAuthor',

  'post /api/membershipRequest/accept/' : 'MembershipRequestController.accept',

  'post /api/membershipRequest/decline/' : 'MembershipRequestController.decline',

  'get /auth/facebook': 'AuthController.fb_authenticate',

  'get /auth/facebook/callback': 'AuthController.fb_authenticate_callback',

  'get /auth/logout': 'AuthController.logout',

  //temp method
  'get /auth/loginById/:id':'AuthController.loginById',

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
