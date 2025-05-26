import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';
import { Organization } from '../models/Organization.js';
import dotenv from 'dotenv';
dotenv.config();




export const signup = async (req, res) => {
  const { name, email, password, organizationName } = req.body;

  if (!name || !email || !password || !organizationName) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered." });

    // Find organization by name
    const organization = await Organization.findOne({ name: organizationName });
    if (!organization) return res.status(404).json({ message: "Organization not found." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with organization._id (ObjectId), NOT the name string!
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      organization: organization._id,
      role: "user"
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};




export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email }).populate('organization');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '5h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};