// ===== SHARED UTILITIES =====
function showToast(type, title, message = '', duration = 4000) {
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<div class="toast-icon">${icons[type]||'ℹ️'}</div><div class="toast-content"><div class="toast-title">${title}</div><div class="toast-message">${message}</div></div><div class="toast-close" onclick="this.parentElement.remove()">✕</div>`;
  container.appendChild(t);
  setTimeout(() => t?.remove(), duration);
}
function openModal(id) { const el=document.getElementById(id); if(el){el.classList.add('active');document.body.style.overflow='hidden';} }
function closeModal(id) { const el=document.getElementById(id); if(el){el.classList.remove('active');document.body.style.overflow='';} }
document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)closeModal(o.id);}));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.querySelectorAll('.modal-overlay.active').forEach(m=>closeModal(m.id)); });

// ===== SIDEBAR =====
let sidebarCollapsed = false;
function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  const sb = document.getElementById('sidebar');
  const main = document.getElementById('dashMain');
  if (sidebarCollapsed) { sb.classList.add('collapsed'); main.classList.add('sidebar-collapsed'); }
  else { sb.classList.remove('collapsed'); main.classList.remove('sidebar-collapsed'); }
}
function openSidebar() {
  document.getElementById('sidebar')?.classList.add('mobile-open');
  document.getElementById('sidebarOverlay')?.classList.add('active');
  document.body.style.overflow='hidden';
}
function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('mobile-open');
  document.getElementById('sidebarOverlay')?.classList.remove('active');
  document.body.style.overflow='';
}

// ===== PAGE NAVIGATION =====
function showPage(name) {
  document.querySelectorAll('.dash-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) { page.classList.add('active'); page.classList.add('page-enter'); }
  const item = document.querySelector(`[onclick="showPage('${name}')"]`);
  if (item) item.classList.add('active');
  closeSidebar();
  // Lazy render
  if (name === 'appointments') renderApptTable();
  if (name === 'patients') renderPatientTable();
  if (name === 'doctors') renderDoctorsGrid();
  if (name === 'services') renderServicesTable();
  if (name === 'staff') renderStaffTable();
  if (name === 'revenue') updateRevenuePage();
  if (name === 'payments') renderPaymentsTable();
  if (name === 'schedule') renderSchedule();
  if (name === 'automation') renderAutomation();
  if (name === 'analytics') renderAnalytics();
  if (name === 'crm') renderCRM();
}

// ===== DATA =====
const APPOINTMENTS = [
  {id:'APT-001',patient:'Omar Saidov',doctor:'Dr. Aliyev',service:'Cardiology',date:'Feb 26, 2026',time:'9:00 AM',status:'confirmed'},
  {id:'APT-002',patient:'Nilufar Rashidova',doctor:'Dr. Karimova',service:'Neurology',date:'Feb 26, 2026',time:'10:30 AM',status:'confirmed'},
  {id:'APT-003',patient:'Bobur Toshmatov',doctor:'Dr. Yusupov',service:'Orthopedics',date:'Feb 26, 2026',time:'11:00 AM',status:'pending'},
  {id:'APT-004',patient:'Zulfiya Mirzayeva',doctor:'Dr. Nazarova',service:'Ophthalmology',date:'Feb 26, 2026',time:'2:00 PM',status:'confirmed'},
  {id:'APT-005',patient:'Jasur Raimov',doctor:'Dr. Aliyev',service:'Cardiology',date:'Feb 26, 2026',time:'3:00 PM',status:'completed'},
  {id:'APT-006',patient:'Malika Ergasheva',doctor:'Dr. Karimova',service:'Neurology',date:'Feb 25, 2026',time:'10:00 AM',status:'cancelled'},
  {id:'APT-007',patient:'Timur Khasanov',doctor:'Dr. Yusupov',service:'Orthopedics',date:'Feb 25, 2026',time:'2:30 PM',status:'completed'},
  {id:'APT-008',patient:'Dildora Nazarova',doctor:'Dr. Nazarova',service:'Ophthalmology',date:'Feb 25, 2026',time:'4:00 PM',status:'confirmed'},
];
const PATIENTS = [
  {id:'P-0001',name:'Omar Saidov',age:42,phone:'+1-555-0101',lastVisit:'Feb 26, 2026',status:'active',initials:'OS',color:'var(--grad-primary)'},
  {id:'P-0002',name:'Nilufar Rashidova',age:35,phone:'+1-555-0102',lastVisit:'Feb 22, 2026',status:'active',initials:'NR',color:'var(--grad-success)'},
  {id:'P-0003',name:'Bobur Toshmatov',age:58,phone:'+1-555-0103',lastVisit:'Feb 20, 2026',status:'active',initials:'BT',color:'var(--grad-warm)'},
  {id:'P-0004',name:'Zulfiya Mirzayeva',age:29,phone:'+1-555-0104',lastVisit:'Jan 15, 2026',status:'active',initials:'ZM',color:'var(--grad-secondary)'},
  {id:'P-0005',name:'Jasur Raimov',age:47,phone:'+1-555-0105',lastVisit:'Feb 18, 2026',status:'inactive',initials:'JR',color:'var(--grad-primary)'},
  {id:'P-0006',name:'Malika Ergasheva',age:33,phone:'+1-555-0106',lastVisit:'Feb 10, 2026',status:'active',initials:'ME',color:'var(--grad-success)'},
];
const DOCTORS = [
  {name:'Dr. Amir Aliyev',specialty:'Cardiology',exp:15,rating:4.9,patients:284,appts:12,status:'available',emoji:'👨‍⚕️',color:'#6366f1'},
  {name:'Dr. Lena Karimova',specialty:'Neurology',exp:12,rating:4.8,patients:198,appts:8,status:'busy',emoji:'👩‍⚕️',color:'#06b6d4'},
  {name:'Dr. Rustam Yusupov',specialty:'Orthopedics',exp:18,rating:4.9,patients:156,appts:6,status:'available',emoji:'👨‍⚕️',color:'#10b981'},
  {name:'Dr. Sara Nazarova',specialty:'Ophthalmology',exp:10,rating:5.0,patients:112,appts:4,status:'available',emoji:'👩‍⚕️',color:'#f43f5e'},
];
const SERVICES = [
  {name:'Cardiology Consultation',cat:'Cardiology',duration:45,price:120,bookings:284,status:'active'},
  {name:'ECG Test',cat:'Diagnostics',duration:30,price:80,bookings:156,status:'active'},
  {name:'Neurology Assessment',cat:'Neurology',duration:60,price:140,bookings:198,status:'active'},
  {name:'Orthopedic Exam',cat:'Orthopedics',duration:45,price:95,bookings:89,status:'active'},
  {name:'Eye Checkup',cat:'Ophthalmology',duration:30,price:85,bookings:112,status:'active'},
  {name:'General Checkup',cat:'General',duration:30,price:45,bookings:410,status:'active'},
  {name:'Dental Cleaning',cat:'Dental',duration:45,price:60,bookings:167,status:'inactive'},
];
const STAFF = [
  {name:'Admin Karimov',role:'Admin',dept:'Management',email:'admin@mc.pro',status:'active',last:'Just now'},
  {name:'Fatima Yusupova',role:'Reception',dept:'Front Desk',email:'fatima@mc.pro',status:'active',last:'5 min ago'},
  {name:'Laziz Tursunov',role:'Reception',dept:'Front Desk',email:'laziz@mc.pro',status:'active',last:'1 hr ago'},
  {name:'Dr. Amir Aliyev',role:'Doctor',dept:'Cardiology',email:'aliyev@mc.pro',status:'active',last:'Today'},
  {name:'Dr. Lena Karimova',role:'Doctor',dept:'Neurology',email:'karimova@mc.pro',status:'active',last:'Today'},
];
const PAYMENTS = [
  {id:'TXN-8821',patient:'Omar Saidov',service:'Cardiology',amount:120,method:'Card',date:'Feb 26',status:'completed'},
  {id:'TXN-8820',patient:'Nilufar Rashidova',service:'Neurology',amount:140,method:'Insurance',date:'Feb 26',status:'completed'},
  {id:'TXN-8819',patient:'Bobur Toshmatov',service:'Orthopedics',amount:95,method:'Cash',date:'Feb 25',status:'completed'},
  {id:'TXN-8818',patient:'Zulfiya Mirzayeva',service:'Ophthalmology',amount:85,method:'Card',date:'Feb 25',status:'completed'},
  {id:'TXN-8817',patient:'Jasur Raimov',service:'Cardiology',amount:120,method:'Card',date:'Feb 24',status:'refunded'},
  {id:'TXN-8816',patient:'Malika Ergasheva',service:'Neurology',amount:140,method:'Insurance',date:'Feb 24',status:'pending'},
];

const STATUS_BADGE = {
  confirmed:'<span class="badge badge-success">✓ Confirmed</span>',
  pending:'<span class="badge badge-warning">⏳ Pending</span>',
  completed:'<span class="badge badge-info">✓ Completed</span>',
  cancelled:'<span class="badge badge-error">✕ Cancelled</span>',
  active:'<span class="badge badge-success">Active</span>',
  inactive:'<span class="badge badge-gray">Inactive</span>',
  available:'<span class="badge badge-success">Available</span>',
  busy:'<span class="badge badge-warning">Busy</span>',
  refunded:'<span class="badge badge-error">Refunded</span>',
};

// ===== RENDER FUNCTIONS =====
function renderApptTable(filter='all') {
  const body = document.getElementById('apptTableBody');
  if (!body) return;
  const data = filter==='all' ? APPOINTMENTS : APPOINTMENTS.filter(a=>a.status===filter);
  body.innerHTML = data.map(a=>`
    <tr>
      <td><span style="font-family:monospace;font-size:11px;color:var(--primary);">${a.id}</span></td>
      <td><div style="display:flex;align-items:center;gap:8px;"><div class="avatar avatar-sm" style="background:var(--grad-primary);color:white;">${a.patient.split(' ').map(n=>n[0]).join('')}</div><span style="font-weight:600;font-size:13px;">${a.patient}</span></div></td>
      <td style="font-size:13px;">${a.doctor}</td>
      <td><span class="badge badge-primary">${a.service}</span></td>
      <td style="font-size:13px;">${a.date} · <strong>${a.time}</strong></td>
      <td>${STATUS_BADGE[a.status]||a.status}</td>
      <td><div style="display:flex;gap:4px;">
        <button class="btn btn-icon-sm btn-ghost" onclick="showToast('info','Edit','Opening appointment editor...')" title="Edit">✏️</button>
        <button class="btn btn-icon-sm btn-ghost" onclick="showToast('info','Notes','CRM notes for ${a.patient}')" title="Notes">📋</button>
        <button class="btn btn-icon-sm btn-ghost" onclick="showToast('warning','Cancel','Appointment ${a.id} cancelled')" title="Cancel">✕</button>
      </div></td>
    </tr>`).join('');
}
function filterAppts(v) { renderApptTable(v); }

function renderPatientTable(search='') {
  const body = document.getElementById('patientTableBody');
  if (!body) return;
  const data = search ? PATIENTS.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())) : PATIENTS;
  body.innerHTML = data.map(p=>`
    <tr>
      <td><div style="display:flex;align-items:center;gap:10px;"><div class="avatar avatar-sm" style="background:${p.color};color:white;">${p.initials}</div><div><div style="font-weight:600;font-size:13px;">${p.name}</div></div></div></td>
      <td><span style="font-family:monospace;font-size:11px;color:var(--primary);">${p.id}</span></td>
      <td style="font-size:13px;">${p.age} yrs</td>
      <td style="font-size:13px;">${p.phone}</td>
      <td style="font-size:13px;">${p.lastVisit}</td>
      <td>${STATUS_BADGE[p.status]}</td>
      <td><div style="display:flex;gap:4px;">
        <button class="btn btn-primary btn-sm" onclick="openPatientCRM('${p.id}','${p.name}')">View CRM</button>
        <button class="btn btn-icon-sm btn-ghost" onclick="showToast('info','Edit','Editing ${p.name}')">✏️</button>
      </div></td>
    </tr>`).join('');
}
function filterPatients(v) { renderPatientTable(v); }

function openPatientCRM(id, name) {
  showPage('crm');
  renderCRM(id, name);
}

function renderCRM(id = 'P-0001', name = 'Omar Saidov') {
  const el = document.getElementById('crmContent');
  if (!el) return;
  el.innerHTML = `
  <div class="patient-profile-header">
    <div class="patient-profile-avatar">OS</div>
    <div class="patient-profile-info">
      <div class="patient-profile-name">${name}</div>
      <div style="font-size:13px;color:var(--text-muted);margin-top:2px;">Patient ID: <span style="font-family:monospace;color:var(--primary);">${id}</span></div>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <span class="badge badge-success">Active Patient</span>
        <span class="badge badge-primary">Cardiology</span>
        <span class="badge badge-info">Insurance: BlueCross</span>
      </div>
    </div>
    <div class="patient-profile-stats">
      <div class="patient-stat"><div class="patient-stat-value">12</div><div class="patient-stat-label">Total Visits</div></div>
      <div class="patient-stat"><div class="patient-stat-value">$1,440</div><div class="patient-stat-label">Total Spent</div></div>
      <div class="patient-stat"><div class="patient-stat-value">4.8★</div><div class="patient-stat-label">Satisfaction</div></div>
    </div>
    <div style="display:flex;gap:8px;flex-direction:column;">
      <button class="btn btn-primary btn-sm" onclick="openModal('addApptModal')">📅 Book Visit</button>
      <button class="btn btn-secondary btn-sm" onclick="showToast('info','Note','Adding clinical note...')">📝 Add Note</button>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-6);">
    <div class="card">
      <div class="card-header"><div style="font-weight:700;">Patient Info</div></div>
      <div class="card-body" style="display:grid;gap:12px;">
        ${[['Date of Birth','March 15, 1984 (42 yrs)'],['Gender','Male'],['Blood Type','A+'],['Phone','+1-555-0101'],['Email','omar.saidov@email.com'],['Address','456 Oak Street, Health City'],['Insurance','BlueCross (Policy #BC-4421)'],['Allergies','Penicillin, Aspirin']].map(([k,v])=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-light);"><span style="font-size:13px;color:var(--text-muted);">${k}</span><span style="font-size:13px;font-weight:600;">${v}</span></div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div style="font-weight:700;">Clinical Notes</div>
        <button class="btn btn-primary btn-sm" onclick="showToast('success','Note','Note saved!')">+ Add</button>
      </div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
        <div style="background:var(--warning-bg);border:1px solid var(--warning);border-radius:12px;padding:12px;">
          <div style="font-size:11px;font-weight:700;color:var(--warning);margin-bottom:4px;">⚠️ ALLERGY ALERT</div>
          <div style="font-size:13px;">Allergic to Penicillin and Aspirin. Use alternative antibiotics.</div>
        </div>
        ${[{d:'Feb 26, 2026',t:'Post-Consultation Note',n:'Patient reported improved chest pain. BP: 128/84. Continue current medication. Follow-up in 4 weeks.',dr:'Dr. Aliyev'},{d:'Jan 15, 2026',t:'Routine Checkup',n:'Annual checkup completed. Cholesterol slightly elevated. Recommended dietary changes and light exercise. Ordered lipid panel.',dr:'Dr. Aliyev'},{d:'Dec 3, 2025',t:'Emergency Visit',n:'Patient presented with acute chest pain. ECG normal. Ruled out MI. Diagnosed with anxiety-related palpitations.',dr:'Dr. Aliyev'}].map(n=>`<div style="border:1px solid var(--border-light);border-radius:12px;padding:12px;"><div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-weight:600;font-size:13px;">${n.t}</span><span style="font-size:11px;color:var(--text-muted);">${n.d}</span></div><div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px;">${n.n}</div><div style="font-size:11px;color:var(--primary);">— ${n.dr}</div></div>`).join('')}
      </div>
    </div>
  </div>
  <div style="margin-top:var(--space-6);">
    <div class="card">
      <div class="card-header"><div style="font-weight:700;">Visit History</div><span class="badge badge-gray">12 visits</span></div>
      <div class="card-body">
        <div class="visit-record">
          ${[{d:'Feb 26, 2026',s:'Confirmed',diag:'Hypertension Follow-up',tx:'Continued Lisinopril 10mg, follow-up in 4 weeks',dr:'Dr. Aliyev'},{d:'Jan 15, 2026',s:'Completed',diag:'Annual Physical',tx:'Lipid panel ordered, dietary counseling provided',dr:'Dr. Aliyev'},{d:'Dec 3, 2025',s:'Completed',diag:'Chest Pain — R/O MI',tx:'ECG performed, anxiety-related. Prescribed Lorazepam PRN',dr:'Dr. Aliyev'},{d:'Oct 22, 2025',s:'Completed',diag:'Hypertension',tx:'Started Lisinopril 5mg, BP monitoring at home',dr:'Dr. Aliyev'}].map(v=>`
          <div class="visit-item">
            <div class="visit-date"><span>📅</span> ${v.d} · ${STATUS_BADGE[v.s.toLowerCase()]||v.s} · <span style="color:var(--primary);">${v.dr}</span></div>
            <div class="visit-diagnosis">🏥 ${v.diag}</div>
            <div class="visit-notes">Treatment: ${v.tx}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function renderDoctorsGrid() {
  const grid = document.getElementById('doctorsGrid');
  if (!grid) return;
  grid.innerHTML = DOCTORS.map(d=>`
    <div class="card" style="overflow:hidden;">
      <div style="height:100px;background:linear-gradient(135deg,${d.color}22,${d.color}44);display:flex;align-items:center;justify-content:center;font-size:50px;">${d.emoji}</div>
      <div class="card-body">
        <div style="font-size:var(--text-lg);font-weight:700;margin-bottom:4px;">${d.name}</div>
        <div style="color:var(--primary);font-weight:600;font-size:13px;margin-bottom:12px;">${d.specialty}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;margin-bottom:16px;">
          <div style="background:var(--bg-secondary);padding:8px;border-radius:10px;"><div style="font-weight:800;font-size:15px;">${d.exp}</div><div style="font-size:10px;color:var(--text-muted);">Years Exp</div></div>
          <div style="background:var(--bg-secondary);padding:8px;border-radius:10px;"><div style="font-weight:800;font-size:15px;">${d.rating}⭐</div><div style="font-size:10px;color:var(--text-muted);">Rating</div></div>
          <div style="background:var(--bg-secondary);padding:8px;border-radius:10px;"><div style="font-weight:800;font-size:15px;">${d.patients}</div><div style="font-size:10px;color:var(--text-muted);">Patients</div></div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          ${STATUS_BADGE[d.status]}
          <div style="display:flex;gap:6px;">
            <button class="btn btn-primary btn-sm" onclick="openModal('addApptModal')">Book</button>
            <button class="btn btn-secondary btn-sm" onclick="showToast('info','Schedule','Opening schedule...')">Schedule</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function renderServicesTable() {
  const body = document.getElementById('servicesTableBody');
  if (!body) return;
  body.innerHTML = SERVICES.map(s=>`
    <tr>
      <td style="font-weight:600;font-size:13px;">${s.name}</td>
      <td><span class="badge badge-primary">${s.cat}</span></td>
      <td style="font-size:13px;">${s.duration} min</td>
      <td style="font-weight:700;color:var(--success);">$${s.price}</td>
      <td style="font-size:13px;">${s.bookings}</td>
      <td>${STATUS_BADGE[s.status]}</td>
      <td><div style="display:flex;gap:4px;">
        <button class="btn btn-icon-sm btn-ghost" onclick="showToast('info','Edit','Editing service...')">✏️</button>
        <button class="btn btn-icon-sm btn-ghost" onclick="showToast('warning','Delete','Service deleted')">🗑️</button>
      </div></td>
    </tr>`).join('');
}

function renderStaffTable() {
  const body = document.getElementById('staffTableBody');
  if (!body) return;
  const roleClass = {Admin:'role-admin',Doctor:'role-doctor',Reception:'role-reception'};
  body.innerHTML = STAFF.map(s=>`
    <tr>
      <td><div style="display:flex;align-items:center;gap:8px;"><div class="avatar avatar-sm" style="background:var(--grad-primary);color:white;">${s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div><span style="font-weight:600;font-size:13px;">${s.name}</span></div></td>
      <td><span class="role-badge ${roleClass[s.role]||'role-reception'}">${s.role}</span></td>
      <td style="font-size:13px;">${s.dept}</td>
      <td style="font-size:13px;">${s.email}</td>
      <td>${STATUS_BADGE[s.status]}</td>
      <td style="font-size:13px;color:var(--text-muted);">${s.last}</td>
      <td><div style="display:flex;gap:4px;">
        <button class="btn btn-icon-sm btn-ghost" onclick="showToast('info','Edit','Editing ${s.name}')">✏️</button>
        <button class="btn btn-icon-sm btn-ghost" onclick="showToast('warning','Deactivate','${s.name} deactivated')">🔒</button>
      </div></td>
    </tr>`).join('');
}

function renderPaymentsTable() {
  const body = document.getElementById('paymentsTableBody');
  if (!body) return;
  body.innerHTML = PAYMENTS.map(p=>`
    <tr>
      <td><span style="font-family:monospace;font-size:11px;color:var(--primary);">${p.id}</span></td>
      <td style="font-weight:600;font-size:13px;">${p.patient}</td>
      <td style="font-size:13px;">${p.service}</td>
      <td style="font-weight:800;color:var(--success);">$${p.amount}</td>
      <td><span class="badge badge-gray">${p.method}</span></td>
      <td style="font-size:13px;">${p.date}</td>
      <td>${STATUS_BADGE[p.status]||`<span class="badge badge-gray">${p.status}</span>`}</td>
    </tr>`).join('');
}

function renderSchedule() {
  const el = document.getElementById('scheduleContent');
  if (!el) return;
  const days = ['Mon','Tue','Wed','Thu','Fri'];
  const times = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM'];
  const events = {
    '9:00 AM-Mon':{text:'Omar S.',doctor:'Aliyev',cls:''},
    '10:30 AM-Tue':{text:'Nilufar R.',doctor:'Karimova',cls:'success'},
    '11:00 AM-Mon':{text:'Bobur T.',doctor:'Yusupov',cls:'warning'},
    '2:00 PM-Wed':{text:'Zulfiya M.',doctor:'Nazarova',cls:''},
    '3:00 PM-Thu':{text:'Jasur R.',doctor:'Aliyev',cls:'success'},
    '9:00 AM-Wed':{text:'Malika E.',doctor:'Karimova',cls:'warning'},
  };
  el.innerHTML = `
  <div class="schedule-grid">
    <div class="schedule-cell header"></div>
    ${days.map(d=>`<div class="schedule-cell header">${d}</div>`).join('')}
    ${times.map(t=>`
      <div class="schedule-cell time">${t}</div>
      ${days.map(d=>{
        const key=`${t}-${d}`;
        const ev=events[key];
        return `<div class="schedule-cell">${ev?`<div class="schedule-event ${ev.cls}">${ev.text}<br><small style="font-weight:400;font-size:9px;">Dr.${ev.doctor}</small></div>`:''}</div>`;
      }).join('')}
    `).join('')}
  </div>`;
}

function updateRevenuePage() {
  const el = document.getElementById('revenuePageContent');
  const period = document.getElementById('revPeriod')?.value || 'monthly';
  if (!el) return;
  const months=['Jan','Feb','Mar','Apr','May','Jun'];
  const vals=[18400,21200,19800,24600,28100,32400];
  el.innerHTML = `
  <div class="dashboard-stats" style="margin-bottom:var(--space-6);">
    <div class="stat-card primary"><div class="stat-icon" style="background:var(--primary-50);">💰</div><div class="stat-value">$32,400</div><div class="stat-label">Monthly Revenue</div><div class="stat-change up">↑ 15.3% vs last month</div></div>
    <div class="stat-card success"><div class="stat-icon" style="background:var(--success-bg);">📅</div><div class="stat-value">$3,240</div><div class="stat-label">Avg Daily Revenue</div><div class="stat-change up">↑ 8.2%</div></div>
    <div class="stat-card warning"><div class="stat-icon" style="background:var(--warning-bg);">📊</div><div class="stat-value">$386,800</div><div class="stat-label">Annual Revenue</div><div class="stat-change up">↑ 22.1% YoY</div></div>
    <div class="stat-card info"><div class="stat-icon" style="background:var(--info-bg);">🎯</div><div class="stat-value">94.2%</div><div class="stat-label">Collection Rate</div><div class="stat-change up">↑ 2.1%</div></div>
  </div>
  <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-6);">
    <div class="card">
      <div class="card-header"><div style="font-weight:700;">Revenue Trend (2026)</div></div>
      <div class="card-body">
        <div class="chart-bars" id="revChart" style="height:180px;"></div>
        <div class="chart-labels">
          ${months.map(m=>`<div class="chart-label">${m}</div>`).join('')}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div style="font-weight:700;">Revenue by Service</div></div>
      <div class="card-body" id="revServiceBreak"></div>
    </div>
  </div>`;

  setTimeout(() => {
    const rc = document.getElementById('revChart');
    if (rc) {
      const max = Math.max(...vals);
      rc.innerHTML = vals.map(v=>`<div class="chart-bar-group"><div class="chart-bar primary" style="height:${Math.round(v/max*100)}%;"></div></div>`).join('');
    }
    const rsb = document.getElementById('revServiceBreak');
    if (rsb) renderServiceBreakdown(rsb);
  }, 50);
}

function renderServiceBreakdown(el) {
  const items = [
    {name:'Cardiology',pct:34,color:'var(--primary)',amount:'$11,016'},
    {name:'Neurology',pct:22,color:'var(--secondary)',amount:'$7,128'},
    {name:'Orthopedics',pct:18,color:'var(--success)',amount:'$5,832'},
    {name:'General',pct:14,color:'var(--warning)',amount:'$4,536'},
    {name:'Ophthalmology',pct:12,color:'var(--accent)',amount:'$3,888'},
  ];
  el.innerHTML = items.map(i=>`
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
        <span style="font-size:13px;font-weight:600;">${i.name}</span>
        <span style="font-size:13px;font-weight:700;">${i.amount}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${i.pct}%;background:${i.color};"></div></div>
      <div style="text-align:right;font-size:11px;color:var(--text-muted);margin-top:2px;">${i.pct}%</div>
    </div>`).join('');
}

function renderAutomation() {
  const el = document.getElementById('automationContent');
  if (!el) return;
  el.innerHTML = `
  <div class="dashboard-stats" style="margin-bottom:var(--space-6);">
    <div class="stat-card primary"><div class="stat-icon" style="background:var(--primary-50);">✉️</div><div class="stat-value">1,284</div><div class="stat-label">Reminders Sent</div><div class="stat-change up">This month</div></div>
    <div class="stat-card success"><div class="stat-icon" style="background:var(--success-bg);">✅</div><div class="stat-value">96.2%</div><div class="stat-label">Delivery Rate</div><div class="stat-change up">↑ 1.2%</div></div>
    <div class="stat-card warning"><div class="stat-icon" style="background:var(--warning-bg);">🚨</div><div class="stat-value">3</div><div class="stat-label">Missed Today</div><div class="stat-change down">Needs follow-up</div></div>
    <div class="stat-card info"><div class="stat-icon" style="background:var(--info-bg);">📈</div><div class="stat-value">65%</div><div class="stat-label">No-Show Reduction</div><div class="stat-change up">Since automation</div></div>
  </div>
  <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-6);">
    <div class="card">
      <div class="card-header"><div style="font-weight:700;">Automation Rules</div><button class="btn btn-primary btn-sm">+ Add Rule</button></div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:var(--space-4);">
        ${[{icon:'📅',name:'Appointment Reminder (24hr)',desc:'Send SMS + Email 24 hours before appointment',status:true,sent:892},{icon:'⏰',name:'Day-of Reminder (2hr)',desc:'SMS reminder 2 hours before appointment time',status:true,sent:756},{icon:'💬',name:'Follow-up Message (72hr)',desc:'Post-visit follow-up after 3 days',status:true,sent:284},{icon:'🚨',name:'Missed Appointment Alert',desc:'Alert reception when patient misses appointment',status:true,sent:47},{icon:'📋',name:'Lab Results Notification',desc:'Auto-notify patient when results are ready',status:false,sent:0}].map(r=>`
        <div style="display:flex;align-items:center;gap:16px;padding:16px;background:var(--bg-secondary);border-radius:16px;border:1px solid var(--border-light);">
          <div style="font-size:28px;">${r.icon}</div>
          <div style="flex:1;">
            <div style="font-weight:700;font-size:14px;margin-bottom:2px;">${r.name}</div>
            <div style="font-size:13px;color:var(--text-muted);">${r.desc}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Sent: <strong>${r.sent}</strong> this month</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:44px;height:24px;background:${r.status?'var(--primary)':'var(--gray-200)'};border-radius:20px;cursor:pointer;position:relative;transition:background 0.2s;" onclick="toggleRule(this)">
              <div style="width:18px;height:18px;background:white;border-radius:50%;position:absolute;top:3px;${r.status?'right:3px':'left:3px'};transition:0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div style="font-weight:700;">Missed Appointments</div><span class="badge badge-error">3 Today</span></div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
        ${[{p:'Malika Ergasheva',t:'10:00 AM',dr:'Dr. Karimova'},
           {p:'Sharif Hakimov',t:'2:30 PM',dr:'Dr. Aliyev'},
           {p:'Dilorom Usmonova',t:'4:00 PM',dr:'Dr. Yusupov'}].map(m=>`
        <div style="padding:12px;border:1px solid var(--error-bg);border-radius:12px;background:var(--error-bg);">
          <div style="font-weight:700;font-size:13px;color:var(--text-primary);">${m.p}</div>
          <div style="font-size:12px;color:var(--text-muted);">${m.t} · ${m.dr}</div>
          <div style="display:flex;gap:6px;margin-top:8px;">
            <button class="btn btn-sm" style="background:var(--warning-bg);color:var(--warning);" onclick="showToast('info','SMS','Follow-up SMS sent!')">📱 SMS</button>
            <button class="btn btn-sm" style="background:var(--primary-50);color:var(--primary);" onclick="openModal('addApptModal')">📅 Reschedule</button>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderAnalytics() {
  const el = document.getElementById('analyticsContent');
  if (!el) return;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const apptData = [280,310,295,340,385,360,420,398,445,412,480,510];
  const revData = [18400,21200,19800,24600,28100,26400,31200,29800,33400,31600,36800,38200];
  el.innerHTML = `
  <div class="dashboard-stats" style="margin-bottom:var(--space-6);">
    <div class="stat-card primary"><div class="stat-icon" style="background:var(--primary-50);">📅</div><div class="stat-value">4,635</div><div class="stat-label">Total Appointments</div><div class="stat-change up">↑ 18% vs last year</div></div>
    <div class="stat-card success"><div class="stat-icon" style="background:var(--success-bg);">👥</div><div class="stat-value">1,284</div><div class="stat-label">Active Patients</div><div class="stat-change up">↑ 24% vs last year</div></div>
    <div class="stat-card warning"><div class="stat-icon" style="background:var(--warning-bg);">💰</div><div class="stat-value">$339.2k</div><div class="stat-label">Annual Revenue</div><div class="stat-change up">↑ 22% vs last year</div></div>
    <div class="stat-card info"><div class="stat-icon" style="background:var(--info-bg);">🎯</div><div class="stat-value">87.4%</div><div class="stat-label">Satisfaction Rate</div><div class="stat-change up">↑ 3.2%</div></div>
  </div>
  <div style="display:grid;grid-template-columns:3fr 2fr;gap:var(--space-6);margin-bottom:var(--space-6);">
    <div class="card">
      <div class="card-header"><div style="font-weight:700;">Annual Appointments (2025)</div></div>
      <div class="card-body">
        <div class="chart-bars" id="analyticsChart" style="height:200px;"></div>
        <div class="chart-labels">${months.map(m=>`<div class="chart-label">${m}</div>`).join('')}</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div style="font-weight:700;">Conversion Tracking</div></div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:14px;">
        ${[{name:'Website Visitors',val:8420,pct:100,color:'var(--primary)'},{name:'Booking Page Views',val:2640,pct:31,color:'var(--secondary)'},{name:'Bookings Started',val:980,pct:12,color:'var(--success)'},{name:'Appointments Confirmed',val:742,pct:9,color:'var(--warning)'}].map(c=>`
        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:13px;font-weight:600;">${c.name}</span><span style="font-size:13px;font-weight:700;">${c.val.toLocaleString()}</span></div>
          <div class="progress-bar"><div class="progress-fill" style="width:${c.pct}%;background:${c.color};"></div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;

  setTimeout(()=>{
    const ac = document.getElementById('analyticsChart');
    if (ac) {
      const max = Math.max(...apptData);
      ac.innerHTML = apptData.map(v=>`<div class="chart-bar-group"><div class="chart-bar primary" style="height:${Math.round(v/max*100)}%;"></div></div>`).join('');
    }
  }, 50);
}

function switchAnalytics(period, btn) {
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderAnalytics();
}

function toggleRule(el) {
  const isActive = el.style.background.includes('primary') || el.style.background.includes('#');
  el.style.background = isActive ? 'var(--gray-200)' : 'var(--primary)';
  const dot = el.querySelector('div');
  dot.style.right = isActive ? 'auto' : '3px';
  dot.style.left = isActive ? '3px' : 'auto';
  showToast(isActive?'warning':'success', isActive?'Rule Disabled':'Rule Enabled', isActive?'Automation rule turned off.':'Automation rule is now active.');
}

// ===== DASHBOARD INIT =====
function renderDashboardHome() {
  // Revenue chart
  const chart = document.getElementById('revenueChart');
  const labels = document.getElementById('chartLabels');
  if (chart) {
    const data = [
      {rev:65,appts:45},{rev:72,appts:55},{rev:58,appts:40},
      {rev:80,appts:65},{rev:90,appts:75},{rev:78,appts:60},{rev:100,appts:85}
    ];
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    chart.innerHTML = data.map(d=>`
      <div class="chart-bar-group">
        <div class="chart-bar primary" style="height:${d.rev}%;"></div>
        <div class="chart-bar secondary" style="height:${d.appts}%;"></div>
      </div>`).join('');
    if (labels) labels.innerHTML = days.map(d=>`<div class="chart-label">${d}</div>`).join('');
  }

  // Today's appointments
  const apptList = document.getElementById('todayApptList');
  if (apptList) {
    const today = APPOINTMENTS.slice(0,5);
    apptList.innerHTML = today.map(a=>`
      <div class="appointment-item">
        <div class="appt-time"><div class="appt-hour">${a.time.split(' ')[0]}</div><div class="appt-period">${a.time.split(' ')[1]}</div></div>
        <div class="appt-line"></div>
        <div class="appt-info"><div class="appt-patient">${a.patient}</div><div class="appt-doctor">${a.doctor} · ${a.service}</div></div>
        ${STATUS_BADGE[a.status]}
      </div>`).join('');
  }

  // Activity feed
  const activity = document.getElementById('recentActivity');
  if (activity) {
    const items = [
      {text:'<strong>Omar Saidov</strong> booked Cardiology appointment',time:'Just now',color:'var(--primary)'},
      {text:'Payment of <strong>$140</strong> received from Nilufar R.',time:'12 min ago',color:'var(--success)'},
      {text:'<strong>Malika Ergasheva</strong> missed her 10:00 AM appointment',time:'30 min ago',color:'var(--error)'},
      {text:'Dr. Aliyev completed <strong>Jasur Raimov</strong>\'s consultation',time:'1 hr ago',color:'var(--info)'},
      {text:'Follow-up SMS sent to <strong>Bobur Toshmatov</strong>',time:'2 hrs ago',color:'var(--warning)'},
    ];
    activity.innerHTML = items.map(i=>`
      <div class="activity-item">
        <div class="activity-dot" style="background:${i.color};"></div>
        <div class="activity-content"><div class="activity-text">${i.text}</div><div class="activity-time">${i.time}</div></div>
      </div>`).join('');
  }

  // Service breakdown
  const sb = document.getElementById('serviceBreakdown');
  if (sb) renderServiceBreakdown(sb);
}

function addAppointment() {
  closeModal('addApptModal');
  showToast('success','Appointment Booked!','Patient has been notified via SMS.');
  const badge = APPOINTMENTS[0];
  if (document.getElementById('statAppts')) {
    const el = document.getElementById('statAppts');
    el.textContent = parseInt(el.textContent) + 1;
  }
}
function addPatient() { closeModal('addPatientModal'); showToast('success','Patient Added','New patient record created successfully.'); }
function addDoctor() { closeModal('addDoctorModal'); showToast('success','Doctor Added','Doctor profile created.'); }
function addService() { closeModal('addServiceModal'); showToast('success','Service Added','Service added to catalog.'); }
function addStaff() { closeModal('addStaffModal'); showToast('success','Staff Added','Staff member invited via email.'); }

function handleSearch(v) {
  if (v.length > 2) showToast('info','Search', `Searching for "${v}"...`);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderDashboardHome();
  // Mobile check
  if (window.innerWidth <= 768) {
    document.getElementById('mobileMenuBtn')?.style && (document.getElementById('mobileMenuBtn').style.display = 'flex');
  }
});
