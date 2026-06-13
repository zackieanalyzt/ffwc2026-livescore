// src/utils/translations.ts - พจนานุกรมคำแปลภาษาไทย-อังกฤษ

export type LangType = 'th' | 'en';

export const TEAM_TRANSLATIONS: Record<string, string> = {
  'เม็กซิโก': 'Mexico',
  'แอฟริกาใต้': 'South Africa',
  'เกาหลีใต้': 'South Korea',
  'เช็กเกีย': 'Czechia',
  'แคนาดา': 'Canada',
  'บอสเนียและเฮอร์เซโกวีนา': 'Bosnia & Herzegovina',
  'กาตาร์': 'Qatar',
  'สวิตเซอร์แลนด์': 'Switzerland',
  'บราซิล': 'Brazil',
  'โมร็อกโก': 'Morocco',
  'ไฮติ': 'Haiti',
  'สกอตแลนด์': 'Scotland',
  'สหรัฐอเมริกา': 'USA',
  'ปารากวัย': 'Paraguay',
  'ออสเตรเลีย': 'Australia',
  'ตุรกี': 'Turkiye',
  'เยอรมนี': 'Germany',
  'เอกวาดอร์': 'Ecuador',
  'ไอวอรีโคสต์': 'Ivory Coast',
  'กูราเซา': 'Curacao',
  'เนเธอร์แลนด์': 'Netherlands',
  'สวีเดน': 'Sweden',
  'ญี่ปุ่น': 'Japan',
  'ตูนิเซีย': 'Tunisia',
  'เบลเยียม': 'Belgium',
  'อียิปต์': 'Egypt',
  'อิหร่าน': 'Iran',
  'นิวซีแลนด์': 'New Zealand',
  'สเปน': 'Spain',
  'อุรุกวัย': 'Uruguay',
  'เคปเวิร์ด': 'Cape Verde',
  'ซาอุดีอาระเบีย': 'Saudi Arabia',
  'ฝรั่งเศส': 'France',
  'นอร์เวย์': 'Norway',
  'เซเนกัล': 'Senegal',
  'อิรัก': 'Iraq',
  'อาร์เจนตินา': 'Argentina',
  'ออสเตรีย': 'Austria',
  'แอลจีเรีย': 'Algeria',
  'จอร์แดน': 'Jordan',
  'โปรตุเกส': 'Portugal',
  'โคลอมเบีย': 'Colombia',
  'ดีอาร์ คองโก': 'DR Congo',
  'อุซเบกิสถาน': 'Uzbekistan',
  'อังกฤษ': 'England',
  'โครเอเชีย': 'Croatia',
  'กานา': 'Ghana',
  'ปานามา': 'Panama'
};

export const VENUE_TRANSLATIONS: Record<string, string> = {
  'สนามกีฬากลางเม็กซิโกซิตี้ (Estadio Azteca)': 'Mexico City Stadium (Estadio Azteca)',
  'สนามกีฬากัวดาลาฮารา (Estadio Akron)': 'Guadalajara Stadium (Estadio Akron)',
  'สนามกีฬาโตรอนโต (BMO Field)': 'Toronto Stadium (BMO Field)',
  'สนามกีฬาลูเมนฟิลด์ (Seattle)': 'Lumen Field (Seattle)',
  'สนามกีฬาฮาร์ดร็อค (Miami)': 'Hard Rock Stadium (Miami)',
  'โลสแอนเจลิส สเตเดียม (SoFi Stadium)': 'Los Angeles Stadium (SoFi Stadium)',
  'ลีวายส์ สเตเดียม (Santa Clara)': 'Levi\'s Stadium (Santa Clara)',
  'ลินคอล์น ไฟแนนเชียล ฟิลด์ (Philadelphia)': 'Lincoln Financial Field (Philadelphia)',
  'เอ็นอาร์จี สเตเดียม (Houston)': 'NRG Stadium (Houston)',
  'ยิลเล็ตต์ สเตเดียม (Boston)': 'Gillette Stadium (Boston)',
  'เม็ทไลฟ์ สเตเดียม (East Rutherford)': 'MetLife Stadium (MetLife Stadium)',
  'เอทีแอนด์ที สเตเดียม (Arlington)': 'AT&T Stadium (Arlington)',
  'บีซี เพลส (Vancouver)': 'BC Place (Vancouver)',
  'เมอร์เซเดส-เบนซ์ สเตเดียม (Atlanta)': 'Mercedes-Benz Stadium (Atlanta)'
};

