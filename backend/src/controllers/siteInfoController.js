import SiteInfo from "../models/SiteInfo.js";

export const getSiteInfo = async (req, res, next) => {
  try {
    let siteInfo = await SiteInfo.findOne();
    if (!siteInfo) {
      siteInfo = await SiteInfo.create({});
    }
    res.json({ success: true, data: siteInfo });
  } catch (error) {
    next(error);
  }
};

export const updateSiteInfo = async (req, res, next) => {
  try {
    let siteInfo = await SiteInfo.findOne();
    if (!siteInfo) {
      siteInfo = await SiteInfo.create(req.body);
    } else {
      siteInfo = await SiteInfo.findByIdAndUpdate(siteInfo._id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    res.json({ success: true, data: siteInfo });
  } catch (error) {
    next(error);
  }
};
