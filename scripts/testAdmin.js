import 'dotenv/config.js';
import { supabase } from '../supabaseApi.js';
import supabaseAdmin from '../supabaseAdminApi.js';

const customerEmail = 'sean.tan@test.com';

console.log('creating user');

// Create user in supabase
const { data: userData, error1 } = await supabaseAdmin.auth.admin.createUser({
  email: customerEmail,
  password: 'password',
});

console.log(userData);
console.log(error1);

// Add user to profile table
const { error2 } = await supabase.from('profiles').insert({
  id: userData.user.id,
  email: customerEmail,
  membershipLevel: 'member',
});
