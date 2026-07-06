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
  status: 'FINISHED' | 'LIVE' | 'SCHEDULED';
  minute: number;
  date: string;
  venue: string;
  events: MatchEvent[];
  stats: MatchStats;
}

interface StandingsTableProps {
  standings: Record<string, TeamStanding[]>;
  lang: LangType;
  matches?: Match[];
}

const localT = {
  thirdTitle: {
    th: '🏅 ตารางอันดับ 3 ที่ดีที่สุด (Best 3rd Placed Teams)',
    en: '🏅 Best 3rd Placed Teams'
  },
  thirdSub: {
    th: 'คัดเลือก 8 ทีมที่ดีที่สุดจาก 12 กลุ่มเพื่อเข้ารอบ 32 ทีมสุดท้าย',
    en: 'Top 8 out of 12 third-place teams qualify for the Round of 32.'
  },
  thRank: {
    th: 'อันดับ',
    en: 'Rank'
  },
  thGroup: {
    th: 'กลุ่ม',
    en: 'Grp'
  },
  thYellow: {
    th: 'ใบเหลือง',
    en: 'Y'
  },
  thRed: {
    th: 'ใบแดง',
    en: 'R'
  },
  thDisc: {
    th: 'วินัย (-)',
    en: 'Disc (-)'
  },
  thStatus: {
    th: 'สถานะ',
    en: 'Status'
  },
  statusQualified: {
    th: 'เข้ารอบ 32 ทีม',
    en: 'Qualified (R32)'
  },
  statusEliminated: {
    th: 'ตกรอบ',
    en: 'Eliminated'
  },
  rulesTitle: {
    th: '📋 กติกาและเกณฑ์การจัดอันดับของ FIFA:',
    en: '📋 FIFA Ranking Criteria:'
  },
  rule1: {
    th: '1. คะแนนสะสม (PTS) 2. ผลต่างประตูได้เสีย (GD) 3. ประตูได้ (GF) 4. จำนวนนัดที่ชนะ (W)',
    en: '1. Points (PTS) 2. Goal Difference (GD) 3. Goals For (GF) 4. Wins (W)'
  },
  rule2: {
    th: '5. คะแนนความประพฤติ (คะแนนแฟร์เพลย์) โดยใบเหลืองติดลบ -1 คะแนน, ใบแดงติดลบ -4 คะแนน (ทีมติดลบน้อยที่สุดได้อันดับสูงกว่า) 6. จับสลากโดยคณะกรรมการ FIFA',
    en: '5. Disciplinary / Fair Play Points (Yellow card = -1, Red card = -4; lowest negative score wins) 6. Drawing of lots by FIFA Committee'
  }
};

