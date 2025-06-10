const mongoose = require("mongoose");
const Chatbot = require("./models/chatModel");

mongoose.connect("mongodb://localhost:27017/chatbotdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
  return seedData();
}).catch(err => {
  console.error("❌ MongoDB connection failed:", err);
});

async function seedData() {
  try {
    const chats = [
      { keyword: ["library timing"], response: "The library is open from 9 AM to 7 PM." },
      { keyword: ["warden contact"], response: "Warden's number is +91-9876543210." },
      { keyword: ["hostel fees","fees"], response: "Hostel fee is ₹5000 per semester." },
      { keyword: ["wifi password"], response: "Please contact the IT helpdesk for WiFi credentials." },
      {
        keyword: ["hostel food", "meal details", "food"],
        response: "Hostel provides vegetarian meals three times a day: breakfast, lunch, and dinner."
      },
      {
        keyword: ["hostel menu", "food menu", "today menu"],
        response: `Here's the weekly hostel menu:
- Monday: Idli, Sambar, Rice, Beans Poriyal
- Tuesday: Dosa, Chutney, Sambar Rice, Potato Fry
- Wednesday: Pongal, Vada, Curd Rice, Brinjal Curry
- Thursday: Poori, Kurma, Lemon Rice, Cabbage Poriyal
- Friday: Upma, Chutney, Veg Biriyani, Raita
- Saturday: Bread, Jam, Tomato Rice, Chips
- Sunday: Chappathi, Paneer Masala, Gulab Jamun`
      },
      {
        keyword: ["room allocation", "my room", "room number","room booking",],
        response: "Rooms are allocated based on your department, year, and gender. Contact the warden for exact details."
      },
      {
        keyword: ["leave form", "apply leave", "permission form"],
        response: "Download the leave form from the portal, get signatures from your department and warden."
      },
      {
        keyword: ["visitor timing", "guest visiting hours", "parents visit"],
        response: "Visitors are allowed only on Sundays between 10 AM and 5 PM with valid ID proof."
      },
      {
        keyword: ["laundry", "washing clothes", "laundry time","washing"],
        response: "Laundry service is available every Wednesday and Saturday."
      },
      {
        keyword: ["hostel rules", "discipline", "regulations"],
        response: "Quiet hours: 10 PM to 6 AM. Visitors only on Sundays. No ragging allowed. Maintain cleanliness."
      },
      {
        keyword: ["fees structure", "fees details","hostel fees"],
        response: "Hostel fee is ₹5000 per semester."
      },
      {
        keyword: ["how to book my room "],
        response: "go to admission form fill the details pay the fees ,."
      },
      {
        keyword: ["complaint", "report issue", "problem","complaints"],
        response: "Submit complaints through the Feedback section or contact your block warden."
      },
      {
        keyword: ["hi ","hello","hii","hiii","hey","hlo"],
        response: "hi 👋 how can i help you today 😊 ,."
      }
    ];

    await Chatbot.deleteMany(); // Clear old data
    await Chatbot.insertMany(chats);
    console.log("✅ Data inserted into chatbot_data collection");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting data:", err);
    mongoose.connection.close();
  }
}
