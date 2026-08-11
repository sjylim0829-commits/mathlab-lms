/**
 * Yeongseo Middle School Math LMS - Master Google Apps Script Backend (v3.1 Safe Editor Test & Drive Enabled)
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교)
 * Script ID: 17cQ5FvmIVP39-2S31_WT0tudDBgwCvyk7k6XmEMhsC-DAt-YmnftZIhT
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. 학생 명부 조회 (학생명부 탭)
  var studentSheet = ss.getSheetByName("학생명부") || ss.getSheets()[0];
  var studentData = studentSheet.getDataRange().getValues();
  var students = [];
  for (var i = 1; i < studentData.length; i++) {
    if (studentData[i][0]) {
      students.push({
        id: String(studentData[i][0]),
        name: String(studentData[i][1]),
        grade: String(studentData[i][2]),
        classNum: String(studentData[i][3]),
        password: String(studentData[i][4]),
        createdAt: String(studentData[i][5])
      });
    }
  }

  // 2. 수업 진도 DB 조회 (수업진도 탭)
  var progressSheet = ss.getSheetByName("수업진도");
  var progress = [];
  if (progressSheet) {
    var pData = progressSheet.getDataRange().getValues();
    for (var j = 1; j < pData.length; j++) {
      if (pData[j][0]) {
        progress.push({
          grade: Number(pData[j][0]),
          classNum: Number(pData[j][1]),
          unit: String(pData[j][2]),
          pages: String(pData[j][3]),
          progressPct: Number(pData[j][4]),
          homework: String(pData[j][5]),
          teacherNote: String(pData[j][6]),
          lastDate: String(pData[j][7])
        });
      }
    }
  }

  // 3. 교육과정 단원 마스터 DB 조회 (교육과정DB 탭)
  var currSheet = ss.getSheetByName("교육과정DB");
  var curriculum = [];
  if (currSheet) {
    var cData = currSheet.getDataRange().getValues();
    for (var k = 1; k < cData.length; k++) {
      if (cData[k][0]) {
        curriculum.push({
          grade: Number(cData[k][0]),
          seq: String(cData[k][1]),
          unit: String(cData[k][2]),
          defaultPages: String(cData[k][3]),
          note: String(cData[k][4] || '')
        });
      }
    }
  }

  // 4. 50차시 반별 체크리스트 DB 조회 (50차시진도표 탭)
  var sylSheet = ss.getSheetByName("50차시진도표");
  var syllabusChecklist = [];
  if (sylSheet) {
    var sData = sylSheet.getDataRange().getValues();
    for (var m = 1; m < sData.length; m++) {
      if (sData[m][0]) {
        syllabusChecklist.push({
          period: Number(sData[m][0]),
          mainUnit: String(sData[m][1]),
          subUnit: String(sData[m][2]),
          topic: String(sData[m][3]),
          checkedClasses: String(sData[m][4] || ''),
          grade: Number(sData[m][5] || 2)
        });
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    students: students,
    progress: progress,
    curriculum: curriculum,
    syllabusChecklist: syllabusChecklist,
    apiVersion: "v3.2_syllabus_50hrs"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 🛡️ 에디터에서 [실행] 버튼을 직접 눌렀을 때 안전 처리 (postData가 없는 예외 방지 및 권한 승인 지원)
  if (!e || !e.postData) {
    try {
      var folderName = "영서중학교 수학 LMS 탐구보고서";
      var folders = DriveApp.getFoldersByName(folderName);
      if (!folders.hasNext()) {
        DriveApp.createFolder(folderName);
      }
    } catch(err) {
      Logger.log("Drive Permission Check: " + err.toString());
    }
    return ContentService.createTextOutput("에디터 권한 테스트 실행 성공").setMimeType(ContentService.MimeType.TEXT);
  }

  var data = JSON.parse(e.postData.contents);

  if (data.type === "progress") {
    // 1. 수업진도 탭 갱신
    var progressSheet = ss.getSheetByName("수업진도");
    if (!progressSheet) {
      progressSheet = ss.insertSheet("수업진도");
      progressSheet.appendRow(["학년", "학반", "진도단원", "진도페이지", "진도율", "수업과제", "교사메모", "최종수정일"]);
    }

    var pData = progressSheet.getDataRange().getValues();
    var foundRow = -1;
    for (var k = 1; k < pData.length; k++) {
      if (Number(pData[k][0]) === Number(data.grade) && Number(pData[k][1]) === Number(data.classNum)) {
        foundRow = k + 1;
        break;
      }
    }

    var rowValues = [
      data.grade,
      data.classNum,
      data.unit,
      data.pages,
      data.progressPct,
      data.homework,
      data.teacherNote,
      new Date().toLocaleDateString('ko-KR')
    ];

    if (foundRow > 0) {
      progressSheet.getRange(foundRow, 1, 1, 8).setValues([rowValues]);
    } else {
      progressSheet.appendRow(rowValues);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      apiVersion: "v3.1_safe_editor_test",
      action: "progress_saved"
    })).setMimeType(ContentService.MimeType.JSON);

  } else if (data.type === "activity_result") {
    // 2. 탐구활동결과 시트 기록 및 구글 드라이브 파일 자동 생성
    var actSheet = ss.getSheetByName("탐구활동결과");
    if (!actSheet) {
      actSheet = ss.insertSheet("탐구활동결과");
      actSheet.appendRow(["학번", "학생성명", "학년", "학반", "탐구활동제목", "학생제출답안", "이해도점수", "제출일시", "드라이브파일URL"]);
    }

    // 📁 구글 드라이브 전용 폴더 및 탐구보고서 파일 자동 생성
    var driveFileUrl = "";
    try {
      var folderName = "영서중학교 수학 LMS 탐구보고서";
      var folders = DriveApp.getFoldersByName(folderName);
      var targetFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

      var docTitle = "[탐구보고서] " + data.studentId + "_" + data.studentName + "_" + data.activityTitle;
      var docContent = "==================================================\n" +
                       "🏫 영서중학교 수학 LMS - 학생 탐구활동 보고서\n" +
                       "==================================================\n" +
                       "■ 학번: " + data.studentId + "\n" +
                       "■ 성명: " + data.studentName + "\n" +
                       "■ 소속: 영서중학교 " + data.grade + "학년 " + data.classNum + "반\n" +
                       "■ 탐구 주제: " + data.activityTitle + "\n" +
                       "■ 제출 일시: " + (data.submittedAt || new Date().toLocaleString('ko-KR')) + "\n" +
                       "■ 이해도 점수: " + (data.score || 100) + "점\n" +
                       "--------------------------------------------------\n" +
                       "■ 학생 작성 수식 및 탐구 소감:\n" +
                       data.answerText + "\n" +
                       "==================================================\n";

      var driveFile = targetFolder.createFile(docTitle + ".txt", docContent);
      driveFileUrl = driveFile.getUrl();
    } catch(err) {
      driveFileUrl = "드라이브 생성 오류: " + err.toString();
    }

    actSheet.appendRow([
      data.studentId,
      data.studentName,
      data.grade,
      data.classNum,
      data.activityTitle,
      data.answerText,
      data.score || 100,
      data.submittedAt || new Date().toLocaleString('ko-KR'),
      driveFileUrl
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      apiVersion: "v3.1_safe_editor_test",
      tabCreated: true,
      driveFileUrl: driveFileUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } else if (data.type === "syllabus_checklist_save") {
    // 50차시 진도표 반별 체크리스트 전체/개별 갱신
    var sylSheet = ss.getSheetByName("50차시진도표");
    if (!sylSheet) {
      sylSheet = ss.insertSheet("50차시진도표");
      sylSheet.appendRow(["차시", "대단원", "중단원소단원", "학습주제", "완료학반목록", "최종수정일"]);
    }

    if (Array.isArray(data.items)) {
      sylSheet.clearContents();
      sylSheet.appendRow(["차시", "대단원", "중단원소단원", "학습주제", "완료학반목록", "최종수정일"]);
      var today = new Date().toLocaleDateString('ko-KR');
      data.items.forEach(function(item) {
        sylSheet.appendRow([
          item.period,
          item.mainUnit,
          item.subUnit,
          item.topic,
          Array.isArray(item.checkedClasses) ? item.checkedClasses.join(',') : (item.checkedClasses || ''),
          item.grade || 2,
          today
        ]);
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      apiVersion: "v3.2_syllabus_50hrs",
      action: "syllabus_saved"
    })).setMimeType(ContentService.MimeType.JSON);

  } else if (data.type === "organize_drive") {
    // 4. 구글 드라이브 마스터 아카이브 폴더 생성 및 정리
    var result = organizeDriveArchive(data.handoffDocs || {});
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      apiVersion: "v3.1_safe_editor_test",
      result: result
    })).setMimeType(ContentService.MimeType.JSON);

  } else if (data.type === "reset_student_password") {
    // 5. 학생 비밀번호 초기화 (교사 권한)
    var studentSheet = ss.getSheetByName("학생명부") || ss.getSheets()[0];
    var sData = studentSheet.getDataRange().getValues();
    var foundRow = -1;
    for (var r = 1; r < sData.length; r++) {
      if (String(sData[r][0]).trim() === String(data.id).trim()) {
        foundRow = r + 1;
        break;
      }
    }
    if (foundRow > 0) {
      studentSheet.getRange(foundRow, 5).setValue(String(data.newPassword).trim());
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "password_reset",
        message: "비밀번호가 성공적으로 초기화되었습니다."
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "해당 학번의 학생을 찾을 수 없습니다."
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } else {
    // 3. 학생 명부 신규 회원가입 (type: 'student')
    var studentSheet = ss.getSheetByName("학생명부") || ss.getSheets()[0];
    studentSheet.appendRow([
      data.id,
      data.name,
      data.grade,
      data.classNum,
      data.password,
      new Date().toLocaleString('ko-KR')
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      apiVersion: "v3.1_safe_editor_test",
      action: "student_registered"
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 선생님 구글 드라이브 내 '영서중학교 수학 LMS 마스터 아카이브' 폴더 생성 및 자동 정돈
 */
