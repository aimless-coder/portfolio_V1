
    emailjs.init("S_iUIUPyQmhdB1tf3");

    function sendEmail() {
        const form = document.querySelector('.contact-form');
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const message = document.querySelector('#message').value;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
        if (!name || !email || !message) {
          Toastify({
            text: "All fields are required.",
            duration: 3000,
            newWindow: true,
            gravity: "bottom",
            position: "center",
            stopOnFocus: true,
            style: {
              background: "black",
            },
          }).showToast();
          return;
        }
      
        if (!emailRegex.test(email)) {
          Toastify({
            text: "Please enter a valid email address.",
            duration: 3000,
            newWindow: true,
            gravity: "bottom",
            position: "center",
            stopOnFocus: true,
            style: {
              background: "black",
            },
          }).showToast();
          return;
        }

        emailjs.sendForm(
          'service_aimlessCoder',
          'template_submitContactFm',
          form 
        ).then(
          function (response) {
            Toastify({
                text: "Email sent successfully!",
                duration: 3000,
                newWindow: true,
                gravity: "bottom",
                position: "center",
                stopOnFocus: true,
                style: {
                  background: "black",
                },
              }).showToast();
            form.reset();
          },
          function (error) {
            Toastify({
                text: "Failed to send email. Please try again later.",
                duration: 3000,
                newWindow: true,
                gravity: "bottom",
                position: "center",
                stopOnFocus: true,
                style: {
                  background: "red",
                },
              }).showToast();
            form.reset();
          }
        );
      }
      