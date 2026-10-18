import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "gaushala_super_secret_jwt_key_2026_xyz123",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email और Password दोनों आवश्यक हैं।",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "गलत ईमेल या पासवर्ड।",
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "गलत ईमेल या पासवर्ड।",
      });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    next(error);
  }
};

export const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "वर्तमान और नया पासवर्ड दोनों आवश्यक हैं।",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
      });
    }

    const admin = await Admin.findById(req.admin._id);
    const isMatch = await admin.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "वर्तमान पासवर्ड सही नहीं है।",
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: "पासवर्ड सफलतापूर्वक बदल दिया गया है।",
    });
  } catch (error) {
    next(error);
  }
};
