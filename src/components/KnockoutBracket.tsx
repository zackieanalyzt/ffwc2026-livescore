import React, { useState } from 'react';
import { getTeamFlag } from '../utils/flags';
import { t, translateTeam } from '../utils/translations';
import type { LangType } from '../utils/translations';

interface TeamStanding {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  form: ('W' | 'D' | 'L')[];
}

interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  fouls: [number, number];
  corners: [number, number];
  offsides: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

interface MatchEvent {
  type: 'GOAL' | 'PENALTY' | 'OWN' | 'YELLOW' | 'RED';
  minute: number;
  team: string;
  player: string;
}

interface Match {
  id: number;
  group: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  penalty1?: number;
  penalty2?: number;
  status: 'FINISHED' | 'LIVE' | 'SCHEDULED';
  minute: number;
  date: string;
  venue: string;
  events: MatchEvent[];
  stats: MatchStats;
}

interface KnockoutBracketProps {
  standings: Record<string, TeamStanding[]>;
  lang: LangType;
  matches?: Match[];
}

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ standings, lang, matches }) => {
  // บันทึกสถานะผู้ชนะที่ยูสเซอร์เลือกคลิกให้เข้ารอบในแต่ละแมตช์
  // Key: matchId (เช่น 'R32_1', 'R16_1', 'QF_1') -> Value: ชื่อประเทศที่ชนะ
  const [winners, setWinners] = useState<Record<string, string>>({});
  const [prevStandings, setPrevStandings] = useState<Record<string, TeamStanding[]>>(standings);

  // ล้างค่าทำนายผลเมื่อตารางคะแนนกลุ่มเปลี่ยนแปลง
  if (standings !== prevStandings) {
    setWinners({});
    setPrevStandings(standings);
  }

  // ฟังก์ชันคำนวณหาว่าประเทศนี้มาจากกลุ่มใดและอันดับใด
  const getTeamOriginString = (teamName: string): string => {
    if (!teamName || teamName.includes('ผู้ชนะ') || teamName.includes('อันดับ') || teamName.includes('Winner') || teamName.includes('Runner-up') || teamName.includes('Best 3rd')) {
      return '';
    }
    for (const [group, teams] of Object.entries(standings)) {
      const idx = teams.findIndex(t => t.team === teamName);
      if (idx !== -1) {
        return ` (${group}${idx + 1})`;
      }
    }
    return '';
  };

  // ฟังก์ชันแสดงวันที่แข่งขันของแต่ละแมตช์รอบน็อกเอาต์
  const getMatchDate = (matchId: string): string => {
    const dates: Record<string, { th: string; en: string }> = {
      R32_1: { th: '29 มิ.ย. 2026', en: 'Jun 29, 2026' },
      R32_2: { th: '30 มิ.ย. 2026', en: 'Jun 30, 2026' },
      R32_3: { th: '28 มิ.ย. 2026', en: 'Jun 28, 2026' },
      R32_4: { th: '29 มิ.ย. 2026', en: 'Jun 29, 2026' },
      R32_5: { th: '2 ก.ค. 2026', en: 'Jul 2, 2026' },
      R32_6: { th: '2 ก.ค. 2026', en: 'Jul 2, 2026' },
      R32_7: { th: '1 ก.ค. 2026', en: 'Jul 1, 2026' },
      R32_8: { th: '1 ก.ค. 2026', en: 'Jul 1, 2026' },
      R32_9: { th: '29 มิ.ย. 2026', en: 'Jun 29, 2026' },
      R32_10: { th: '30 มิ.ย. 2026', en: 'Jun 30, 2026' },
      R32_11: { th: '30 มิ.ย. 2026', en: 'Jun 30, 2026' },
      R32_12: { th: '1 ก.ค. 2026', en: 'Jul 1, 2026' },
      R32_13: { th: '3 ก.ค. 2026', en: 'Jul 3, 2026' },
      R32_14: { th: '3 ก.ค. 2026', en: 'Jul 3, 2026' },
      R32_15: { th: '2 ก.ค. 2026', en: 'Jul 2, 2026' },
      R32_16: { th: '3 ก.ค. 2026', en: 'Jul 3, 2026' },
      
      R16_1: { th: '4 ก.ค. 2026', en: 'Jul 4, 2026' },
      R16_2: { th: '4 ก.ค. 2026', en: 'Jul 4, 2026' },
      R16_3: { th: '5 ก.ค. 2026', en: 'Jul 5, 2026' },
      R16_4: { th: '5 ก.ค. 2026', en: 'Jul 5, 2026' },
      R16_5: { th: '6 ก.ค. 2026', en: 'Jul 6, 2026' },
      R16_6: { th: '6 ก.ค. 2026', en: 'Jul 6, 2026' },
      R16_7: { th: '7 ก.ค. 2026', en: 'Jul 7, 2026' },
      R16_8: { th: '7 ก.ค. 2026', en: 'Jul 7, 2026' },
      
      QF_1: { th: '9 ก.ค. 2026', en: 'Jul 9, 2026' },
      QF_2: { th: '10 ก.ค. 2026', en: 'Jul 10, 2026' },
      QF_3: { th: '11 ก.ค. 2026', en: 'Jul 11, 2026' },
      QF_4: { th: '11 ก.ค. 2026', en: 'Jul 11, 2026' },
      
      SF_1: { th: '14 ก.ค. 2026', en: 'Jul 14, 2026' },
      SF_2: { th: '15 ก.ค. 2026', en: 'Jul 15, 2026' },
      
      FINAL: { th: '19 ก.ค. 2026', en: 'Jul 19, 2026' }
    };
    return dates[matchId]?.[lang] || '';
  };

  // ฟังก์ชันแปลข้อความ Placeholder เป็นภาษาอังกฤษ
  const translatePlaceholder = (text: string): string => {
    if (lang === 'th') return text;
    if (text.startsWith('อันดับ 1 กลุ่ม')) {
      const group = text.replace('อันดับ 1 กลุ่ม', '').trim();
      return `Winner Group ${group}`;
    }
    if (text.startsWith('อันดับ 2 กลุ่ม')) {
      const group = text.replace('อันดับ 2 กลุ่ม', '').trim();
      return `Runner-up Group ${group}`;
    }
    if (text.startsWith('อันดับ 3 กลุ่ม')) {
      const group = text.replace('อันดับ 3 กลุ่ม', '').trim();
      return `3rd Group ${group}`;
    }
    if (text.startsWith('ผู้ชนะคู่ที่')) {
      const num = text.replace('ผู้ชนะคู่ที่', '').trim();
      return `Winner Match ${num}`;
    }
    return text;
  };

  // 1. ดึงข้อมูลทีมเข้ารอบแรกจากตารางคะแนนล่าสุด
  const getGroupWinner = (g: string) => standings[g]?.[0]?.team || `อันดับ 1 กลุ่ม ${g}`;
  const getGroupRunnerUp = (g: string) => standings[g]?.[1]?.team || `อันดับ 2 กลุ่ม ${g}`;

  // 2. ดึง 8 ทีมอันดับ 3 ที่ดีที่สุดจาก 12 กลุ่ม
  const getBestThirdPlaced = () => {
    const thirdsList = Object.entries(standings)
      .map(([group, teams]) => ({ group, teamData: teams[2] }))
      .filter(item => item.teamData && item.teamData.played > 0)
      .sort((a, b) => {
        if (b.teamData.pts !== a.teamData.pts) return b.teamData.pts - a.teamData.pts;
        if (b.teamData.gd !== a.teamData.gd) return b.teamData.gd - a.teamData.gd;
        return b.teamData.gf - a.teamData.gf;
      });

    const best8 = [];
    for (let i = 0; i < 8; i++) {
      best8.push(thirdsList[i]?.teamData.team || `อันดับ 3 ดีเด่น #${i + 1}`);
    }
    return best8;
  };

  const thirds = getBestThirdPlaced();

  // ดึงทีมจากรายการแมตช์จริง (สำหรับรอบน็อกเอาต์ 32 ทีม)
  const getR32Teams = (idNum: number, fallbackT1: string, fallbackT2: string) => {
    const match = matches?.find(m => m.id === idNum);
    return {
      t1: match && match.team1 ? match.team1 : fallbackT1,
      t2: match && match.team2 ? match.team2 : fallbackT2,
      score1: match?.score1,
      score2: match?.score2,
      penalty1: match?.penalty1,
      penalty2: match?.penalty2,
      status: match?.status || 'SCHEDULED'
    };
  };

  // กำหนดคู่แข่งรอบ 32 ทีมสุดท้ายตามผัง (ตรงตามสายแข่งขันจริง FIFA World Cup 2026)
  const r32Matches = [
    { id: 'R32_1', apiId: 74, ...getR32Teams(74, getGroupWinner('E'), thirds[6]) },
    { id: 'R32_2', apiId: 77, ...getR32Teams(77, getGroupWinner('I'), thirds[5]) },
    { id: 'R32_3', apiId: 73, ...getR32Teams(73, getGroupRunnerUp('A'), getGroupRunnerUp('B')) },
    { id: 'R32_4', apiId: 75, ...getR32Teams(75, getGroupWinner('F'), getGroupRunnerUp('C')) },
    { id: 'R32_5', apiId: 83, ...getR32Teams(83, getGroupRunnerUp('K'), getGroupRunnerUp('L')) },
    { id: 'R32_6', apiId: 84, ...getR32Teams(84, getGroupWinner('H'), getGroupRunnerUp('J')) },
    { id: 'R32_7', apiId: 81, ...getR32Teams(81, getGroupWinner('D'), thirds[3]) },
    { id: 'R32_8', apiId: 82, ...getR32Teams(82, getGroupWinner('G'), thirds[4]) },
    { id: 'R32_9', apiId: 76, ...getR32Teams(76, getGroupWinner('C'), getGroupRunnerUp('F')) },
    { id: 'R32_10', apiId: 78, ...getR32Teams(78, getGroupRunnerUp('E'), getGroupRunnerUp('I')) },
    { id: 'R32_11', apiId: 79, ...getR32Teams(79, getGroupWinner('A'), thirds[0]) },
    { id: 'R32_12', apiId: 80, ...getR32Teams(80, getGroupWinner('L'), thirds[7]) },
    { id: 'R32_13', apiId: 86, ...getR32Teams(86, getGroupWinner('J'), getGroupRunnerUp('H')) },
    { id: 'R32_14', apiId: 88, ...getR32Teams(88, getGroupRunnerUp('D'), getGroupRunnerUp('G')) },
    { id: 'R32_15', apiId: 85, ...getR32Teams(85, getGroupWinner('B'), thirds[1]) },
    { id: 'R32_16', apiId: 87, ...getR32Teams(87, getGroupWinner('K'), thirds[2]) }
  ];

  // ดึงคู่น็อกเอาต์ในรอบลึก (ดึงค่าจริงจาก API หากยืนยันทีมแล้ว หรือดึงค่าคำทำนาย)
  const getKnockoutTeams = (
    idNum: number, 
    prevMatch1Id: string, 
    prevMatch2Id: string, 
    fallbackLabel1: string, 
    fallbackLabel2: string
  ) => {
    const match = matches?.find(m => m.id === idNum);
    
    // ตรวจสอบว่าคู่แข่งขันเป็นทีมประเทศจริง (ไม่ใช่ Label Placeholder เช่น Winner Match หรือ 3rd Group)
    const hasActualTeam1 = match && match.team1 && !match.team1.includes('ผู้ชนะ') && !match.team1.includes('อันดับ') && !match.team1.includes('Winner') && !match.team1.includes('Runner-up') && !match.team1.includes('Best 3rd');
    const hasActualTeam2 = match && match.team2 && !match.team2.includes('ผู้ชนะ') && !match.team2.includes('อันดับ') && !match.team2.includes('Winner') && !match.team2.includes('Runner-up') && !match.team2.includes('Best 3rd');
    
    const fallbackT1 = getWinnerOf(prevMatch1Id, fallbackLabel1);
    const fallbackT2 = getWinnerOf(prevMatch2Id, fallbackLabel2);

    return {
      t1: hasActualTeam1 ? match!.team1 : fallbackT1,
      t2: hasActualTeam2 ? match!.team2 : fallbackT2,
      score1: match?.score1,
      score2: match?.score2,
      penalty1: match?.penalty1,
      penalty2: match?.penalty2,
      status: match?.status || 'SCHEDULED'
    };
  };

  // คำนวณผู้ชนะในแต่ละแมตช์ที่แข่งเสร็จสิ้นแล้วจริง
  const getWinnerOfMatch = (match: Match) => {
    if (!match || match.status !== 'FINISHED') return undefined;
    if (match.score1 > match.score2) return match.team1;
    if (match.score2 > match.score1) return match.team2;
    if (match.penalty1 !== undefined && match.penalty2 !== undefined) {
      if (match.penalty1 > match.penalty2) return match.team1;
      if (match.penalty2 > match.penalty1) return match.team2;
    }
    return undefined;
  };

  // ค้นหาผู้ชนะสะสมของน็อกเอาต์จากคู่แข่งขันจริงที่จบแล้ว
  const getRealWinners = () => {
    const real: Record<string, string> = {};
    
    // R32
    r32Matches.forEach(m => {
      const match = matches?.find(x => x.id === m.apiId);
      if (match) {
        const w = getWinnerOfMatch(match);
        if (w) real[m.id] = w;
      }
    });

    // ลูปจำลองหาผู้ชนะของรอบลึกเพื่อใช้อัปเดต UI อัตโนมัติหากแมตช์จบแล้วจริง
    const allRounds = [
      { id: 89, kId: 'R16_1' }, { id: 90, kId: 'R16_2' }, { id: 93, kId: 'R16_3' }, { id: 94, kId: 'R16_4' },
      { id: 91, kId: 'R16_5' }, { id: 92, kId: 'R16_6' }, { id: 95, kId: 'R16_7' }, { id: 96, kId: 'R16_8' },
      { id: 97, kId: 'QF_1' }, { id: 98, kId: 'QF_2' }, { id: 99, kId: 'QF_3' }, { id: 100, kId: 'QF_4' },
      { id: 101, kId: 'SF_1' }, { id: 102, kId: 'SF_2' }, { id: 104, kId: 'FINAL' }
    ];

    allRounds.forEach(r => {
      const match = matches?.find(x => x.id === r.id);
      if (match) {
        const w = getWinnerOfMatch(match);
        if (w) real[r.kId] = w;
      }
    });

    return real;
  };

  const realWinners = getRealWinners();
  // รวมผู้ชนะจริงกับผลทำนาย (ถ้าแมตช์จริงมีผู้ชนะแล้ว จะเอาผลจริงก่อน)
  const activeWinners = { ...realWinners, ...winners };

  const getWinnerOf = (matchId: string, fallbackText: string) => {
    return activeWinners[matchId] || fallbackText;
  };

  const r16Matches = [
    { id: 'R16_1', apiId: 89, ...getKnockoutTeams(89, 'R32_1', 'R32_2', lang === 'th' ? 'ผู้ชนะคู่ที่ 1' : 'Winner Match 1', lang === 'th' ? 'ผู้ชนะคู่ที่ 2' : 'Winner Match 2') },
    { id: 'R16_2', apiId: 90, ...getKnockoutTeams(90, 'R32_3', 'R32_4', lang === 'th' ? 'ผู้ชนะคู่ที่ 3' : 'Winner Match 3', lang === 'th' ? 'ผู้ชนะคู่ที่ 4' : 'Winner Match 4') },
    { id: 'R16_3', apiId: 93, ...getKnockoutTeams(93, 'R32_5', 'R32_6', lang === 'th' ? 'ผู้ชนะคู่ที่ 5' : 'Winner Match 5', lang === 'th' ? 'ผู้ชนะคู่ที่ 6' : 'Winner Match 6') },
    { id: 'R16_4', apiId: 94, ...getKnockoutTeams(94, 'R32_7', 'R32_8', lang === 'th' ? 'ผู้ชนะคู่ที่ 7' : 'Winner Match 7', lang === 'th' ? 'ผู้ชนะคู่ที่ 8' : 'Winner Match 8') },
    { id: 'R16_5', apiId: 91, ...getKnockoutTeams(91, 'R32_9', 'R32_10', lang === 'th' ? 'ผู้ชนะคู่ที่ 9' : 'Winner Match 9', lang === 'th' ? 'ผู้ชนะคู่ที่ 10' : 'Winner Match 10') },
    { id: 'R16_6', apiId: 92, ...getKnockoutTeams(92, 'R32_11', 'R32_12', lang === 'th' ? 'ผู้ชนะคู่ที่ 11' : 'Winner Match 11', lang === 'th' ? 'ผู้ชนะคู่ที่ 12' : 'Winner Match 12') },
    { id: 'R16_7', apiId: 95, ...getKnockoutTeams(95, 'R32_13', 'R32_14', lang === 'th' ? 'ผู้ชนะคู่ที่ 13' : 'Winner Match 13', lang === 'th' ? 'ผู้ชนะคู่ที่ 14' : 'Winner Match 14') },
    { id: 'R16_8', apiId: 96, ...getKnockoutTeams(96, 'R32_15', 'R32_16', lang === 'th' ? 'ผู้ชนะคู่ที่ 15' : 'Winner Match 15', lang === 'th' ? 'ผู้ชนะคู่ที่ 16' : 'Winner Match 16') }
  ];

  // รอบ 8 ทีมสุดท้าย (Quarterfinals)
  const qfMatches = [
    { id: 'QF_1', apiId: 97, ...getKnockoutTeams(97, 'R16_1', 'R16_2', lang === 'th' ? 'ผู้ชนะคู่ที่ 17' : 'Winner Match 17', lang === 'th' ? 'ผู้ชนะคู่ที่ 18' : 'Winner Match 18') },
    { id: 'QF_2', apiId: 98, ...getKnockoutTeams(98, 'R16_3', 'R16_4', lang === 'th' ? 'ผู้ชนะคู่ที่ 19' : 'Winner Match 19', lang === 'th' ? 'ผู้ชนะคู่ที่ 20' : 'Winner Match 20') },
    { id: 'QF_3', apiId: 99, ...getKnockoutTeams(99, 'R16_5', 'R16_6', lang === 'th' ? 'ผู้ชนะคู่ที่ 21' : 'Winner Match 21', lang === 'th' ? 'ผู้ชนะคู่ที่ 22' : 'Winner Match 22') },
    { id: 'QF_4', apiId: 100, ...getKnockoutTeams(100, 'R16_7', 'R16_8', lang === 'th' ? 'ผู้ชนะคู่ที่ 23' : 'Winner Match 23', lang === 'th' ? 'ผู้ชนะคู่ที่ 24' : 'Winner Match 24') }
  ];

  // รอบรองชนะเลิศ (Semifinals)
  const sfMatches = [
    { id: 'SF_1', apiId: 101, ...getKnockoutTeams(101, 'QF_1', 'QF_2', lang === 'th' ? 'ผู้ชนะคู่ที่ 25' : 'Winner Match 25', lang === 'th' ? 'ผู้ชนะคู่ที่ 26' : 'Winner Match 26') },
    { id: 'SF_2', apiId: 102, ...getKnockoutTeams(102, 'QF_3', 'QF_4', lang === 'th' ? 'ผู้ชนะคู่ที่ 27' : 'Winner Match 27', lang === 'th' ? 'ผู้ชนะคู่ที่ 28' : 'Winner Match 28') }
  ];

  // รอบชิงชนะเลิศ (Final)
  const finalMatch = { 
    id: 'FINAL', 
    apiId: 104,
    ...getKnockoutTeams(104, 'SF_1', 'SF_2', lang === 'th' ? 'ผู้ชนะคู่ที่ 29' : 'Winner Match 29', lang === 'th' ? 'ผู้ชนะคู่ที่ 30' : 'Winner Match 30') 
  };

  const champion = activeWinners['FINAL'];

  // ฟังก์ชันสลับเลือกผู้ชนะ
  const handleSelectWinner = (matchId: string, teamName: string) => {
    // ป้องกันการเลือกตัวหนังสือ Placeholder หรือคู่ที่แข่งจบจริงแล้ว
    if (
      teamName.includes('ผู้ชนะ') || 
      teamName.includes('อันดับ') || 
      teamName.includes('Winner') || 
      teamName.includes('Runner-up') || 
      teamName.includes('Best 3rd') ||
      realWinners[matchId] !== undefined
    ) return;
    
    setWinners(prev => {
      const next = { ...prev, [matchId]: teamName };
      
      // ล้างค่าทำนายสายเข้ารอบลึกถัดไป หากเราเปลี่ยนทีมชนะในรอบก่อนหน้า
      const cleanDownstream = (mid: string) => {
        if (mid.startsWith('R32')) {
          // หาคู่ 16 ทีมที่คู่ R32 นี้ส่งผล
          const r16Index = Math.floor(parseInt(mid.split('_')[1]) / 2.1); // 1,2 -> 1; 3,4 -> 2...
          const r16Id = `R16_${r16Index + 1}`;
          delete next[r16Id];
          cleanDownstream(r16Id);
        } else if (mid.startsWith('R16')) {
          const qfIndex = Math.floor(parseInt(mid.split('_')[1]) / 2.1);
          const qfId = `QF_${qfIndex + 1}`;
          delete next[qfId];
          cleanDownstream(qfId);
        } else if (mid.startsWith('QF')) {
          const sfIndex = Math.floor(parseInt(mid.split('_')[1]) / 2.1);
          const sfId = `SF_${sfIndex + 1}`;
          delete next[sfId];
          cleanDownstream(sfId);
        } else if (mid.startsWith('SF')) {
          delete next['FINAL'];
          delete next['CHAMPION'];
        }
      };
      
      cleanDownstream(matchId);
      return next;
    });
  };

  // ฟังก์ชันดาวน์โหลดภาพทำนายผลรอบน็อกเอาต์แบบ Canvas
  const handleExportBracket = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 650;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. วาดภาพพื้นหลังไล่สี
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0b0f19');
    grad.addColorStop(1, '#020408');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ตารางพื้นหลัง
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // 2. เขียนหัวข้อภาพ
    ctx.fillStyle = '#e5b323'; 
    ctx.font = 'bold 24px "Inter", "Helvetica", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(lang === 'th' ? '🏆 ผลทำนายรอบน็อกเอาต์ ฟุตบอลโลก 2026' : '🏆 World Cup 2026 Knockout Predictions', canvas.width / 2, 55);

    ctx.fillStyle = '#94a3b8'; 
    ctx.font = '13px "Inter", sans-serif';
    ctx.fillText(lang === 'th' ? 'จัดทำโดย แดชบอร์ด FIFA World Cup 2026 LiveScore' : 'Generated by FIFA World Cup 2026 LiveScore Dashboard', canvas.width / 2, 85);

    // ตำแหน่งจัดวางแบบจำลอง QF -> SF -> Final
    const qfLeft = 110;
    const qfRight = 890;
    const sfLeft = 320;
    const sfRight = 680;
    const finalX = 500;

    const drawNode = (teamName: string, x: number, y: number, width = 160, height = 40) => {
      const isPlaceholder = teamName.includes('ผู้ชนะ') || teamName.includes('อันดับ') || teamName.includes('Winner') || teamName.includes('Runner-up') || teamName.includes('Best 3rd');
      
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = isPlaceholder ? 'rgba(255, 255, 255, 0.08)' : '#06b6d4'; 
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x - width / 2, y - height / 2, width, height, 8);
      } else {
        ctx.rect(x - width / 2, y - height / 2, width, height);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isPlaceholder ? '#64748b' : '#ffffff';
      ctx.font = 'bold 12px "Inter", "Helvetica", sans-serif';
      ctx.textAlign = 'left';
      
      let flag = '🏳️';
      let displayName: string;
      if (!isPlaceholder) {
        flag = getTeamFlag(teamName);
        displayName = `${translateTeam(teamName, lang)}${getTeamOriginString(teamName)}`;
      } else {
        displayName = translatePlaceholder(teamName);
      }

      ctx.fillText(`${flag}  ${displayName}`, x - width / 2 + 12, y + 4);
    };

    // เส้นเชื่อมต่อ
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.lineWidth = 2;

    // เส้นเชื่อมทางซ้าย
    ctx.beginPath();
    ctx.moveTo(qfLeft + 80, 160); ctx.lineTo(sfLeft - 80, 240);
    ctx.moveTo(qfLeft + 80, 320); ctx.lineTo(sfLeft - 80, 240);
    
    ctx.moveTo(qfLeft + 80, 400); ctx.lineTo(sfLeft - 80, 480);
    ctx.moveTo(qfLeft + 80, 560); ctx.lineTo(sfLeft - 80, 480);

    // เส้นเชื่อมทางขวา
    ctx.moveTo(qfRight - 80, 160); ctx.lineTo(sfRight + 80, 240);
    ctx.moveTo(qfRight - 80, 320); ctx.lineTo(sfRight + 80, 240);
    
    ctx.moveTo(qfRight - 80, 400); ctx.lineTo(sfRight + 80, 480);
    ctx.moveTo(qfRight - 80, 560); ctx.lineTo(sfRight + 80, 480);

    // เส้นเชื่อม SF เข้าชิง
    ctx.moveTo(sfLeft + 80, 240); ctx.lineTo(finalX - 90, 340);
    ctx.moveTo(sfLeft + 80, 480); ctx.lineTo(finalX - 90, 340);
    
    ctx.moveTo(sfRight - 80, 240); ctx.lineTo(finalX + 90, 340);
    ctx.moveTo(sfRight - 80, 480); ctx.lineTo(finalX + 90, 340);
    ctx.stroke();

    // วาดการ์ดรอบ 8 ทีม
    drawNode(qfMatches[0].t1, qfLeft, 160);
    drawNode(qfMatches[0].t2, qfLeft, 320);
    drawNode(qfMatches[1].t1, qfLeft, 400);
    drawNode(qfMatches[1].t2, qfLeft, 560);

    drawNode(qfMatches[2].t1, qfRight, 160);
    drawNode(qfMatches[2].t2, qfRight, 320);
    drawNode(qfMatches[3].t1, qfRight, 400);
    drawNode(qfMatches[3].t2, qfRight, 560);

    // วาดการ์ดรอบรองชนะเลิศ
    drawNode(sfMatches[0].t1, sfLeft, 240);
    drawNode(sfMatches[0].t2, sfLeft, 480);
    drawNode(sfMatches[1].t1, sfRight, 240);
    drawNode(sfMatches[1].t2, sfRight, 480);

    // วาดชิงชนะเลิศ
    drawNode(finalMatch.t1, finalX - 90, 340);
    drawNode(finalMatch.t2, finalX + 90, 340);

    // วาดกรอบถ้วยแชมป์
    ctx.fillStyle = 'rgba(229, 179, 35, 0.06)';
    ctx.strokeStyle = '#e5b323';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(finalX - 90, 430, 180, 150, 16);
    } else {
      ctx.rect(finalX - 90, 430, 180, 150);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e5b323';
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆', finalX, 485);

    ctx.font = 'bold 10px "Inter", sans-serif';
    ctx.fillText(lang === 'th' ? 'แชมป์ฟุตบอลโลก 2026' : '2026 WORLD CHAMPION', finalX, 515);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Inter", sans-serif';
    if (champion) {
      const cFlag = getTeamFlag(champion);
      const cName = `${translateTeam(champion, lang)}${getTeamOriginString(champion)}`;
      ctx.fillText(`${cFlag} ${cName}`, finalX, 545);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.fillText(lang === 'th' ? 'รอทำนายผล...' : 'Awaiting Predictions...', finalX, 545);
    }

    // ทำการดาวน์โหลด
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `worldcup_prediction_${lang}.png`;
    link.href = dataUrl;
    link.click();
  };

  const renderMatchCard = (match: { id: string; t1: string; t2: string; score1?: number; score2?: number; penalty1?: number; penalty2?: number; status?: string }) => {
    const isT1Winner = activeWinners[match.id] === match.t1 && match.t1 !== '';
    const isT2Winner = activeWinners[match.id] === match.t2 && match.t2 !== '';
    
    const isT1Placeholder = match.t1.includes('อันดับ') || match.t1.includes('ผู้ชนะ');
    const isT2Placeholder = match.t2.includes('อันดับ') || match.t2.includes('ผู้ชนะ');

    const hasFinished = match.status === 'FINISHED';
    const isClickable = !hasFinished;

    return (
      <div key={match.id} className="bracket-match-card" style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '0.6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        fontSize: '0.8rem',
        width: '180px',
        position: 'relative',
        boxShadow: activeWinners[match.id] ? '0 0 10px rgba(6,182,212,0.05)' : 'none'
      }}>
        {/* หัวการ์ดแสดงรอบและวันที่แข่ง */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.2rem', marginBottom: '0.1rem' }}>
          <span style={{ fontWeight: '600' }}>{match.id.replace('_', ' ')}</span>
          <span style={{ color: 'var(--cyan)' }}>{getMatchDate(match.id)}</span>
        </div>

        {/* ทีม 1 */}
        <div 
          onClick={() => isClickable && handleSelectWinner(match.id, match.t1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.35rem 0.5rem',
            borderRadius: '4px',
            cursor: (isT1Placeholder || hasFinished) ? 'default' : 'pointer',
            background: isT1Winner ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: isT1Winner ? '1px solid var(--green)' : '1px solid transparent',
            fontWeight: isT1Winner ? '700' : 'normal',
            transition: 'all 0.2s',
            color: isT1Placeholder ? 'var(--text-muted)' : '#fff'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {!isT1Placeholder && <span style={{ fontSize: '1.1rem' }}>{getTeamFlag(match.t1)}</span>}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{isT1Placeholder ? translatePlaceholder(match.t1) : `${translateTeam(match.t1, lang)}${getTeamOriginString(match.t1)}`}</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {hasFinished && match.score1 !== undefined && (
              <span style={{ fontWeight: '800', fontSize: '0.9rem', color: isT1Winner ? 'var(--green)' : 'var(--text-muted)' }}>
                {match.score1}
                {match.penalty1 !== undefined && match.penalty2 !== undefined && ` (${match.penalty1})`}
              </span>
            )}
            {isT1Winner && <span style={{ color: 'var(--green)', fontSize: '0.75rem' }}>✓</span>}
          </div>
        </div>

        {/* ทีม 2 */}
        <div 
          onClick={() => isClickable && handleSelectWinner(match.id, match.t2)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.35rem 0.5rem',
            borderRadius: '4px',
            cursor: (isT2Placeholder || hasFinished) ? 'default' : 'pointer',
            background: isT2Winner ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: isT2Winner ? '1px solid var(--green)' : '1px solid transparent',
            fontWeight: isT2Winner ? '700' : 'normal',
            transition: 'all 0.2s',
            color: isT2Placeholder ? 'var(--text-muted)' : '#fff'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {!isT2Placeholder && <span style={{ fontSize: '1.1rem' }}>{getTeamFlag(match.t2)}</span>}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{isT2Placeholder ? translatePlaceholder(match.t2) : `${translateTeam(match.t2, lang)}${getTeamOriginString(match.t2)}`}</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {hasFinished && match.score2 !== undefined && (
              <span style={{ fontWeight: '800', fontSize: '0.9rem', color: isT2Winner ? 'var(--green)' : 'var(--text-muted)' }}>
                {match.score2}
                {match.penalty1 !== undefined && match.penalty2 !== undefined && ` (${match.penalty2})`}
              </span>
            )}
            {isT2Winner && <span style={{ color: 'var(--green)', fontSize: '0.75rem' }}>✓</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-card" style={{ overflowX: 'auto' }}>
      <div className="card-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="card-title">{t('koTitle', lang)}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('koSub', lang)}</span>
        </div>
        <button 
          className="btn"
          onClick={handleExportBracket}
          style={{ borderColor: 'var(--gold)', color: 'var(--gold)', padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: '600' }}
        >
          {t('exportBracketBtn', lang)}
        </button>
      </div>

      <div style={{ padding: '0.5rem 0', display: 'flex', gap: '1.5rem', minWidth: '1050px', justifyContent: 'space-between', alignItems: 'stretch' }}>
        
        {/* รอบ 32 ทีม */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-around' }}>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--gold)', textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.3rem' }}>
            {t('koR32', lang)}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {r32Matches.slice(0, 8).map(renderMatchCard)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
            {r32Matches.slice(8, 16).map(renderMatchCard)}
          </div>
        </div>

        {/* รอบ 16 ทีม */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-around' }}>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--gold)', textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.3rem' }}>
            {t('koR16', lang)}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {r16Matches.slice(0, 4).map(renderMatchCard)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
            {r16Matches.slice(4, 8).map(renderMatchCard)}
          </div>
        </div>

        {/* รอบ 8 ทีมสุดท้าย */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-around' }}>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--gold)', textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.3rem' }}>
            {t('koQf', lang)}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5.5rem' }}>
            {qfMatches.slice(0, 2).map(renderMatchCard)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5.5rem', marginTop: '1rem' }}>
            {qfMatches.slice(2, 4).map(renderMatchCard)}
          </div>
        </div>

        {/* รอบรองชนะเลิศ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-around' }}>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--gold)', textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.3rem' }}>
            {t('koSf', lang)}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12rem' }}>
            {sfMatches.map(renderMatchCard)}
          </div>
        </div>

        {/* รอบชิงชนะเลิศ & แชมป์ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-around', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--gold)', textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.3rem', width: '100%' }}>
            {t('koFinal', lang)}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            {renderMatchCard(finalMatch)}
            
            {/* โซนแสดงถ้วยรางวัลผู้ชนะเลิศ */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(229,179,35,0.1) 0%, rgba(3,7,18,0.5) 100%)',
              border: '2px dashed var(--gold)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '180px',
              textAlign: 'center',
              boxShadow: champion ? '0 0 20px var(--gold-glow)' : 'none'
            }}>
              <span style={{ fontSize: '2.5rem' }}>🏆</span>
              <div style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
                {t('koChampion', lang)}
              </div>
              {champion ? (
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center' }}>
                  <span>{getTeamFlag(champion)}</span>
                  <span>{translateTeam(champion, lang)}{getTeamOriginString(champion)}</span>
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('koWait', lang)}</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
