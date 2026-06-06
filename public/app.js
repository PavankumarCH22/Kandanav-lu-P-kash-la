// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDL1INc1SgeiipP2ArJIQSuOE_osAnDjFM",
  authDomain: "kandanavolu-paakashala.firebaseapp.com",
  projectId: "kandanavolu-paakashala",
  storageBucket: "kandanavolu-paakashala.firebasestorage.app",
  messagingSenderId: "622375436948",
  appId: "1:622375436948:web:80049b02aaeb4a6f9caa81",
  measurementId: "G-BTZB65XGHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const menuGrid = document.querySelector("#menuGrid");
const packageGrid = document.querySelector("#packageGrid");
const servingStyleGrid = document.querySelector("#servingStyleGrid");
const functionsGrid = document.querySelector("#functionsGrid");
const testimonialGrid = document.querySelector("#testimonialGrid");
const packageSelect = document.querySelector("#packageSelect");
const functionSelect = document.querySelector("#functionSelect");
const bookingForm = document.querySelector("#bookingForm");
const formStatus = document.querySelector("#formStatus");
const languageButtons = document.querySelectorAll("[data-lang]");

// Selection options
const selectedItemsBox = document.querySelector("#selectedItemsBox");
const selectedItemsContainer = document.querySelector("#selectedItemsContainer");
const clearSelectedBtn = document.querySelector("#clearSelectedBtn");
const messageInput = document.querySelector("#messageInput");
const fontSizeSelect = document.querySelector("#fontSizeSelect");

let currentLanguage = localStorage.getItem("kp-language") || "en";
let currentFontSize = localStorage.getItem("kp-font-size") || "normal";
let cachedFunctions = [];
let cachedMenu = [];
let cachedPackages = [];
let cachedServingStyles = [];
let currentServingSlideIndex = 0;
const selectedItems = new Set();

