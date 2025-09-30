const today = new Date();
today.setHours(0, 0, 0, 0); 
export const start = today.toISOString();
export const end = new Date().toISOString();
export const addStartTime= new Date(today.getTime() - 1000 * 60 * 30).toISOString();