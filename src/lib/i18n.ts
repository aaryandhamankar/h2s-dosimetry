'use client';

export type Language = 'en' | 'hi' | 'kn' | 'gu';

export const LANGUAGES: { code: Language; label: string; nativeName: string }[] = [
  { code: 'en', label: 'English', nativeName: 'EN' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી' },
];

export const TRANSLATIONS = {
  en: {
    // Accessibility Bar
    skipToContent: 'Skip to main content',
    fontSize: 'Font Size',
    contrast: 'Contrast',
    contrastHigh: 'High Contrast',
    contrastStandard: 'Standard',
    shiftA: 'Shift A (06:00 – 14:00 IST)',
    language: 'Language',
    
    // Navigation
    navHome: 'Home',
    navWorker: 'Worker',
    navDashboard: 'Dashboard',
    navOverview: 'Overview',
    navWorkers: 'Workers',
    navRoster: 'Workers',
    navTrends: 'Trends',
    navAlerts: 'Alerts',
    navReports: 'Reports',
    navMetrology: 'Metrology',
    navScan: 'Scanner',
    navHistory: 'Profile & History',
    
    // Header
    appName: 'H2S Dosimeter',
    appSubtitle: 'Hydrogen Sulfide Gas Dosimetry System',
    switchMode: 'Switch Mode',
    searchPlaceholder: 'Search personnel, badges, alerts...',
    
    // Home Page
    homeBadge: 'Gas Safety & Occupational Health',
    homeTitle: 'Continuous Hydrogen Sulfide (H₂S) Personal Dosimetry',
    homeDescription: 'Wearable colorimetric sensor badges paired with ISO D65 optical analysis for real-time, deterministic chemical plant gas safety.',
    enterWorker: 'Check Your Exposure',
    enterWorkerSub: 'Scan your wristband to check your H₂S exposure.',
    openDashboard: 'Safety Overview',
    openDashboardSub: 'Monitor workforce exposure and alerts.',
    openScannerBtn: 'Open Exposure Scanner',
    openDashboardBtn: 'Open Safety Dashboard',
    
    // Wristband Simulator
    schematicTitle: 'Wearable Dosimeter Cartridge Interface',
    schematicSubtitle: 'Lead-Free Cu-PAN / Bi(III) solid-state colorimetric sensing matrix',
    simulateExposure: 'Simulate Exposure Scenario:',
    normalDemo: 'Normal (3.2 ppm·h)',
    elevatedDemo: 'Elevated (12.4 ppm·h)',
    criticalDemo: 'Critical (24.8 ppm·h)',
    
    // Key Specifications
    techSpecs: 'Technical & Sensor Specifications',
    reagentMatrix: 'Chemical Reagent Matrix',
    reagentDesc: 'Lead-free Copper 1-(2-Pyridylazo)-2-naphthol (Cu-PAN) and Bismuth(III) in porous silica substrate.',
    dynamicRange: 'Analytical Dynamic Range',
    dynamicRangeDesc: '0.0 to 30.0 ppm·h cumulative exposure with optical resolution <0.5 ppm·h.',
    opticalEngine: 'Optical Gating & Calibration',
    opticalEngineDesc: 'ISO/CIE D65 Bradford chromatic adaptation across multi-spectral ambient illumination.',
    
    // Worker Scan & Profile
    operatorProfile: 'Operator Profile',
    certifiedOperator: 'Certified Operator',
    editProfile: 'Edit Profile',
    workerId: 'Worker ID',
    assignedUnit: 'Assigned Unit',
    refinerySite: 'Refinery Site',
    captureBadge: 'CAPTURE BADGE & GET READING',
    tapToCapture: 'Align the 4-corner calibration bar inside the reticle',
    useFileUpload: 'Upload Photo File Instead',
    selectTestSample: 'Or Select a Calibrated Field Test Sample:',
    
    // Risk & Status
    riskNormal: 'Normal Exposure',
    riskElevated: 'Elevated Level',
    riskHigh: 'High Exposure',
    riskCritical: 'Critical Alarm',
    validityValid: 'Metrology Valid',
    validityInvalid: 'Invalid Scan',
    
    // Scan Results
    resultTitle: 'Dosimeter Exposure Reading',
    measuredDose: 'Measured Cumulative Dose',
    statusBadge: 'Safety Status',
    actionRequired: 'Action Required',
    twaLabel: 'Estimated 8h TWA',
    sensorSlotTitle: 'Multi-Spot Dosimeter Array (1 of 6 active)',
    metrologyAccordion: 'Inspection Metrology & Colorimetric Vectors',
    saveAndReturn: 'Log Scan & Return to Terminal',
    scanAnother: 'Scan Another Badge',
    
    // Actions & Recommendations
    actionNormal: 'Safe to continue normal shift operations in Zone A.',
    actionElevated: 'Caution Advised — Verify area exhaust ventilation and notify shift lead.',
    actionHigh: 'Mandatory Action — Inspect breathing apparatus (SCBA) and limit dwell time.',
    actionCritical: 'MANDATORY IMMEDIATE EVACUATION — Exit Zone A, don emergency respirator, and report to muster point.',
    
    // Worker History
    lastScanTitle: 'Most Recent Exposure Scan',
    workerDossier: 'Operator Dossier & Hardware Assignment',
    historyLedger: 'Shift Exposure History Ledger',
    noScansRecorded: 'No exposure scans recorded for this shift.',
    viewCertificate: 'View Certificate',
    
    // HSE Dashboard
    dashboardTitle: 'Plant Safety & Exposure Dashboard',
    monitoredStaff: 'Monitored Staff',
    totalScans: 'Total Scans Logged',
    exceedances: 'Exceedance (>10 ppm)',
    activeAlerts: 'Active Alerts',
    riskDistribution: 'Workforce Risk Distribution',
    recentScansFeed: 'Real-Time Personnel Verification Feed',
    incidentQueue: 'Incident & Alert Queue',
    acknowledge: 'Acknowledge',
    acknowledged: 'Acknowledged',
    
    // Footer
    footerGov: 'Government of India Enterprise · Ministry of Petroleum & Natural Gas',
    footerCopyright: '© 2026 Mangalore Refinery and Petrochemicals Limited. All rights reserved.',
  },
  hi: {
    // Accessibility Bar
    skipToContent: 'मुख्य सामग्री पर जाएं',
    fontSize: 'फ़ॉन्ट आकार',
    contrast: 'कंट्रास्ट',
    contrastHigh: 'उच्च कंट्रास्ट',
    contrastStandard: 'सामान्य',
    shiftA: 'पाली ए (06:00 – 14:00 भारतीय मानक समय)',
    language: 'भाषा',
    
    // Navigation
    navHome: 'होम',
    navWorker: 'श्रमिक',
    navDashboard: 'डैशबोर्ड',
    navOverview: 'अवलोकन',
    navWorkers: 'श्रमिक',
    navRoster: 'श्रमिक',
    navTrends: 'रुझान',
    navAlerts: 'अलर्ट',
    navReports: 'रिपोर्ट्स',
    navMetrology: 'मेट्रोलॉजी',
    navScan: 'स्कैनर',
    navHistory: 'प्रोफ़ाइल व इतिहास',
    
    // Header
    appName: 'H2S डोसीमीटर',
    appSubtitle: 'हाइड्रोजन सल्फाइड गैस डोसीमेट्री प्रणाली',
    switchMode: 'मोड बदलें',
    searchPlaceholder: 'कर्मचारी, बैज, अलर्ट खोजें...',
    
    // Home Page
    homeBadge: 'गैस सुरक्षा और व्यावसायिक स्वास्थ्य',
    homeTitle: 'निरंतर हाइड्रोजन सल्फाइड (H₂S) व्यक्तिगत डोसीमेट्री',
    homeDescription: 'रासायनिक संयंत्रों में रीयल-टाइम, सटीक गैस सुरक्षा हेतु पहनने योग्य रंगमितीय सेंसर बैज और आईएसओ D65 ऑप्टिकल विश्लेषण।',
    enterWorker: 'अपना एक्सपोज़र जांचें',
    enterWorkerSub: 'अपना H₂S एक्सपोज़र जांचने के लिए रिस्टबैंड स्कैन करें।',
    openDashboard: 'सुरक्षा अवलोकन',
    openDashboardSub: 'कार्यबल एक्सपोज़र और अलर्ट की निगरानी करें।',
    openScannerBtn: 'एक्सपोज़र स्कैनर खोलें',
    openDashboardBtn: 'सुरक्षा डैशबोर्ड खोलें',
    
    // Wristband Simulator
    schematicTitle: 'पहनने योग्य डोसीमीटर कार्ट्रिज इंटरफ़ेस',
    schematicSubtitle: 'लेड-मुक्त Cu-PAN / Bi(III) सॉलिड-स्टेट कलरिमेट्रिक सेंसिंग मैट्रिक्स',
    simulateExposure: 'एक्सपोजर परिदृश्य का अनुकरण करें:',
    normalDemo: 'सामान्य (3.2 ppm·h)',
    elevatedDemo: 'मध्यम (12.4 ppm·h)',
    criticalDemo: 'गंभीर (24.8 ppm·h)',
    
    // Key Specifications
    techSpecs: 'तकनीकी और सेंसर विनिर्देश',
    reagentMatrix: 'रासायनिक अभिकर्मक मैट्रिक्स',
    reagentDesc: 'छिद्रयुक्त सिलिका सब्सट्रेट में लेड-मुक्त कॉपर PAN (Cu-PAN) और बिस्मथ(III)।',
    dynamicRange: 'विश्लेषणात्मक गतिशील सीमा',
    dynamicRangeDesc: '0.0 से 30.0 ppm·h संचयी एक्सपोजर, <0.5 ppm·h ऑप्टिकल रिज़ॉल्यूशन के साथ।',
    opticalEngine: 'ऑप्टिकल गेटिंग और अंशांकन',
    opticalEngineDesc: 'परिवेशी प्रकाश में आईएसओ/सीआईई D65 ब्रैडफोर्ड क्रोमैटिक अनुकूलन।',
    
    // Worker Scan & Profile
    operatorProfile: 'ऑपरेटर प्रोफ़ाइल',
    certifiedOperator: 'प्रमाणित ऑपरेटर',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    workerId: 'श्रमिक आईडी',
    assignedUnit: 'आवंटित यूनिट',
    refinerySite: 'रिफाइनरी स्थल',
    captureBadge: 'बैज कैप्चर करें और रीडिंग प्राप्त करें',
    tapToCapture: 'रेटिकल के अंदर 4-कोने वाले कैलिब्रेशन बार को संरेखित करें',
    useFileUpload: 'इसके बजाय फ़ोटो फ़ाइल अपलोड करें',
    selectTestSample: 'या कैलिब्रेटेड फ़ील्ड टेस्ट नमूना चुनें:',
    
    // Risk & Status
    riskNormal: 'सामान्य एक्सपोजर',
    riskElevated: 'मध्यम स्तर',
    riskHigh: 'उच्च एक्सपोजर',
    riskCritical: 'गंभीर अलार्म',
    validityValid: 'सटीक मेट्रोलॉजी',
    validityInvalid: 'अमान्य स्कैन',
    
    // Scan Results
    resultTitle: 'डोसीमीटर एक्सपोजर रीडिंग',
    measuredDose: 'मापी गई संचयी खुराक',
    statusBadge: 'सुरक्षा स्थिति',
    actionRequired: 'आवश्यक कार्रवाई',
    twaLabel: 'अनुमानित 8-घंटे TWA',
    sensorSlotTitle: 'मल्टी-स्पॉट डोसीमीटर व्यू (6 में से 1 सक्रिय)',
    metrologyAccordion: 'निरीक्षण मेट्रोलॉजी और वर्णमिति वैक्टर',
    saveAndReturn: 'स्कैन सहेजें और टर्मिनल पर लौटें',
    scanAnother: 'दूसरा बैज स्कैन करें',
    
    // Actions & Recommendations
    actionNormal: 'ज़ोन ए में सामान्य कार्य संचालन जारी रखना सुरक्षित है।',
    actionElevated: 'सावधानी बरतें — क्षेत्र के वेंटिलेशन की जांच करें और शिफ्ट प्रभारी को सूचित करें।',
    actionHigh: 'अनिवार्य कार्रवाई — श्वास उपकरण (SCBA) की जांच करें और समय सीमित करें।',
    actionCritical: 'तत्काल अनिवार्य निकासी — ज़ोन ए से बाहर निकलें, आपातकालीन रेस्पिरेटर पहनें और मस्टर पॉइंट पर जाएं।',
    
    // Worker History
    lastScanTitle: 'नवीनतम एक्सपोजर स्कैन',
    workerDossier: 'ऑपरेटर विवरण और हार्डवेयर आवंटन',
    historyLedger: 'शिफ्ट एक्सपोजर इतिहास लेजर',
    noScansRecorded: 'इस शिफ्ट के लिए कोई स्कैन दर्ज नहीं किया गया है।',
    viewCertificate: 'प्रमाणपत्र देखें',
    
    // HSE Dashboard
    dashboardTitle: 'संयंत्र सुरक्षा और एक्सपोजर डैशबोर्ड',
    monitoredStaff: 'निगरानी अधीन कर्मचारी',
    totalScans: 'कुल दर्ज स्कैन',
    exceedances: 'सीमा उल्लंघन (>10 ppm)',
    activeAlerts: 'सक्रिय अलर्ट',
    riskDistribution: 'कार्यबल जोखिम वितरण',
    recentScansFeed: 'रीयल-टाइम कर्मचारी सत्यापन फ़ीड',
    incidentQueue: 'घटना और अलर्ट कतार',
    acknowledge: 'स्वीकार करें',
    acknowledged: 'स्वीकृत',
    
    // Footer
    footerGov: 'भारत सरकार का उद्यम · पेट्रोलियम और प्राकृतिक गैस मंत्रालय',
    footerCopyright: '© 2026 मंगलूर रिफाइनरी एंड पेट्रोकेमिकल्स लिमिटेड। सर्वाधिकार सुरक्षित।',
  },
  kn: {
    // Accessibility Bar
    skipToContent: 'ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ',
    fontSize: 'ಫಾಂಟ್ ಗಾತ್ರ',
    contrast: 'ಕಾಂಟ್ರಾಸ್ಟ್',
    contrastHigh: 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್',
    contrastStandard: 'ಸಾಮಾನ್ಯ',
    shiftA: 'ಶಿಫ್ಟ್ A (06:00 – 14:00 IST)',
    language: 'ಭಾಷೆ',
    
    // Navigation
    navHome: 'ಮುಖಪುಟ',
    navWorker: 'ಕಾರ್ಮಿಕ',
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navOverview: 'ಅವಲೋಕನ',
    navWorkers: 'ಕಾರ್ಮಿಕರು',
    navRoster: 'ಕಾರ್ಮಿಕರ ಪಟ್ಟಿ',
    navTrends: 'ಪ್ರವೃತ್ತಿಗಳು',
    navAlerts: 'ಎಚ್ಚರಿಕೆಗಳು',
    navReports: 'ವರದಿಗಳು',
    navMetrology: 'ಮೆಟ್ರಾಲಜಿ',
    navScan: 'ಸ್ಕ್ಯಾನರ್',
    navHistory: 'ಪ್ರೊಫೈಲ್ ಮತ್ತು ಇತಿಹಾಸ',
    
    // Header
    appName: 'H2S ಡೋಸಿಮೀಟರ್',
    appSubtitle: 'ಹೈಡ್ರೋಜನ್ ಸಲ್ಫೈಡ್ ಅನಿಲ ಡೋಸಿಮೆಟ್ರಿ ವ್ಯವಸ್ಥೆ',
    switchMode: 'ಮೋಡ್ ಬದಲಾಯಿಸಿ',
    searchPlaceholder: 'ಸಿಬ್ಬಂದಿ, ಬ್ಯಾಡ್ಜ್‌ಗಳು, ಎಚ್ಚರಿಕೆಗಳನ್ನು ಹುಡುಕಿ...',
    
    // Home Page
    homeBadge: 'ಅನಿಲ ಸುರಕ್ಷತೆ & ಔದ್ಯೋಗಿಕ ಆರೋಗ್ಯ',
    homeTitle: 'ನಿರಂತರ ಹೈಡ್ರೋಜನ್ ಸಲ್ಫೈಡ್ (H₂S) ವೈಯಕ್ತಿಕ ಡೋಸಿಮೆಟ್ರಿ',
    homeDescription: 'ನೈಜ-ಸಮಯದ, ರಾಸಾಯನಿಕ ಘಟಕದ ಅನಿಲ ಸುರಕ್ಷತೆಗಾಗಿ ISO D65 ಆಪ್ಟಿಕಲ್ ವಿಶ್ಲೇಷಣೆಯೊಂದಿಗೆ ಧರಿಸಬಹುದಾದ ಸೆನ್ಸರ್ ಬ್ಯಾಡ್ಜ್‌ಗಳು.',
    enterWorker: 'ನಿಮ್ಮ ಎಕ್ಸ್‌ಪೋಶರ್ ಪರೀಕ್ಷಿಸಿ',
    enterWorkerSub: 'ನಿಮ್ಮ H₂S ಎಕ್ಸ್‌ಪೋಶರ್ ಪರೀಕ್ಷಿಸಲು ರಿಸ್ಟ್‌ಬ್ಯಾಂಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
    openDashboard: 'ಸುರಕ್ಷತಾ ಅವಲೋಕನ',
    openDashboardSub: 'ಕಾರ್ಯಪಡೆಯ ಎಕ್ಸ್‌ಪೋಶರ್ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.',
    openScannerBtn: 'ಎಕ್ಸ್‌ಪೋಶರ್ ಸ್ಕ್ಯಾನರ್ ತೆರೆಯಿರಿ',
    openDashboardBtn: 'ಸುರಕ್ಷತಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ',
    
    // Wristband Simulator
    schematicTitle: 'ಧರಿಸಬಹುದಾದ ಡೋಸಿಮೀಟರ್ ಕಾರ್ಟ್ರಿಡ್ಜ್ ಇಂಟರ್ಫೇಸ್',
    schematicSubtitle: 'ಸೀಸ-ಮುಕ್ತ Cu-PAN / Bi(III) ಸಾಲಿಡ್-ಸ್ಟೇಟ್ ಸೆನ್ಸಿಂಗ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್',
    simulateExposure: 'ಎಕ್ಸ್‌ಪೋಶರ್ ಸನ್ನಿವೇಶವನ್ನು ಅನುಕರಿಸಿ:',
    normalDemo: 'ಸಾಮಾನ್ಯ (3.2 ppm·h)',
    elevatedDemo: 'ಮಧ್ಯಮ (12.4 ppm·h)',
    criticalDemo: 'ತುರ್ತು (24.8 ppm·h)',
    
    // Key Specifications
    techSpecs: 'ತಾಂತ್ರಿಕ ಮತ್ತು ಸಂವೇದಕ ವಿಶೇಷಣಗಳು',
    reagentMatrix: 'ರಾಸಾಯನಿಕ ಕಾರಕ ಮ್ಯಾಟ್ರಿಕ್ಸ್',
    reagentDesc: 'ರಂಧ್ರಯುಕ್ತ ಸಿಲಿಕಾ ತಲಾಧಾರದಲ್ಲಿ ಸೀಸ-ಮುಕ್ತ ತಾಮ್ರ 1-(2-ಪಿರಿಡಿಲಾಜೊ)-2-ನಾಫ್ಥಾಲ್ (Cu-PAN) ಮತ್ತು ಬಿಸ್ಮತ್(III).',
    dynamicRange: 'ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಡೈನಾಮಿಕ್ ಶ್ರೇಣಿ',
    dynamicRangeDesc: '0.0 ರಿಂದ 30.0 ppm·h ಒಟ್ಟು ಸಂಚಿತ ಎಕ್ಸ್‌ಪೋಶರ್, <0.5 ppm·h ಆಪ್ಟಿಕಲ್ ರೆಸಲ್ಯೂಶನ್‌ನೊಂದಿಗೆ.',
    opticalEngine: 'ಆಪ್ಟಿಕಲ್ ಗೇಟಿಂಗ್ ಮತ್ತು ಮಾಪನಾಂಕ ನಿರ್ಣಯ',
    opticalEngineDesc: 'ಬಹು-ಸ್ಪೆಕ್ಟ್ರಲ್ ಸುತ್ತಲಿನ ಬೆಳಕಿನಲ್ಲಿ ISO/CIE D65 ಬ್ರಾಡ್‌ಫೋರ್ಡ್ ಕ್ರೊಮ್ಯಾಟಿಕ್ ಅಳವಡಿಕೆ.',
    
    // Worker Scan & Profile
    operatorProfile: 'ಆಪರೇಟರ್ ಪ್ರೊಫೈಲ್',
    certifiedOperator: 'ಪ್ರಮಾಣೀಕೃತ ಆಪರೇಟರ್',
    editProfile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
    workerId: 'ಕಾರ್ಮಿಕ ID',
    assignedUnit: 'ನಿಯೋಜಿತ ಘಟಕ',
    refinerySite: 'ರಿಫೈನರಿ ತಾಣ',
    captureBadge: 'ಬ್ಯಾಡ್ಜ್ ಸೆರೆಹಿಡಿಯಿರಿ & ರೀಡಿಂಗ್ ಪಡೆಯಿರಿ',
    tapToCapture: 'ಕ್ಯಾಲಿಬ್ರೇಶನ್ ಬಾರ್ ಅನ್ನು ರೆಟಿಕಲ್ ಒಳಗೆ ಜೋಡಿಸಿ',
    useFileUpload: 'ಬದಲಿಗೆ ಫೋಟೋ ಫೈಲ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ',
    selectTestSample: 'ಅಥವಾ ಕ್ಯಾಲಿಬ್ರೇಟೆಡ್ ಫೀಲ್ಡ್ ಪರೀಕ್ಷಾ ಮಾದರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    
    // Risk & Status
    riskNormal: 'ಸಾಮಾನ್ಯ ಎಕ್ಸ್‌ಪೋಶರ್',
    riskElevated: 'ಮಧ್ಯಮ ಮಟ್ಟ',
    riskHigh: 'ಅಧಿಕ ಎಕ್ಸ್‌ಪೋಶರ್',
    riskCritical: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ',
    validityValid: 'ಮೆಟ್ರಾಲಜಿ ಮಾನ್ಯವಾಗಿದೆ',
    validityInvalid: 'ಅಮಾನ್ಯ ಸ್ಕ್ಯಾನ್',
    
    // Scan Results
    resultTitle: 'ಡೋಸಿಮೀಟರ್ ಎಕ್ಸ್‌ಪೋಶರ್ ರೀಡಿಂಗ್',
    measuredDose: 'ಅಳೆಯಲಾದ ಸಂಚಿತ ಡೋಸ್',
    statusBadge: 'ಸುರಕ್ಷತಾ ಸ್ಥಿತಿ',
    actionRequired: 'ಅಗತ್ಯ ಕ್ರಮ',
    twaLabel: 'ಅಂದಾಜು 8h TWA',
    sensorSlotTitle: 'ಮಲ್ಟಿ-ಸ್ಪಾಟ್ ಡೋಸಿಮೀಟರ್ ಅರೇ (6 ರಲ್ಲಿ 1 ಸಕ್ರಿಯ)',
    metrologyAccordion: 'ತಪಾಸಣಾ ಮೆಟ್ರಾಲಜಿ ಮತ್ತು ಕಲರ್ಮೆಟ್ರಿಕ್ ವೆಕ್ಟರ್‌ಗಳು',
    saveAndReturn: 'ಸ್ಕ್ಯಾನ್ ದಾಖಲಿಸಿ ಮತ್ತು ಟರ್ಮಿನಲ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    scanAnother: 'ಇನ್ನೊಂದು ಬ್ಯಾಡ್ಜ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    
    // Actions & Recommendations
    actionNormal: 'ವಲಯ A ನಲ್ಲಿ ಸಾಮಾನ್ಯ ಶಿಫ್ಟ್ ಕಾರ್ಯಾಚರಣೆಗಳನ್ನು ಮುಂದುವರಿಸಲು ಸುರಕ್ಷಿತವಾಗಿದೆ.',
    actionElevated: 'ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ — ಪ್ರದೇಶದ ಗಾಳಿ ಸಂಚಾರ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಶಿಫ್ಟ್ ಲೀಡ್‌ಗೆ ತಿಳಿಸಿ.',
    actionHigh: 'ಕಡ್ಡಾಯ ಕ್ರಮ — ಉಸಿರಾಟದ ಉಪಕರಣವನ್ನು (SCBA) ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಇರುವ ಸಮಯ ಮಿತಿಗೊಳಿಸಿ.',
    actionCritical: 'ತಕ್ಷಣ ಕಡ್ಡಾಯ ಸ್ಥಳಾಂತರ — ವಲಯ A ಯಿಂದ ಹೊರಬನ್ನಿ, ತುರ್ತು ರೆಸ್ಪಿರೇಟರ್ ಧರಿಸಿ ಮತ್ತು ಮಸ್ಟರ್ ಪಾಯಿಂಟ್‌ಗೆ ವರದಿ ಮಾಡಿ.',
    
    // Worker History
    lastScanTitle: 'ಇತ್ತೀಚಿನ ಎಕ್ಸ್‌ಪೋಶರ್ ಸ್ಕ್ಯಾನ್',
    workerDossier: 'ಆಪರೇಟರ್ ಡೋಸಿಯರ್ ಮತ್ತು ಹಾರ್ಡ್‌ವೇರ್ ಹಂಚಿಕೆ',
    historyLedger: 'ಶಿಫ್ಟ್ ಎಕ್ಸ್‌ಪೋಶರ್ ಇತಿಹಾಸ',
    noScansRecorded: 'ಈ ಶಿಫ್ಟ್‌ಗೆ ಯಾವುದೇ ಸ್ಕ್ಯಾನ್‌ಗಳು ದಾಖಲಾಗಿಲ್ಲ.',
    viewCertificate: 'ಪ್ರಮಾಣಪತ್ರ ವೀಕ್ಷಿಸಿ',
    
    // HSE Dashboard
    dashboardTitle: 'ಪ್ಲಾಂಟ್ ಸುರಕ್ಷತೆ ಮತ್ತು ಎಕ್ಸ್‌ಪೋಶರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    monitoredStaff: 'ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿರುವ ಸಿಬ್ಬಂದಿ',
    totalScans: 'ಒಟ್ಟು ದಾಖಲಾದ ಸ್ಕ್ಯಾನ್‌ಗಳು',
    exceedances: 'ಮಿತಿ ಮೀರಿದ್ದು (>10 ppm)',
    activeAlerts: 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು',
    riskDistribution: 'ಕಾರ್ಯಪಡೆಯ ಅಪಾಯ ವಿತರಣೆ',
    recentScansFeed: 'ನೈಜ-ಸಮಯದ ಸಿಬ್ಬಂದಿ ಪರಿಶೀಲನಾ ಫೀಡ್',
    incidentQueue: 'ಘಟನೆ ಮತ್ತು ಎಚ್ಚರಿಕೆ ಸರತಿ ಸಾಲು',
    acknowledge: 'ದೃಢೀಕರಿಸಿ',
    acknowledged: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    
    // Footer
    footerGov: 'ಭಾರತ ಸರ್ಕಾರದ ಉದ್ಯಮ · ಪೆಟ್ರೋಲಿಯಂ ಮತ್ತು ನೈಸರ್ಗಿಕ ಅನಿಲ ಸಚಿವಾಲಯ',
    footerCopyright: '© 2026 ಮಂಗಳೂರು ರಿಫೈನರಿ ಮತ್ತು ಪೆಟ್ರೋಕೆಮಿಕಲ್ಸ್ ಲಿಮಿಟೆಡ್. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
  },
  gu: {
    // Accessibility Bar
    skipToContent: 'મુખ્ય સામગ્રી પર જાઓ',
    fontSize: 'ફોન્ટ માપ',
    contrast: 'કોન્ટ્રાસ્ટ',
    contrastHigh: 'ઉચ્ચ કોન્ટ્રાસ્ટ',
    contrastStandard: 'સામાન્ય',
    shiftA: 'શિફ્ટ A (06:00 – 14:00 IST)',
    language: 'ભાષા',
    
    // Navigation
    navHome: 'હોમ',
    navWorker: 'શ્રમિક',
    navDashboard: 'ડેશબોર્ડ',
    navOverview: 'ઝાંખી',
    navWorkers: 'શ્રમિકો',
    navRoster: 'શ્રમિકો',
    navTrends: 'વલણો',
    navAlerts: 'ચેતવણીઓ',
    navReports: 'અહેવાલો',
    navMetrology: 'મેટ્રોલોજી',
    navScan: 'સ્કેનર',
    navHistory: 'પ્રોફાઇલ અને ઇતિહાસ',
    
    // Header
    appName: 'H2S ડોસિમીટર',
    appSubtitle: 'હાઇડ્રોજન સલ્ફાઇડ ગેસ ડોસિમેટ્રી સિસ્ટમ',
    switchMode: 'મોડ બદલો',
    searchPlaceholder: 'કર્મચારીઓ, બેજ, ચેતવણીઓ શોધો...',
    
    // Home Page
    homeBadge: 'ગેસ સુરક્ષા અને વ્યવસાયિક સ્વાસ્થ્ય',
    homeTitle: 'સતત હાઇડ્રોજન સલ્ફાઇડ (H₂S) વ્યક્તિગત ડોસિમેટ્રી',
    homeDescription: 'રાસાયણિક પ્લાન્ટની ગેસ સુરક્ષા માટે ISO D65 ઓપ્ટિકલ વિશ્લેષણ સાથે પહેરી શકાય તેવા સેન્સર બેજ.',
    enterWorker: 'તમારું એક્સપોઝર તપાસો',
    enterWorkerSub: 'તમારું H₂S એક્સપોઝર તપાસવા કાંડાનો પટ્ટો સ્કેન કરો.',
    openDashboard: 'સુરક્ષા ઝાંખી',
    openDashboardSub: 'કાર્યબળના એક્સપોઝર અને ચેતવણીઓની દેખરેખ રાખો.',
    openScannerBtn: 'એક્સપોઝર સ્કેનર ખોલો',
    openDashboardBtn: 'સુરક્ષા ડેશબોર્ડ ખોલો',
    
    // Wristband Simulator
    schematicTitle: 'પહેરી શકાય તેવા ડોસિમીટર કારતૂસ ઈન્ટરફેસ',
    schematicSubtitle: 'લીડ-મુક્ત Cu-PAN / Bi(III) સોલિડ-સ્ટેટ કલરીમેટ્રિક સેન્સિંગ મેટ્રિક્સ',
    simulateExposure: 'એક્સપોઝર દૃશ્યનું અનુકરણ કરો:',
    normalDemo: 'સામાન્ય (3.2 ppm·h)',
    elevatedDemo: 'મધ્યમ (12.4 ppm·h)',
    criticalDemo: 'ગંભીર (24.8 ppm·h)',
    
    // Key Specifications
    techSpecs: 'તકનીકી અને સેન્સર સ્પષ્ટીકરણો',
    reagentMatrix: 'રાસાયણિક પ્રતિક્રિયા મેટ્રિક્સ',
    reagentDesc: 'છિદ્રાળુ સિલિકા સબસ્ટ્રેટમાં સીસા-મુક્ત કોપર PAN (Cu-PAN) અને બિસ્મથ(III).',
    dynamicRange: 'વિશ્લેષણાત્મક ગતિશીલ શ્રેણી',
    dynamicRangeDesc: '0.0 થી 30.0 ppm·h સંચિત એક્સપોઝર, <0.5 ppm·h ઓપ્ટિકલ રિઝોલ્યુશન સાથે.',
    opticalEngine: 'ઓપ્ટિકલ ગેટિંગ અને માપાંકન',
    opticalEngineDesc: 'આસપાસના પ્રકાશમાં ISO/CIE D65 બ્રેડફોર્ડ ક્રોમેટિક અનુકૂલન.',
    
    // Worker Scan & Profile
    operatorProfile: 'ઓપરેટર પ્રોફાઇલ',
    certifiedOperator: 'પ્રમાણિત ઓપરેટર',
    editProfile: 'પ્રોફાઇલ સંપાદિત કરો',
    workerId: 'શ્રમિક ID',
    assignedUnit: 'સોંપેલ એકમ',
    refinerySite: 'રિફાઇનરી સાઇટ',
    captureBadge: 'બેજ કેપ્ચર કરો અને રીડિંગ મેળવો',
    tapToCapture: 'રેટિકલની અંદર કેલિબ્રેશન બારને ગોઠવો',
    useFileUpload: 'તેના બદલે ફોટો ફાઇલ અપલોડ કરો',
    selectTestSample: 'અથવા કેલિબ્રેટેડ ફીલ્ડ ટેસ્ટ સેમ્પલ પસંદ કરો:',
    
    // Risk & Status
    riskNormal: 'સામાન્ય એક્સપોઝર',
    riskElevated: 'મધ્યમ સ્તર',
    riskHigh: 'ઉચ્ચ એક્સપોઝર',
    riskCritical: 'ગંભીર ચેતવણી',
    validityValid: 'મેટ્રોલોજી માન્ય છે',
    validityInvalid: 'અમાન્ય સ્કેન',
    
    // Scan Results
    resultTitle: 'ડોસિમીટર એક્સપોઝર રીડિંગ',
    measuredDose: 'માપવામાં આવેલ સંચિત ડોઝ',
    statusBadge: 'સુરક્ષા સ્થિતિ',
    actionRequired: 'જરૂરી પગલાં',
    twaLabel: 'અંદાજિત 8 કલાક TWA',
    sensorSlotTitle: 'મલ્ટી-સ્પોટ ડોસિમીટર એરે (6 માંથી 1 સક્રિય)',
    metrologyAccordion: 'તપાસ મેટ્રોલોજી અને કલરીમેટ્રિક વેક્ટર્સ',
    saveAndReturn: 'સ્કેન સાચવો અને ટર્મિનલ પર પાછા ફરો',
    scanAnother: 'બીજો બેજ સ્કેન કરો',
    
    // Actions & Recommendations
    actionNormal: 'ઝોન A માં સામાન્ય શિફ્ટ કામગીરી ચાલુ રાખવી સુરક્ષિત છે.',
    actionElevated: 'સાવચેતીની સલાહ — વિસ્તારના વેન્ટિલેશનની તપાસ કરો અને શિફ્ટ ઇન્ચાર્જને જાણ કરો.',
    actionHigh: 'ફરજિયાત પગલાં — શ્વાસ લેવાના ઉપકરણ (SCBA) ની તપાસ કરો અને રોકાણ મર્યાદિત કરો.',
    actionCritical: 'તાત્કાલિક ફરજિયાત સ્થળાંતર — ઝોન A માંથી બહાર નીકળો, કટોકટી શ્વસન યંત્ર પહેરો અને મસ્ટર પોઇન્ટ પર પહોંચો.',
    
    // Worker History
    lastScanTitle: 'તાજેતરનું એક્સપોઝર સ્કેન',
    workerDossier: 'ઓપરેટર ડોઝિયર અને હાર્ડવેર સોંપણી',
    historyLedger: 'શિફ્ટ એક્સપોઝર ઇતિહાસ',
    noScansRecorded: 'આ શિફ્ટ માટે કોઈ સ્કેન નોંધાયેલ નથી.',
    viewCertificate: 'પ્રમાણપત્ર જુઓ',
    
    // HSE Dashboard
    dashboardTitle: 'પ્લાન્ટ સુરક્ષા અને એક્સપોઝર ડેશબોર્ડ',
    monitoredStaff: 'મોનિટર કરેલ સ્ટાફ',
    totalScans: 'કુલ નોંધાયેલ સ્કેન',
    exceedances: 'મર્યાદા બહાર (>10 ppm)',
    activeAlerts: 'સક્રિય ચેતવણીઓ',
    riskDistribution: 'કર્મચારી જોખમ વિતરણ',
    recentScansFeed: 'વાસ્તવિક સમયનું કર્મચારી ચકાસણી ફીડ',
    incidentQueue: 'ઘટના અને ચેતવણી કતાર',
    acknowledge: 'સ્વીકારો',
    acknowledged: 'સ્વીકારેલ',
    
    // Footer
    footerGov: 'ભારત સરકારનું સાહસ · પેટ્રોલિયમ અને કુદરતી ગેસ મંત્રાલય',
    footerCopyright: '© 2026 મેંગલોર રિફાઇનરી એન્ડ પેટ્રોકેમિકલ્સ લિમિટેડ. સર્વાધિકાર સુરક્ષિત.',
  }
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
  const dict = (TRANSLATIONS as Record<string, Record<string, string>>)[lang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}