const translations = {
  en: {
    "brand.subtitle": "Professional Catering Services",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.functions": "Functions",
    "nav.menu": "Menu",
    "nav.contact": "Contact",
    "nav.book": "Book Now",
    "tagline": "Traditional Taste... Quality Service",
    "tagline.dot": "Traditional Taste. Quality Service.",
    "hero.badge": "Premium Kurnool catering",
    "hero.eyebrow": "Kandanavolu Paakashala catering services",
    "hero.title": "Professional Andhra catering for every celebration.",
    "hero.copy": "Carefully planned menus, authentic Rayalaseema taste, hygienic preparation, live counters, and warm guest service for weddings, family functions, and business events.",
    "hero.inquiry": "Request a Quote",
    "hero.services": "View services",
    "visitor.pill": "Catering profile",
    "visitor.copy": "End-to-end catering support for guest planning, menu selection, preparation, serving, and live food counters.",
    "visitor.fast": "Fast inquiry",
    "visitor.area": "Kurnool area",
    "visitor.food": "Veg and non-veg",
    "visitor.leaf": "Banana leaf meals",
    "trust.items": "menu options",
    "trust.functions": "function types",
    "trust.area": "service area",
    "trust.service": "booking support",
    "dock.explore": "Explore Menus",
    "dock.exploreSmall": "Andhra meals, sweets, and counters",
    "dock.select": "Choose Event",
    "dock.selectSmall": "Weddings, receptions, and gatherings",
    "dock.inquiry": "Request Quote",
    "dock.inquirySmall": "Fast callback from our team",
    "business.kicker": "Business Catering",
    "business.title": "Professional catering support for every event size.",
    "business.copy": "Kandanavolu Paakashala helps customers choose food items, serving style, guest count, and event details with a clear booking process for fast follow-up.",
    "business.card1Title": "Quick Booking",
    "business.card1Copy": "Call, WhatsApp, or send the online inquiry form.",
    "business.card2Title": "Event Ready",
    "business.card2Copy": "Weddings, receptions, family events, temple events, and outdoor service.",
    "business.card3Title": "Food Options",
    "business.card3Copy": "Veg, non-veg, village specials, live counters, and banana leaf meals.",
    "business.card4Title": "Booking Records",
    "business.card4Copy": "Admin can view inquiries and export booking sheet data.",
    "about.kicker": "About Us",
    "about.title": "Authentic village taste with modern catering standards.",
    "about.copy1": "We provide professional Andhra village-style catering in Kurnool for weddings, engagements, housewarming functions, temple events, corporate events, college functions, outdoor events, and family gatherings.",
    "about.copy2": "Our team focuses on fresh ingredients, hygienic preparation, punctual service, banana leaf meals, live counters, and flexible veg and non-veg menu planning.",
    "about.business": "Business Name",
    "about.location": "Location",
    "about.contact": "Contact",
    "services.kicker": "Catering Services",
    "services.title": "Kandanavolu Paakashala for every function.",
    "services.copy": "A professional Kurnool catering service for weddings, engagements, family functions, temple events, college events, corporate gatherings, outdoor events, and village celebrations.",
    "services.foodTitle": "Function Food",
    "services.foodCopy": "Welcome drinks, starters, Andhra meals, rice items, curries, dal, sambar, rotis, fry items, and sweets.",
    "services.specialTitle": "Village Specials",
    "services.specialCopy": "Ragi Sangati, Naatu Kodi Pulusu, Ulavacharu, clay-pot style food, banana leaf meals, and live counters.",
    "services.promiseTitle": "Service Promise",
    "services.promiseCopy": "Responsive booking support, hygienic cooking, fresh ingredients, an experienced team, and bulk orders accepted.",
    "specialty.taste": "Traditional Andhra Taste",
    "specialty.hygiene": "Hygienic Cooking",
    "specialty.fresh": "Fresh Ingredients",
    "specialty.live": "Live Counters Available",
    "specialty.leaf": "Banana Leaf Meals",
    "specialty.bulk": "Bulk Orders Accepted",
    "route.kicker": "Visitor Route",
    "route.title": "From food idea to function service.",
    "route.browse": "Browse",
    "route.browseCopy": "Review drinks, starters, meals, curries, sweets, and specials in one place.",
    "route.choose": "Choose",
    "route.chooseCopy": "Choose a ready combo or share a custom item list for your event.",
    "route.serve": "Serve",
    "route.serveCopy": "We align food, location, guest count, and serving style before the event.",
    "functions.kicker": "Functions We Serve",
    "functions.title": "Food service for every Kurnool celebration.",
    "functions.copy": "Choose your event type in the booking form so our team can suggest the right menu and serving plan.",
    "menu.kicker": "Special Menu",
    "menu.title": "Curated Andhra function menu",
    "menu.count": "90 function items",
    "packages.kicker": "Combination Meals",
    "packages.title": "Famous village combos",
    "serving.kicker": "Catering Specialties",
    "serving.title": "Traditional serving & cooking styles",
    "reviews.kicker": "Local Reviews",
    "reviews.title": "What families say",
    "booking.kicker": "Booking Desk",
    "booking.title": "Tell us about your event.",
    "booking.copy": "Share the function type, food preference, guest count, location, and date. Our team will review the details and contact you with the next steps.",
    "booking.leaf": "Banana leaf serving",
    "booking.live": "Live counters",
    "booking.service": "24/7 service",
    "booking.export": "Custom menu planning",
    "form.name": "Name",
    "form.namePlaceholder": "Your name",
    "form.phone": "Phone",
    "form.foodNeed": "Food need",
    "form.selectFoodNeed": "Select food need",
    "form.functionType": "Function type",
    "form.selectFunction": "Select function",
    "form.preference": "Veg / Non-veg",
    "form.selectPreference": "Select preference",
    "form.guests": "Guests",
    "form.date": "Date",
    "form.area": "Kurnool area",
    "form.areaPlaceholder": "Nandyal Road, Adoni, Yemmiganur...",
    "form.package": "Combo or food set",
    "form.custom": "Custom",
    "form.message": "Message",
    "form.messagePlaceholder": "Mention items like panakam, mirchi bajji, biryani, gutti vankaya, naatu kodi pulusu, bobbatlu, or live counters",
    "form.submit": "Request catering quote",
    "form.selectedTitle": "Selected Food Items",
    "form.clearSelection": "Clear All",
    "form.fontSize": "Font Size",
    "fontSize.small": "Small Size",
    "fontSize.normal": "Normal Size",
    "fontSize.large": "Large Size",
    "fontSize.xlarge": "Extra Large",
    "foodNeed.welcome": "Welcome drinks",
    "foodNeed.starters": "Starters",
    "foodNeed.rice": "Rice items",
    "foodNeed.curries": "Curries and dal",
    "foodNeed.nonVeg": "Non-veg specials",
    "foodNeed.sweets": "Sweets",
    "foodNeed.live": "Live counters",
    "foodNeed.custom": "Custom item order",
    "preference.veg": "Veg",
    "preference.nonVeg": "Non-veg",
    "preference.both": "Both veg and non-veg",
    "contact.kicker": "Contact",
    "contact.title": "Call or WhatsApp for booking support.",
    "contact.copy": "Kandanavolu Paakashala serves Kurnool and nearby areas with professional catering support for weddings, family functions, and organized events.",
    "contact.call1": "Call 63005 48790",
    "contact.whatsapp1": "WhatsApp 63005 48790",
    "contact.call2": "Call 90304 35532",
    "contact.whatsapp2": "WhatsApp 90304 35532",
    "contact.primary": "Primary Helpline",
    "contact.secondary": "Secondary Helpline",
    "contact.callNow": "Call Now",
    "contact.chatNow": "WhatsApp",
    "contact.admin": "Admin Dashboard",
    "quick.call1": "Call Primary",
    "quick.call2": "Call Secondary",
    "quick.whatsapp": "WhatsApp",
    "footer.copy": "Professional Andhra catering for functions, events, banana leaf meals, and live counters.",
    "status.loading": "Sending inquiry...",
    "status.contentError": "Some content could not load. Please refresh once.",
    "status.formError": "Please check the form.",
    "status.networkError": "Could not reach the server. Please try again.",
    "menu.items": "items",
    "menu.viewItems": "View items",
    "menu.hideItems": "Hide items"
  },
  te: {
    "brand.subtitle": "కేటరింగ్ సర్వీసెస్",
    "nav.home": "హోమ్",
    "nav.about": "మా గురించి",
    "nav.services": "సేవలు",
    "nav.functions": "ఫంక్షన్స్",
    "nav.menu": "మెనూ",
    "nav.contact": "సంప్రదించండి",
    "nav.book": "బుకింగ్",
    "tagline": "సాంప్రదాయ రుచి... నాణ్యమైన సేవ",
    "tagline.dot": "సాంప్రదాయ రుచి. నాణ్యమైన సేవ.",
    "hero.badge": "కర్నూలు ఫుడ్ సర్వీస్",
    "hero.eyebrow": "కందనవోలు పాకశాల కేటరింగ్ సర్వీసెస్",
    "hero.title": "ప్రతి కర్నూలు వేడుకకు సాంప్రదాయ రుచి.",
    "hero.copy": "వెల్కమ్ డ్రింక్స్, స్టార్టర్స్, ఆంధ్ర భోజనం, కూరలు, స్వీట్స్, రాగి సంగటి, నాటు కోడి పులుసు, అరటి ఆకు వడ్డింపు, లైవ్ కౌంటర్లు అందిస్తాం.",
    "hero.inquiry": "ఇంక్వైరీ పంపండి",
    "hero.services": "సేవలు చూడండి",
    "visitor.pill": "కేటరింగ్ ప్రొఫైల్",
    "visitor.copy": "పెళ్లిళ్లు, ఫంక్షన్స్, ఈవెంట్స్, కుటుంబ వేడుకలు, లైవ్ కౌంటర్లకు గ్రామీణ ఆంధ్ర ఫుడ్ సర్వీస్.",
    "visitor.fast": "త్వరిత ఇంక్వైరీ",
    "visitor.area": "కర్నూలు ప్రాంతం",
    "visitor.food": "వెజ్ మరియు నాన్-వెజ్",
    "visitor.leaf": "అరటి ఆకు భోజనం",
    "trust.items": "ఫంక్షన్ ఫుడ్ ఐటమ్స్",
    "trust.functions": "ఫంక్షన్ రకాలు",
    "trust.area": "లోకల్ సర్వీస్ ఏరియా",
    "trust.service": "ఆర్డర్లు మరియు సేవ",
    "dock.explore": "ఫుడ్ చూడండి",
    "dock.exploreSmall": "90 ఆంధ్ర ఫంక్షన్ ఐటమ్స్",
    "dock.select": "ఫంక్షన్ ఎంచుకోండి",
    "dock.selectSmall": "పెళ్లిళ్ల నుంచి కుటుంబ వేడుకల వరకు",
    "dock.inquiry": "ఇంక్వైరీ పంపండి",
    "dock.inquirySmall": "24/7 కర్నూలు కాల్ బ్యాక్",
    "business.kicker": "బిజినెస్ కేటరింగ్",
    "business.title": "ప్రతి ఫంక్షన్ పరిమాణానికి ప్రొఫెషనల్ ఫుడ్ ప్లానింగ్.",
    "business.copy": "కందనవోలు పాకశాల కస్టమర్లకు ఫుడ్ ఐటమ్స్, వడ్డింపు స్టైల్, అతిథుల సంఖ్య, ఈవెంట్ వివరాలు స్పష్టంగా ఎంచుకునే బుకింగ్ ప్రాసెస్ అందిస్తుంది.",
    "business.card1Title": "త్వరిత బుకింగ్",
    "business.card1Copy": "కాల్, వాట్సాప్ లేదా ఆన్‌లైన్ ఇంక్వైరీ ఫార్మ్ పంపండి.",
    "business.card2Title": "ఈవెంట్ రెడీ",
    "business.card2Copy": "పెళ్లిళ్లు, రిసెప్షన్లు, కుటుంబ వేడుకలు, దేవాలయ ఈవెంట్లు, అవుట్‌డోర్ సర్వీస్.",
    "business.card3Title": "ఫుడ్ ఎంపికలు",
    "business.card3Copy": "వెజ్, నాన్-వెజ్, గ్రామీణ స్పెషల్స్, లైవ్ కౌంటర్లు, అరటి ఆకు భోజనం.",
    "business.card4Title": "బుకింగ్ రికార్డ్స్",
    "business.card4Copy": "అడ్మిన్ ఇంక్వైరీలను చూడవచ్చు మరియు బుకింగ్ షీట్ డేటాను ఎక్స్‌పోర్ట్ చేయవచ్చు.",
    "about.kicker": "మా గురించి",
    "about.title": "కందనవోలు పాకశాల గ్రామీణ రుచిని ఆధునిక ఫంక్షన్లకు తీసుకువస్తుంది.",
    "about.copy1": "కర్నూలులో పెళ్లిళ్లు, ఎంగేజ్‌మెంట్లు, గృహప్రవేశాలు, దేవాలయ ఈవెంట్లు, కార్పొరేట్ ఈవెంట్లు, కాలేజీ ఫంక్షన్లు, అవుట్‌డోర్ ఈవెంట్లు, కుటుంబ వేడుకలకు ప్రొఫెషనల్ ఆంధ్ర గ్రామీణ కేటరింగ్ అందిస్తాం.",
    "about.copy2": "తాజా పదార్థాలు, శుభ్రమైన వంట, అరటి ఆకు భోజనం, లైవ్ కౌంటర్లు, వెజ్ మరియు నాన్-వెజ్ ఎంపికలు, స్పష్టమైన బుకింగ్ ఫాలోఅప్ మా ప్రత్యేకత.",
    "about.business": "బిజినెస్ పేరు",
    "about.location": "లొకేషన్",
    "about.contact": "కాంటాక్ట్",
    "services.kicker": "కేటరింగ్ సర్వీసెస్",
    "services.title": "ప్రతి ఫంక్షన్‌కు కందనవోలు పాకశాల.",
    "services.copy": "పెళ్లిళ్లు, ఎంగేజ్‌మెంట్లు, కుటుంబ ఫంక్షన్లు, దేవాలయ, కాలేజీ, కార్పొరేట్, అవుట్‌డోర్, గ్రామీణ వేడుకలకు ప్రొఫెషనల్ కర్నూలు కేటరింగ్.",
    "services.foodTitle": "ఫంక్షన్ ఫుడ్",
    "services.foodCopy": "వెల్కమ్ డ్రింక్స్, స్టార్టర్స్, ఆంధ్ర భోజనం, రైస్ ఐటమ్స్, కూరలు, పప్పు, సాంబార్, రోటీలు, ఫ్రై ఐటమ్స్, స్వీట్స్.",
    "services.specialTitle": "గ్రామీణ స్పెషల్స్",
    "services.specialCopy": "రాగి సంగటి, నాటు కోడి పులుసు, ఉలవచారు, మట్టి పాత్ర వంట, అరటి ఆకు భోజనం, లైవ్ కౌంటర్లు.",
    "services.promiseTitle": "సేవ హామీ",
    "services.promiseCopy": "24/7 ఇంక్వైరీ సపోర్ట్, శుభ్రమైన వంట, తాజా పదార్థాలు, అనుభవం ఉన్న వంట టీమ్, బల్క్ ఆర్డర్లు.",
    "specialty.taste": "సాంప్రదాయ ఆంధ్ర రుచి",
    "specialty.hygiene": "శుభ్రమైన వంట",
    "specialty.fresh": "తాజా పదార్థాలు",
    "specialty.live": "లైవ్ కౌంటర్లు",
    "specialty.leaf": "అరటి ఆకు భోజనం",
    "specialty.bulk": "బల్క్ ఆర్డర్లు",
    "route.kicker": "విజిటర్ మార్గం",
    "route.title": "ఫుడ్ ఆలోచన నుంచి ఫంక్షన్ సర్వీస్ వరకు.",
    "route.browse": "చూడండి",
    "route.browseCopy": "డ్రింక్స్, స్టార్టర్స్, భోజనం, కూరలు, స్వీట్స్, స్పెషల్స్ అన్నీ ఒకే చోట చూడండి.",
    "route.choose": "ఎంచుకోండి",
    "route.chooseCopy": "రెడీ కాంబో ఎంచుకోండి లేదా మీ కస్టమ్ ఐటమ్ లిస్ట్ ఇంక్వైరీలో రాయండి.",
    "route.serve": "సర్వ్ చేస్తాం",
    "route.serveCopy": "మీ ఈవెంట్‌కు ఫుడ్, ఏరియా, గెస్ట్ కౌంట్, వడ్డింపు స్టైల్ ప్లాన్ చేస్తాం.",
    "functions.kicker": "మేము సేవ చేసే ఫంక్షన్స్",
    "functions.title": "ప్రతి కర్నూలు వేడుకకు ఫుడ్ సర్వీస్.",
    "functions.copy": "ఇంక్వైరీ ఫార్మ్‌లో అదే ఫంక్షన్ రకం ఎంచుకుంటే బిజినెస్‌కు వివరాలు క్లియర్‌గా వస్తాయి.",
    "menu.kicker": "స్పెషల్ మెనూ",
    "menu.title": "ఆంధ్ర ఫంక్షన్ ఫుడ్ ఐటమ్స్",
    "menu.count": "90 ఫంక్షన్ ఐటమ్స్",
    "packages.kicker": "కాంబినేషన్ భోజనాలు",
    "packages.title": "ప్రసిద్ధ గ్రామీణ కాంబోలు",
    "serving.kicker": "కేటరింగ్ ప్రత్యేకతలు",
    "serving.title": "సాంప్రదాయ వడ్డన & వంట పద్ధతులు",
    "reviews.kicker": "లోకల్ రివ్యూస్",
    "reviews.title": "కుటుంబాలు చెప్పేది",
    "booking.kicker": "బుకింగ్ డెస్క్",
    "booking.title": "మీ ఫంక్షన్ మరియు ఫుడ్ అవసరాన్ని ఎంచుకోండి.",
    "booking.copy": "ఫుడ్ టైప్, ఫంక్షన్ టైప్, గెస్ట్ కౌంట్, కర్నూలు ఏరియా, తేదీ ఎంచుకోండి. ప్రతి ఇంక్వైరీని బ్యాక్‌ఎండ్‌లో సేవ్ చేస్తాం.",
    "booking.leaf": "అరటి ఆకు వడ్డింపు",
    "booking.live": "లైవ్ కౌంటర్లు",
    "booking.service": "24/7 సేవ",
    "booking.export": "బుకింగ్ షీట్ ఎక్స్‌పోర్ట్",
    "form.name": "పేరు",
    "form.namePlaceholder": "మీ పేరు",
    "form.phone": "ఫోన్",
    "form.foodNeed": "ఫుడ్ అవసరం",
    "form.selectFoodNeed": "ఫుడ్ అవసరం ఎంచుకోండి",
    "form.functionType": "ఫంక్షన్ రకం",
    "form.selectFunction": "ఫంక్షన్ ఎంచుకోండి",
    "form.preference": "వెజ్ / నాన్-వెజ్",
    "form.selectPreference": "ప్రాధాన్యత ఎంచుకోండి",
    "form.guests": "అతిథులు",
    "form.date": "తేదీ",
    "form.area": "కర్నూలు ఏరియా",
    "form.areaPlaceholder": "నంద్యాల రోడ్, ఆదోని, ఎమ్మిగనూరు...",
    "form.package": "కాంబో లేదా ఫుడ్ సెట్",
    "form.custom": "కస్టమ్",
    "form.message": "మెసేజ్",
    "form.messagePlaceholder": "పానకం, మిర్చి బజ్జీ, బిర్యానీ, గుత్తి వంకాయ, నాటు కోడి పులుసు, బొబ్బట్లు లేదా లైవ్ కౌంటర్లు వంటి ఐటమ్స్ రాయండి",
    "form.submit": "ఫుడ్ ఇంక్వైరీ పంపండి",
    "form.selectedTitle": "ఎంచుకున్న ఫుడ్ ఐటమ్స్",
    "form.clearSelection": "అన్నీ తీసివేయి",
    "form.fontSize": "అక్షరాల సైజు",
    "fontSize.small": "చిన్న సైజు",
    "fontSize.normal": "సాధారణ సైజు",
    "fontSize.large": "పెద్ద సైజు",
    "fontSize.xlarge": "చాలా పెద్దది",
    "foodNeed.welcome": "వెల్కమ్ డ్రింక్స్",
    "foodNeed.starters": "స్టార్టర్స్",
    "foodNeed.rice": "రైస్ ఐటమ్స్",
    "foodNeed.curries": "కూరలు మరియు పప్పు",
    "foodNeed.nonVeg": "నాన్-వెజ్ స్పెషల్స్",
    "foodNeed.sweets": "స్వీట్స్",
    "foodNeed.live": "లైవ్ కౌంటర్లు",
    "foodNeed.custom": "కస్టమ్ ఐటమ్ ఆర్డర్",
    "preference.veg": "వెజ్",
    "preference.nonVeg": "నాన్-వెజ్",
    "preference.both": "వెజ్ మరియు నాన్-వెజ్ రెండూ",
    "contact.kicker": "కాంటాక్ట్ పేజ్",
    "contact.title": "ఫాస్ట్ బుకింగ్ సపోర్ట్ కోసం కాల్ లేదా వాట్సాప్ చేయండి.",
    "contact.copy": "కందనవోలు పాకశాల, కర్నూలు, ఆంధ్రప్రదేశ్. అన్ని ఫంక్షన్లకు 24/7 కేటరింగ్ ఇంక్వైరీ సపోర్ట్ అందిస్తాం.",
    "contact.call1": "63005 48790 కి కాల్ చేయండి",
    "contact.whatsapp1": "వాట్సాప్ 63005 48790",
    "contact.call2": "90304 35532 కి కాల్ చేయండి",
    "contact.whatsapp2": "వాట్సాప్ 90304 35532",
    "contact.primary": "ప్రధాన హెల్ప్‌లైన్",
    "contact.secondary": "సహాయక హెల్ప్‌లైన్",
    "contact.callNow": "కాల్ చేయండి",
    "contact.chatNow": "వాట్సాప్",
    "contact.admin": "అడ్మిన్ డ్యాష్‌బోర్డ్",
    "quick.call1": "కాల్ 1",
    "quick.call2": "కాల్ 2",
    "quick.whatsapp": "వాట్సాప్",
    "footer.copy": "ఫంక్షన్లు, ఈవెంట్లు, లైవ్ కౌంటర్లకు 24/7 కర్నూలు గ్రామీణ ఫుడ్ సర్వీస్.",
    "status.loading": "ఇంక్వైరీ పంపుతున్నాం...",
    "status.contentError": "కొన్ని వివరాలు లోడ్ కాలేదు. దయచేసి ఒకసారి రిఫ్రెష్ చేయండి.",
    "status.formError": "దయచేసి ఫార్మ్ చెక్ చేయండి.",
    "status.networkError": "సర్వర్‌ను చేరుకోలేకపోయాం. మళ్లీ ప్రయత్నించండి.",
    "menu.items": "ఐటమ్స్",
    "menu.viewItems": "ఐటమ్స్ చూడండి",
    "menu.hideItems": "ఐటమ్స్ దాచండి"
  },
  hi: {
    "brand.subtitle": "कैटरिंग सर्विसेज",
    "nav.home": "होम",
    "nav.about": "हमारे बारे में",
    "nav.services": "सेवाएं",
    "nav.functions": "फंक्शन",
    "nav.menu": "मेनू",
    "nav.contact": "संपर्क",
    "nav.book": "बुक करें",
    "tagline": "पारंपरिक स्वाद... गुणवत्ता सेवा",
    "tagline.dot": "पारंपरिक स्वाद. गुणवत्ता सेवा.",
    "hero.badge": "कर्नूल फूड सर्विस",
    "hero.eyebrow": "कंदनवोलु पाकशाला कैटरिंग सर्विसेज",
    "hero.title": "हर कर्नूल समारोह के लिए पारंपरिक स्वाद.",
    "hero.copy": "वेलकम ड्रिंक्स, स्टार्टर्स, आंध्रा भोजन, करी, मिठाइयां, रागी संगती, नाटु कोडी पुलुसु, केले के पत्ते पर सर्विंग और लाइव काउंटर.",
    "hero.inquiry": "इंक्वायरी भेजें",
    "hero.services": "सेवाएं देखें",
    "visitor.pill": "कैटरिंग प्रोफाइल",
    "visitor.copy": "शादियों, फंक्शन्स, इवेंट्स, पारिवारिक समारोह और लाइव काउंटर के लिए गांव-स्टाइल आंध्रा फूड सर्विस.",
    "visitor.fast": "फास्ट इंक्वायरी",
    "visitor.area": "कर्नूल क्षेत्र",
    "visitor.food": "वेज और नॉन-वेज",
    "visitor.leaf": "केले के पत्ते पर भोजन",
    "trust.items": "फंक्शन फूड आइटम्स",
    "trust.functions": "फंक्शन प्रकार",
    "trust.area": "लोकल सर्विस एरिया",
    "trust.service": "ऑर्डर और सर्विस",
    "dock.explore": "फूड देखें",
    "dock.exploreSmall": "90 आंध्रा फंक्शन आइटम्स",
    "dock.select": "फंक्शन चुनें",
    "dock.selectSmall": "शादियों से पारिवारिक समारोह तक",
    "dock.inquiry": "इंक्वायरी भेजें",
    "dock.inquirySmall": "24/7 कर्नूल कॉलबैक",
    "business.kicker": "बिजनेस कैटरिंग",
    "business.title": "हर फंक्शन साइज के लिए प्रोफेशनल फूड प्लानिंग.",
    "business.copy": "कंदनवोलु पाकशाला ग्राहकों को फूड आइटम, सर्विंग स्टाइल, गेस्ट काउंट और इवेंट डिटेल्स साफ बुकिंग प्रोसेस से चुनने में मदद करता है.",
    "business.card1Title": "क्विक बुकिंग",
    "business.card1Copy": "कॉल, WhatsApp या ऑनलाइन इंक्वायरी फॉर्म भेजें.",
    "business.card2Title": "इवेंट रेडी",
    "business.card2Copy": "शादियां, रिसेप्शन, पारिवारिक इवेंट्स, मंदिर इवेंट्स और आउटडोर सर्विस.",
    "business.card3Title": "फूड विकल्प",
    "business.card3Copy": "वेज, नॉन-वेज, गांव स्पेशल्स, लाइव काउंटर और केले के पत्ते पर भोजन.",
    "business.card4Title": "बुकिंग रिकॉर्ड्स",
    "business.card4Copy": "एडमिन इंक्वायरी देख सकता है और बुकिंग शीट डेटा एक्सपोर्ट कर सकता है.",
    "about.kicker": "हमारे बारे में",
    "about.title": "कंदनवोलु पाकशाला गांव का स्वाद आधुनिक फंक्शन्स तक लाता है.",
    "about.copy1": "हम कर्नूल में शादियों, एंगेजमेंट, गृहप्रवेश, मंदिर इवेंट्स, कॉर्पोरेट इवेंट्स, कॉलेज फंक्शन्स, आउटडोर इवेंट्स और पारिवारिक समारोह के लिए प्रोफेशनल आंध्रा गांव-स्टाइल कैटरिंग देते हैं.",
    "about.copy2": "हमारा ध्यान ताजा सामग्री, साफ-सुथरी कुकिंग, केले के पत्ते पर भोजन, लाइव काउंटर, वेज और नॉन-वेज विकल्प और स्पष्ट बुकिंग फॉलोअप पर है.",
    "about.business": "बिजनेस नाम",
    "about.location": "लोकेशन",
    "about.contact": "कॉन्टैक्ट",
    "services.kicker": "कैटरिंग सर्विसेज",
    "services.title": "हर फंक्शन के लिए कंदनवोलु पाकशाला.",
    "services.copy": "शादियों, एंगेजमेंट, पारिवारिक फंक्शन्स, मंदिर, कॉलेज, कॉर्पोरेट, आउटडोर और गांव समारोह के लिए प्रोफेशनल कर्नूल कैटरिंग.",
    "services.foodTitle": "फंक्शन फूड",
    "services.foodCopy": "वेलकम ड्रिंक्स, स्टार्टर्स, आंध्रा भोजन, राइस आइटम्स, करी, दाल, सांभर, रोटी, फ्राई आइटम्स और मिठाइयां.",
    "services.specialTitle": "गांव स्पेशल्स",
    "services.specialCopy": "रागी संगती, नाटु कोडी पुलुसु, उलवचारु, मिट्टी के बर्तन स्टाइल फूड, केले के पत्ते पर भोजन और लाइव काउंटर.",
    "services.promiseTitle": "सेवा वादा",
    "services.promiseCopy": "24/7 इंक्वायरी सपोर्ट, साफ-सुथरी कुकिंग, ताजा सामग्री, अनुभवी कुकिंग टीम और बल्क ऑर्डर.",
    "specialty.taste": "पारंपरिक आंध्रा स्वाद",
    "specialty.hygiene": "हाइजेनिक कुकिंग",
    "specialty.fresh": "ताजा सामग्री",
    "specialty.live": "लाइव काउंटर उपलब्ध",
    "specialty.leaf": "केले के पत्ते पर भोजन",
    "specialty.bulk": "बल्क ऑर्डर स्वीकार",
    "route.kicker": "विजिटर रूट",
    "route.title": "फूड आइडिया से फंक्शन सर्विस तक.",
    "route.browse": "देखें",
    "route.browseCopy": "ड्रिंक्स, स्टार्टर्स, भोजन, करी, मिठाइयां और स्पेशल्स एक जगह देखें.",
    "route.choose": "चुनें",
    "route.chooseCopy": "रेडी कॉम्बो चुनें या इंक्वायरी में अपनी कस्टम आइटम लिस्ट लिखें.",
    "route.serve": "सर्व करें",
    "route.serveCopy": "हम आपके इवेंट के लिए फूड, एरिया, गेस्ट काउंट और सर्विंग स्टाइल प्लान करते हैं.",
    "functions.kicker": "हम जिन फंक्शन्स में सेवा देते हैं",
    "functions.title": "हर कर्नूल समारोह के लिए फूड सर्विस.",
    "functions.copy": "इंक्वायरी फॉर्म में वही फंक्शन टाइप चुनें ताकि बिजनेस को इवेंट डिटेल्स साफ मिलें.",
    "menu.kicker": "स्पेशल मेनू",
    "menu.title": "आंध्रा फंक्शन फूड आइटम्स",
    "menu.count": "90 फंक्शन आइटम्स",
    "packages.kicker": "कॉम्बिनेशन मील्स",
    "packages.title": "मशहूर गांव कॉम्बो",
    "serving.kicker": "केटरिंग विशेषताएं",
    "serving.title": "पारंपरिक परोसने और पकाने की शैलियाँ",
    "reviews.kicker": "लोकल रिव्यू",
    "reviews.title": "परिवार क्या कहते हैं",
    "booking.kicker": "बुकिंग डेस्क",
    "booking.title": "अपना फंक्शन और फूड जरूरत चुनें.",
    "booking.copy": "फूड टाइप, फंक्शन टाइप, गेस्ट काउंट, कर्नूल एरिया और तारीख चुनें. बैकएंड हर इंक्वायरी को बिजनेस फॉलोअप के लिए सेव करता है.",
    "booking.leaf": "केले के पत्ते पर सर्विंग",
    "booking.live": "लाइव काउंटर",
    "booking.service": "24/7 सर्विस",
    "booking.export": "बुकिंग शीट एक्सपोर्ट",
    "form.name": "नाम",
    "form.namePlaceholder": "आपका नाम",
    "form.phone": "फोन",
    "form.foodNeed": "फूड जरूरत",
    "form.selectFoodNeed": "फूड जरूरत चुनें",
    "form.functionType": "फंक्शन प्रकार",
    "form.selectFunction": "फंक्शन चुनें",
    "form.preference": "वेज / नॉन-वेज",
    "form.selectPreference": "पसंद चुनें",
    "form.guests": "मेहमान",
    "form.date": "तारीख",
    "form.area": "कर्नूल एरिया",
    "form.areaPlaceholder": "नंद्याल रोड, आदोनी, येम्मिगनूर...",
    "form.package": "कॉम्बो या फूड सेट",
    "form.custom": "कस्टम",
    "form.message": "मैसेज",
    "form.messagePlaceholder": "पानकम, मिर्ची बज्जी, बिरयानी, गुट्टी वंकाया, नाटु कोडी पुलुसु, बोब्बट्लू या लाइव काउंटर जैसे आइटम लिखें",
    "form.submit": "फूड इंक्वायरी भेजें",
    "form.selectedTitle": "चुने गए फ़ूड आइटम्स",
    "form.clearSelection": "सभी साफ़ करें",
    "form.fontSize": "अक्षर का आकार",
    "fontSize.small": "छोटा आकार",
    "fontSize.normal": "सामान्य आकार",
    "fontSize.large": "बड़ा आकार",
    "fontSize.xlarge": "बहुत बड़ा आकार",
    "foodNeed.welcome": "वेलकम ड्रिंक्स",
    "foodNeed.starters": "स्टार्टर्स",
    "foodNeed.rice": "राइस आइटम्स",
    "foodNeed.curries": "करी और दाल",
    "foodNeed.nonVeg": "नॉन-वेज स्पेशल्स",
    "foodNeed.sweets": "मिठाइयां",
    "foodNeed.live": "लाइव काउंटर",
    "foodNeed.custom": "कस्टम आइटम ऑर्डर",
    "preference.veg": "वेज",
    "preference.nonVeg": "नॉन-वेज",
    "preference.both": "वेज और नॉन-वेज दोनों",
    "contact.kicker": "कॉन्टैक्ट पेज",
    "contact.title": "फास्ट बुकिंग सपोर्ट के लिए कॉल या WhatsApp करें.",
    "contact.copy": "कंदनवोलु पाकशाला, कर्नूल, आंध्र प्रदेश. हम सभी फंक्शन्स के लिए 24/7 कैटरिंग इंक्वायरी सपोर्ट देते हैं.",
    "contact.call1": "63005 48790 पर कॉल करें",
    "contact.whatsapp1": "WhatsApp 63005 48790",
    "contact.call2": "90304 35532 पर कॉल करें",
    "contact.whatsapp2": "WhatsApp 90304 35532",
    "contact.primary": "मुख्य हेल्पलाइन",
    "contact.secondary": "सहायक हेल्पलाइन",
    "contact.callNow": "कॉल करें",
    "contact.chatNow": "WhatsApp",
    "contact.admin": "एडमिन डैशबोर्ड",
    "quick.call1": "कॉल 1",
    "quick.call2": "कॉल 2",
    "quick.whatsapp": "WhatsApp",
    "footer.copy": "फंक्शन्स, इवेंट्स और लाइव काउंटर के लिए 24/7 कर्नूल गांव-स्टाइल फूड सर्विस.",
    "status.loading": "इंक्वायरी भेज रहे हैं...",
    "status.contentError": "कुछ कंटेंट लोड नहीं हुआ. कृपया एक बार रिफ्रेश करें.",
    "status.formError": "कृपया फॉर्म चेक करें.",
    "status.networkError": "सर्वर तक नहीं पहुंच पाए. कृपया फिर कोशिश करें.",
    "menu.items": "आइटम्स",
    "menu.viewItems": "आइटम्स देखें",
    "menu.hideItems": "आइटम्स छिपाएं"
  }
};

