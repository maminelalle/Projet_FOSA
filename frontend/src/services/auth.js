export const login = async (credentials) => {
  const response = await API.post('auth/token/', credentials);
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyNjE1MTE4LCJpYXQiOjE3NTI2MTQ4MTgsImp0aSI6IjJmZTkwNzJkMGE0MzQ5NjQ5NWIwYTZmODg1MTYxNDJiIiwidXNlcl9pZCI6Mn0.7cULqDNINWv8OuKFTwz15XGD5c9myD-RWAN2QWXkXas');
  localStorage.removeItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjcwMTIxOCwiaWF0IjoxNzUyNjE0ODE4LCJqdGkiOiJhYTMxZGU2MTQ1YWE0NTdhYjYzZmRhYjM0YTQ5OWQ5YSIsInVzZXJfaWQiOjJ9.C6QZwrJI2jOFs4bVOAAQ819x3-AQ2YDMxcy2OLp-W7k');
};