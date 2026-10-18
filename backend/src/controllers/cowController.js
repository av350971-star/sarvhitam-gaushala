import Cow from "../models/Cow.js";

export const getCows = async (req, res, next) => {
  try {
    const cows = await Cow.find().sort({ createdAt: -1 });
    res.json({ success: true, data: cows });
  } catch (error) {
    next(error);
  }
};

export const getCowById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cow = await Cow.findOne({ id });
    if (!cow) {
      return res.status(404).json({ success: false, message: "गौ माता रिकॉर्ड नहीं मिला" });
    }
    res.json({ success: true, data: cow });
  } catch (error) {
    next(error);
  }
};

export const addCow = async (req, res, next) => {
  try {
    const { id, name, photo, description, status, adoptionInfo } = req.body;
    const cowId = id || `cow_${Date.now()}`;

    const cow = await Cow.create({
      id: cowId,
      name,
      photo: photo || "",
      description: description || "",
      status: status || "स्वस्थ",
      adoptionInfo: adoptionInfo || "",
    });

    res.status(201).json({ success: true, data: cow });
  } catch (error) {
    next(error);
  }
};

export const updateCow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cow = await Cow.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cow) {
      return res.status(404).json({ success: false, message: "गौ माता रिकॉर्ड नहीं मिला" });
    }

    res.json({ success: true, data: cow });
  } catch (error) {
    next(error);
  }
};

export const deleteCow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cow = await Cow.findOneAndDelete({ id });

    if (!cow) {
      return res.status(404).json({ success: false, message: "गौ माता रिकॉर्ड नहीं मिला" });
    }

    res.json({ success: true, message: "रिकॉर्ड सफलतापूर्वक हटाया गया", id });
  } catch (error) {
    next(error);
  }
};