const selectorTranslations = [
  [".eyebrow", "hero.eyebrow"],
  [".about-section h2", "about.title"],
  [".poster-main > h2", "services.title"],
  [".contact-section p", "contact.copy"]
];

const functionTranslations = {
  te: {
    "Weddings": "పెళ్లిళ్లు",
    "Engagements": "ఎంగేజ్‌మెంట్లు",
    "Birthday Parties": "పుట్టినరోజు పార్టీలు",
    "Housewarming Functions": "గృహప్రవేశాలు",
    "Naming Ceremonies": "నామకరణ వేడుకలు",
    "Half Saree Functions": "హాఫ్ సారీ ఫంక్షన్లు",
    "Reception Events": "రిసెప్షన్ ఈవెంట్లు",
    "Corporate Events": "కార్పొరేట్ ఈవెంట్లు",
    "College Functions": "కాలేజీ ఫంక్షన్లు",
    "Temple Events": "దేవాలయ ఈవెంట్లు",
    "Festival Celebrations": "పండుగ వేడుకలు",
    "Village Functions": "గ్రామీణ ఫంక్షన్లు",
    "Outdoor Events": "అవుట్‌డోర్ ఈవెంట్లు",
    "Family Gatherings": "కుటుంబ సమావేశాలు"
  },
  hi: {
    "Weddings": "शादियां",
    "Engagements": "सगाई",
    "Birthday Parties": "जन्मदिन पार्टियां",
    "Housewarming Functions": "गृहप्रवेश",
    "Naming Ceremonies": "नामकरण समारोह",
    "Half Saree Functions": "हाफ साड़ी फंक्शन्स",
    "Reception Events": "रिसेप्शन इवेंट्स",
    "Corporate Events": "कॉर्पोरेट इवेंट्स",
    "College Functions": "कॉलेज फंक्शन्स",
    "Temple Events": "मंदिर इवेंट्स",
    "Festival Celebrations": "त्योहार समारोह",
    "Village Functions": "गांव फंक्शन्स",
    "Outdoor Events": "आउटडोर इवेंट्स",
    "Family Gatherings": "पारिवारिक समारोह"
  }
};