export const UI_TRANSLATIONS = {
  liveScoreTab: { th: '📱 ผลบอลสดปัจจุบัน', en: '📱 Live Scores' },
  standingsTab: { th: '📊 ตารางคะแนนกลุ่ม A-L', en: '📊 Standings A-L' },
  matchesTab: { th: '📅 โปรแกรมแข่งทั้งหมด', en: '📅 All Fixtures' },
  knockoutTab: { th: '🏆 รอบน็อกเอาต์', en: '🏆 Knockout Stage' },
  autoUpdate: { th: '🔄 อัปเดตอัตโนมัติ:', en: '🔄 Auto Update:' },
  refreshBtn: { th: '↻ รีเฟรชข้อมูล', en: '↻ Refresh' },
  refreshing: { th: '⏳ กำลังรีเฟรช...', en: '⏳ Refreshing...' },
  simControl: { th: '⚙️ จำลองสด:', en: '⚙️ Live Sim:' },
  simStart: { th: '▶️ เริ่มจำลอง', en: '▶️ Start Sim' },
  simStop: { th: '⏸️ หยุดจำลอง', en: '⏸️ Pause Sim' },
  simReset: { th: '↺ รีเซ็ต', en: '↺ Reset' },
  recentTicker: { th: 'เหตุการณ์สดล่าสุด:', en: 'Live Events:' },
  tickerPlaceholder: { th: 'กำลังรอเปิดสนามการแข่งขัน...', en: 'Waiting for kick-off...' },
  footerTitle: { th: '© 2026 ระบบแดชบอร์ด LiveScore ฟุตบอลโลก 2026 อ้างอิงตารางตามจริงจาก', en: '© 2026 World Cup LiveScore Dashboard. Official fixtures referenced from' },
  footerSub: { th: 'จัดทำขึ้นพิเศษด้วยธีมมืดระดับพรีเมียม แปลภาษาไทยและเวลาเตะท้องถิ่นประเทศไทย (GMT+7)', en: 'Premium Dark Theme Dashboard. Localized in Thai / English and Thailand Time (GMT+7)' },
  disclaimer: {
    th: 'แอปพลิเคชันนี้จัดทำขึ้นโดยแฟนบอลเพื่อจุดประสงค์การสาธิตและการศึกษาเท่านั้น และไม่มีความเกี่ยวข้องหรือได้รับการสนับสนุนอย่างเป็นทางการจาก FIFA หรือองค์กรฟุตบอลใดๆ เครื่องหมายการค้าและโลโก้ทั้งหมดเป็นลิขสิทธิ์ของเจ้าของตามกฎหมาย',
    en: 'This is an unofficial fan-made project for demonstration/educational purposes. We are not affiliated with, endorsed by, or associated with FIFA or any official football organization. All trademarks are properties of their respective owners.'
  },
  liveMatchesTitle: { th: 'การแข่งขันที่กำลังเล่นอยู่ (Live Matches)', en: 'Live Matches In Progress' },
  recentResultsTitle: { th: '⚽ การแข่งขันที่เพิ่งจบลง (Recent Results)', en: '⚽ Recent Results' },
  noLiveMatches: { th: 'ไม่มีการแข่งขันสดจริงตามเวลาปัจจุบันในขณะนี้', en: 'No matches playing live at this hour' },
  simPrompt: { 
    th: 'เวลาแข่งขันปกติของฟุตบอลโลกมักเริ่มตอนดึกหรือเช้ามืด คุณสามารถคลิกปุ่มด้านล่างเพื่อเริ่มเปิด "ระบบจำลองการแข่งขันสด" เพื่อชมเหตุการณ์อัปเดตแบบเรียลไทม์', 
    en: 'Matches are scheduled in North American time zones. Click the button below to start "Live Simulation Mode" to watch matches progress in real-time.' 
  },
  startSimBtn: { th: '⚡ เริ่มจำลองการแข่งขันสด', en: '⚡ Start Live Simulation' },
  noRecentResults: { th: 'ไม่มีประวัติแข่งขันล่าสุดที่บันทึก', en: 'No recent match results logged' },
  topScorerTitle: { th: '⚽ อันดับดาวซัลโวสูงสุด (Top Scorers)', en: '⚽ Top Scorers Leaderboard' },
  noScorers: { th: 'ยังไม่มีข้อมูลประตูเกิดขึ้น', en: 'No goals recorded yet' },
  goalsUnit: { th: 'ประตู', en: 'goals' },
  groupTitle: { th: '🏆 ตารางคะแนนกลุ่มรอบแบ่งกลุ่ม (Standings)', en: '🏆 Group Standings' },
  groupSub: { th: 'รอบแรก (48 ทีม • 12 กลุ่ม)', en: 'First Round (48 Teams • 12 Groups)' },
  filterLabel: { th: 'เลือกกลุ่มสายการแข่งขัน:', en: 'Filter by Group:' },
  thPos: { th: 'อันดับ', en: 'Pos' },
  thTeam: { th: 'ประเทศ', en: 'Team' },
  thPlayed: { th: 'แข่ง', en: 'P' },
  thWon: { th: 'ชนะ', en: 'W' },
  thDrawn: { th: 'เสมอ', en: 'D' },
  thLost: { th: 'แพ้', en: 'L' },
  thGf: { th: 'ได้', en: 'GF' },
  thGa: { th: 'เสีย', en: 'GA' },
  thGd: { th: '+/-', en: 'GD' },
  thPts: { th: 'คะแนน', en: 'PTS' },
  thForm: { th: 'ฟอร์ม', en: 'Form' },
  legend1: { th: 'อันดับที่ 1 และ 2 ของกลุ่ม จะผ่านเข้าสู่รอบ 32 ทีมสุดท้ายโดยอัตโนมัติ', en: 'Top 2 teams qualify directly for the Round of 32.' },
  legend2: { th: 'อันดับที่ 3 ลุ้นสิทธิ์เข้ารอบ 32 ทีมสุดท้าย (คัดเลือกทีมอันดับ 3 ที่ดีที่สุด 8 จาก 12 กลุ่ม)', en: '3rd-place teams enter the best 3rd placed wild-card pool (top 8 of 12 advance).' },
  fixturesTitle: { th: '📅 ตารางการแข่งขันและผลบอลฟุตบอลโลก 2026', en: '📅 Fixtures & Results' },
  fixturesSub: { th: 'ทั้งหมด 24 แมตช์แรกในรอบแบ่งกลุ่ม', en: 'All 24 Matchday 1 fixtures' },
  fAll: { th: 'ทั้งหมด', en: 'All' },
  fSched: { th: 'ยังไม่เริ่ม', en: 'Scheduled' },
  fLive: { th: 'แข่งขันสด', en: 'Live' },
  fFin: { th: 'ผลการแข่งที่จบแล้ว', en: 'Results' },
  noFixtures: { th: 'ไม่พบรายการแข่งขันตามสถานะที่เลือก', en: 'No fixtures found for selected status' },
  matchTimeLabel: { th: 'เวลาแข่งขัน:', en: 'Kick-off Time (Thai Time):' },
  matchScheduledText: { th: 'ยังไม่เริ่ม', en: 'Scheduled' },
  matchLiveText: { th: 'สด', en: 'LIVE' },
  matchFinishedText: { th: 'จบเกม', en: 'FT' },
  modalStatsTitle: { th: 'สถิติการเล่นในแมตช์', en: 'Match Statistics' },
  modalEventsTitle: { th: 'เหตุการณ์สำคัญในการแข่งขัน', en: 'Timeline & Match Events' },
  modalNoEvents: { th: 'ไม่มีรายงานใบเตือนหรือประตูในแมตช์นี้ (หรือกำลังป้อนข้อมูลด้วยตนเอง)', en: 'No match events recorded yet (or manually editing)' },
  modalNoStats: { th: 'ยังไม่มีรายงานสถิติการเล่นจนกว่าการแข่งขันจะเริ่มต้นขึ้น', en: 'Statistics are not logged yet. Match has not started.' },
  modalGuruTitle: { th: '🧠 ทรรศนะ & พยากรณ์ผลโดยกูรูฟุตบอล', en: '🧠 Guru Forecasts & Insights' },
  guruAi: { th: 'กูรูสปอร์ตเรดาร์ (ระบบ AI วิเคราะห์)', en: 'SportRadar AI Assistant' },
  guruHuman: { th: 'กูรูสมชาย (ทีเด็ดลูกหนัง)', en: 'Guru Somchai (Football pundit)' },
  forecastAiDesc: { 
    th: 'จากการประมวลผลทางสถิติ คาดว่า {t1} จะเป็นฝ่ายครองเกมบุกเข้ากดดันได้ดีกว่า และมีโอกาสชนะมากกว่า', 
    en: 'Based on statistical modeling, {t1} is projected to control the tempo with higher offensive efficacy.'
  },
  forecastHumanDesc: {
    th: 'เชื่อว่าทีมฝั่งเจ้าบ้านหรือทีมที่มีประสบการณ์เหนือกว่าอย่าง {t1} จะสามารถคุมจังหวะเกมและเฉือนเอาชนะไปได้สำเร็จ',
    en: 'Pundit believes {t1} has the squad depth and host country advantage to secure a narrow victory.'
  },
  forecastAiWin: { th: 'โอกาสชนะ: {t1} 48% | เสมอ 30% | {t2} 22%', en: 'Win Probability: {t1} 48% | Draw 30% | {t2} 22%' },
  forecastHumanWin: { th: '{t1} ชนะ {score}', en: '{t1} to win {score}' },
  editBtn: { th: '✏️ ป้อนสกอร์ผลแข่งขันเอง', en: '✏️ Edit Score Manually' },
  saveBtn: { th: '💾 บันทึกผล', en: '💾 Save Score' },
  cancelBtn: { th: 'ยกเลิก', en: 'Cancel' },
  inputScoreAlert: { th: 'กรุณากรอกสกอร์คะแนนเป็นตัวเลขศูนย์ขึ้นไป', en: 'Please enter valid positive score integers.' },
  koTitle: { th: '🏆 สายการแข่งขันรอบน็อกเอาต์ฟุตบอลโลก 2026 (Knockout Simulator)', en: '🏆 Interactive World Cup Knockout Stage Bracket' },
  koSub: { th: 'คลิกชื่อทีมเพื่อทำนายผลเข้ารอบถัดไป', en: 'Click on a team to advance them through the rounds' },
  koR32: { th: 'รอบ 32 ทีม', en: 'Round of 32' },
  koR16: { th: 'รอบ 16 ทีม', en: 'Round of 16' },
  koQf: { th: 'รอบ 8 ทีม', en: 'Quarterfinals' },
  koSf: { th: 'รอบรองชนะเลิศ', en: 'Semifinals' },
  koFinal: { th: 'รอบชิงชนะเลิศ', en: 'Final' },
  koChampion: { th: 'แชมป์ฟุตบอลโลก 2026', en: '2026 World Champion' },
  koWait: { th: 'รอทำนายผล...', en: 'Awaiting predictions...' },
  simStopMsg: { th: '⏸️ หยุดจำลอง', en: '⏸️ Pause' },
  simStartMsg: { th: '▶️ เริ่มจำลอง', en: '▶️ Simulate' },
  autoUpdateOff: { th: 'ปิดอัปเดตอัตโนมัติ (Manual)', en: 'Disable Auto Update' },
  autoUpdateHour: { th: 'ทุก {h} ชั่วโมง', en: 'Every {h} hour(s)' },
  manualRefresh: { th: '↻ รีเฟรชข้อมูล', en: '↻ Refresh' },
  leaderboardTab: { th: '🏆 คะแนนทายผล', en: '🏆 Predictor League' },
  friendLeaderboardTitle: { th: '🏆 ตารางคะแนนทายผลของกลุ่มเพื่อน (Leaderboard)', en: '🏆 Friends Prediction Leaderboard' },
  registerLabel: { th: 'ป้อนชื่อเล่นของคุณเพื่อทายผลและสะสมคะแนน:', en: 'Enter your name to start predicting & earning points:' },
  registerBtn: { th: 'บันทึกชื่อ', en: 'Save Name' },
  changeUserBtn: { th: 'เปลี่ยนชื่อ', en: 'Change Name' },
  userWelcome: { th: 'ผู้เล่น: {name} (ทายผลไปแล้ว)', en: 'Player: {name} (Predictions active)' },
  lbRank: { th: 'อันดับ', en: 'Rank' },
  lbName: { th: 'ชื่อผู้เล่น', en: 'Player Name' },
  lbExact: { th: 'ทายสกอร์ตรงเป๊ะ (3 แต้ม)', en: 'Exact Score (3 pts)' },
  lbOutcome: { th: 'ทายชนะ/แพ้ถูก (1 แต้ม)', en: 'Correct Outcome (1 pt)' },
  lbPoints: { th: 'คะแนนรวม', en: 'Total Points' },
  noLbData: { th: 'ยังไม่มีข้อมูลคะแนนทำนายผลในขณะนี้', en: 'No prediction scores recorded yet.' },
  predictTitle: { th: '🔮 ทำนายผลสกอร์คู่นี้', en: '🔮 Predict Match Score' },
  predictBtn: { th: '🔮 บันทึกคำทายผล', en: '🔮 Submit Prediction' },
  predictTooltip: { th: 'ทายผลสกอร์คู่นี้ล่วงหน้า', en: 'Predict the score of this match' },
  predictionShow: { th: 'คุณทายผลไว้: {t1} {score1} - {score2} {t2}', en: 'Your prediction: {t1} {score1} - {score2} {t2}' },
  exportBracketBtn: { th: '📸 เซฟรูปภาพผังสายแข่ง (PNG)', en: '📸 Export Bracket to PNG' },
  goalAlertTitle: { th: '⚽ ได้ประตู! (GOAL!)', en: '⚽ GOAL!' }
};

