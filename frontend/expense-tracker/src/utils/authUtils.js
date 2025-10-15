// Token utility functions
export const getToken = () => {
  return localStorage.getItem('token');
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const redirectToLogin = () => {
  clearAuthData();
  window.location.href = '/login';
};

export const checkAuthAndRedirect = () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    redirectToLogin();
    return false;
  }
  return true;
};