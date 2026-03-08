import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'mock-google-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-secret',
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });

      if (user) {
        // Merge accounts
        if (!user.googleId) {
          user.googleId = profile.id;
          if (!user.avatar) user.avatar = profile.photos[0].value;
          user.isEmailVerified = true;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        name: profile.displayName,
        email: email,
        googleId: profile.id,
        avatar: profile.photos[0].value,
        isEmailVerified: true
      });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'mock-facebook-id',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'mock-facebook-secret',
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'picture.type(large)']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      if (!email) {
        return done(new Error('Facebook account must have an email attached.'), null);
      }

      let user = await User.findOne({ email });

      if (user) {
        if (!user.facebookId) {
          user.facebookId = profile.id;
          if (!user.avatar && profile.photos && profile.photos.length > 0) {
            user.avatar = profile.photos[0].value;
          }
          user.isEmailVerified = true;
          await user.save();
        }
        return done(null, user);
      }

      const name = `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim();

      user = await User.create({
        name: name,
        email: email,
        facebookId: profile.id,
        avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        isEmailVerified: true
      });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

export default passport;
