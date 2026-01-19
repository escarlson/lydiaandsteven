// CLIENT-SIDE ONLY - No database imports!
export const inviteSearch = async (givenName: string, familyName: string, postalCode: string) => {
  try {
    const response = await fetch(`/api/rsvp/search?givenName=${encodeURIComponent(givenName)}&familyName=${encodeURIComponent(familyName)}&postalCode=${encodeURIComponent(postalCode)}`, {
      method: "GET",
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch RSVP", error);
    return { error: "An error occurred while searching" };
  }
};