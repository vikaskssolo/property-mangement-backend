import jwt from "jsonwebtoken";

const jwtTokenCreation = async (id, name, role, email, phone) => {
  const token = jwt.sign(
    {
      id: id,
      name: name,
      role: role,
      email: email,
      phone: phone,
    },
    process.env.TOKENKEY
  );
  return token;
};

export default jwtTokenCreation;
