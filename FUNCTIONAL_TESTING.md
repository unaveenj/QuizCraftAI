# QuizCraft AI - Functional Testing Guide

## Pre-Release Testing Checklist

### Prerequisites
- [ ] Modern web browser (Chrome, Firefox, Safari, Edge)
- [ ] Valid OpenAI API key with billing enabled
- [ ] Internet connection

### 1. Initial Setup & Landing Page
**Test ID: T001**
- [ ] Open `index.html` in browser
- [ ] Verify landing page loads without errors
- [ ] Check hero section displays correctly with stats (47%, 3x, 92%)
- [ ] Test theme toggle (light/dark mode)
- [ ] Verify "Get Started Free" button links to `app.html`
- [ ] Check responsive design on mobile/tablet

**Expected Results:**
- Clean, professional landing page
- All statistics visible
- Theme toggle works smoothly
- Responsive across devices

### 2. Application Launch & Navigation
**Test ID: T002**
- [ ] Click "Get Started Free" button
- [ ] Verify app.html loads with quiz creation page active
- [ ] Test sidebar navigation between pages:
  - [ ] Overview
  - [ ] Create Quiz
  - [ ] Quiz History  
  - [ ] Settings
- [ ] Verify "Back to Home" button returns to landing page
- [ ] Test theme toggle persistence

**Expected Results:**
- App loads with Create Quiz page active
- Navigation works between all pages
- Theme preference persists across pages

### 3. API Configuration & Testing
**Test ID: T003**
- [ ] Navigate to Settings → API Configuration
- [ ] Test API key input field:
  - [ ] Enter invalid key format (not starting with "sk-")
  - [ ] Verify warning message appears
  - [ ] Enter valid API key format
  - [ ] Verify validation passes
- [ ] Test API key visibility toggle
- [ ] Click "Test Connection" button:
  - [ ] With invalid key - verify error message
  - [ ] With valid key - verify success message
- [ ] Click "Diagnose Issues" button
- [ ] Verify diagnostic report shows correct status

**Expected Results:**
- Real-time validation of API key format
- Connection test provides clear feedback
- Diagnostic tool identifies issues accurately

### 4. API Key Information Help
**Test ID: T004**
- [ ] Hover over the ℹ️ icon next to "OpenAI API Key"
- [ ] Verify tooltip appears with step-by-step instructions
- [ ] Click external links in tooltip:
  - [ ] platform.openai.com opens in new tab
  - [ ] API keys page opens correctly
- [ ] Test tooltip on mobile (tap behavior)

**Expected Results:**
- Tooltip displays helpful instructions
- External links work correctly
- Mobile-friendly interaction

### 5. Model Selection & Settings
**Test ID: T005**
- [ ] Test AI model dropdown:
  - [ ] GPT-4o Mini (default)
  - [ ] GPT-4o
- [ ] Verify default model is GPT-4o Mini
- [ ] Test model selection in both quiz creation and settings
- [ ] Check cost estimator shows correct pricing
- [ ] Verify help text updates appropriately

**Expected Results:**
- Only 2 models available (GPT-4o Mini, GPT-4o)
- Default selection is GPT-4o Mini
- Cost information is accurate

### 6. Quiz Creation Interface
**Test ID: T006**
- [ ] Navigate to Create Quiz page
- [ ] Test quiz description textarea:
  - [ ] Enter sample quiz request
  - [ ] Verify placeholder text is helpful
  - [ ] Check character/word counter updates
- [ ] Test file upload tab:
  - [ ] Click "Upload Materials" tab
  - [ ] Verify upload zone appears
  - [ ] Check file type restrictions (.txt, .md, .pdf, .docx, .pptx)
- [ ] Test quiz settings:
  - [ ] Number of questions slider (5-50)
  - [ ] Difficulty selection (Easy, Medium, Hard)
  - [ ] Question types checkboxes
  - [ ] Focus areas dropdown

**Expected Results:**
- Intuitive interface for quiz requests
- All controls work smoothly
- Settings persist between interactions

### 7. Token Usage Meter
**Test ID: T007**
- [ ] Locate usage meter in top-right header
- [ ] Verify initial display shows "0 tokens (~$0.000)"
- [ ] Test reset button (↻ icon):
  - [ ] Click and verify counter resets
  - [ ] Check notification appears
- [ ] Verify meter color coding:
  - [ ] Green for low usage
  - [ ] Orange for medium usage
  - [ ] Red for high usage

**Expected Results:**
- Usage meter always visible
- Reset functionality works
- Color coding provides clear feedback

