// =============================================
// MediCare Pro — Backend Server
// Node.js + Express + JSON File Storage + JWT
// =============================================

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'medicare_pro_secret_2026';

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve frontend files

// ===== JSON FILE DATABASE =====
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function readDB(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

function writeDB(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ===== SEED DEFAULT DATA =====
function seedData() {
  // Default admin user
  if (readDB('users').length === 0) {
    const users = [
      {
        id: uuidv4(),
        name: 'Admin Karimov',
        email: 'admin@medicare.pro',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        clinic: 'City Medical Center',
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Fatima Yusupova',
        email: 'reception@medicare.pro',
        password: bcrypt.hashSync('reception123', 10),
        role: 'reception',
        clinic: 'City Medical Center',
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Dr. Amir Aliyev',
        email: 'doctor@medicare.pro',
        password: bcrypt.hashSync('doctor123', 10),
        role: 'doctor',
        clinic: 'City Medical Center',
        createdAt: new Date().toISOString()
      }
    ];
    writeDB('users', users);
    console.log('✅ Default users seeded');
  }

  // Default patients
  if (readDB('patients').length === 0) {
    const patients = [
      { id: 'P-0001', name: 'Omar Saidov', age: 42, phone: '+998 90 123 4567', email: 'omar@email.com', gender: 'Male', bloodType: 'A+', allergies: 'Penicillin', address: 'Toshkent, Chilonzor', lastVisit: '2026-02-26', status: 'active', insurance: 'O\'z sug\'urta', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
      { id: 'P-0002', name: 'Nilufar Rashidova', age: 35, phone: '+998 91 234 5678', email: 'nilufar@email.com', gender: 'Female', bloodType: 'B+', allergies: '', address: 'Toshkent, Yunusobod', lastVisit: '2026-02-22', status: 'active', insurance: 'Kapital sug\'urta', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
      { id: 'P-0003', name: 'Bobur Toshmatov', age: 58, phone: '+998 93 345 6789', email: 'bobur@email.com', gender: 'Male', bloodType: 'O+', allergies: 'Aspirin', address: 'Samarqand', lastVisit: '2026-02-20', status: 'active', insurance: '', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
      { id: 'P-0004', name: 'Zulfiya Mirzayeva', age: 29, phone: '+998 94 456 7890', email: 'zulfiya@email.com', gender: 'Female', bloodType: 'AB+', allergies: '', address: 'Toshkent, Mirzo Ulug\'bek', lastVisit: '2026-01-15', status: 'active', insurance: '', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
      { id: 'P-0005', name: 'Jasur Raimov', age: 47, phone: '+998 95 567 8901', email: 'jasur@email.com', gender: 'Male', bloodType: 'B-', allergies: '', address: 'Andijon', lastVisit: '2026-02-18', status: 'inactive', insurance: '', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
    ];
    writeDB('patients', patients);
    console.log('✅ Default patients seeded');
  }

  // Default appointments
  if (readDB('appointments').length === 0) {
    const appointments = [
      { id: 'APT-001', patientId: 'P-0001', patientName: 'Omar Saidov', doctor: 'Dr. Aliyev', service: 'Kardiologiya', date: '2026-02-26', time: '9:00', status: 'confirmed', phone: '+998 90 123 4567', notes: '', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
      { id: 'APT-002', patientId: 'P-0002', patientName: 'Nilufar Rashidova', doctor: 'Dr. Karimova', service: 'Nevrologiya', date: '2026-02-26', time: '10:30', status: 'confirmed', phone: '+998 91 234 5678', notes: '', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
      { id: 'APT-003', patientId: 'P-0003', patientName: 'Bobur Toshmatov', doctor: 'Dr. Yusupov', service: 'Ortopediya', date: '2026-02-26', time: '11:00', status: 'pending', phone: '+998 93 345 6789', notes: '', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
      { id: 'APT-004', patientId: 'P-0004', patientName: 'Zulfiya Mirzayeva', doctor: 'Dr. Nazarova', service: 'Oftalmologiya', date: '2026-02-26', time: '14:00', status: 'confirmed', phone: '+998 94 456 7890', notes: '', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
      { id: 'APT-005', patientId: 'P-0005', patientName: 'Jasur Raimov', doctor: 'Dr. Aliyev', service: 'Kardiologiya', date: '2026-02-26', time: '15:00', status: 'missed', phone: '+998 95 567 8901', notes: '', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
    ];
    writeDB('appointments', appointments);
    console.log('✅ Default appointments seeded');
  }

  // Default payments
  if (readDB('payments').length === 0) {
    const payments = [
      { id: 'TXN-8821', patientId: 'P-0001', patientName: 'Omar Saidov', service: 'Kardiologiya', amountUSD: 120, amountUZS: 1536000, method: 'Karta', date: '2026-02-26', status: 'completed', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
      { id: 'TXN-8820', patientId: 'P-0002', patientName: 'Nilufar Rashidova', service: 'Nevrologiya', amountUSD: 140, amountUZS: 1792000, method: 'Sug\'urta', date: '2026-02-26', status: 'completed', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
      { id: 'TXN-8819', patientId: 'P-0003', patientName: 'Bobur Toshmatov', service: 'Ortopediya', amountUSD: 95, amountUZS: 1216000, method: 'Naqd', date: '2026-02-25', status: 'completed', clinic: 'City Medical Center', createdAt: new Date().toISOString() },
    ];
    writeDB('payments', payments);
    console.log('✅ Default payments seeded');
  }
}

// ===== AUTH MIDDLEWARE =====
function auth(requiredRoles = []) {
  return (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token kerak' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Ruxsat yo\'q' });
      }
      next();
    } catch {
      res.status(401).json({ error: 'Token yaroqsiz' });
    }
  };
}

// ===== ROUTES =====

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', time: new Date().toISOString() });
});

// ── AUTH ──
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email va parol kerak' });

  const users = readDB('users');
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Email yoki parol noto\'g\'ri' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, clinic: user.clinic },
    JWT_SECRET, { expiresIn: '24h' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, clinic: user.clinic }
  });
});

app.get('/api/auth/me', auth(), (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/change-password', auth(), (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const users = readDB('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(401).json({ error: 'Joriy parol noto\'g\'ri' });
  }
  user.password = bcrypt.hashSync(newPassword, 10);
  writeDB('users', users);
  res.json({ message: 'Parol muvaffaqiyatli o\'zgartirildi' });
});

// ── PATIENTS ──
app.get('/api/patients', auth(), (req, res) => {
  let patients = readDB('patients').filter(p => p.clinic === req.user.clinic);
  const { search, status } = req.query;
  if (search) patients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search));
  if (status) patients = patients.filter(p => p.status === status);
  res.json({ patients, total: patients.length });
});

