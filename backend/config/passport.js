import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import db from "../config/db.js";


export default function(passport) {
  passport.use(new LocalStrategy(
    { usernameField: "email" }, // use email instead of username
    async (email, password, done) => {
      try {
        const user = await UserModel.findByEmail(email);
        if (!user) return done(null, false, { message: "No user found" });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return done(null, false, { message: "Incorrect password" });

        if (user.status !== "active") {
          return done(null, false, { message: "Account not approved yet" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      done(null, rows[0]);
    } catch (err) {
      done(err);
    }
  });
}
