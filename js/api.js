// =============================================
// MediCare Pro — Frontend API Client
// Connects to Express backend on localhost:3000
// =============================================

const API_BASE = 'http://localhost:3000/api';

const API = {
  // ===== INTERNAL =====
  _token() { return localStorage.getItem('mc_token'); },
  _headers(extra = {}) {
    return {
      'Content-Type': 'application/json',
      ...(this._token() ? { 'Authorization': `Bearer ${this._token()}` } : {}),
      ...extra
    };
  },
  async _req(method, path, body) {
    try {
      const res = await fetch(API_BASE + path, {
        method, headers: this._headers(),
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    } catch (e) {
      console.error(`API ${method} ${path}:`, e.message);
      throw e;
    }
  },
  get: (path) => API._req('GET', path),
  post: (path, body) => API._req('POST', path, body),
  put: (path, body) => API._req('PUT', path, body),
  patch: (path, body) => API._req('PATCH', path, body),
  del: (path) => API._req('DELETE', path),

  // ===== AUTH =====
  async login(email, password) {
    const data = await this.post('/auth/login', { email, password });
    localStorage.setItem('mc_token', data.token);
    localStorage.setItem('mc_user', JSON.stringify(data.user));
    return data;
  },
  logout() {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_user');
    window.location.href = 'login.html';
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem('mc_user')); }
    catch { return null; }
  },
  isLoggedIn() { return !!this._token(); },
  requireAuth() {
    if (!this.isLoggedIn()) { window.location.href = 'login.html'; return false; }
    return true;
  },

  // ===== PATIENTS =====
  getPatients: (params = {}) => API.get('/patients?' + new URLSearchParams(params)),
  getPatient: (id) => API.get(`/patients/${id}`),
  createPatient: (data) => API.post('/patients', data),
  updatePatient: (id, data) => API.put(`/patients/${id}`, data),
  deletePatient: (id) => API.del(`/patients/${id}`),

  // ===== APPOINTMENTS =====
  getAppointments: (params = {}) => API.get('/appointments?' + new URLSearchParams(params)),
  getTodayAppointments: () => API.get('/appointments/today'),
  createAppointment: (data) => API.post('/appointments', data),
  updateAppointment: (id, data) => API.put(`/appointments/${id}`, data),
  updateAppointmentStatus: (id, status) => API.patch(`/appointments/${id}/status`, { status }),
  deleteAppointment: (id) => API.del(`/appointments/${id}`),
  publicBook: (data) => fetch(API_BASE + '/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),

  // ===== PAYMENTS =====
  getPayments: (params = {}) => API.get('/payments?' + new URLSearchParams(params)),
  createPayment: (data) => API.post('/payments', data),

  // ===== STATS =====
  getStats: () => API.get('/stats'),

  // ===== STAFF =====
  getUsers: () => API.get('/users'),
  createUser: (data) => API.post('/users', data),

  // ===== CONTACT =====
  sendContact: (data) => fetch(API_BASE + '/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),

  // ===== HEALTH =====
  health: () => API.get('/health'),
};

// ===== LIVE DATA LOADER for Dashboard =====
const LiveData = {
  async loadStats() {
    try {
      const data = await API.getStats();
      // Update stat cards if they exist on page
      const el = (id) => document.getElementById(id);
      if (el('statAppts')) el('statAppts').textContent = data.appointments.todayTotal;
      if (el('st-total')) el('st-total').textContent = data.appointments.todayTotal;
      if (el('st-here')) el('st-here').textContent = data.appointments.todayConfirmed;
      if (el('st-missed')) el('st-missed').textContent = data.appointments.todayMissed;
      if (el('st-income')) {
        const mode = localStorage.getItem('mc_currency') || 'uzs';
        el('st-income').textContent = mode === 'uzs'
          ? data.revenue.todayUZS.toLocaleString('uz-UZ')
          : '$' + data.revenue.todayUSD;
      }
      return data;
    } catch (e) {
      console.warn('Stats load failed (server offline?):', e.message);
      return null;
    }
  },

  async loadTodayAppts() {
    try {
      const data = await API.getTodayAppointments();
      return data.appointments;
    } catch {
      return null;
    }
  },

  async loadPatients(search = '') {
    try {
      const params = search ? { search } : {};
      const data = await API.getPatients(params);
      return data.patients;
    } catch {
      return null;
    }
  },

  async init() {
    const isServerUp = await this.checkServer();
    if (isServerUp) {
      await this.loadStats();
      console.log('✅ Backend bilan ulanish: muvaffaqiyatli');
    } else {
      console.warn('⚠️  Backend server o\'chiq — demo data ko\'rsatilmoqda');
      this.showOfflineBanner();
    }
  },

  async checkServer() {
    try {
      await fetch(API_BASE + '/health', { signal: AbortSignal.timeout(2000) });
      return true;
    } catch {
      return false;
    }
  },

  showOfflineBanner() {
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#fbbf24;color:#1a1a00;text-align:center;padding:8px;font-size:13px;font-weight:700;z-index:9999;';
    banner.innerHTML = '⚠️ Server o\'chiq — Demo rejimda ishlayapti. <a href="#" onclick="window.open(\'README.md\')" style="color:#1a1a00;text-decoration:underline;">Server ishga tushirish</a>';
    document.body.prepend(banner);
  }
};

window.API = API;
window.LiveData = LiveData;
