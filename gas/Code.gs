/**
 * Yeongseo Middle School Math LMS - Master Google Apps Script Backend
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

  return ContentService.createTextOutput(JSON.stringify({
    students: students,
    progress: progress,
    curriculum: curriculum
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
  } else if (data.type === "activity_result") {
    // 2. 탐구활동결과 시트 기록 및 구글 드라이브 탐구보고서 파일 자동 생성
    var actSheet = ss.getSheetByName("탐구활동결과");
    if (!actSheet) {
      actSheet = ss.insertSheet("탐구활동결과");
      actSheet.appendRow(["학번", "학생성명", "학년", "학반", "탐구활동제목", "학생제출답안", "이해도점수", "제출일시", "드라이브파일URL"]);
    }

    // 📁 구글 드라이브 전용 폴더 및 탐구보고서 파일 생성
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
    var driveFileUrl = driveFile.getUrl();

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

    return ContentService.createTextOutput(JSON.stringify({ status: "success", driveFileUrl: driveFileUrl }))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    // 3. 학생 명부 신규 회원가입
    var studentSheet = ss.getSheetByName("학생명부") || ss.getSheets()[0];
    studentSheet.appendRow([
      data.id,
      data.name,
      data.grade,
      data.classNum,
      data.password,
      new Date().toLocaleString('ko-KR')
    ]);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
