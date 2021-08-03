const passport = require('passport');
const passportLocal = require('passport-local');
const { login } = require('../api/users/user.controller');
const loginService = require('../services/loginService');

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = ()=>{
    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
        async (req, email, password, done)=>{
            try{
                let user = await loginService.findUserByEmail(email);
                if (!user){
                    return done(null, false, req.flash("errors", `This email "${email}" doesn't exist`));
                }
                if (user){
                    let match = await loginService.comparePasswordUser(user, password);
                    console.log(match)
                    if (match === true){
                        return done(null, user, null);
                    } else {
                        return done(null, false, req.flash("errors, match"));
                    }
                }
            } catch(err){
                return done(null, false, err);
            }
        }
    
        ))
};

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

// passport.deserializeUser((id, done)=>{
//     console.log(id)
//     loginService.findById(id).then((user)=>{
//         return done(null, user);
//     }).catch(error=>{
//         return done(error, null)
//     });
// });

module.exports = initPassportLocal;