document.getElementById('register-form').addEventListener('submit', async function (event) {
event.preventDefault(); // Prevent the form from refreshing the page
  
    // Collect input values
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const phone = document.getElementById('reg-phone').value;
  
    // Prepare the request payload
    const payload = {
      name: name,
      email: email,
      password: password,
      phone: phone,
    };
  
    try {
      
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', // Specify JSON format
        },
        body: JSON.stringify(payload), // Send the payload as JSON
      });
  
      // Handle the response
      if (response.ok) {
        const data = await response.json();
        alert('Registration successful!');
      
        localStorage.setItem('userId', data.userId); // Save the userId for use in index.html
        window.location.href = 'index.html';
       

      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred while registering. Please try again.');
    }
  });
  