const menuTranslations = {
  te: {
    "Welcome Drinks": "వెల్కమ్ డ్రింక్స్",
    "Starters": "స్టార్టర్స్",
    "Tiffins": "టిఫిన్స్",
    "Chutney, Curry & Podis": "నంజుకోవడానికి చట్నీలు, కూరలు మరియు పొడులు",
    "Rice Items": "రైస్ ఐటమ్స్",
    "Curries": "కూరలు",
    "Dal & Sambar": "పప్పు మరియు సాంబార్",
    "Pickles & Chutneys": "పచ్చళ్లు మరియు చట్నీలు",
    "Rotis": "రోటీలు",
    "Fry Items": "ఫ్రై ఐటమ్స్",
    "Sweets": "స్వీట్స్",
    "Traditional Village Special Items": "సాంప్రదాయ గ్రామీణ స్పెషల్ ఐటమ్స్",
    "Cool drinks for guest arrival": "అతిథుల స్వాగతానికి చల్లని పానీయాలు",
    "Morning breakfast and tiffin items": "ఉదయపు అల్పాహారం మరియు టిఫిన్ ఐటమ్స్",
    "Delicious sides, gravies, and spice powders": "రుచికరమైన పచ్చళ్లు, కూరలు మరియు కారప్పొడులు",
    "Hot veg and non-veg starters": "వేడి వెజ్ మరియు నాన్-వెజ్ స్టార్టర్స్",
    "Main rice dishes for Andhra meals": "ఆంధ్ర భోజనానికి ప్రధాన రైస్ వంటకాలు",
    "Veg and non-veg curries": "వెజ్ మరియు నాన్-వెజ్ కూరలు",
    "Daily comfort gravies": "రోజువారీ రుచికర గ్రేవీలు",
    "Andhra pachadi and chutney sides": "ఆంధ్ర పచ్చడి మరియు చట్నీ సైడ్స్",
    "Soft breads and millet rotis": "సాఫ్ట్ బ్రెడ్స్ మరియు మిల్లెట్ రోటీలు",
    "Crispy and spicy fry dishes": "క్రిస్పీ మరియు స్పైసీ ఫ్రై వంటకాలు",
    "Function sweets and desserts": "ఫంక్షన్ స్వీట్స్ మరియు డెజర్ట్స్",
    "Kurnool-style country specials": "కర్నూలు-స్టైల్ గ్రామీణ స్పెషల్స్"
  },
  hi: {
    "Welcome Drinks": "वेलकम ड्रिंक्स",
    "Starters": "स्टार्टर्स",
    "Tiffins": "टिफिन",
    "Chutney, Curry & Podis": "चटनी, करी और पोड़ी",
    "Rice Items": "राइस आइटम्स",
    "Curries": "करी",
    "Dal & Sambar": "दाल और सांभर",
    "Pickles & Chutneys": "अचार और चटनी",
    "Rotis": "रोटी",
    "Fry Items": "फ्राई आइटम्स",
    "Sweets": "मिठाइयां",
    "Traditional Village Special Items": "पारंपरिक गांव स्पेशल आइटम्स",
    "Cool drinks for guest arrival": "मेहमानों के स्वागत के लिए ठंडे पेय",
    "Morning breakfast and tiffin items": "सुबह का नाश्ता और टिफिन आइटम्स",
    "Delicious sides, gravies, and spice powders": "स्वादिष्ट चटनी, ग्रेवी और मसालेदार पाउडर",
    "Hot veg and non-veg starters": "गरम वेज और नॉन-वेज स्टार्टर्स",
    "Main rice dishes for Andhra meals": "आंध्रा भोजन के मुख्य राइस व्यंजन",
    "Veg and non-veg curries": "वेज और नॉन-वेज करी",
    "Daily comfort gravies": "रोजाना पसंद आने वाली ग्रेवी",
    "Andhra pachadi and chutney sides": "आंध्रा पचड़ी और चटनी साइड्स",
    "Soft breads and millet rotis": "सॉफ्ट ब्रेड और मिलेट रोटियां",
    "Crispy and spicy fry dishes": "क्रिस्पी और मसालेदार फ्राई व्यंजन",
    "Function sweets and desserts": "फंक्शन मिठाइयां और डेजर्ट",
    "Kurnool-style country specials": "कर्नूल-स्टाइल गांव स्पेशल्स"
  }
};

