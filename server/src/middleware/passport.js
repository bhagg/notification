import bcrypt from 'bcryptjs';
import PassportLocal from 'passport-local';
import User from '../models/user.js';
import passport from 'passport';
const LocalStrategy = PassportLocal.Strategy;

module.exports = ()=> {
  passport.use(
      new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
        User.findOne({email: email, type: {$exists: true}})
            .then((admin)=>{
              if (!admin) {
                return done(null, false,
                    {message: 'That Email in not registered'});
              }
              // Match password
              bcrypt.compare(password, admin.password, (err, isMatch)=>{
                if (err) throw err;
                if (isMatch) {
                  return done(null, admin);
                } else {
                  return done(null, false, {message: 'Password Incorrect'});
                }
              });
            }).catch((err) =>console.log(err));
      }),
  );
  passport.serializeUser((admin, done) =>{
    done(null, admin.id);
  });

  passport.deserializeUser((id, done)=> {
    User.findById(id, (err, admin)=> {
      done(err, admin);
    });
  });
};