app.get('/api/patients/:id', auth(), (req, res) => {
  const patient = readDB('patients').find(p => p.id === req.params.id && p.clinic === req.user.clinic);
  if (!patient) return res.status(404).json({ error: 'Bemor topilmadi' });
  const appointments = readDB('appointments').filter(a => a.patientId === patient.id);
  const payments = readDB('payments').filter(p => p.patientId === patient.id);
  res.json({ patient, appointments, payments });
});

app.post('/api/patients', auth(['admin', 'reception']), (req, res) => {
  const { name, phone, email, age, gender, bloodType, allergies, address, insurance } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Ism va telefon kerak' });
  const patients = readDB('patients');
  const newPatient = {
    id: 'P-' + String(patients.length + 1).padStart(4, '0'),
    name, phone, email: email || '', age: age || 0, gender: gender || '', bloodType: bloodType || '',
    allergies: allergies || '', address: address || '', insurance: insurance || '',
    lastVisit: null, status: 'active', clinic: req.user.clinic,
    createdAt: new Date().toISOString()
  };
  patients.push(newPatient);
  writeDB('patients', patients);
  res.status(201).json({ patient: newPatient, message: 'Bemor qo\'shildi' });
});

app.put('/api/patients/:id', auth(['admin', 'reception']), (req, res) => {
  const patients = readDB('patients');
  const idx = patients.findIndex(p => p.id === req.params.id && p.clinic === req.user.clinic);
  if (idx === -1) return res.status(404).json({ error: 'Bemor topilmadi' });
  patients[idx] = { ...patients[idx], ...req.body, id: patients[idx].id, clinic: patients[idx].clinic };
  writeDB('patients', patients);
  res.json({ patient: patients[idx], message: 'Bemor ma\'lumotlari yangilandi' });
});

app.delete('/api/patients/:id', auth(['admin']), (req, res) => {
  const patients = readDB('patients');
  const idx = patients.findIndex(p => p.id === req.params.id && p.clinic === req.user.clinic);
  if (idx === -1) return res.status(404).json({ error: 'Bemor topilmadi' });
  patients.splice(idx, 1);
  writeDB('patients', patients);
  res.json({ message: 'Bemor o\'chirildi' });
});

