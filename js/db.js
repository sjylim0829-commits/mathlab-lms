/**
 * Yeongseo Middle School Math LMS - Google Sheets Database Engine
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교)
 * 
 * Direct Google Sheets Integration:
 * https://script.google.com/macros/s/AKfycbxnxVFfw9oeqks1lrDj_SgrS8ltk7HGdcmfA98BlLxf3f7PdC9M47LETlV6JuAbOJ8E/exec
 */

const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnxVFfw9oeqks1lrDj_SgrS8ltk7HGdcmfA98BlLxf3f7PdC9M47LETlV6JuAbOJ8E/exec';
const LOCAL_STORAGE_KEY = 'ys_mathlab_google_sheet_students_v1';

const CloudDB = {
  // Load local cache immediately for zero-lag UI
  getStudentsFromLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.warn('[CloudDB] Local cache read error:', e);
    }
    return [];
  },

  saveStudentsToLocal(students) {
    try {
      const list = Array.isArray(students) ? students : [];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('[CloudDB] Local cache save error:', e);
    }
  },

  // Fetch live student list from Teacher Jongyoon Lim's Google Sheet
  async fetchStudents() {
    let localList = this.getStudentsFromLocal();

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timer);

      if (res && res.ok) {
        const remoteData = await res.json();
        if (Array.isArray(remoteData)) {
          const cleaned = remoteData.map(s => ({
            id: String(s.id || '').trim(),
            name: String(s.name || '').trim(),
            grade: String(s.grade || '1').trim(),
            classNum: String(s.classNum || '1').trim(),
            password: String(s.password || '').trim(),
            status: 'in-progress',
            score: 0,
            createdAt: s.createdAt || ''
          })).filter(s => s.id && s.name);

          this.saveStudentsToLocal(cleaned);
          return cleaned;
        }
      }
    } catch (err) {
      console.warn('[CloudDB] Google Sheets fetch fallback to local cache:', err);
    }

    return localList;
  },

  // Post new student registration to Teacher Jongyoon Lim's Google Sheet
  async registerStudent(newStudent) {
    if (!newStudent || !newStudent.id) return;

    const cleanStudent = {
      id: String(newStudent.id).trim(),
      name: String(newStudent.name).trim(),
      grade: String(newStudent.grade || '1').trim(),
      classNum: String(newStudent.classNum || '1').trim(),
      password: String(newStudent.password).trim(),
      status: 'in-progress',
      score: 0,
      createdAt: new Date().toLocaleString('ko-KR')
    };

    // 1. Immediately update Local Storage cache for zero UI lag
    const localList = this.getStudentsFromLocal();
    const idx = localList.findIndex(s => String(s.id) === cleanStudent.id);
    if (idx >= 0) {
      localList[idx] = cleanStudent;
    } else {
      localList.unshift(cleanStudent);
    }
    this.saveStudentsToLocal(localList);

    // 2. Post to Google Sheet Web App (using text/plain to prevent CORS preflight issues)
    try {
      await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(cleanStudent)
      });
      console.log('[CloudDB] Student registered in Google Sheet!');
    } catch (err) {
      console.warn('[CloudDB] Google Sheet background sync error:', err);
    }
  }
};
