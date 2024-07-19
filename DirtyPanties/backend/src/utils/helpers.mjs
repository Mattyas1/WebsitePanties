import bcrypt from "bcrypt";

const saltRounds = 15;

export const hashPassword = async (password) => {
     await bcrypt.genSalt(saltRounds);
    return  await bcrypt.hash(password, saltRounds);

};

export const comparePassword= async (plain, hashed) => {
    return await bcrypt.compare(plain, hashed)
};