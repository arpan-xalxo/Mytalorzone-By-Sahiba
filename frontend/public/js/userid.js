// Retrieve the userId from localStorage
const userId = localStorage.getItem('userId');

if (userId) {
  console.log(`User ID: ${userId}`); // Use the userId as needed
 
} else {
  console.log('No user is logged in.');
}
