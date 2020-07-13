export function randomString(length: number = 8): string {
  const validChars = "qwertyuiopasdfghjklzxcvbnm1234567890";
  let str = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * validChars.length);
    str += validChars[randomIndex];
  }
  return str;
}
