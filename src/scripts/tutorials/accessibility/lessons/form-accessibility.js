/**
 * Form Accessibility Lesson
 * =========================
 */

export const formAccessibilityLesson = {
  id: 'form-accessibility',
  title: 'Accessible Forms',
  description: 'Create forms that everyone can use',
  html: `<!-- Accessible Form Patterns -->
<section class="form-demo">
  <h2>Accessible Form Design</h2>

  <form class="accessible-form" novalidate>
    <!-- Text Input with Label -->
    <div class="form-group">
      <label for="full-name">
        Full Name
        <span class="required" aria-label="required">*</span>
      </label>
      <input
        type="text"
        id="full-name"
        name="fullName"
        required
        aria-required="true"
        aria-describedby="name-help"
      >
      <span id="name-help" class="help-text">
        Enter your first and last name
      </span>
    </div>

    <!-- Email with Error -->
    <div class="form-group">
      <label for="email">
        Email Address
        <span class="required" aria-label="required">*</span>
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        aria-required="true"
        aria-invalid="false"
        aria-describedby="email-error"
      >
      <span id="email-error" class="error-message" role="alert" hidden>
        Please enter a valid email address
      </span>
    </div>

    <!-- Radio Group -->
    <fieldset class="form-group">
      <legend>Preferred Contact Method</legend>
      <div class="radio-group">
        <input type="radio" id="contact-email" name="contact" value="email" checked>
        <label for="contact-email">Email</label>

        <input type="radio" id="contact-phone" name="contact" value="phone">
        <label for="contact-phone">Phone</label>

        <input type="radio" id="contact-text" name="contact" value="text">
        <label for="contact-text">Text Message</label>
      </div>
    </fieldset>

    <!-- Checkbox Group -->
    <fieldset class="form-group">
      <legend>Interests (select all that apply)</legend>
      <div class="checkbox-group">
        <input type="checkbox" id="interest-a11y" name="interests" value="accessibility">
        <label for="interest-a11y">Web Accessibility</label>

        <input type="checkbox" id="interest-ux" name="interests" value="ux">
        <label for="interest-ux">User Experience</label>

        <input type="checkbox" id="interest-dev" name="interests" value="development">
        <label for="interest-dev">Web Development</label>
      </div>
    </fieldset>

    <!-- Accessible Select -->
    <div class="form-group">
      <label for="country">
        Country
        <span class="required" aria-label="required">*</span>
      </label>
      <select id="country" name="country" required aria-required="true">
        <option value="">Select a country</option>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
        <option value="au">Australia</option>
      </select>
    </div>

    <!-- Textarea with Character Count -->
    <div class="form-group">
      <label for="message">
        Message
        <span class="optional">(optional)</span>
      </label>
      <textarea
        id="message"
        name="message"
        rows="4"
        maxlength="500"
        aria-describedby="message-count"
      ></textarea>
      <span id="message-count" class="character-count">
        <span class="current-count">0</span> / 500 characters
      </span>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <button type="submit" class="btn-primary">Submit Form</button>
      <button type="reset" class="btn-secondary">Clear Form</button>
    </div>

    <!-- Form Status Messages -->
    <div role="status" aria-live="polite" aria-atomic="true" class="form-status"></div>
  </form>
</section>`,
  css: `.form-demo {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.accessible-form {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

/* Labels */
label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #212529;
}

.required {
  color: #dc3545;
  font-weight: normal;
  margin-left: 0.25rem;
}

.optional {
  color: #6c757d;
  font-weight: normal;
  font-size: 0.875rem;
  margin-left: 0.25rem;
}

/* Inputs */
input[type="text"],
input[type="email"],
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #ced4da;
  border-radius: 4px;
  background: white;
  transition: border-color 0.15s ease-in-out;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* Invalid state */
input[aria-invalid="true"],
select[aria-invalid="true"],
textarea[aria-invalid="true"] {
  border-color: #dc3545;
}

input[aria-invalid="true"]:focus,
select[aria-invalid="true"]:focus,
textarea[aria-invalid="true"]:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
}

/* Help text */
.help-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6c757d;
}

/* Error messages */
.error-message {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545;
}

/* Fieldsets */
fieldset {
  border: 2px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

legend {
  font-weight: 500;
  padding: 0 0.5rem;
  color: #212529;
}

/* Radio and Checkbox Groups */
.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-group label,
.checkbox-group label {
  display: inline;
  margin-left: 0.5rem;
  font-weight: normal;
}

input[type="radio"],
input[type="checkbox"] {
  width: auto;
  margin: 0;
}

/* Character count */
.character-count {
  display: block;
  text-align: right;
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-secondary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 117, 125, 0.5);
}

/* Form status */
.form-status:not(:empty) {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
}

.form-status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}`,
  js: `// Form validation and accessibility
const form = document.querySelector('.accessible-form');
const emailInput = document.getElementById('email');
const messageTextarea = document.getElementById('message');
const characterCount = document.querySelector('.current-count');
const formStatus = document.querySelector('.form-status');

// Update character count
messageTextarea.addEventListener('input', () => {
  const count = messageTextarea.value.length;
  characterCount.textContent = count;

  // Update color when approaching limit
  const percentUsed = count / 500;
  if (percentUsed > 0.9) {
    characterCount.parentElement.style.color = '#dc3545';
  } else if (percentUsed > 0.7) {
    characterCount.parentElement.style.color = '#ffc107';
  } else {
    characterCount.parentElement.style.color = '#6c757d';
  }
});

// Email validation
emailInput.addEventListener('blur', () => {
  const emailError = document.getElementById('email-error');
  const isValid = emailInput.validity.valid;

  emailInput.setAttribute('aria-invalid', !isValid);

  if (!isValid && emailInput.value) {
    emailError.hidden = false;
  } else {
    emailError.hidden = true;
  }
});

// Form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Clear previous status
  formStatus.className = 'form-status';
  formStatus.textContent = '';

  // Validate required fields
  const requiredFields = form.querySelectorAll('[required]');
  let hasErrors = false;

  requiredFields.forEach(field => {
    if (!field.value) {
      field.setAttribute('aria-invalid', 'true');
      hasErrors = true;

      // Find and show error message
      const errorId = field.getAttribute('aria-describedby');
      if (errorId && errorId.includes('error')) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
          errorElement.hidden = false;
          errorElement.textContent = 'This field is required';
        }
      }
    } else {
      field.setAttribute('aria-invalid', 'false');
    }
  });

  if (hasErrors) {
    formStatus.className = 'form-status error';
    formStatus.textContent = 'Please correct the errors above and try again.';

    // Focus first invalid field
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) {
      firstInvalid.focus();
    }
  } else {
    // Success
    formStatus.className = 'form-status success';
    formStatus.textContent = 'Form submitted successfully! Thank you for your submission.';

    // Reset form after delay
    setTimeout(() => {
      form.reset();
      characterCount.textContent = '0';
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }, 3000);
  }
});

// Clear form handler
form.addEventListener('reset', () => {
  // Reset all validation states
  form.querySelectorAll('[aria-invalid]').forEach(field => {
    field.setAttribute('aria-invalid', 'false');
  });

  // Hide all error messages
  form.querySelectorAll('.error-message').forEach(error => {
    error.hidden = true;
  });

  // Reset character count
  characterCount.textContent = '0';
  characterCount.parentElement.style.color = '#6c757d';

  // Clear status
  formStatus.className = 'form-status';
  formStatus.textContent = '';
});`
};