function t(key) {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

function localizeName(name, dictionary) {
  return dictionary[currentLanguage]?.[name] || name;
}

function translateStaticPage() {
  document.documentElement.lang = currentLanguage;
  document.title = "Kandanavolu Paakashala | Professional Catering Services";

  document.querySelectorAll(".brand strong, .visitor-card h2, .site-footer strong").forEach(element => {
    element.textContent = "Kandanavolu Paakashala";
  });

  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  selectorTranslations.forEach(([selector, key]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = t(key);
  });

  languageButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.lang === currentLanguage);
  });
}

async function getJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function renderMenu(categories) {
  cachedMenu = categories;
  if (menuGrid) {
    menuGrid.innerHTML = categories.map((category, index) => {
      const listId = `menu-items-${index}`;
      return `
      <article class="food-card menu-category">
        <div class="food-card-body">
          <span class="tag">${category.items.length} ${t("menu.items")}</span>
          <h3>${localizeName(category.category, menuTranslations)}</h3>
          <div class="region">${localizeName(category.note, menuTranslations)}</div>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="${listId}">${t("menu.viewItems")}</button>
          <ul id="${listId}" class="menu-items" hidden>
            ${category.items.map((food, foodIdx) => {
              const inputId = `item-${index}-${foodIdx}`;
              const isChecked = selectedItems.has(food) ? "checked" : "";
              return `
                <li>
                  <input type="checkbox" id="${inputId}" class="menu-item-checkbox" data-food="${food}" ${isChecked} hidden>
                  <label for="${inputId}" class="menu-item-label">
                    <span class="checkbox-indicator">${selectedItems.has(food) ? "✔" : "✚"}</span>
                    <span class="food-name">${food}</span>
                  </label>
                </li>
              `;
            }).join("")}
          </ul>
        </div>
      </article>
    `;
    }).join("");
  }
}

