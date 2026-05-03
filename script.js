const USERS = {
  "arifmadurock7@gmail.com": "kopi1234",
};

// Fungsi login utama
function doLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("pass").value;
  const errBox = document.getElementById("err");

  // Reset error box style
  errBox.style.background = "rgba(180, 50, 50, 0.1)";
  errBox.style.borderColor = "rgba(180, 50, 50, 0.3)";
  errBox.style.color = "#e07070";

  if (!validateEmail(email)) {
    errBox.innerText = "Silakan masukkan format email yang benar.";
    errBox.style.display = "block";
    return;
  }

  // Cek apakah email & password cocok (Hardcoded or LocalStorage)
  const localUsers =
    JSON.parse(localStorage.getItem("coffee_registered_users")) || {};

  let isValid = false;
  let userData = null;

  // 1. Check Hardcoded Users
  if (USERS[email] && USERS[email] === password) {
    isValid = true;
    userData = { name: email.split("@")[0], role: "Manajer" };
  }
  // 2. Check LocalStorage Users
  else if (localUsers[email]) {
    const entry = localUsers[email];
    if (typeof entry === "object") {
      if (entry.password === password) {
        isValid = true;
        userData = entry;
      }
    } else if (entry === password) {
      // Compatibility with old string format
      isValid = true;
      userData = { name: email.split("@")[0], role: "Pengguna Baru" };
    }
  }

  if (isValid) {
    // Sukses
    const role =
      email === "arifmadurock7@gmail.com"
        ? "Manajer"
        : userData.role || "Pengguna Baru";
    localStorage.setItem("user_name", userData.name || email.split("@")[0]);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_role", role);
    localStorage.setItem("is_logged_in", "true");

    // Set profile picture based on role - ALWAYS refresh to match the current user
    const managerPic =
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"; // Professional Manager
    const customerPic =
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"; // Friendly Customer

    // Use saved picture if available, otherwise use role default
    const finalPic =
      userData.picture || (role === "Manajer" ? managerPic : customerPic);
    localStorage.setItem("user_pic", finalPic);

    errBox.style.display = "none";
    window.location.href = "dashboard.html";
  } else {
    // Gagal
    errBox.innerText = "Email atau password salah. Coba lagi.";
    errBox.style.display = "block";
    document.getElementById("pass").value = "";
  }
}

// Switch between Login, Forgot Password, and Register forms
function switchForm(form) {
  const forms = ["login", "forgot", "register"];
  forms.forEach((f) => {
    const el = document.getElementById(`${f}-form`);
    el.classList.remove("active");
    el.style.display = "none";
  });

  const activeEl = document.getElementById(`${form}-form`);
  if (activeEl) {
    activeEl.style.display = "flex";
    activeEl.classList.add("active");
  }

  // Clear any existing error messages
  document.querySelectorAll(".error").forEach((err) => {
    err.style.display = "none";
  });
}

