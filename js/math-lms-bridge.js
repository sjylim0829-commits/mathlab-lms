/**
 * MathLab LMS - External Web App Integration SDK (MathLMSBridge)
 * Used by math-app web applications to automatically connect with the LMS
 * and send student exploration results directly into the LMS Database.
 */

(function(window) {
  'use strict';

  var MathLMSBridge = {
    lmsOrigin: '*',
    studentInfo: null,
    onStudentInfoCallback: null,

    /**
     * Initialize connection with the parent LMS iframe
     * @param {Object} options - { onStudentInfo: function(student) {} }
     */
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
          console.log('[MathLMSBridge] Received student info from LMS:', self.studentInfo);
          if (self.onStudentInfoCallback) {
            self.onStudentInfoCallback(self.studentInfo);
          }
        }
      });

      // Send handshake request to LMS parent window
      this.requestStudentInfo();
    },

    /**
     * Request student credentials from parent LMS window
     */
    requestStudentInfo: function() {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'MATH_LMS_REQUEST_STUDENT_INFO' }, this.lmsOrigin);
      }
    },

    /**
     * Submit student exploration data to LMS Database
     * @param {Object} data - { activityTitle, answerText, score, details }
     */
    submitResult: function(data) {
      if (!data || typeof data !== 'object') {
        console.error('[MathLMSBridge] Invalid submission data');
        return;
      }

      var payload = {
        type: 'MATH_LMS_SUBMIT',
        activityTitle: data.activityTitle || document.title || '수학 탐구활동',
        answerText: data.answerText || '',
        score: typeof data.score === 'number' ? data.score : 100,
        details: data.details || {},
        submittedAt: new Date().toISOString()
      };

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(payload, this.lmsOrigin);
        console.log('[MathLMSBridge] Submitted activity result to parent LMS:', payload);
        return true;
      } else {
        console.warn('[MathLMSBridge] Not running inside LMS iframe, logging payload:', payload);
        return false;
      }
    }
  };

  window.MathLMSBridge = MathLMSBridge;
})(window);
