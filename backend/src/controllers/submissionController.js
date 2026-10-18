import Volunteer from "../models/Volunteer.js";
import Suggestion from "../models/Suggestion.js";
import AdoptionRequest from "../models/AdoptionRequest.js";

// ---------- Volunteers ----------
export const addVolunteer = async (req, res, next) => {
  try {
    const { fullName, phone, email, city, sevaType, message } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: "नाम और फ़ोन नंबर आवश्यक हैं।",
      });
    }

    const volunteer = await Volunteer.create({
      fullName,
      phone,
      email: email || "",
      city: city || "",
      sevaType: sevaType || "",
      message: message || "",
    });

    res.status(201).json({ success: true, data: volunteer });
  } catch (error) {
    next(error);
  }
};

export const getVolunteers = async (req, res, next) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: volunteers });
  } catch (error) {
    next(error);
  }
};

// ---------- Suggestions ----------
export const addSuggestion = async (req, res, next) => {
  try {
    const { name, phone, suggestion } = req.body;
    if (!suggestion || !suggestion.trim()) {
      return res.status(400).json({
        success: false,
        message: "सुझाव दर्ज करना अनिवार्य है।",
      });
    }

    const item = await Suggestion.create({
      name: name || "",
      phone: phone || "",
      suggestion: suggestion.trim(),
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const getSuggestions = async (req, res, next) => {
  try {
    const suggestions = await Suggestion.find().sort({ createdAt: -1 });
    res.json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
};

// ---------- Adoption Requests ----------
export const addAdoptionRequest = async (req, res, next) => {
  try {
    const {
      cowId,
      cowName,
      applicantName,
      phone,
      email,
      address,
      message,
    } = req.body;

    if (!applicantName || !phone) {
      return res.status(400).json({
        success: false,
        message: "आवेदक का नाम और फ़ोन नंबर आवश्यक हैं।",
      });
    }

    const item = await AdoptionRequest.create({
      cowId: cowId || "",
      cowName: cowName || "",
      applicantName,
      phone,
      email: email || "",
      address: address || "",
      message: message || "",
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const getAdoptionRequests = async (req, res, next) => {
  try {
    const requests = await AdoptionRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};
