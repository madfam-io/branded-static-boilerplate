/**
 * Screen Reader Lesson
 * ====================
 */

export const screenReaderLesson = {
  id: 'screen-readers',
  title: 'Screen Reader Optimization',
  description: 'Build experiences that work with assistive technologies',
  html: `<!-- Screen Reader Optimization -->
<section class="screen-reader-demo">
  <h2>Screen Reader Best Practices</h2>

  <!-- Live Regions -->
  <div class="live-region-demo">
    <h3>Live Region Updates</h3>
    <button onclick="updateStatus()">Update Status</button>
    <button onclick="updateAlert()">Show Alert</button>

    <!-- Polite updates -->
    <div role="status" aria-live="polite" aria-atomic="true" class="status-region">
      <p id="status-message">Status: Ready</p>
    </div>

    <!-- Important alerts -->
    <div role="alert" aria-live="assertive" class="alert-region" id="alert-region"></div>
  </div>

  <!-- Descriptive Links -->
  <div class="link-examples">
    <h3>Descriptive Link Text</h3>

    <div class="bad-example">
      <h4>❌ Avoid This</h4>
      <p>To learn more about our services, <a href="#">click here</a>.</p>
      <p>Download the report <a href="#">here</a>.</p>
    </div>

    <div class="good-example">
      <h4>✅ Do This</h4>
      <p>Learn more about <a href="#">our accessibility services</a>.</p>
      <p><a href="#">Download the 2024 accessibility report (PDF, 2.5MB)</a></p>
    </div>
  </div>

  <!-- Complex Data Table -->
  <div class="table-demo">
    <h3>Accessible Data Tables</h3>
    <table>
      <caption>Q4 2023 Sales Report by Region</caption>
      <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">North</th>
          <th scope="col">South</th>
          <th scope="col">East</th>
          <th scope="col">West</th>
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Laptops</th>
          <td>$50,000</td>
          <td>$45,000</td>
          <td>$60,000</td>
          <td>$55,000</td>
          <td>$210,000</td>
        </tr>
        <tr>
          <th scope="row">Tablets</th>
          <td>$30,000</td>
          <td>$25,000</td>
          <td>$35,000</td>
          <td>$40,000</td>
          <td>$130,000</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Total</th>
          <td>$80,000</td>
          <td>$70,000</td>
          <td>$95,000</td>
          <td>$95,000</td>
          <td><strong>$340,000</strong></td>
        </tr>
      </tfoot>
    </table>
  </div>
</section>`,
  css: `.screen-reader-demo {
  padding: 2rem;
}

.live-region-demo {
  margin-bottom: 3rem;
}

.live-region-demo button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.status-region {
  margin-top: 1rem;
  padding: 1rem;
  background: #e7f3ff;
  border: 1px solid #b3d7ff;
  border-radius: 4px;
}

.alert-region:not(:empty) {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  color: #721c24;
}

.link-examples {
  margin-bottom: 3rem;
}

.link-examples .bad-example,
.link-examples .good-example {
  padding: 1rem;
  margin: 1rem 0;
  border: 2px solid #ddd;
  border-radius: 4px;
}

/* Table styling */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

caption {
  padding: 0.75rem;
  font-weight: bold;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-bottom: none;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #dee2e6;
}

thead th {
  background: #e9ecef;
  font-weight: 600;
}

tbody th {
  background: #f8f9fa;
  font-weight: 500;
}

tfoot {
  font-weight: bold;
  background: #e9ecef;
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}`,
  js: `// Live region updates
let statusCount = 0;
let alertCount = 0;

function updateStatus() {
  statusCount++;
  const statusMessage = document.getElementById('status-message');
  statusMessage.textContent = \`Status: Update #\${statusCount} completed at \${new Date().toLocaleTimeString()}\`;
}

function updateAlert() {
  alertCount++;
  const alertRegion = document.getElementById('alert-region');
  alertRegion.innerHTML = \`<strong>Alert #\${alertCount}:</strong> This is an important notification that interrupts the user.\`;

  // Clear alert after 5 seconds
  setTimeout(() => {
    alertRegion.innerHTML = '';
  }, 5000);
}

// Add screen reader announcements for dynamic content
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

// Example: Announce table interactions
const table = document.querySelector('table');
table.addEventListener('click', (e) => {
  const cell = e.target.closest('td, th');
  if (cell) {
    const row = cell.parentElement;
    const rowHeader = row.querySelector('th');
    const colHeader = table.querySelector(\`thead th:nth-child(\${cell.cellIndex + 1})\`);

    if (rowHeader && colHeader) {
      const message = \`Selected \${rowHeader.textContent} for \${colHeader.textContent}: \${cell.textContent}\`;
      announceToScreenReader(message);
    }
  }
});`
};