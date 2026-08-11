/**
 * Yeongseo Middle School Math LMS - Master Cloud Database Sync Engine with Self-Verification
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교)
 * Script ID: 17cQ5FvmIVP39-2S31_WT0tudDBgwCvyk7k6XmEMhsC-DAt-YmnftZIhT
 */

const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnxVFfw9oeqks1lrDj_SgrS8ltk7HGdcmfA98BlLxf3f7PdC9M47LETlV6JuAbOJ8E/exec';

const LOCAL_STORAGE_KEY_STUDENTS = 'mathlab_students_cache';
const LOCAL_STORAGE_KEY_PROGRESS = 'mathlab_progress_cache';
const LOCAL_STORAGE_KEY_CURRICULUM = 'mathlab_curriculum_cache';
const LOCAL_STORAGE_KEY_SUBMISSIONS = 'mathlab_submissions_cache';

const CloudDB = {
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

    const localList = this.getStudentsFromLocal();
    const idx = localList.findIndex(s => String(s.id) === cleanStudent.id);
    if (idx >= 0) {
      localList[idx] = cleanStudent;
    } else {
      localList.unshift(cleanStudent);
    }
    this.saveStudentsToLocal(localList);

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

  // Post student activity exploration result with Self-Verification Engine
  async saveActivityResult(activityResultData) {
    if (!activityResultData) return { verified: false, error: 'No data' };

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

    this.saveSubmissionToLocal(payload);

    try {
      const response = await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      let resJson = null;
      try {
        resJson = await response.json();
      } catch(e) {}

      console.log('[CloudDB Self-Verification] Web App Response:', resJson);

      if (resJson && (resJson.apiVersion || resJson.driveFileUrl || resJson.tabCreated)) {
        return {
          verified: true,
          driveFileUrl: resJson.driveFileUrl || '',
          tabName: '탐구활동결과'
        };
      } else {
        return {
          verified: false,
          isAccessBlocked: true,
          message: '구글 보안 정책상 앱스 스크립트 웹앱의 외부 접근 권한 승인이 필요합니다. 앱스 스크립트 편집기에서 [배포] ➔ [배포 관리] ➔ [✏️수정] ➔ [액세스 권한: 모든 사용자]로 설정해 주세요.'
        };
      }
    } catch (err) {
      console.warn('[CloudDB] Activity result Google Sheet save error:', err);
      return { verified: false, error: err.message };
    }
  },

  // Save 50-Period Syllabus Checkboard Data to Google Sheet
  async saveSyllabusChecklist(items) {
    if (!Array.isArray(items)) return;

    const payload = {
      type: 'syllabus_checklist_save',
      items: items
    };

    try {
      await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      console.log('[CloudDB] 50-Period Syllabus checklist saved to Google Sheet!');
    } catch (err) {
      console.warn('[CloudDB] Syllabus checklist save error:', err);
    }
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

    // 2. Post reset to Google Sheets GAS backend
    const payload = {
      type: 'reset_student_password',
      id: cleanId,
      newPassword: cleanPw
    };

    try {
      const res = await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('[CloudDB] Student password reset response:', data);
      return { success: true, message: data.message || '비밀번호가 성공적으로 초기화되었습니다.' };
    } catch (err) {
      console.warn('[CloudDB] Password reset network/GAS error:', err);
      return { success: true, message: '로컬 환경에 비밀번호가 반영되었습니다. (오프라인 모드)' };
    }
  }
};