const getTxt = (key: keyof typeof localT, currentLang: LangType) => {
  return localT[key][currentLang];
};

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings, lang, matches }) => {
  const groupsList = Object.keys(standings).sort();
  const [selectedGroup, setSelectedGroup] = useState<string>('A');

  const currentStandings = standings[selectedGroup] || [];

  // คำนวณคะแนนวินัย (ติดลบ) ของแต่ละทีม
  const calculateDisciplinaryPoints = (teamName: string, matchesList: Match[]) => {
    let yellow = 0;
    let red = 0;
    let disc = 0;
    matchesList.forEach(m => {
      if (m.status !== 'SCHEDULED' && m.stats) {
        if (m.team1 === teamName) {
          const y = m.stats.yellowCards ? m.stats.yellowCards[0] || 0 : 0;
          const r = m.stats.redCards ? m.stats.redCards[0] || 0 : 0;
          yellow += y;
          red += r;
          disc += (y * 1) + (r * 4);
        } else if (m.team2 === teamName) {
          const y = m.stats.yellowCards ? m.stats.yellowCards[1] || 0 : 0;
          const r = m.stats.redCards ? m.stats.redCards[1] || 0 : 0;
          yellow += y;
          red += r;
          disc += (y * 1) + (r * 4);
        }
      }
    });
    return { yellow, red, disc };
  };

  // ดึงและจัดอันดับทีมอันดับ 3 ที่ดีที่สุดของแต่ละกลุ่ม
  const getBestThirdPlacedList = () => {
    const list = Object.entries(standings)
      .map(([group, teams]) => {
        const thirdTeam = teams[2]; // ดึงทีมอันดับ 3 (index 2)
        if (!thirdTeam) return null;

        const discStats = calculateDisciplinaryPoints(thirdTeam.team, matches || []);

        return {
          group,
          team: thirdTeam.team,
          played: thirdTeam.played,
          won: thirdTeam.won,
          drawn: thirdTeam.drawn,
          lost: thirdTeam.lost,
          gf: thirdTeam.gf,
          ga: thirdTeam.ga,
          gd: thirdTeam.gd,
          pts: thirdTeam.pts,
          ...discStats
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // เรียงตามกฎ FIFA: PTS -> GD -> GF -> W -> Disc (ติดลบน้อยสุดชนะ)
    list.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      if (b.won !== a.won) return b.won - a.won;
      if (a.disc !== b.disc) return a.disc - b.disc;
      return a.group.localeCompare(b.group);
    });

    return list;
  };

  const thirdPlaceRankings = getBestThirdPlacedList();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. การ์ดตารางคะแนนแบ่งกลุ่ม */}
      <div className="dashboard-card">
        <div className="card-title-bar">
          <h2 className="card-title">{t('groupTitle', lang)}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('groupSub', lang)}</span>
        </div>

        {/* เลือกกลุ่ม A-L แบบแท็บ */}
        <div className="group-filter-bar">
          <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--gold)' }}>{t('filterLabel', lang)}</div>
          <div className="group-selector-pills">
            {groupsList.map(group => (
              <button
                key={group}
                className={`pill-btn ${selectedGroup === group ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        <div className="standings-table-container">
          <table className="standings-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>{t('thPos', lang)}</th>
                <th style={{ textAlign: 'left', minWidth: '150px' }}>{t('thTeam', lang)}</th>
                <th style={{ width: '50px' }}>{t('thPlayed', lang)}</th>
                <th style={{ width: '50px' }}>{t('thWon', lang)}</th>
                <th style={{ width: '50px' }}>{t('thDrawn', lang)}</th>
                <th style={{ width: '50px' }}>{t('thLost', lang)}</th>
                <th style={{ width: '50px' }}>{t('thGf', lang)}</th>
                <th style={{ width: '50px' }}>{t('thGa', lang)}</th>
                <th style={{ width: '60px' }}>{t('thGd', lang)}</th>
                <th style={{ width: '60px', fontWeight: '700', color: '#fff' }}>{t('thPts', lang)}</th>
                <th style={{ width: '130px', textAlign: 'center' }}>{t('thForm', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {currentStandings.map((teamData, index) => {
                const pos = index + 1;
                // ไฮไลท์อันดับ 1-2 (เข้ารอบอัตโนมัติ) และอันดับ 3 (ลุ้นโควตาเข้ารอบ)
                let qualificationClass = '';
                if (pos <= 2) {
                  qualificationClass = 'row-qualified-direct';
                } else if (pos === 3) {
                  qualificationClass = 'row-qualified-playoff';
                }

                return (
                  <tr key={teamData.team} className={qualificationClass}>
                    <td>
                      <div className="pos-badge">{pos}</div>
                    </td>
                    <td>
                      <div className="team-td">
                        <span style={{ fontSize: '1.4rem' }}>{getTeamFlag(teamData.team)}</span>
                        <span>{translateTeam(teamData.team, lang)}</span>
                      </div>
                    </td>
                    <td className="number">{teamData.played}</td>
                    <td className="number">{teamData.won}</td>
                    <td className="number">{teamData.drawn}</td>
                    <td className="number">{teamData.lost}</td>
                    <td className="number">{teamData.gf}</td>
                    <td className="number">{teamData.ga}</td>
                    <td className="number" style={{ 
                      fontFamily: 'var(--font-eng)',
                      color: teamData.gd > 0 ? 'var(--green)' : teamData.gd < 0 ? 'var(--red)' : 'var(--text-muted)'
                    }}>
                      {teamData.gd > 0 ? `+${teamData.gd}` : teamData.gd}
                    </td>
                    <td className="number" style={{ fontWeight: '800', fontSize: '1.05rem', color: '#fff' }}>
                      {teamData.pts}
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {teamData.form.length === 0 ? (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
                        ) : (
                          teamData.form.map((f, i) => (
                            <span 
                              key={i} 
                              className={`form-dot ${
                                f === 'W' ? 'form-w' : f === 'D' ? 'form-d' : 'form-l'
                              }`}
                              title={f === 'W' ? (lang === 'th' ? 'ชนะ' : 'Won') : f === 'D' ? (lang === 'th' ? 'เสมอ' : 'Drawn') : (lang === 'th' ? 'แพ้' : 'Lost')}
                            >
                              {f === 'W' ? 'W' : f === 'D' ? 'D' : 'L'}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* คำอธิบายสิทธิ์เข้ารอบ */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--green)' }}></span>
            <span>{t('legend1', lang)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.2)', border: '1px solid var(--cyan)' }}></span>
            <span>{t('legend2', lang)}</span>
          </div>
        </div>
      </div>

      {/* 2. การ์ดตารางจัดอันดับทีมอันดับ 3 ที่ดีที่สุด */}
      <div className="dashboard-card">
        <div className="card-title-bar">
          <h2 className="card-title">{getTxt('thirdTitle', lang)}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{getTxt('thirdSub', lang)}</span>
        </div>

        <div className="standings-table-container">
          <table className="standings-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>{getTxt('thRank', lang)}</th>
                <th style={{ width: '50px', textAlign: 'center' }}>{getTxt('thGroup', lang)}</th>
                <th style={{ textAlign: 'left', minWidth: '150px' }}>{t('thTeam', lang)}</th>
                <th style={{ width: '50px' }}>{t('thPlayed', lang)}</th>
                <th style={{ width: '50px' }}>{t('thWon', lang)}</th>
                <th style={{ width: '50px' }}>{t('thDrawn', lang)}</th>
                <th style={{ width: '50px' }}>{t('thLost', lang)}</th>
                <th style={{ width: '50px' }}>{t('thGf', lang)}</th>
                <th style={{ width: '50px' }}>{t('thGa', lang)}</th>
                <th style={{ width: '60px' }}>{t('thGd', lang)}</th>
                <th style={{ width: '60px', fontWeight: '700', color: '#fff' }}>{t('thPts', lang)}</th>
                <th style={{ width: '45px', textAlign: 'center' }}>{getTxt('thYellow', lang)}</th>
                <th style={{ width: '45px', textAlign: 'center' }}>{getTxt('thRed', lang)}</th>
                <th style={{ width: '60px', textAlign: 'center' }}>{getTxt('thDisc', lang)}</th>
                <th style={{ width: '130px', textAlign: 'center' }}>{getTxt('thStatus', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {thirdPlaceRankings.map((teamData, index) => {
                const rank = index + 1;
                const isQualified = rank <= 8;

                return (
                  <tr 
                    key={teamData.team}
                    style={{
                      background: isQualified ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)',
                      borderLeft: `4px solid ${isQualified ? 'var(--green)' : 'var(--red)'}`
                    }}
                  >
                    <td style={{ textAlign: 'center' }}>
                      <div 
                        className="pos-badge"
                        style={{
                          background: isQualified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: isQualified ? 'var(--green)' : 'var(--red)',
                          margin: '0 auto'
                        }}
                      >
                        {rank}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '700', color: 'var(--gold)', fontFamily: 'var(--font-eng)' }}>
                      {teamData.group}
                    </td>
                    <td>
                      <div className="team-td">
                        <span style={{ fontSize: '1.4rem' }}>{getTeamFlag(teamData.team)}</span>
                        <span>{translateTeam(teamData.team, lang)}</span>
                      </div>
                    </td>
                    <td className="number">{teamData.played}</td>
                    <td className="number">{teamData.won}</td>
                    <td className="number">{teamData.drawn}</td>
                    <td className="number">{teamData.lost}</td>
                    <td className="number">{teamData.gf}</td>
                    <td className="number">{teamData.ga}</td>
                    <td className="number" style={{ 
                      fontFamily: 'var(--font-eng)',
                      color: teamData.gd > 0 ? 'var(--green)' : teamData.gd < 0 ? 'var(--red)' : 'var(--text-muted)'
                    }}>
                      {teamData.gd > 0 ? `+${teamData.gd}` : teamData.gd}
                    </td>
                    <td className="number" style={{ fontWeight: '800', fontSize: '1.05rem', color: '#fff' }}>
                      {teamData.pts}
                    </td>
                    <td className="number" style={{ textAlign: 'center', color: teamData.yellow > 0 ? '#fbbf24' : 'var(--text-muted)' }}>{teamData.yellow}</td>
                    <td className="number" style={{ textAlign: 'center', color: teamData.red > 0 ? 'var(--red)' : 'var(--text-muted)' }}>{teamData.red}</td>
                    <td className="number" style={{ textAlign: 'center', fontWeight: '600', color: teamData.disc > 0 ? '#f87171' : 'var(--text-muted)' }}>
                      {teamData.disc > 0 ? `-${teamData.disc}` : 0}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span 
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: isQualified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isQualified ? 'var(--green)' : 'var(--red)',
                          border: `1px solid ${isQualified ? 'var(--green)' : 'var(--red)'}`
                        }}
                      >
                        {isQualified ? getTxt('statusQualified', lang) : getTxt('statusEliminated', lang)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* กติกาและคำแนะนำเกณฑ์อันดับ 3 */}
        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{ fontWeight: '600', color: 'var(--gold)', marginBottom: '0.5rem' }}>
            {getTxt('rulesTitle', lang)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div>{getTxt('rule1', lang)}</div>
            <div>{getTxt('rule2', lang)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