// ── APPOINTMENTS ──
app.get('/api/appointments', auth(), (req, res) => {
  let appts = readDB('appointments').filter(a => a.clinic === req.user.clinic);
  const { date, status, doctor, search } = req.query;
  if (date) appts = appts.filter(a => a.date === date);
  if (status) appts = appts.filter(a => a.status === status);
  if (doctor) appts = appts.filter(a => a.doctor.toLowerCase().includes(doctor.toLowerCase()));
  if (search) appts = appts.filter(a => a.patientName.toLowerCase().includes(search.toLowerCase()));
  appts.sort((a, b) => a.time.localeCompare(b.time));
  res.json({ appointments: appts, total: appts.length });
});

app.get('/api/appointments/today', auth(), (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const appts = readDB('appointments')
    .filter(a => a.clinic === req.user.clinic && a.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));
  res.json({ appointments: appts, total: appts.length });
});

app.post('/api/appointments', auth(['admin', 'reception', 'doctor']), (req, res) => {
  const { patientId, patientName, doctor, service, date, time, notes, phone } = req.body;
  if (!patientName || !doctor || !date || !time) {
    return res.status(400).json({ error: 'Bemor, shifokor, sana va vaqt kerak' });
  }
  const appts = readDB('appointments');
  // Check for time conflict
  const conflict = appts.find(a => a.clinic === req.user.clinic && a.doctor === doctor && a.date === date && a.time === time && a.status !== 'cancelled');
  if (conflict) return res.status(409).json({ error: 'Bu vaqtda shifokor band' });

  const newAppt = {
    id: 'APT-' + String(appts.length + 1).padStart(3, '0'),
    patientId: patientId || null, patientName, doctor, service: service || 'Umumiy',
    date, time, status: 'confirmed', notes: notes || '', phone: phone || '',
    clinic: req.user.clinic, createdAt: new Date().toISOString()
  };
  appts.push(newAppt);
  writeDB('appointments', appts);

  // Update patient's lastVisit
  if (patientId) {
    const patients = readDB('patients');
    const patient = patients.find(p => p.id === patientId);
    if (patient) { patient.lastVisit = date; writeDB('patients', patients); }
  }

  res.status(201).json({ appointment: newAppt, message: 'Qabul band qilindi' });
});

app.put('/api/appointments/:id', auth(['admin', 'reception']), (req, res) => {
  const appts = readDB('appointments');
  const idx = appts.findIndex(a => a.id === req.params.id && a.clinic === req.user.clinic);
  if (idx === -1) return res.status(404).json({ error: 'Qabul topilmadi' });
  appts[idx] = { ...appts[idx], ...req.body, id: appts[idx].id, clinic: appts[idx].clinic };
  writeDB('appointments', appts);
  res.json({ appointment: appts[idx], message: 'Qabul yangilandi' });
});

app.patch('/api/appointments/:id/status', auth(['admin', 'reception', 'doctor']), (req, res) => {
  const { status } = req.body;
  const validStatuses = ['confirmed', 'pending', 'completed', 'cancelled', 'missed'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Noto\'g\'ri holat' });
  const appts = readDB('appointments');
  const appt = appts.find(a => a.id === req.params.id && a.clinic === req.user.clinic);
  if (!appt) return res.status(404).json({ error: 'Qabul topilmadi' });
  appt.status = status;
  appt.updatedAt = new Date().toISOString();
  writeDB('appointments', appts);
  res.json({ appointment: appt, message: `Holat "${status}" ga o'zgartirildi` });
});

app.delete('/api/appointments/:id', auth(['admin', 'reception']), (req, res) => {
  const appts = readDB('appointments');
  const idx = appts.findIndex(a => a.id === req.params.id && a.clinic === req.user.clinic);
  if (idx === -1) return res.status(404).json({ error: 'Qabul topilmadi' });
  appts.splice(idx, 1);
  writeDB('appointments', appts);
  res.json({ message: 'Qabul o\'chirildi' });
});

// ── PAYMENTS ──
app.get('/api/payments', auth(['admin', 'reception']), (req, res) => {
  let payments = readDB('payments').filter(p => p.clinic === req.user.clinic);
  const { date, method, status } = req.query;
  if (date) payments = payments.filter(p => p.date === date);
  if (method) payments = payments.filter(p => p.method === method);
  if (status) payments = payments.filter(p => p.status === status);
  res.json({ payments, total: payments.length });
});

app.post('/api/payments', auth(['admin', 'reception']), (req, res) => {
  const { patientId, patientName, service, amountUSD, method } = req.body;
  if (!patientName || !amountUSD || !method) {
    return res.status(400).json({ error: 'Bemor, miqdor va to\'lov usuli kerak' });
  }
  const payments = readDB('payments');
  const UZS_RATE = 12800;
  const newPayment = {
    id: 'TXN-' + (8800 + payments.length + 1),
    patientId: patientId || null, patientName, service: service || 'Umumiy',
    amountUSD: parseFloat(amountUSD), amountUZS: Math.round(parseFloat(amountUSD) * UZS_RATE),
    method, date: new Date().toISOString().split('T')[0],
    status: 'completed', clinic: req.user.clinic,
    createdAt: new Date().toISOString()
  };
  payments.push(newPayment);
  writeDB('payments', payments);
  res.status(201).json({ payment: newPayment, message: 'To\'lov qabul qilindi' });
});

