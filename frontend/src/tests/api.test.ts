import { authAPI } from '../services/api';

// Test user data
const testUser = {
  email: `test${Date.now()}@example.com`,
  password: 'Test123!@#',
  first_name: 'Test',
  last_name: 'User',
  username: `testuser${Date.now()}`
};

// Test credentials
const testCredentials = {
  email: testUser.email,
  password: testUser.password
};

// Test registration
const testRegistration = async () => {
  console.log('Testing registration...');
  try {
    const response = await authAPI.register(testUser);
    console.log('Registration successful:', response.data);
    return true;
  } catch (error) {
    console.error('Registration failed:', error);
    return false;
  }
};

// Test login
const testLogin = async () => {
  console.log('Testing login...');
  try {
    const response = await authAPI.login(testCredentials);
    console.log('Login successful:', response.data);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

// Test token verification
const testTokenVerification = async () => {
  console.log('Testing token verification...');
  try {
    const isValid = await authAPI.verifyToken();
    console.log('Token verification result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

// Test logout
const testLogout = async () => {
  console.log('Testing logout...');
  try {
    await authAPI.logout();
    console.log('Logout successful');
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('Starting API tests...');
  
  // Test registration
  const registrationSuccess = await testRegistration();
  if (!registrationSuccess) {
    console.error('Registration test failed. Stopping further tests.');
    return;
  }
  
  // Test login
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.error('Login test failed. Stopping further tests.');
    return;
  }
  
  // Test token verification
  const tokenVerificationSuccess = await testTokenVerification();
  if (!tokenVerificationSuccess) {
    console.error('Token verification test failed.');
  }
  
  // Test logout
  const logoutSuccess = await testLogout();
  if (!logoutSuccess) {
    console.error('Logout test failed.');
  }
  
  console.log('API tests completed.');
};

// Export the test functions
export {
  testRegistration,
  testLogin,
  testTokenVerification,
  testLogout,
  runTests
}; 