export const translateTeam = (name: string, lang: LangType): string => {
  if (lang === 'th') return name;
  return TEAM_TRANSLATIONS[name] || name;
};

export const translateVenue = (name: string, lang: LangType): string => {
  if (lang === 'th') return name;
  return VENUE_TRANSLATIONS[name] || name;
};

export const t = (key: keyof typeof UI_TRANSLATIONS, lang: LangType): string => {
  return UI_TRANSLATIONS[key]?.[lang] || '';
};

export const translateTickerText = (text: string, lang: LangType): string => {
  if (lang === 'th') return text;
  
  let translated = text;
  
  if (translated.includes('ประตู!')) {
    translated = translated
      .replace('ประตู!', 'Goal!')
      .replace('ขึ้นนำ/ได้ประตูเพิ่ม', 'scores')
      .replace('โดย', 'by')
      .replace('(นาทีที่', '(Min');
  } else if (translated.includes('ใบเหลือง!')) {
    translated = translated
      .replace('ใบเหลือง!', 'Yellow Card!')
      .replace('ได้รับใบเหลือง', 'receives a yellow card')
      .replace('(นาทีที่', '(Min');
  } else if (translated.includes('ใบแดง!')) {
    translated = translated
      .replace('ใบแดง!', 'Red Card!')
      .replace('ได้รับใบแดงไล่ออกจากสนาม!', 'is sent off!')
      .replace('(นาทีที่', '(Min');
  } else if (translated === 'การจำลองแมตช์สดเสร็จสิ้นลงแล้ว (ทุกคู่แข่งขันครบ 90 นาที)') {
    return 'Match simulation completed (all matches played 90 minutes).';
  }

  // Translate team names
  for (const thTeam of Object.keys(TEAM_TRANSLATIONS)) {
    if (translated.includes(thTeam)) {
      translated = translated.replaceAll(thTeam, TEAM_TRANSLATIONS[thTeam]);
    }
  }

  return translated;
};

