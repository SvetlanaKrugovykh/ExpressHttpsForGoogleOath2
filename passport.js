

const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID: "566234933611-ht40ios0fdr0ohjltssk9esmkm05s74m.apps.googleusercontent.com",
	clientSecret: "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",
	callbackURL: "http://localhost:5000/google/callback",
	passReqToCallback: true
},
	function (request, accessToken, refreshToken, profile, done) {
		return done(null, profile);
	}
));

