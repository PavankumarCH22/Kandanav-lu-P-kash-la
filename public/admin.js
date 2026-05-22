const adminLogin = document.querySelector("#adminLogin");
const adminDashboard = document.querySelector("#adminDashboard");
const adminLoginForm = document.querySelector("#adminLoginForm");
const loginStatus = document.querySelector("#loginStatus");
const bookingRows = document.querySelector("#bookingRows");
const adminStatus = document.querySelector("#adminStatus");
const bookingCount = document.querySelector("#bookingCount");
const deviceUrl = document.querySelector("#deviceUrl");
const downloadSheet = document.querySelector("#downloadSheet");
const adminLogout = document.querySelector("#adminLogout");

const TOKEN_KEY = "kv-admin-token";

function token() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cell(value) {
  return `<td>${escapeHtml(value)}</td>`;
}

function showDashboard() {
  adminLogin.hidden = true;
  adminDashboard.hidden = false;
}

function showLogin(message = "") {
  adminLogin.hidden = false;
  adminDashboard.hidden = true;
  loginStatus.textContent = message;
}

async function loadDeviceInfo() {
  try {
    const response = await fetch("/api/device-info");
    const info = await response.json();
    const networkUrl = info.urls.find(url => !url.includes("localhost")) || info.urls[0];
    deviceUrl.textContent = `Other devices: ${networkUrl}`;
  } catch (error) {
    deviceUrl.textContent = "Other devices: use this computer local network URL.";
  }
}

async function loadBookings() {
  try {
    const response = await fetch("/api/inquiries", {
      headers: {
        Authorization: `Bearer ${token()}`
      }
    });

    if (response.status === 401) {
      sessionStorage.removeItem(TOKEN_KEY);
      showLogin("Please login again.");
      return;
    }

    const bookings = await response.json();

    bookingRows.innerHTML = bookings.map(booking => `
      <tr>
        ${cell(booking.id)}
        ${cell(booking.name)}
        ${cell(booking.phone)}
        ${cell(booking.functionType)}
        ${cell(booking.eventType)}
        ${cell(booking.foodPreference)}
        ${cell(booking.guests)}
        ${cell(booking.eventDate)}
        ${cell(booking.location)}
        ${cell(booking.message)}
      </tr>
    `).join("");

    bookingCount.textContent = `${bookings.length} booking records`;
    adminStatus.textContent = `${bookings.length} booking records found.`;
  } catch (error) {
    adminStatus.textContent = "Could not load bookings.";
  }
}

adminLoginForm.addEventListener("submit", async event => {
  event.preventDefault();
  loginStatus.textContent = "Checking password...";

  const payload = Object.fromEntries(new FormData(adminLoginForm).entries());

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      loginStatus.textContent = result.error || "Login failed.";
      return;
    }

    sessionStorage.setItem(TOKEN_KEY, result.token);
    adminLoginForm.reset();
    showDashboard();
    loadBookings();
    loadDeviceInfo();
  } catch (error) {
    loginStatus.textContent = "Could not reach server.";
  }
});

downloadSheet.addEventListener("click", () => {
  window.location.href = `/api/inquiries.csv?token=${encodeURIComponent(token())}`;
});

adminLogout.addEventListener("click", () => {
  sessionStorage.removeItem(TOKEN_KEY);
  showLogin("Logged out.");
});

if (token()) {
  showDashboard();
  loadBookings();
  loadDeviceInfo();
} else {
  showLogin();
}
