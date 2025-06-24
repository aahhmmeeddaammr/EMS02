import { UserModel } from "../../db/models/User.model.js";

// CREATE
export const createUser = async (req, res, next) => {
  try {
    const { name, email, age, phone, startDate } = req.body;
    const user = await UserModel.create({
      name,
      email,
      age,
      phone,
      startDate,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(409).json({ message: "Email already exist" });
  }
};

// READ ALL
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json({ message: "done", data: { users } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "done", data: { user } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateUser = async (req, res) => {
  try {
    console.log(req.file);

    const user = await UserModel.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { name, email, age, phone, startDate } = req.body;
    await user.update({
      name,
      email,
      age,
      phone,
      startDate,
      image: req.file ? req.file.path : user.image,
    });
    res.status(200).json({ message: "User updated", data: { user } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
