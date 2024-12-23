document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from refreshing the page
      
    // Collect input values
    const email = document.getElementById('username').value; // Change 'username' to 'email'
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
  
    // Prepare the request payload
    const payload = {
      email: email,  // Changed to 'email'
      password: password,
      rememberMe: rememberMe,
    };
  
    try {
      // Send data to the backend using fetch
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'application/json', // Specify JSON format
        },
        body: JSON.stringify(payload), // Send the payload as JSON
      });
  
      // Handle the response
      if (response.ok) {
        const data = await response.json();
        console.log(data);

         // Save data to localStorage
        localStorage.setItem('userId', data.userId); // Save the userId for use in index.html
        window.location.href = 'index.html';
       

       
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred while logging in. Please try again.');
    }
  });
  