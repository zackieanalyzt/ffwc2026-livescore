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

interface KnockoutBracketProps {
  standings: Record<string, TeamStanding[]>;
  lang: LangType;
}

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ standings, lang }) => {
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
    if (text.startsWith('อันดับ 3 ดีเด่น #')) {
      const num = text.replace('อันดับ 3 ดีเด่น #', '').trim();
      return `Best 3rd #${num}`;
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
    const thirds = Object.entries(standings)
      .map(([group, teams]) => ({ group, teamData: teams[2] }))
      .filter(item => item.teamData && item.teamData.played > 0)
      .sort((a, b) => {
        if (b.teamData.pts !== a.teamData.pts) return b.teamData.pts - a.teamData.pts;
        if (b.teamData.gd !== a.teamData.gd) return b.teamData.gd - a.teamData.gd;
        return b.teamData.gf - a.teamData.gf;
      });

    const best8 = [];
    for (let i = 0; i < 8; i++) {
      best8.push(thirds[i]?.teamData.team || `อันดับ 3 ดีเด่น #${i + 1}`);
    }
    return best8;
  };

  const thirds = getBestThirdPlaced();

  // กำหนดคู่แข่งรอบ 32 ทีมสุดท้ายตามผัง (ใช้การจำลองจับคู่แบบสมมาตร)
  const r32Matches = [
    { id: 'R32_1', t1: getGroupWinner('A'), t2: thirds[0] },
    { id: 'R32_2', t1: getGroupRunnerUp('A'), t2: getGroupRunnerUp('B') },
    { id: 'R32_3', t1: getGroupWinner('B'), t2: thirds[1] },
    { id: 'R32_4', t1: getGroupRunnerUp('C'), t2: getGroupRunnerUp('D') },
    { id: 'R32_5', t1: getGroupWinner('C'), t2: thirds[2] },
    { id: 'R32_6', t1: getGroupWinner('D'), t2: thirds[3] },
    { id: 'R32_7', t1: getGroupRunnerUp('E'), t2: getGroupRunnerUp('F') },
    { id: 'R32_8', t1: getGroupWinner('E'), t2: getGroupRunnerUp('C') },
    { id: 'R32_9', t1: getGroupWinner('F'), t2: getGroupRunnerUp('A') },
    { id: 'R32_10', t1: getGroupRunnerUp('G'), t2: getGroupRunnerUp('H') },
    { id: 'R32_11', t1: getGroupWinner('G'), t2: thirds[4] },
    { id: 'R32_12', t1: getGroupWinner('H'), t2: getGroupRunnerUp('D') },
    { id: 'R32_13', t1: getGroupWinner('I'), t2: thirds[5] },
    { id: 'R32_14', t1: getGroupRunnerUp('I'), t2: getGroupRunnerUp('J') },
    { id: 'R32_15', t1: getGroupWinner('J'), t2: getGroupRunnerUp('K') },
    { id: 'R32_16', t1: getGroupWinner('K'), t2: getGroupRunnerUp('L') }
  ];

  // คำนวณผู้เล่นในรอบ 16 ทีมจากผลรอบ 32 ทีมที่ยูสเซอร์คลิกเลือกผู้ชนะ
  const getWinnerOf = (matchId: string, fallbackText: string) => {
    return winners[matchId] || fallbackText;
  };

  const r16Matches = [
    { id: 'R16_1', t1: getWinnerOf('R32_1', lang === 'th' ? 'ผู้ชนะคู่ที่ 1' : 'ผู้ชนะคู่ที่ 1'), t2: getWinnerOf('R32_2', lang === 'th' ? 'ผู้ชนะคู่ที่ 2' : 'ผู้ชนะคู่ที่ 2') },
    { id: 'R16_2', t1: getWinnerOf('R32_3', lang === 'th' ? 'ผู้ชนะคู่ที่ 3' : 'ผู้ชนะคู่ที่ 3'), t2: getWinnerOf('R32_4', lang === 'th' ? 'ผู้ชนะคู่ที่ 4' : 'ผู้ชนะคู่ที่ 4') },
    { id: 'R16_3', t1: getWinnerOf('R32_5', lang === 'th' ? 'ผู้ชนะคู่ที่ 5' : 'ผู้ชนะคู่ที่ 5'), t2: getWinnerOf('R32_6', lang === 'th' ? 'ผู้ชนะคู่ที่ 6' : 'ผู้ชนะคู่ที่ 6') },
    { id: 'R16_4', t1: getWinnerOf('R32_7', lang === 'th' ? 'ผู้ชนะคู่ที่ 7' : 'ผู้ชนะคู่ที่ 7'), t2: getWinnerOf('R32_8', lang === 'th' ? 'ผู้ชนะคู่ที่ 8' : 'ผู้ชนะคู่ที่ 8') },
    { id: 'R16_5', t1: getWinnerOf('R32_9', lang === 'th' ? 'ผู้ชนะคู่ที่ 9' : 'ผู้ชนะคู่ที่ 9'), t2: getWinnerOf('R32_10', lang === 'th' ? 'ผู้ชนะคู่ที่ 10' : 'ผู้ชนะคู่ที่ 10') },
    { id: 'R16_6', t1: getWinnerOf('R32_11', lang === 'th' ? 'ผู้ชนะคู่ที่ 11' : 'ผู้ชนะคู่ที่ 11'), t2: getWinnerOf('R32_12', lang === 'th' ? 'ผู้ชนะคู่ที่ 12' : 'ผู้ชนะคู่ที่ 12') },
    { id: 'R16_7', t1: getWinnerOf('R32_13', lang === 'th' ? 'ผู้ชนะคู่ที่ 13' : 'ผู้ชนะคู่ที่ 13'), t2: getWinnerOf('R32_14', lang === 'th' ? 'ผู้ชนะคู่ที่ 14' : 'ผู้ชนะคู่ที่ 14') },
    { id: 'R16_8', t1: getWinnerOf('R32_15', lang === 'th' ? 'ผู้ชนะคู่ที่ 15' : 'ผู้ชนะคู่ที่ 15'), t2: getWinnerOf('R32_16', lang === 'th' ? 'ผู้ชนะคู่ที่ 16' : 'ผู้ชนะคู่ที่ 16') }
  ];

  // รอบ 8 ทีมสุดท้าย (Quarterfinals)
  const qfMatches = [
    { id: 'QF_1', t1: getWinnerOf('R16_1', lang === 'th' ? 'ผู้ชนะคู่ที่ 17' : 'ผู้ชนะคู่ที่ 17'), t2: getWinnerOf('R16_2', lang === 'th' ? 'ผู้ชนะคู่ที่ 18' : 'ผู้ชนะคู่ที่ 18') },
    { id: 'QF_2', t1: getWinnerOf('R16_3', lang === 'th' ? 'ผู้ชนะคู่ที่ 19' : 'ผู้ชนะคู่ที่ 19'), t2: getWinnerOf('R16_4', lang === 'th' ? 'ผู้ชนะคู่ที่ 20' : 'ผู้ชนะคู่ที่ 20') },
    { id: 'QF_3', t1: getWinnerOf('R16_5', lang === 'th' ? 'ผู้ชนะคู่ที่ 21' : 'ผู้ชนะคู่ที่ 21'), t2: getWinnerOf('R16_6', lang === 'th' ? 'ผู้ชนะคู่ที่ 22' : 'ผู้ชนะคู่ที่ 22') },
    { id: 'QF_4', t1: getWinnerOf('R16_7', lang === 'th' ? 'ผู้ชนะคู่ที่ 23' : 'ผู้ชนะคู่ที่ 23'), t2: getWinnerOf('R16_8', lang === 'th' ? 'ผู้ชนะคู่ที่ 24' : 'ผู้ชนะคู่ที่ 24') }
  ];

  // รอบรองชนะเลิศ (Semifinals)
  const sfMatches = [
    { id: 'SF_1', t1: getWinnerOf('QF_1', lang === 'th' ? 'ผู้ชนะคู่ที่ 25' : 'ผู้ชนะคู่ที่ 25'), t2: getWinnerOf('QF_2', lang === 'th' ? 'ผู้ชนะคู่ที่ 26' : 'ผู้ชนะคู่ที่ 26') },
    { id: 'SF_2', t1: getWinnerOf('QF_3', lang === 'th' ? 'ผู้ชนะคู่ที่ 27' : 'ผู้ชนะคู่ที่ 27'), t2: getWinnerOf('QF_4', lang === 'th' ? 'ผู้ชนะคู่ที่ 28' : 'ผู้ชนะคู่ที่ 28') }
  ];

  // รอบชิงชนะเลิศ (Final)
  const finalMatch = { 
    id: 'FINAL', 
    t1: getWinnerOf('SF_1', lang === 'th' ? 'ผู้ชนะคู่ที่ 29' : 'ผู้ชนะคู่ที่ 29'), 
    t2: getWinnerOf('SF_2', lang === 'th' ? 'ผู้ชนะคู่ที่ 30' : 'ผู้ชนะคู่ที่ 30') 
  };

  const champion = winners['FINAL'];

  // ฟังก์ชันสลับเลือกผู้ชนะ
  const handleSelectWinner = (matchId: string, teamName: string) => {
    // ป้องกันการเลือกตัวหนังสือ Placeholder
    if (
      teamName.includes('ผู้ชนะ') || 
      teamName.includes('อันดับ') || 
      teamName.includes('Winner') || 
      teamName.includes('Runner-up') || 
      teamName.includes('Best 3rd')
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

  const renderMatchCard = (match: { id: string; t1: string; t2: string }) => {
    const isT1Winner = winners[match.id] === match.t1 && match.t1 !== '';
    const isT2Winner = winners[match.id] === match.t2 && match.t2 !== '';
    
    const isT1Placeholder = match.t1.includes('อันดับ') || match.t1.includes('ผู้ชนะ');
    const isT2Placeholder = match.t2.includes('อันดับ') || match.t2.includes('ผู้ชนะ');

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
        boxShadow: winners[match.id] ? '0 0 10px rgba(6,182,212,0.05)' : 'none'
      }}>
        {/* ทีม 1 */}
        <div 
          onClick={() => handleSelectWinner(match.id, match.t1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.35rem 0.5rem',
            borderRadius: '4px',
            cursor: isT1Placeholder ? 'default' : 'pointer',
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
          {isT1Winner && <span style={{ color: 'var(--green)', fontSize: '0.75rem' }}>✓</span>}
        </div>

        {/* ทีม 2 */}
        <div 
          onClick={() => handleSelectWinner(match.id, match.t2)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.35rem 0.5rem',
            borderRadius: '4px',
            cursor: isT2Placeholder ? 'default' : 'pointer',
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
          {isT2Winner && <span style={{ color: 'var(--green)', fontSize: '0.75rem' }}>✓</span>}
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

