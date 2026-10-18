import Admin from "../models/Admin.js";
import SiteInfo from "../models/SiteInfo.js";
import Statistic from "../models/Statistic.js";
import Donation from "../models/Donation.js";

export const seedInitialData = async () => {
  try {
    // 1. Seed Admin
    const adminCom = await Admin.findOne({ email: "admin@gaushala.com" });
    if (!adminCom) {
      await Admin.create({
        email: "admin@gaushala.com",
        password: "change-this-password",
        name: "मुख्य व्यवस्थापक",
        role: "superadmin",
      });
      console.log(" Admin created/updated: admin@gaushala.com");
    }

    // 2. Seed SiteInfo
    const siteInfoCount = await SiteInfo.countDocuments();
    if (siteInfoCount === 0) {
      await SiteInfo.create({
        name: "सर्व हितम सेवा गौशाला",
        address: "ग्राम संदलपुर, खातेगांव, देवास, मध्य प्रदेश",
        phone: "6232786661",
        email: "sarvahitamsevasamiti@gmail.com",
        whatsapp: "6232786661",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Sandalpur+Khategaon+Dewas+Madhya+Pradesh",
        about:
          "सर्व हितम सेवा गौशाला (ग्राम संदलपुर, खातेगांव, देवास) बेसहारा, वृद्ध एवं बीमार गौवंश की सेवा, समुचित उपचार और संरक्षण के लिए समर्पित है।",
      });
      console.log(" Default SiteInfo initialized");
    }

    // 3. Seed Statistics
    const statCount = await Statistic.countDocuments();
    if (statCount === 0) {
      const defaultStatistics = [
        { id: "stat_total_cows", label: "कुल गौ माता", value: null, enabled: true, order: 1 },
        { id: "stat_rescued", label: "रेस्क्यू की गई", value: null, enabled: true, order: 2 },
        { id: "stat_treatment", label: "उपचाररत", value: null, enabled: true, order: 3 },
        { id: "stat_volunteers", label: "सेवक सदस्य", value: null, enabled: true, order: 4 },
        { id: "stat_fodder", label: "आज का चारा (KG)", value: null, enabled: true, order: 5 },
      ];
      await Statistic.insertMany(defaultStatistics);
      console.log(" Default Statistics initialized");
    }

    // 4. Seed Donation
    const donationCount = await Donation.countDocuments();
    if (donationCount === 0) {
      await Donation.create({
        upiId: "",
        qrImage: "",
        description:
          "यहाँ डोनेशन से जुड़ी जानकारी दिखेगी। कृपया Admin Panel में जाकर 'Donation Information' सेक्शन से UPI ID, QR कोड और विवरण जोड़ें।",
        suggestedAmounts: [],
      });
      console.log(" Default Donation info initialized");
    }
  } catch (error) {
    console.error("Error during initial seeding:", error.message);
  }
};