// Password visibility toggle
function togglePassword() {
  const passInput = document.getElementById("pass");
  const toggleIcon = document.getElementById("toggleIcon");

  if (passInput.type === "password") {
    passInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

// Handle Reset Password Simulation
function handleReset() {
  const email = document.getElementById("forgot-email").value;
  const errBox = document.getElementById("err-forgot");

  if (!email || !validateEmail(email)) {
    errBox.innerText = "Silakan masukkan format email yang valid.";
    errBox.style.background = "rgba(180, 50, 50, 0.1)";
    errBox.style.borderColor = "rgba(180, 50, 50, 0.3)";
    errBox.style.color = "#e07070";
    errBox.style.display = "block";
    return;
  }

  errBox.innerText = `Link reset password telah dikirim ke ${email}`;
  errBox.style.background = "rgba(40, 167, 69, 0.1)";
  errBox.style.borderColor = "rgba(40, 167, 69, 0.3)";
  errBox.style.color = "#4ade80";
  errBox.style.display = "block";
}

// Handle Registration Simulation
function handleRegister() {
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-pass").value;
  const errBox = document.getElementById("err-register");

  if (!name || !email || !password || !validateEmail(email)) {
    errBox.innerText = !validateEmail(email)
      ? "Format email tidak valid!"
      : "Silakan isi semua data.";
    errBox.style.background = "rgba(180, 50, 50, 0.1)";
    errBox.style.borderColor = "rgba(180, 50, 50, 0.3)";
    errBox.style.color = "#e07070";
    errBox.style.display = "block";
    return;
  }

  // Save User to LocalStorage as Object
  let localUsers =
    JSON.parse(localStorage.getItem("coffee_registered_users")) || {};
  localUsers[email] = {
    password: password,
    name: name,
    role: "Pengguna Baru",
    promoActive: false,
    discount: Math.floor(Math.random() * 41) + 10 + "%",
  };
  localStorage.setItem("coffee_registered_users", JSON.stringify(localUsers));

  // Logic for Member Baru count
  let memberEmails =
    JSON.parse(localStorage.getItem("coffee_member_emails")) || [];
  if (!memberEmails.includes(email)) {
    memberEmails.push(email);
    localStorage.setItem("coffee_member_emails", JSON.stringify(memberEmails));

    let currentMembers =
      parseInt(localStorage.getItem("coffee_members_count")) || 0;
    localStorage.setItem("coffee_members_count", currentMembers + 1);
  }

  errBox.innerText = "Akun berhasil dibuat! Silakan login.";
  errBox.style.background = "rgba(40, 167, 69, 0.1)";
  errBox.style.borderColor = "rgba(40, 167, 69, 0.3)";
  errBox.style.color = "#4ade80";
  errBox.style.display = "block";

  setTimeout(() => switchForm("login"), 2000);
}

// Social Login Simulation
function socialLogin(provider) {
  const modal = document.getElementById("socialModal");
  const title = document.getElementById("social-modal-title");
  const brandIcon = document.getElementById("social-brand-icon");
  const content = document.getElementById("socialContent");
  const loading = document.getElementById("socialLoading");

  // Reset states
  content.style.display = "block";
  loading.style.display = "none";

  if (provider === "Google") {
    brandIcon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.86-2.59 3.29-4.53 6.16-4.53z"/>
      </svg>`;
    title.innerText = "Pilih akun Google";
  } else {
    brandIcon.innerHTML =
      '<i class="fab fa-apple" style="color:#000; font-size:28px"></i>';
    title.innerText = "Masuk dengan Apple ID";
  }

  modal.style.display = "flex";
}

function selectAccount(name, email) {
  const content = document.getElementById("socialContent");
  const loading = document.getElementById("socialLoading");

  content.style.display = "none";
  loading.style.display = "flex";

  // Set Identity
  const role =
    email === "arifmadurock7@gmail.com" ? "Manajer" : "Pengguna Baru";
  localStorage.setItem("user_name", name);
  localStorage.setItem("user_email", email);
  localStorage.setItem("user_role", role);

  const managerPic =
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";
  const userPic =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop";
  localStorage.setItem("user_pic", role === "Manajer" ? managerPic : userPic);

  // Simulate server communication
  window.location.href = "dashboard.html";
}

function closeSocialModal() {
  document.getElementById("socialModal").style.display = "none";
}

// Google Auth Integration
const GOOGLE_CLIENT_ID =
  "999365143429-1kqhn6tjub3o4kmjqisgfilep5nmeetr.apps.googleusercontent.com"; // GANTI DENGAN ID ANDA

function initGoogle() {
  if (typeof google === "undefined") {
    setTimeout(initGoogle, 100);
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  });

  google.accounts.id.renderButton(document.getElementById("googleBtn"), {
    theme: "outline",
    size: "large",
    width: 320,
    text: "signin_with",
    shape: "pill",
  });
}

function handleCredentialResponse(response) {
  // Decode JWT to get user info
  const responsePayload = decodeJwt(response.credential);

  // Save user info for dashboard
  const role =
    responsePayload.email === "arifmadurock7@gmail.com"
      ? "Manajer"
      : "Pengguna Baru";
  localStorage.setItem("user_name", responsePayload.name);
  localStorage.setItem("user_email", responsePayload.email);
  localStorage.setItem("user_pic", responsePayload.picture);
  localStorage.setItem("user_role", role);
  localStorage.setItem("is_logged_in", "true");

  // Logic for Member Baru (Real-time update)
  let memberEmails =
    JSON.parse(localStorage.getItem("coffee_member_emails")) || [];
  if (!memberEmails.includes(responsePayload.email)) {
    memberEmails.push(responsePayload.email);
    localStorage.setItem("coffee_member_emails", JSON.stringify(memberEmails));

    let currentMembers =
      parseInt(localStorage.getItem("coffee_members_count")) || 0;
    localStorage.setItem("coffee_members_count", currentMembers + 1);
  }

  alert("Berhasil masuk sebagai " + responsePayload.name);
  window.location.href = "dashboard.html";
}

function decodeJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

// Bisakah login dengan menekan tombol Enter
document.getElementById("pass").addEventListener("keydown", function (e) {
  if (e.key === "Enter") doLogin();
});

document.getElementById("email").addEventListener("keydown", function (e) {
  if (e.key === "Enter") doLogin();
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function checkEmail(inputId, errId) {
  const email = document.getElementById(inputId).value;
  const errBox = document.getElementById(errId);
  if (email && !validateEmail(email)) {
    errBox.style.display = "block";
  } else {
    errBox.style.display = "none";
  }
}

// Toggle Right Panel Visibility
function toggleRightPanel() {
  const panel = document.getElementById("rightPanel");
  const openBtn = document.getElementById("openPanelBtn");
  const leftPanel = document.querySelector(".left");

  if (panel.classList.contains("panel-off")) {
    panel.classList.remove("panel-off");
    openBtn.classList.remove("show");
    if (leftPanel) leftPanel.classList.add("shrink");
  } else {
    panel.classList.add("panel-off");
    openBtn.classList.add("show");
    if (leftPanel) leftPanel.classList.remove("shrink");
  }
}

// Load handler
window.addEventListener("load", () => {
  document.getElementById("email").value = "";
  document.getElementById("pass").value = "";
  initGoogle();

  // Trigger animations
  setTimeout(() => {
    document.body.classList.add("ready");
  }, 100);
});
