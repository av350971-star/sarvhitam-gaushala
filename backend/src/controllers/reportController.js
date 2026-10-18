import Report from "../models/Report.js";

export const getReports = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { cowName: searchRegex },
        { id: searchRegex },
        { description: searchRegex },
        { contactName: searchRegex },
        { contactPhone: searchRegex },
      ];
    }

    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

export const addReport = async (req, res, next) => {
  try {
    const {
      id,
      cowId,
      cowName,
      cowPhoto,
      description,
      photo,
      contactName,
      contactPhone,
      status,
    } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "समस्या का विवरण दर्ज करना अनिवार्य है।",
      });
    }

    const reportId = id || `report_${Date.now()}`;

    const report = await Report.create({
      id: reportId,
      cowId: cowId || "",
      cowName: cowName || "",
      cowPhoto: cowPhoto || "",
      description: description.trim(),
      photo: photo || "",
      contactName: contactName ? contactName.trim() : "",
      contactPhone: contactPhone ? contactPhone.trim() : "",
      status: status || "New",
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["New", "Under Review", "Resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "अमान्य स्टेटस (Invalid Status)",
      });
    }

    const report = await Report.findOneAndUpdate(
      { id },
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findOneAndDelete({ id });

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.json({ success: true, message: "रिपोर्ट हटा दी गई है", id });
  } catch (error) {
    next(error);
  }
};
