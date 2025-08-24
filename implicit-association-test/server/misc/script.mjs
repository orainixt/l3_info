import bcrypt from 'bcrypt';

const hash = await bcrypt.hash("superadmin", 10);
console.log(hash);
