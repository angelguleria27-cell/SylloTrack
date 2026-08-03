const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@syllotrack.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'System Admin';

    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`✅ Default admin account seeded (${adminEmail})`);
    } else {
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log(`✅ Updated existing account (${adminEmail}) to admin role`);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding default admin user:', error.message);
  }
};

module.exports = seedAdmin;