let currentSlideIndex = 0;

function slidePackages(direction) {
  const cards = document.querySelectorAll(".package-card");
  if (!cards.length) return;

  const cardWidth = cards[0].offsetWidth;
  const gap = 20;
  const track = document.querySelector("#packageGrid");
  
  let itemsPerPage = 3;
  if (window.innerWidth <= 640) {
    itemsPerPage = 1;
  } else if (window.innerWidth <= 980) {
    itemsPerPage = 2;
  }
  
  const maxIndex = Math.max(0, cards.length - itemsPerPage);
  
  if (direction === "next") {
    currentSlideIndex = Math.min(currentSlideIndex + 1, maxIndex);
  } else if (direction === "prev") {
    currentSlideIndex = Math.max(currentSlideIndex - 1, 0);
  } else {
    currentSlideIndex = Math.min(currentSlideIndex, maxIndex);
  }
  
  const moveAmount = currentSlideIndex * (cardWidth + gap);
  if (track) {
    track.style.transform = `translateX(-${moveAmount}px)`;
  }
  
  const prevBtn = document.querySelector("#packagePrevBtn");
  const nextBtn = document.querySelector("#packageNextBtn");
  if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
  if (nextBtn) nextBtn.disabled = currentSlideIndex === maxIndex;
}

function slideServingStyles(direction) {
  const cards = document.querySelectorAll(".serving-card");
  if (!cards.length) return;

  const cardWidth = cards[0].offsetWidth;
  const gap = 20;
  const track = document.querySelector("#servingStyleGrid");
  
  let itemsPerPage = 3;
  if (window.innerWidth <= 640) {
    itemsPerPage = 1;
  } else if (window.innerWidth <= 980) {
    itemsPerPage = 2;
  }
  
  const maxIndex = Math.max(0, cards.length - itemsPerPage);
  
  if (direction === "next") {
    currentServingSlideIndex = Math.min(currentServingSlideIndex + 1, maxIndex);
  } else if (direction === "prev") {
    currentServingSlideIndex = Math.max(currentServingSlideIndex - 1, 0);
  } else {
    currentServingSlideIndex = Math.min(currentServingSlideIndex, maxIndex);
  }
  
  const moveAmount = currentServingSlideIndex * (cardWidth + gap);
  if (track) {
    track.style.transform = `translateX(-${moveAmount}px)`;
  }
  
  const prevBtn = document.querySelector("#servingPrevBtn");
  const nextBtn = document.querySelector("#servingNextBtn");
  if (prevBtn) prevBtn.disabled = currentServingSlideIndex === 0;
  if (nextBtn) nextBtn.disabled = currentServingSlideIndex === maxIndex;
}

