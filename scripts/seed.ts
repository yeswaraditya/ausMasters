import mongoose from "mongoose";
import { VisaProfile } from "../src/models/VisaProfile";

const visaProfiles = [
  {
    studentLevel: "Masters",
    course: "Master of Information Technology",
    englishScore: 7.5,
    financialCapacity: 45000,
    studyGapYears: 0,
    visaRefusal: false,
    processingTimeWeeks: 3,
    outcome: "approved",
    riskFactors: [],
    country: "AU",
  },
  {
    studentLevel: "Undergraduate",
    course: "Bachelor of Business",
    englishScore: 6.5,
    financialCapacity: 35000,
    studyGapYears: 2,
    visaRefusal: false,
    processingTimeWeeks: 5,
    outcome: "approved",
    riskFactors: ["Study gap of 2 years requires explanation"],
    country: "AU",
  },
  {
    studentLevel: "PhD",
    course: "PhD in Engineering",
    englishScore: 8.0,
    financialCapacity: 50000,
    studyGapYears: 1,
    visaRefusal: false,
    processingTimeWeeks: 2,
    outcome: "approved",
    riskFactors: [],
    country: "AU",
  },
  {
    studentLevel: "Masters",
    course: "Master of Data Science",
    englishScore: 6.0,
    financialCapacity: 30000,
    studyGapYears: 3,
    visaRefusal: true,
    processingTimeWeeks: 8,
    outcome: "rejected",
    riskFactors: [
      "Previous visa refusal",
      "Study gap of 3 years",
      "Lower English score",
    ],
    country: "AU",
  },
  {
    studentLevel: "Diploma",
    course: "Diploma in Hospitality",
    englishScore: 5.5,
    financialCapacity: 25000,
    studyGapYears: 1,
    visaRefusal: false,
    processingTimeWeeks: 6,
    outcome: "approved",
    riskFactors: ["Financial capacity near minimum threshold"],
    country: "AU",
  },
  {
    studentLevel: "Masters",
    course: "Master of Nursing",
    englishScore: 7.0,
    financialCapacity: 40000,
    studyGapYears: 0,
    visaRefusal: false,
    processingTimeWeeks: 4,
    outcome: "approved",
    riskFactors: [],
    country: "AU",
  },
  {
    studentLevel: "Undergraduate",
    course: "Bachelor of Engineering",
    englishScore: 7.0,
    financialCapacity: 38000,
    studyGapYears: 0,
    visaRefusal: false,
    processingTimeWeeks: 3,
    outcome: "approved",
    riskFactors: [],
    country: "AU",
  },
  {
    studentLevel: "Masters",
    course: "Master of Accounting",
    englishScore: 6.5,
    financialCapacity: 32000,
    studyGapYears: 4,
    visaRefusal: true,
    processingTimeWeeks: 7,
    outcome: "rejected",
    riskFactors: [
      "Previous visa refusal from another country",
      "Significant study gap",
      "Course change from previous field",
    ],
    country: "AU",
  },
];

async function seed() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/study-abroad-hub"
    );
    console.log("Connected to MongoDB");

    await VisaProfile.deleteMany({});
    console.log("Cleared existing profiles");

    const result = await VisaProfile.insertMany(visaProfiles);
    console.log(`Seeded ${result.length} visa profiles`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
