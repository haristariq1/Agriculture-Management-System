require('dotenv').config(); const sequelize = require('./config/db');
(async () => { try { await sequelize.authenticate(); console.log('PostgreSQL connected successfully'); } catch (e) { console.error(`Connection failed: ${e.message}`); process.exitCode = 1; } finally { await sequelize.close(); } })();