function renderPackages(items) {
  cachedPackages = items;
  packageGrid.innerHTML = items.map(item => `
    <article class="package-card">
      <span class="tag">${item.people}</span>
      <h3>${item.name}</h3>
      <strong>${item.combo}</strong>
      <p>${item.details}</p>
    </article>
  `).join("");

  packageSelect.innerHTML = `<option value="Custom">${t("form.custom")}</option>` + items.map(item => `<option value="${item.name}">${item.name}</option>`).join("");
  
  currentSlideIndex = 0;
  setTimeout(() => slidePackages(), 50);
}

function renderServingStyles(items) {
  cachedServingStyles = items;
  
  const details = {
    "Banana Leaf Meals": {
      icon: "🌿",
      themeClass: "serving-leaf",
      desc: "Authentic festival feast served on fresh banana leaves.",
      descTe: "తాజా అరటి ఆకులలో వడ్డించే ప్రాచీన విందు భోజనం.",
      descHi: "ताजा केले के पत्ते पर परोसा जाने वाला पारंपरिक उत्सव भोज।"
    },
    "Traditional Andhra Serving": {
      icon: "🍛",
      themeClass: "serving-andhra",
      desc: "Warm hospitality with traditional Andhra serving standards.",
      descTe: "సాంప్రదాయ పద్ధతిలో వడ్డించే మర్యాదపూర్వక సేవ.",
      descHi: "पारंपरिक आंध्र शैली में आतिथ्य सत्कार के साथ परोसना।"
    },
    "Brass/Steel Plates": {
      icon: "🍽️",
      themeClass: "serving-plates",
      desc: "Premium dining experience using elegant traditional brass or steel dinnerware.",
      descTe: "రాగి, ఇత్తడి లేదా స్టీల్ పాత్రలలో శుభ్రమైన భోజన సేవ.",
      descHi: "भव्य पीतल या स्टील के बर्तनों में शाही भोजन का अनुभव।"
    },
    "Live Counters": {
      icon: "🧑‍🍳",
      themeClass: "serving-live",
      desc: "Hot, fresh starters and live cooking stations at the venue.",
      descTe: "వేడి వేడి రుచులు అందించే ప్రత్యక్ష లైవ్ కౌంటర్లు.",
      descHi: "गर्म और ताज़ा स्टार्टर्स के लिए शानदार लाइव काउंटर।"
    },
    "Clay Pot Cooking": {
      icon: "🏺",
      themeClass: "serving-clay",
      desc: "Aromatic dishes prepared in traditional clay pots for rustic taste.",
      descTe: "సాంప్రదాయ మట్టి పాత్రలలో వండిన సహజ సిద్ధమైన వంటకాలు.",
      descHi: "मिट्टी के बर्तनों में धीमी आंच पर पका स्वादिष्ट भोजन।"
    },
    "Wood Fire Chicken": {
      icon: "🔥",
      themeClass: "serving-wood",
      desc: "Smoky, spicy country chicken cooked over slow wood fire.",
      descTe: "కట్టెల పొయ్యి పై కాల్చిన ఘుమఘుమలాడే నాటు కోడి.",
      descHi: "लकड़ी की आंच पर तैयार स्मोकी और लाजवाब विलेज चिकन।"
    }
  };

  const titleTranslations = {
    "Banana Leaf Meals": { te: "అరటి ఆకు భోజనాలు", hi: "केले के पत्ते का भोजन" },
    "Traditional Andhra Serving": { te: "సాంప్రదాయ ఆంధ్రా వడ్డన", hi: "पारंपरिक आंध्र परोसना" },
    "Brass/Steel Plates": { te: "ఇత్తడి & స్టీల్ ప్లేట్లు", hi: "पीतल और स्टील की थालियाँ" },
    "Live Counters": { te: "లైవ్ కౌంటర్లు", hi: "लाइव काउंटर" },
    "Clay Pot Cooking": { te: "మట్టి పాత్రల వంట", hi: "मिट्टी के बर्तनों में कुकिंग" },
    "Wood Fire Chicken": { te: "కట్టెల పొయ్యి కోడి కూర", hi: "लकड़ी की आंच का चिकन" }
  };

  servingStyleGrid.innerHTML = items.map(item => {
    const info = details[item] || { icon: "✨", themeClass: "serving-default", desc: "Premium catering specialty for your special event." };
    const currentLang = currentLanguage || 'en';
    let desc = info.desc;
    if (currentLang === 'te' && info.descTe) desc = info.descTe;
    if (currentLang === 'hi' && info.descHi) desc = info.descHi;
    
    const displayTitle = (titleTranslations[item] && titleTranslations[item][currentLang]) 
      ? titleTranslations[item][currentLang] 
      : item;

    return `
      <article class="serving-card ${info.themeClass}">
        <div class="serving-icon-wrap">${info.icon}</div>
        <h3>${displayTitle}</h3>
        <p>${desc}</p>
      </article>
    `;
  }).join("");

  currentServingSlideIndex = 0;
  setTimeout(() => slideServingStyles(), 50);
}

