/**
 * MathLab LMS - External Web App Integration SDK (MathLMSBridge)
 * Compatible with Deployment ID: AKfycbz1zC7figOuC7FjoEAT4uQ39Kt3fLirKdSOetoIXvavxzqR4WETvwaf875VNBiBQV1N
 */

(function(window) {
  'use strict';

  var MathLMSBridge = {
    lmsOrigin: '*',
    studentInfo: null,
    onStudentInfoCallback: null,

    init: function(options) {
      options = options || {};
      if (typeof options.onStudentInfo === 'function') {
        this.onStudentInfoCallback = options.onStudentInfo;
      }

      var self = this;
      window.addEventListener('message', function(event) {
        if (!event.data || typeof event.data !== 'object') return;

        var data = event.data;
        if (data.type === 'MATH_LMS_INIT_STUDENT' && data.student) {
          self.studentInfo = data.student;
          console.log('[MathLMSBridge] Student profile synced from LMS:', self.studentInfo);
          if (self.onStudentInfoCallback) {
            self.onStudentInfoCallback(self.studentInfo);
          }
        }
      });

      this.requestStudentInfo();
    },

    requestStudentInfo: function() {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'MATH_LMS_REQUEST_STUDENT_INFO' }, this.lmsOrigin);
      }
    },

    submitResult: function(data) {
      if (!data || typeof data !== 'object') {
        console.error('[MathLMSBridge] Invalid submission data');
        return;
      }

      var payload = {
        type: 'MATH_LMS_SUBMIT',
        activityId: data.activityId || 'MATH-2026-GEO-02',
        activityTitle: data.activityTitle || '삼각형의 외심 탐구',
        student: this.studentInfo,
        score: data.score || 100,
        answerText: data.answerText || '',
        details: data.details || {},
        timestamp: new Date().toISOString()
      };

      console.log('[MathLMSBridge] Submitting exploration payload to parent LMS:', payload);

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(payload, this.lmsOrigin);
      }

      alert('✅ 탐구 결과가 LMS 시스템에 전달되었습니다!\n학습 기록이 저장되었습니다.');
    }
  };

  window.MathLMSBridge = MathLMSBridge;
})(window);
