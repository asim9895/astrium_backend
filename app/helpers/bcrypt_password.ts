import bcrypt from "bcrypt";

/**
 * Encrypts a plaintext password using bcrypt.
 * @param password - The plaintext password to be encrypted.
 * @returns A Promise that resolves to the encrypted password.
 */
export const encrypt_password = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compares a user's password with a stored hashed password using bcrypt.
 * @param user_password - The hashed password stored for the user.
 * @param password - The plaintext password provided by the user.
 * @returns A Promise that resolves to a boolean indicating whether the passwords match.
 */
export const match_password = async (
  user_password: string,
  password: string
) => {
  return await bcrypt.compare(password, user_password);
};
