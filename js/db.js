/**
 * Math LMS - Master Cloud Database Sync Engine (Supabase PostgreSQL + Fallback)
 * Live URL: https://curlymath.vercel.app
 */

// 🔑 Supabase Project Credentials (Paste your keys from https://supabase.com dashboard)
const SUPABASE_URL = 'https://YOUR_SUPABASE_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Legacy Google Sheets GAS Backup Endpoint
const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnxVFfw9oeqks1lrDj_SgrS8ltk7HGdcmfA98BlLxf3f7PdC9M47LETlV6JuAbOJ8E/exec';

const LOCAL_STORAGE_KEY_STUDENTS = 'mathlab_students_cache';
const LOCAL_STORAGE_KEY_PROGRESS = 'mathlab_progress_cache';
const LOCAL_STORAGE_KEY_CURRICULUM = 'mathlab_curriculum_cache';
const LOCAL_STORAGE_KEY_SUBMISSIONS = 'mathlab_submissions_cache';

let _supabaseInstance = null;

const CloudDB = {
  isSupabaseConfigured() {
    return (
      typeof window.supabase !== 'undefined' &&
      SUPABASE_URL &&
      !SUPABASE_URL.includes('YOUR_SUPABASE_PROJECT_REF') &&
      SUPABASE_ANON_KEY &&
      !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
    );
  },

  getSupabase() {
    if (!this.isSupabaseConfigured()) return null;
    if (!_supabaseInstance) {
      try {
        _supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('⚡ [CloudDB] Supabase Cloud DB Engine initialized!');
      } catch (err) {
        console.warn('⚠️ [CloudDB] Supabase init warning:', err);
      }
    }
    return _supabaseInstance;
  },

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
      localStorage.setItem(LOCAL_STORAGE_KEY_STUDENTS, JSON.stringify(students));
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

  getSubmissionsFromLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_SUBMISSIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.warn('[CloudDB] Submissions local cache read error:', e);
    }
    return [];
  },

  saveSubmissionToLocal(submission) {
    if (!submission) return;
    try {
      const list = this.getSubmissionsFromLocal();
      list.unshift(submission);
      localStorage.setItem(LOCAL_STORAGE_KEY_SUBMISSIONS, JSON.stringify(list));
    } catch (e) {
      console.warn('[CloudDB] Submission local cache save error:', e);
    }
  },

  // Fetch live student list and progress from Supabase Cloud DB (or fallback)
  async fetchStudents() {
    let localList = this.getStudentsFromLocal();
    const sb = this.getSupabase();

    // 1. Try Supabase Primary Cloud DB
    if (sb) {
      try {
        const { data: stData, error: stErr } = await sb.from('students').select('*');
        if (!stErr && Array.isArray(stData)) {
          const cleaned = stData.map(s => ({
            id: String(s.id || '').trim(),
            name: String(s.name || '').trim(),
            grade: String(s.grade || '1').trim(),
            classNum: String(s.class_num || s.classNum || '1').trim(),
            password: String(s.password || '').trim(),
            status: 'in-progress',
            score: 0,
            createdAt: s.created_at || s.createdAt || ''
          })).filter(s => s.id && s.name);

          this.saveStudentsToLocal(cleaned);

          // Fetch progress checklist
          const { data: sylData, error: sylErr } = await sb.from('progress_checklist').select('*');
          if (!sylErr && Array.isArray(sylData) && sylData.length > 0) {
            const mappedChecklist = sylData.map(item => ({
              grade: item.grade,
              period: item.period,
              mainUnit: item.main_unit || item.mainUnit,
              subUnit: item.sub_unit || item.subUnit,
              topic: item.topic,
              checkedClasses: Array.isArray(item.checked_classes) ? item.checked_classes.join(',') : String(item.checked_classes || '')
            }));

            try {
              localStorage.setItem('mathlab_syllabus_checklist_cache', JSON.stringify(mappedChecklist));
            } catch(e) {}

            if (typeof ProgressModule !== 'undefined' && ProgressModule.updateFromSheet) {
              ProgressModule.updateFromSheet(mappedChecklist);
            }
          }

          console.log(`⚡ [Supabase Cloud DB] Loaded ${cleaned.length} students successfully!`);
          return cleaned;
        }
      } catch (err) {
        console.warn('[CloudDB] Supabase fetch fallback to local/GAS:', err);
      }
    }

    // 2. Fallback to Google Sheets GAS
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timer);

      if (res && res.ok) {
        const text = await res.text();
        let remoteData = null;
        try {
          remoteData = JSON.parse(text);
        } catch (e) {
          return localList;
        }

        let remoteStudents = [];
        if (Array.isArray(remoteData)) {
          remoteStudents = remoteData;
        } else if (remoteData && typeof remoteData === 'object') {
          if (Array.isArray(remoteData.students)) remoteStudents = remoteData.students;
          if (Array.isArray(remoteData.syllabusChecklist) && remoteData.syllabusChecklist.length > 0) {
            try {
              localStorage.setItem('mathlab_syllabus_checklist_cache', JSON.stringify(remoteData.syllabusChecklist));
            } catch(e) {}
            if (typeof ProgressModule !== 'undefined' && ProgressModule.updateFromSheet) {
              ProgressModule.updateFromSheet(remoteData.syllabusChecklist);
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
    } catch (err) {}

    return localList;
  },

  // Post new student registration to Supabase Cloud DB
  async registerStudent(newStudent) {
    if (!newStudent || !newStudent.id) return;

    const cleanStudent = {
      id: String(newStudent.id).trim(),
      name: String(newStudent.name).trim(),
      grade: Number(newStudent.grade || 1),
      class_num: Number(newStudent.classNum || 1),
      password: String(newStudent.password).trim(),
      created_at: new Date().toISOString()
    };

    // Save to local cache
    const localList = this.getStudentsFromLocal();
    const idx = localList.findIndex(s => String(s.id) === cleanStudent.id);
    const localObj = {
      id: cleanStudent.id,
      name: cleanStudent.name,
      grade: String(cleanStudent.grade),
      classNum: String(cleanStudent.class_num),
      password: cleanStudent.password,
      status: 'in-progress',
      score: 0,
      createdAt: new Date().toLocaleString('ko-KR')
    };

    if (idx >= 0) {
      localList[idx] = localObj;
    } else {
      localList.unshift(localObj);
    }
    this.saveStudentsToLocal(localList);

    // Save to Supabase
    const sb = this.getSupabase();
    if (sb) {
      try {
        const { error } = await sb.from('students').upsert(cleanStudent);
        if (!error) {
          console.log('⚡ [Supabase Cloud DB] Student registered:', cleanStudent.name);
          return;
        }
      } catch (err) {
        console.warn('[CloudDB] Supabase register error:', err);
      }
    }

    // Fallback save to Google Sheets GAS
    try {
      await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...localObj, type: 'student' })
      });
    } catch (err) {}
  },

  // Post student activity exploration result
  async saveActivityResult(activityResultData) {
    if (!activityResultData) return { verified: false, error: 'No data' };

    const payload = {
      student_id: String(activityResultData.studentId || ''),
      student_name: String(activityResultData.studentName || ''),
      grade: Number(activityResultData.grade || 1),
      class_num: Number(activityResultData.classNum || 1),
      activity_title: String(activityResultData.activityTitle || ''),
      answer_text: String(activityResultData.answerText || ''),
      score: Number(activityResultData.score || 100),
      submitted_at: new Date().toISOString()
    };

    this.saveSubmissionToLocal({
      studentId: payload.student_id,
      studentName: payload.student_name,
      grade: payload.grade,
      classNum: payload.class_num,
      activityTitle: payload.activity_title,
      answerText: payload.answer_text,
      score: payload.score,
      submittedAt: new Date().toLocaleString('ko-KR')
    });

    const sb = this.getSupabase();
    if (sb) {
      try {
        const { error } = await sb.from('activity_submissions').insert(payload);
        if (!error) {
          console.log('⚡ [Supabase Cloud DB] Activity submission saved!');
          return { verified: true, dbType: 'Supabase' };
        }
      } catch (err) {
        console.warn('[CloudDB] Supabase submission error:', err);
      }
    }

    // Fallback save to Google Sheets GAS
    try {
      const response = await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...activityResultData, type: 'activity_result' })
      });
      return { verified: true, dbType: 'GoogleSheets' };
    } catch (err) {
      return { verified: true, dbType: 'LocalStorage' };
    }
  },

  // Save 50-Period Syllabus Checkboard Data to Supabase Cloud DB
  async saveSyllabusChecklist(items) {
    if (!Array.isArray(items)) return;

    const sb = this.getSupabase();
    if (sb) {
      try {
        const upsertPayload = items.map(item => ({
          grade: Number(item.grade || 2),
          period: Number(item.period),
          main_unit: String(item.mainUnit || ''),
          sub_unit: String(item.subUnit || ''),
          topic: String(item.topic || ''),
          checked_classes: Array.isArray(item.checkedClasses) ? item.checkedClasses.map(Number) : [],
          updated_at: new Date().toISOString()
        }));

        const { error } = await sb.from('progress_checklist').upsert(upsertPayload, { onConflict: 'grade,period' });
        if (!error) {
          console.log('⚡ [Supabase Cloud DB] 50-Period Syllabus checklist saved successfully!');
          return;
        } else {
          console.warn('[CloudDB] Supabase checklist upsert warning:', error);
        }
      } catch (err) {
        console.warn('[CloudDB] Supabase saveSyllabusChecklist error:', err);
      }
    }

    // Fallback save to Google Sheets GAS
    try {
      await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ type: 'syllabus_checklist_save', items: items })
      });
    } catch (err) {}
  },

  // Reset student password (Teacher Action)
  async resetStudentPassword(studentId, newPassword) {
    if (!studentId || !newPassword) return { success: false, message: '학번과 비밀번호를 입력해 주세요.' };

    const cleanId = String(studentId).trim();
    const cleanPw = String(newPassword).trim();

    // 1. Update local cache and AppState
    const localList = this.getStudentsFromLocal();
    const studentInLocal = localList.find(s => String(s.id).trim() === cleanId);
    if (studentInLocal) {
      studentInLocal.password = cleanPw;
      this.saveStudentsToLocal(localList);
    }

    if (typeof AppState !== 'undefined' && AppState.demoStudents) {
      const studentInAppState = AppState.demoStudents.find(s => String(s.id).trim() === cleanId);
      if (studentInAppState) {
        studentInAppState.password = cleanPw;
      }
    }

    // 2. Update in Supabase Cloud DB
    const sb = this.getSupabase();
    if (sb) {
      try {
        const { error } = await sb.from('students').update({ password: cleanPw }).eq('id', cleanId);
        if (!error) {
          console.log('⚡ [Supabase Cloud DB] Password reset for student:', cleanId);
          return { success: true, message: 'Supabase DB 및 시스템에 비밀번호가 반영되었습니다.' };
        }
      } catch (err) {
        console.warn('[CloudDB] Supabase password reset error:', err);
      }
    }

    // Fallback to Google Sheets GAS
    try {
      await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ type: 'reset_student_password', id: cleanId, newPassword: cleanPw })
      });
      return { success: true, message: '비밀번호가 성공적으로 초기화되었습니다.' };
    } catch (err) {
      return { success: true, message: '로컬 환경에 비밀번호가 반영되었습니다.' };
    }
  }
};