function renderFunctions(items) {
  cachedFunctions = items;
  if (functionsGrid) {
    functionsGrid.innerHTML = items.map((item, index) => `
      <span><strong>${String(index + 1).padStart(2, "0")}</strong>${localizeName(item, functionTranslations)}</span>
    `).join("");
  }

  if (functionSelect) {
    functionSelect.innerHTML = `<option value="">${t("form.selectFunction")}</option>` + items.map(item => (
      `<option value="${item}">${localizeName(item, functionTranslations)}</option>`
    )).join("");
  }
}

function renderTestimonials(items) {
  if (testimonialGrid) {
    testimonialGrid.innerHTML = items.map(item => `
      <article class="testimonial-card">
        <p>"${item.text}"</p>
        <strong>${item.name}</strong>
      </article>
    `).join("");
  }
}

function setFontSize(size) {
  currentFontSize = size;
  localStorage.setItem("kp-font-size", size);
  
  // Remove existing size classes from root HTML element
  document.documentElement.classList.remove("font-small", "font-normal", "font-large", "font-xlarge");
  
  // Add selected class
  if (size === "small") {
    document.documentElement.classList.add("font-small");
  } else if (size === "normal") {
    document.documentElement.classList.add("font-normal");
  } else if (size === "large") {
    document.documentElement.classList.add("font-large");
  } else if (size === "xlarge") {
    document.documentElement.classList.add("font-xlarge");
  }
  
  // Sync the select dropdown element value
  if (fontSizeSelect) {
    fontSizeSelect.value = size;
  }
}

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("kp-language", language);
  translateStaticPage();
  if (cachedMenu.length) renderMenu(cachedMenu);
  if (cachedPackages.length) renderPackages(cachedPackages);
  if (cachedServingStyles.length) renderServingStyles(cachedServingStyles);
  if (cachedFunctions.length) renderFunctions(cachedFunctions);
}

async function boot() {
  setFontSize(currentFontSize);
  translateStaticPage();

  try {
    const [menu, packages, servingStyles, functionsServed, testimonials] = await Promise.all([
      getJson("/api/menu"),
      getJson("/api/packages"),
      getJson("/api/serving-styles"),
      getJson("/api/functions"),
      getJson("/api/testimonials")
    ]);

    renderMenu(menu);
    renderPackages(packages);
    renderServingStyles(servingStyles);
    renderFunctions(functionsServed);
    renderTestimonials(testimonials);
  } catch (error) {
    formStatus.textContent = t("status.contentError");
  }
}

languageButtons.forEach(button => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

if (fontSizeSelect) {
  fontSizeSelect.addEventListener("change", (event) => {
    setFontSize(event.target.value);
  });
}

if (menuGrid) {
  menuGrid.addEventListener("click", event => {
    const toggle = event.target.closest(".menu-toggle");
    if (!toggle) return;

    const card = toggle.closest(".menu-category");
    const items = card.querySelector(".menu-items");
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.textContent = isOpen ? t("menu.viewItems") : t("menu.hideItems");
    card.classList.toggle("is-open", !isOpen);
    items.hidden = isOpen;
  });
}

function updateSelectedItemsUI() {
  if (!selectedItemsBox || !selectedItemsContainer) return;

  if (selectedItems.size === 0) {
    selectedItemsBox.style.display = "none";
    selectedItemsContainer.innerHTML = "";
    return;
  }

  selectedItemsBox.style.display = "block";
  selectedItemsContainer.innerHTML = Array.from(selectedItems).map(food => {
    return `
      <span class="selected-item-tag">
        <span>${food}</span>
        <button type="button" class="remove-btn" data-food="${food}">&times;</button>
      </span>
    `;
  }).join("");

  // Update checkmarks in the menu grid
  document.querySelectorAll(".menu-item-checkbox").forEach(cb => {
    const food = cb.dataset.food;
    const isChecked = selectedItems.has(food);
    cb.checked = isChecked;
    const indicator = cb.parentElement.querySelector(".checkbox-indicator");
    if (indicator) indicator.textContent = isChecked ? "✔" : "✚";
  });
}

// Menu item checkbox change event listener
if (menuGrid) {
  menuGrid.addEventListener("change", event => {
    const checkbox = event.target.closest(".menu-item-checkbox");
    if (!checkbox) return;

    const food = checkbox.dataset.food;
    if (checkbox.checked) {
      selectedItems.add(food);
    } else {
      selectedItems.delete(food);
    }

    const indicator = checkbox.parentElement.querySelector(".checkbox-indicator");
    if (indicator) {
      indicator.textContent = checkbox.checked ? "✔" : "✚";
    }

    updateSelectedItemsUI();
  });
}

// Remove item from tag list click handler
if (selectedItemsContainer) {
  selectedItemsContainer.addEventListener("click", event => {
    const removeBtn = event.target.closest(".remove-btn");
    if (!removeBtn) return;

    const food = removeBtn.dataset.food;
    selectedItems.delete(food);
    updateSelectedItemsUI();
  });
}

// Clear all selected items handler
if (clearSelectedBtn) {
  clearSelectedBtn.addEventListener("click", () => {
    selectedItems.clear();
    updateSelectedItemsUI();
  });
}

bookingForm.addEventListener("submit", async event => {
  event.preventDefault();
  formStatus.textContent = t("status.loading");

  const formData = new FormData(bookingForm);
  const payload = Object.fromEntries(formData.entries());

  // Intercept and inject selected items into message field
  if (selectedItems.size > 0) {
    const selectedText = `Selected Items: [${Array.from(selectedItems).join(", ")}]`;
    if (payload.message) {
      payload.message = `${selectedText}\n\nAdditional Requests: ${payload.message}`;
    } else {
      payload.message = selectedText;
    }
  }

  const isFirebaseHosting = window.location.hostname.endsWith("web.app") || window.location.hostname.endsWith("firebaseapp.com");
  if (isFirebaseHosting) {
    try {
      await addDoc(collection(db, "inquiries"), {
        ...payload,
        createdAt: new Date().toISOString()
      });
      bookingForm.reset();
      selectedItems.clear();
      updateSelectedItemsUI();
      const randomRef = "KP-" + Math.floor(100000 + Math.random() * 900000);
      formStatus.textContent = "Inquiry sent successfully! Reference: " + randomRef;
    } catch (fireErr) {
      formStatus.textContent = "Error saving: " + fireErr.message;
    }
    return;
  }

  try {
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      formStatus.textContent = result.error || t("status.formError");
      return;
    }

    // Try saving to Firebase Firestore as well
    try {
      await addDoc(collection(db, "inquiries"), {
        ...payload,
        createdAt: new Date().toISOString()
      });
    } catch (fireErr) {
      console.warn("Could not sync with Firebase Firestore:", fireErr.message);
    }

    bookingForm.reset();
    selectedItems.clear();
    updateSelectedItemsUI();
    formStatus.textContent = `${result.message} Reference: ${result.inquiry.id}`;
  } catch (error) {
    formStatus.textContent = t("status.networkError");
  }
});

const prevBtn = document.querySelector("#packagePrevBtn");
const nextBtn = document.querySelector("#packageNextBtn");

if (prevBtn) {
  prevBtn.addEventListener("click", () => slidePackages("prev"));
}
if (nextBtn) {
  nextBtn.addEventListener("click", () => slidePackages("next"));
}

const servingPrevBtn = document.querySelector("#servingPrevBtn");
const servingNextBtn = document.querySelector("#servingNextBtn");

if (servingPrevBtn) {
  servingPrevBtn.addEventListener("click", () => slideServingStyles("prev"));
}
if (servingNextBtn) {
  servingNextBtn.addEventListener("click", () => slideServingStyles("next"));
}

window.addEventListener("resize", () => {
  slidePackages();
  slideServingStyles();
});

boot();