// ── STATS / DASHBOARD ──
app.get('/api/stats', auth(), (req, res) => {
  const clinic = req.user.clinic;
  const today = new Date().toISOString().split('T')[0];

  const patients = readDB('patients').filter(p => p.clinic === clinic);
  const appointments = readDB('appointments').filter(a => a.clinic === clinic);
  const payments = readDB('payments').filter(p => p.clinic === clinic);

  const todayAppts = appointments.filter(a => a.date === today);
  const todayPayments = payments.filter(p => p.date === today);
  const todayRevUSD = todayPayments.reduce((s, p) => s + (p.amountUSD || 0), 0);

  const thisMonth = today.substring(0, 7);
  const monthlyPayments = payments.filter(p => p.date?.startsWith(thisMonth));
  const monthlyRevUSD = monthlyPayments.reduce((s, p) => s + (p.amountUSD || 0), 0);

  res.json({
    patients: { total: patients.length, active: patients.filter(p => p.status === 'active').length },
    appointments: {
      todayTotal: todayAppts.length,
      todayConfirmed: todayAppts.filter(a => a.status === 'confirmed').length,
      todayMissed: todayAppts.filter(a => a.status === 'missed').length,
      todayCompleted: todayAppts.filter(a => a.status === 'completed').length,
    },
    revenue: {
      todayUSD: todayRevUSD,
      todayUZS: Math.round(todayRevUSD * 12800),
      monthlyUSD: monthlyRevUSD,
      monthlyUZS: Math.round(monthlyRevUSD * 12800),
    }
  });
});

// ── USERS / STAFF ──
app.get('/api/users', auth(['admin']), (req, res) => {
  const users = readDB('users')
    .filter(u => u.clinic === req.user.clinic)
    .map(({ password, ...u }) => u); // Remove password
  res.json({ users, total: users.length });
});

app.post('/api/users', auth(['admin']), (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Barcha maydonlar kerak' });
  }
  const users = readDB('users');
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Bu email allaqachon mavjud' });
  }
  const newUser = {
    id: uuidv4(), name, email,
    password: bcrypt.hashSync(password, 10),
    role, clinic: req.user.clinic,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  writeDB('users', users);
  const { password: _, ...userOut } = newUser;
  res.status(201).json({ user: userOut, message: 'Xodim qo\'shildi' });
});

// ── CONTACT FORM ──
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'Ism va xabar kerak' });
  const contacts = readDB('contacts');
  contacts.push({ id: uuidv4(), name, email, phone, message, createdAt: new Date().toISOString() });
  writeDB('contacts', contacts);
  res.json({ message: 'Xabaringiz qabul qilindi. Tez orada murojaat qilamiz!' });
});

// ── PUBLIC BOOKING (no auth) ──
app.post('/api/book', (req, res) => {
  const { patientName, phone, service, doctor, date, time, notes } = req.body;
  if (!patientName || !phone || !date || !time) {
    return res.status(400).json({ error: 'Ism, telefon, sana va vaqt kerak' });
  }
  const appts = readDB('appointments');
  const newAppt = {
    id: 'APT-' + String(appts.length + 1).padStart(3, '0'),
    patientId: null, patientName, phone, doctor: doctor || 'Har qanday shifokor',
    service: service || 'Umumiy konsultatsiya', date, time,
    status: 'pending', notes: notes || '', clinic: 'City Medical Center',
    source: 'website', createdAt: new Date().toISOString()
  };
  appts.push(newAppt);
  writeDB('appointments', appts);
  res.status(201).json({ appointment: newAppt, message: 'Qabul muvaffaqiyatli band qilindi!' });
});

// ===== START =====
seedData();

app.listen(PORT, () => {
  console.log('');
  console.log('🏥 MediCare Pro Server ishga tushdi!');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🌐 Sayt:   http://localhost:${PORT}/index.html`);
  console.log(`⚙️  Admin:  http://localhost:${PORT}/admin.html`);
  console.log(`🏪 Qabulxona: http://localhost:${PORT}/reception.html`);
  console.log('');
  console.log('📝 Default login credentials:');
  console.log('   Admin:     admin@medicare.pro / admin123');
  console.log('   Reception: reception@medicare.pro / reception123');
  console.log('   Doctor:    doctor@medicare.pro / doctor123');
  console.log('');
});
