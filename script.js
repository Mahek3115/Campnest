(function() {
      emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
    })();
  
    document.addEventListener('DOMContentLoaded', function() {
      const bookYourCampBtn = document.getElementById('bookYourCampBtn');
      if (bookYourCampBtn) {
        bookYourCampBtn.addEventListener('click', showBookingForm);
      }
    });

    function showBookingForm() {
      document.getElementById("bookingForm").style.display = "block";
      window.scrollTo({
        top: document.getElementById("bookingForm").offsetTop - 100,
        behavior: 'smooth'
      });
    }

    function generateTicket() {
      const name = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const location = document.getElementById("location").value.trim();
      const date = document.getElementById("date").value;
      const people = document.getElementById("people").value;

      if (!name || !email || !location || !date || !people) {
        alert("Please fill all the booking details.");
        return;
      }

      const ticketHTML = `
  <h2>🎫 CampNest Booking Ticket</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Location:</strong> ${location}</p>
  <p><strong>Date:</strong> ${date}</p>
  <p><strong>People:</strong> ${people}</p>
  <p>✅ Your camping adventure is booked!</p>
`;


      document.getElementById("ticketContent").innerHTML = ticketHTML;
      document.getElementById("ticketBox").style.display = "block";
      document.getElementById("thankYouMsg").style.display = "block";

      sendEmail(name, email, location, date, people);
    }

    function sendEmail(name, email, location, date, people) {
      const params = {
        full_name: name,
        user_email: email,
        camp_location: location,
        camp_date: date,
        camp_people: people,
        message: "Your CampNest ticket is successfully booked!"
      };

      emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params)
        .then(() => console.log("Email sent"))
        .catch(err => console.error("Email failed", err));
    }

    async function downloadTicketPDF() {
      const { jsPDF } = window.jspdf;
      const ticket = document.getElementById("ticketContent");

      const canvas = await html2canvas(ticket, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save("CampNest_Ticket.pdf");
    }
  
    const loginBox = document.getElementById("loginBox");
    const registerBox = document.getElementById("registerBox");
    const authContainer = document.getElementById("auth-container");
    const mainWebsite = document.getElementById("main-website");

    function showRegister() {
      loginBox.classList.add("hidden");
      registerBox.classList.remove("hidden");
    }

    function showLogin() {
      registerBox.classList.add("hidden");
      loginBox.classList.remove("hidden");
    }

    function registerUser() {
      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value;

      if (!name || !email || !password) {
        alert("Please fill all fields.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some(u => u.email === email)) {
        alert("User already exists. Try logging in.");
        return;
      }

      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful! Now login.");
      showLogin();
    }

    function loginUser() {
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        showMainWebsite();
      } else {
        alert("Invalid email or password.");
      }
    }

    function showMainWebsite() {
      authContainer.style.display = "none";
      mainWebsite.style.display = "block";
    }

    function logout() {
      localStorage.removeItem("loggedInUser");
      location.reload();
    }

    // Auto-login check
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      showMainWebsite();
    }