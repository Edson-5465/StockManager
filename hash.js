// hash.js
import bcrypt from "bcrypt"; // or "bcryptjs" if you installed that

const password = "admin123"; // replace with your chosen password
const hash = await bcrypt.hash(password, 10); // 10 = salt rounds
console.log("Hashed password:", hash);