### 8. Quiz Generation Process
**Test ID: T008**
- [ ] Enter valid API key in settings
- [ ] Navigate to Create Quiz
- [ ] Enter quiz description (e.g., "Create a quiz about basic math")
- [ ] Configure quiz settings
- [ ] Click "Generate Quiz with AI"
- [ ] Verify loading state with spinner
- [ ] Check token usage meter updates after generation
- [ ] Verify quiz interface loads with questions
- [ ] Test quiz navigation:
  - [ ] Next/Previous buttons
  - [ ] Progress bar updates
  - [ ] Question counter accurate

**Expected Results:**
- Quiz generates successfully
- Token usage tracked accurately
- Interactive quiz interface loads
- Navigation works smoothly

### 9. Quiz Taking Experience
**Test ID: T009**
- [ ] Answer multiple choice questions
- [ ] Test true/false questions (if generated)
- [ ] Test fill-in-blank questions (if generated)
- [ ] Verify answer selection works
- [ ] Test previous/next navigation
- [ ] Submit quiz and view results
- [ ] Check score calculation accuracy
- [ ] Test "Create New Quiz" and "Back to Dashboard" buttons

**Expected Results:**
- All question types work properly
- Answer selection is clear
- Results page shows accurate scoring
- Navigation options work correctly

### 10. Error Handling & Edge Cases
**Test ID: T010**
- [ ] Test without API key:
  - [ ] Verify error message
  - [ ] Check redirect to settings
- [ ] Test with invalid API key:
  - [ ] Verify specific error message
- [ ] Test rate limiting scenario:
  - [ ] Verify retry mechanism
  - [ ] Check auto-fallback behavior
- [ ] Test empty quiz description:
  - [ ] Verify validation message
- [ ] Test network disconnection during generation
- [ ] Test browser refresh during quiz taking

**Expected Results:**
- Clear error messages for all scenarios
- Graceful handling of API issues
- User guidance for resolution

### 11. Data Persistence
**Test ID: T011**
- [ ] Set API key and refresh page
- [ ] Verify API key persists
- [ ] Change theme and refresh
- [ ] Verify theme preference persists
- [ ] Generate quiz, refresh during quiz
- [ ] Check if quiz state is preserved
- [ ] Test usage meter persistence

**Expected Results:**
- Settings persist across sessions
- Quiz state handled appropriately
- Usage tracking continues correctly

### 12. Cross-Browser Compatibility
**Test ID: T012**
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari (if available)
- [ ] Test in Edge
- [ ] Verify consistent behavior across browsers
- [ ] Check for console errors in each browser

**Expected Results:**
- Consistent functionality across browsers
- No browser-specific errors
- Smooth performance in all tested browsers

### 13. Mobile Responsiveness
**Test ID: T013**
- [ ] Test on mobile phone (portrait/landscape)
- [ ] Test on tablet (portrait/landscape)
- [ ] Verify touch interactions work
- [ ] Check sidebar navigation on mobile
- [ ] Test quiz taking on mobile
- [ ] Verify usage meter visibility

**Expected Results:**
- Fully responsive design
- Touch-friendly interface
- No horizontal scrolling
- All features accessible on mobile

### 14. Performance Testing
**Test ID: T014**
- [ ] Measure page load times
- [ ] Test multiple quiz generations in sequence
- [ ] Check memory usage during extended use
- [ ] Verify smooth animations and transitions
- [ ] Test with large quiz descriptions

**Expected Results:**
- Fast page loads (<3 seconds)
- Consistent performance
- No memory leaks
- Smooth user experience

### 15. Security & Privacy
**Test ID: T015**
- [ ] Verify API key is stored locally only
- [ ] Check no sensitive data sent to external servers
- [ ] Test API key masking in UI
- [ ] Verify HTTPS for all API calls
- [ ] Check browser console for exposed credentials

**Expected Results:**
- No sensitive data exposure
- Secure API communication
- Local-only data storage

## Bug Report Template

When reporting issues, include:

**Bug ID:** [Unique identifier]
**Test ID:** [From which test case]
**Severity:** Critical | High | Medium | Low
**Browser/OS:** [Browser version and operating system]
**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:** [What should happen]
**Actual Result:** [What actually happened]
**Screenshots:** [If applicable]
**Console Errors:** [Any JavaScript errors]

## Sign-off Criteria

Application is ready for public release when:
- [ ] All critical and high severity bugs are fixed
- [ ] 95% of test cases pass
- [ ] Performance benchmarks are met
- [ ] Security review is complete
- [ ] Cross-browser compatibility confirmed
- [ ] Mobile responsiveness verified

---

**Testing Completed By:** [Name]
**Date:** [Date]
**Version:** [Version number]
**Overall Status:** Pass | Fail | Pending