import Gallery from "../models/Gallery.js";

export const getGalleryPhotos = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "All" ? { category } : {};
    const photos = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: photos });
  } catch (error) {
    next(error);
  }
};

export const addGalleryPhoto = async (req, res, next) => {
  try {
    const { id, image, title, description, category } = req.body;
    const photoId = id || `photo_${Date.now()}`;

    const photo = await Gallery.create({
      id: photoId,
      image,
      title: title || "",
      description: description || "",
      category: category || "Other",
    });

    res.status(201).json({ success: true, data: photo });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const photo = await Gallery.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!photo) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    res.json({ success: true, data: photo });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const photo = await Gallery.findOneAndDelete({ id });

    if (!photo) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    res.json({ success: true, message: "Photo deleted successfully", id });
  } catch (error) {
    next(error);
  }
};
