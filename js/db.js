/**
 * Yeongseo Middle School Math LMS - Google Sheets Database Engine
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교)
 * 
 * Direct Google Sheets Integration for Students, Class Progress, Curriculum Master DB & Activity Results:
 * https://script.google.com/macros/s/AKfycbxnxVFfw9oeqks1lrDj_SgrS8ltk7HGdcmfA98BlLxf3f7PdC9M47LETlV6JuAbOJ8E/exec
 */

const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnxVFfw9oeqks1lrDj_SgrS8ltk7HGdcmfA98BlLxf3f7PdC9M47LETlV6JuAbOJ8E/exec';
const LOCAL_STORAGE_KEY_STUDENTS = 'ys_mathlab_google_sheet_students_v1';
const LOCAL_STORAGE_KEY_PROGRESS = 'ys_mathlab_google_sheet_progress_v1';
const LOCAL_STORAGE_KEY_CURRICULUM = 'ys_mathlab_google_sheet_curriculum_v1';

const CloudDB = {
  // Load local cache immediately for zero-lag UI
  getStudentsFromLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_STUDENTS);
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
      localStorage.setItem(LOCAL_STORAGE_KEY_STUDENTS, JSON.stringify(list));
    } catch (e) {
      console.warn('[CloudDB] Local cache save error:', e);
    }
  },

  getProgressFromLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PROGRESS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
      }
    } catch (e) {
      console.warn('[CloudDB] Progress local cache read error:', e);
    }
    return null;
  },

  saveProgressToLocal(progressList) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(progressList));
    } catch (e) {
      console.warn('[CloudDB] Progress local cache save error:', e);
    }
  },

  getCurriculumFromLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CURRICULUM);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
      }
    } catch (e) {
      console.warn('[CloudDB] Curriculum local cache read error:', e);
    }
    return null;
  },

  saveCurriculumToLocal(currList) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRICULUM, JSON.stringify(currList));
    } catch (e) {
      console.warn('[CloudDB] Curriculum local cache save error:', e);
    }
  },

  // Fetch live student list, progress, and curriculum master DB from Teacher Jongyoon Lim's Google Sheet
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
        
        // Handle combined payload (students + progress + curriculum)
        let remoteStudents = [];
        if (Array.isArray(remoteData)) {
          remoteStudents = remoteData;
        } else if (remoteData && typeof remoteData === 'object') {
          if (Array.isArray(remoteData.students)) remoteStudents = remoteData.students;
          if (Array.isArray(remoteData.progress) && remoteData.progress.length > 0) {
            this.saveProgressToLocal(remoteData.progress);
          }
          if (Array.isArray(remoteData.curriculum) && remoteData.curriculum.length > 0) {
            this.saveCurriculumToLocal(remoteData.curriculum);
            if (typeof ProgressModule !== 'undefined' && ProgressModule.updateCurriculumFromSheet) {
              ProgressModule.updateCurriculumFromSheet(remoteData.curriculum);
            }
          }
        }

        const cleaned = remoteStudents.map(s => ({
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
    } catch (err) {
      console.warn('[CloudDB] Google Sheets fetch fallback to local cache:', err);
    }

    return localList;
  },

  // Post new student registration to Teacher Jongyoon Lim's Google Sheet
  async registerStudent(newStudent) {
    if (!newStudent || !newStudent.id) return;

    const cleanStudent = {
      type: 'student',
      id: String(newStudent.id).trim(),
      name: String(newStudent.name).trim(),
      grade: String(newStudent.grade || '1').trim(),
      classNum: String(newStudent.classNum || '1').trim(),
      password: String(newStudent.password).trim(),
      status: 'in-progress',
      score: 0,
      createdAt: new Date().toLocaleString('ko-KR')
    };

    // 1. Local Storage cache for zero UI lag
    const localList = this.getStudentsFromLocal();
    const idx = localList.findIndex(s => String(s.id) === cleanStudent.id);
    if (idx >= 0) {
      localList[idx] = cleanStudent;
    } else {
      localList.unshift(cleanStudent);
    }
    this.saveStudentsToLocal(localList);

    // 2. Post to Google Sheet Web App
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
  },

  // Post updated class progress to Teacher Jongyoon Lim's Google Sheet
  async saveClassProgress(progressData) {
    if (!progressData) return;

    const payload = {
      type: 'progress',
      grade: progressData.grade,
      classNum: progressData.classNum,
      unit: progressData.unit,
      pages: progressData.pages,
      progressPct: progressData.progressPct,
      homework: progressData.homework,
      teacherNote: progressData.teacherNote
    };

    try {
      await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      console.log('[CloudDB] Class progress saved to Google Sheet!');
    } catch (err) {
      console.warn('[CloudDB] Class progress Google Sheet save error:', err);
    }
  },

  // Post student activity exploration result to Teacher Jongyoon Lim's Google Sheet
  async saveActivityResult(activityResultData) {
    if (!activityResultData) return;

    const payload = {
      type: 'activity_result',
      studentId: activityResultData.studentId || '',
      studentName: activityResultData.studentName || '',
      grade: activityResultData.grade || '1',
      classNum: activityResultData.classNum || '1',
      activityTitle: activityResultData.activityTitle || '',
      answerText: activityResultData.answerText || '',
      score: activityResultData.score || 100,
      submittedAt: new Date().toLocaleString('ko-KR')
    };

    try {
      await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      console.log('[CloudDB] Activity result saved to Google Sheet tab 탐구활동결과!');
    } catch (err) {
      console.warn('[CloudDB] Activity result Google Sheet save error:', err);
    }
  }
};