function organizeDriveArchive(handoffDocs) {
  try {
    var masterFolderName = "영서중학교 수학 LMS 마스터 아카이브";
    var masterFolders = DriveApp.getFoldersByName(masterFolderName);
    var masterFolder = masterFolders.hasNext() ? masterFolders.next() : DriveApp.createFolder(masterFolderName);

    // 3개 서브 폴더 생성 및 가져오기
    var sub1Name = "01_데이터베이스_및_기록";
    var sub2Name = "02_학생_탐구보고서_자동생성";
    var sub3Name = "03_웹앱_소스코드_및_인수인계_문서";

    var f1s = masterFolder.getFoldersByName(sub1Name);
    var folder1 = f1s.hasNext() ? f1s.next() : masterFolder.createFolder(sub1Name);

    var f2s = masterFolder.getFoldersByName(sub2Name);
    var folder2 = f2s.hasNext() ? f2s.next() : masterFolder.createFolder(sub2Name);

    var f3s = masterFolder.getFoldersByName(sub3Name);
    var folder3 = f3s.hasNext() ? f3s.next() : masterFolder.createFolder(sub3Name);

    // 1. 현재 active 구글 시트를 01번 폴더에 정리
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ssFile = DriveApp.getFileById(ss.getId());
    ssFile.moveTo(folder1);

    // 2. 기존 '영서중학교 수학 LMS 탐구보고서' 폴더를 02번 폴더 안으로 정리
    var oldReportFolders = DriveApp.getFoldersByName("영서중학교 수학 LMS 탐구보고서");
    if (oldReportFolders.hasNext()) {
      var oldReportFolder = oldReportFolders.next();
      oldReportFolder.moveTo(folder2);
    }

    // 3. 인수인계 기록 문서들을 03번 폴더에 파일로 자동 업데이트/생성
    if (handoffDocs.lmsMaster) {
      folder3.createFile("LMS_DEVELOPMENT_MASTER_MEMORY.txt", handoffDocs.lmsMaster);
    }
    if (handoffDocs.redbookGeo) {
      folder3.createFile("REDBOOK_GEOMETRY_HANDOFF_RECORDS.txt", handoffDocs.redbookGeo);
    }
    if (handoffDocs.redbookCircum) {
      folder3.createFile("REDBOOK_CIRCUMCENTER_HANDOFF_RECORDS.txt", handoffDocs.redbookCircum);
    }

    return {
      success: true,
      masterFolderUrl: masterFolder.getUrl(),
      subFolder1Url: folder1.getUrl(),
      subFolder2Url: folder2.getUrl(),
      subFolder3Url: folder3.getUrl()
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 구글 에디터 직접 실행용 테스트 헬퍼 함수
 */
function testDriveOrganize() {
  var res = organizeDriveArchive({
    lmsMaster: "영서중학교 수학 LMS 인수인계 마스터 기록문서 내용",
    redbookGeo: "Redbook 이등변삼각형 및 직각삼각형의 합동 인수인계 내용",
    redbookCircum: "Redbook 삼각형의 외심 탐구 인수인계 내용"
  });
  Logger.log("Drive organize result: " + JSON.stringify(res));
  return res;
}


