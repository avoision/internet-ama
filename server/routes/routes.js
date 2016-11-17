module.exports = function(app, passport) {

	// route for home page
	app.get(['/', '/share'], function(req, res) {
		// var uid = req.session.id
		
		var authStatus

		if (req.isAuthenticated()) {
			authStatus = 'auth'
		} else {
			authStatus = 'no-auth'
		}



		res.render('index.ejs', {
			// uid: req.session.passport.user
			authStatus: authStatus,
			uid: req.session.id
			}); // load the index.ejs file

	});


	// app.get('/login', function(req, res) {
	// 	res.render('login.ejs'); // load the index.ejs file
	// });



	// // route for showing the profile page
	// app.get('/profile', isLoggedIn, function(req, res) {
	// 	res.render('profile.ejs', {
	// 		user : req.user // get the user out of session and pass to template
	// 	});
	// });
	
	// // route for logging out
	// app.get('/logout', function(req, res) {
	// 	req.logout();
	// 	res.redirect('/');
	// });

	// =====================================
	// TWITTER ROUTES =====================
	// =====================================
	// route for twitter authentication and login
	app.get('/auth/twitter', passport.authenticate('twitter'));

	// handle the callback after twitter has authenticated the user
	// app.get('/auth/twitter/callback',
	app.get('/login/twitter/return',
		passport.authenticate('twitter', {
			successRedirect : '/',
			failureRedirect : '/error'
		}));

};

// route middleware to make sure a user is logged in
// function isLoggedIn(req, res, next) {
// 	// if user is authenticated, carry on
// 	if (req.isAuthenticated()) {
//   	// console.log("Session ID is: " + req.sessionID)
// 		return next();
// 	} else {
// 	// if not authenticated, redirect to home page
// 	// res.redirect('/login');
// 		console.log("NO. Session ID is: " + req.sessionID)
// 		return next();
// 	}
// }


