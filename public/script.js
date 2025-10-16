// Optional client-side validation for email form
document.addEventListener("DOMContentLoaded", function () {
  const emailForm = document.querySelector('form[action="/send-email"]');
  if (emailForm) {
    emailForm.addEventListener("submit", function (e) {
      const receivers = document.getElementById("receivers").value;
      const message = document.getElementById("message").value;

      // Basic email validation for comma-separated list
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emails = receivers.split(",").map((email) => email.trim());
      const invalidEmails = emails.filter((email) => !emailRegex.test(email));

      if (invalidEmails.length > 0) {
        alert("Invalid email addresses: " + invalidEmails.join(", "));
        e.preventDefault();
        return;
      }

      if (!message.trim()) {
        alert("Message cannot be empty");
        e.preventDefault();
        return;
      }
    });
  }

  // Password change form validation
  const passwordForm = document.querySelector(
    'form[action="/change-password"]'
  );
  if (passwordForm) {
    passwordForm.addEventListener("submit", function (e) {
      const newPassword = document.getElementById("newPassword").value;
      if (newPassword.length < 6) {
        alert("New password must be at least 6 characters long");
        e.preventDefault();
      }
    });
  }
});
