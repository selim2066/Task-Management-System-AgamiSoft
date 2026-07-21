import axios from 'axios';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Can't reach the server. Please check your connection.";
    }
    
    const data = error.response.data;
    
    if (data?.details && Array.isArray(data.details)) {
      // Handle Zod error array
      const messages = data.details.map((err: { path?: (string | number)[]; message: string }) => {
        if (err.path && err.path.length > 0) {
          return `${err.path.join('.')}: ${err.message}`;
        }
        return err.message;
      });
      return messages.join(', ');
    }
    
    if (data?.error) {
      return data.error;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "Something went wrong. Please try again.";
}
