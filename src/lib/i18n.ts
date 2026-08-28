'use client';

export type Language = 'en' | 'hi';

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
    navRoster: 'Roster',
    navTrends: 'Trends',
    navAlerts: 'Alerts',
    navMetrology: 'Metrology',
    navScan: 'Scan & Profile',
    navHistory: 'History & Details',
    
    // Header
    appName: 'MRPL Gas Dosimetry Portal',
    appSubtitle: 'Mangalore Refinery & Petrochemicals Ltd · Occupational Safety',
    switchMode: 'Switch Mode',
    searchPlaceholder: 'Search personnel, badges, alerts...',
    
    // Home Page
    homeBadge: 'Gas Safety & Occupational Health',
    homeTitle: 'Continuous Hydrogen Sulfide (H₂S) Personal Dosimetry',
    homeDescription: 'Wearable colorimetric sensor badges paired with ISO D65 optical analysis for real-time, deterministic chemical plant gas safety.',
    enterWorker: 'Worker Terminal',
    enterWorkerSub: 'Scan badge, log dose & view personal exposure',
    openDashboard: 'HSE Dashboard',
    openDashboardSub: 'Supervisory monitoring, triage & metrology',
    
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
    navRoster: 'रोस्टर',
    navTrends: 'रुझान',
    navAlerts: 'अलर्ट',
    navMetrology: 'मेट्रोलॉजी',
    navScan: 'स्कैन और प्रोफ़ाइल',
    navHistory: 'इतिहास और विवरण',
    
    // Header
    appName: 'एमआरपीएल गैस डोसीमेट्री पोर्टल',
    appSubtitle: 'मंगलूर रिफाइनरी एंड पेट्रोकेमिकल्स लिमिटेड · व्यावसायिक सुरक्षा',
    switchMode: 'मोड बदलें',
    searchPlaceholder: 'कर्मचारी, बैज, अलर्ट खोजें...',
    
    // Home Page
    homeBadge: 'गैस सुरक्षा और व्यावसायिक स्वास्थ्य',
    homeTitle: 'निरंतर हाइड्रोजन सल्फाइड (H₂S) व्यक्तिगत डोसीमेट्री',
    homeDescription: 'रासायनिक संयंत्रों में रीयल-टाइम, सटीक गैस सुरक्षा हेतु पहनने योग्य रंगमितीय सेंसर बैज और आईएसओ D65 ऑप्टिकल विश्लेषण।',
    enterWorker: 'श्रमिक टर्मिनल',
    enterWorkerSub: 'बैज स्कैन करें, खुराक दर्ज करें और व्यक्तिगत डेटा देखें',
    openDashboard: 'एचएसई डैशबोर्ड',
    openDashboardSub: 'पर्यवेक्षी निगरानी, घटना निवारण और मेट्रोलॉजी',
    
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
  }
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;
