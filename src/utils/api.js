// Utility function to safely parse JSON responses
export const safeJsonParse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.log('Non-JSON response:', text);
    throw new Error('Server returned non-JSON response. Backend may be down.');
  }
  
  try {
    return await response.json();
  } catch (error) {
    console.error('JSON parsing error:', error);
    throw new Error('Invalid JSON response from server');
  }
};

// Utility function for API calls with proper error handling
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorData = await safeJsonParse(response);
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse error response, use default message
      }
      throw new Error(errorMessage);
    }
    
    return await safeJsonParse(response);
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};