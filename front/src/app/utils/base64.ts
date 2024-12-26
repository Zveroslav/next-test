export const encodeSortingToBase64 = (sorting: string[] | object[] ) => {
  try {
    const jsonString = JSON.stringify(sorting);
    return btoa(jsonString); // Use browser's built-in Base64 encoding
  } catch (e) {
    console.error(e)
    throw e;
  }

  };
  
  export const decodeSortingFromBase64 = (base64: string) => {
    try {
      const jsonString = atob(base64); // Use browser's built-in Base64 decoding
      return JSON.parse(jsonString);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };