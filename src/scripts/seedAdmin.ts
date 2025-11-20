import db from '../db';
import bcrypt from 'bcryptjs';

function main() {
  const email = 'admin@tailor.test';

  const exists = db.prepare('SELECT id FROM users WHERE email=?').get(email);
  if (exists) {
    console.log('Admin already exists:', email);
    return;
  }

  const password = 'admin123';
  const hash = bcrypt.hashSync(password, 10);

  db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  ).run('Admin', email, hash, 'ADMIN');

  console.log('Admin created:');
  console.log('  email   :', email);
  console.log('  password:', password);
}

main();