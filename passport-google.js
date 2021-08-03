var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require ("./config/database");
const { getUserById } = require("./api/users/user.service")


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((req, user, done) => {

    pool.query("SELECT * FROM registration WHERE id = ?", [user.id], (err, rows) => {
        if (err) {
            console.log(err);
            return done(null, err);
        }
            done(null, user);
    });
});



passport.use(new GoogleStrategy({
    clientID: "678912145911-ah84kpfah4pm1qkhkekv1faj49a9e03k.apps.googleusercontent.com",
    clientSecret: "E2e5ooMdClAUg1DNAme_QnuR",
    callbackURL: "http://localhost:3000/google/callback"
  },
    function (req, accessToken, refreshToken, profile, done) {

        process.nextTick(function () {
            pool.query("SELECT * FROM registration WHERE google_id = ?", [profile.id], (err, user) => {
                if (err) {console.log(err)
                    return done(err);
                    
                } 
                //     else if (user) {
                //     console.log("done")
                //     console.log(profile.id)
                //     console.log(profile.emails[0].value)
                //     console.log(profile.name.givenName + ' ' + profile.name.familyName)
                //     return done(null, user);
                // }
                    

                 else {
                    let newUser = {
                        google_id: profile.id,
                        google_email: profile.emails[0].value,
                        google_name: profile.name.givenName + ' ' + profile.name.familyName,
                        oaccess_token: profile.access_token,
                        otoken_type: profile.token_type,
                        oid_token: profile.id_token,
                    };
                    console.log(newUser)
                    pool.query("INSERT INTO registration (google_id, email, firstName) VALUES (?, ?, ?)",
                        [newUser.google_id, newUser.google_email, newUser.google_name], (err, rows) => {
                            if (err) {
                                console.log(err);
                            }

                            return done(null, newUser);
                        })
                }
            });
        });
    }
));