import React, { useState } from 'react';
import { getTeamFlag } from '../utils/flags';
import { t, translateTeam, translateVenue } from '../utils/translations';
import type { LangType } from '../utils/translations';

interface MatchEvent {
  type: 'GOAL' | 'YELLOW' | 'RED';
  minute: number;
  team: string;
  player: string;
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

interface MatchListProps {
  matches: Match[];
  onMatchClick: (match: Match) => void;
  lang: LangType;
}

type FilterStatus = 'ALL' | 'SCHEDULED' | 'LIVE' | 'FINISHED';

export const MatchList: React.FC<MatchListProps> = ({ matches, onMatchClick, lang }) => {
  const [filter, setFilter] = useState<FilterStatus>('ALL');

  // ฟังก์ชันจัดกลุ่มแมตช์ตามวันที่เวลาไทย
  const getFormattedDateString = (isoString: string) => {
    try {
      const dateObj = new Date(isoString);
      if (lang === 'th') {
        const options: Intl.DateTimeFormatOptions = { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        };
        return dateObj.toLocaleDateString('th-TH', options);
      } else {
        const options: Intl.DateTimeFormatOptions = { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        };
        return dateObj.toLocaleDateString('en-US', options);
      }
    } catch {
      return lang === 'th' ? 'ไม่ระบุวันที่' : 'Unknown Date';
    }
  };

  // ฟังก์ชันจัดรูปแบบเวลาเป็นเวลาไทย (GMT+7)
  const formatMatchTime = (isoString: string) => {
    try {
      const dateObj = new Date(isoString);
      const options: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      };
      if (lang === 'th') {
        return `${dateObj.toLocaleTimeString('th-TH', options)} น.`;
      } else {
        return `${dateObj.toLocaleTimeString('en-US', options)}`;
      }
    } catch {
      return lang === 'th' ? 'ยังไม่ระบุเวลา' : 'Unknown Time';
    }
  };

  // กรองแมตช์ตามฟิลเตอร์สถานะ
  const filteredMatches = matches.filter(m => {
    if (filter === 'ALL') return true;
    return m.status === filter;
  });

  // กรองเสร็จแล้วเอามาจัดกลุ่มตามวัน
  const groupedMatches: Record<string, Match[]> = {};
  filteredMatches.forEach(match => {
    const dateStr = getFormattedDateString(match.date);
    if (!groupedMatches[dateStr]) {
      groupedMatches[dateStr] = [];
    }
    groupedMatches[dateStr].push(match);
  });

  // เรียงลำดับแมตช์ในแต่ละวันตามเวลาประเทศไทยจริง (เช้าไปดึก)
  Object.keys(groupedMatches).forEach(dateStr => {
    groupedMatches[dateStr].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  // จัดเรียงวันที่
  const sortedDates = Object.keys(groupedMatches).sort((a, b) => {
    // ดึงวันแรกในแต่ละกลุ่มมาเทียบเวลา
    const dateA = new Date(groupedMatches[a][0].date).getTime();
    const dateB = new Date(groupedMatches[b][0].date).getTime();
    return dateA - dateB;
  });

  const getStatusTagText = (status: string, minute: number) => {
    switch (status) {
      case 'LIVE': return lang === 'th' ? `สด (${minute}')` : `LIVE (${minute}')`;
      case 'FINISHED': return lang === 'th' ? 'จบเกม' : 'FT';
      case 'SCHEDULED': return lang === 'th' ? 'ยังไม่เริ่ม' : 'Scheduled';
      default: return '';
    }
  };

  const getStatusTagClass = (status: string) => {
    switch (status) {
      case 'LIVE': return 'tag-live';
      case 'FINISHED': return 'tag-finished';
      case 'SCHEDULED': return 'tag-scheduled';
      default: return '';
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-title-bar">
        <h2 className="card-title">{t('fixturesTitle', lang)}</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('fixturesSub', lang)}</span>
      </div>

      {/* แถบตัวเลือกสถานะการแข่งขัน */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['ALL', 'SCHEDULED', 'LIVE', 'FINISHED'] as const).map(status => {
          const count = matches.filter(m => status === 'ALL' ? true : m.status === status).length;
          const statusLabels: Record<FilterStatus, string> = {
            ALL: lang === 'th' ? 'ทั้งหมด' : 'All',
            SCHEDULED: lang === 'th' ? 'ยังไม่เริ่ม' : 'Scheduled',
            LIVE: lang === 'th' ? 'แข่งขันสด' : 'Live',
            FINISHED: lang === 'th' ? 'ผลการแข่งที่จบแล้ว' : 'Results'
          };

          return (
            <button
              key={status}
              className={`pill-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
              style={{ fontSize: '0.85rem' }}
            >
              {statusLabels[status]} ({count})
            </button>
          );
        })}
      </div>

      {sortedDates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          {t('noFixtures', lang)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sortedDates.map(dateStr => (
            <div key={dateStr}>
              {/* หัวข้อวันแข่งขัน */}
              <h3 style={{ fontSize: '1rem', color: 'var(--gold)', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.35rem', fontWeight: '600' }}>
                {dateStr}
              </h3>
              
              <div className="match-list-vertical">
                {groupedMatches[dateStr].map(match => (
                  <div
                    key={match.id}
                    className={`match-row-card ${match.status === 'LIVE' ? 'match-live' : ''}`}
                    onClick={() => onMatchClick(match)}
                  >
                    {/* ทีมเหย้า */}
                    <div className="team-container team-left">
                      <span className="team-name">{translateTeam(match.team1, lang)}</span>
                      <span className="team-flag">{getTeamFlag(match.team1)}</span>
                    </div>

                    {/* กลางสกอร์ */}
                    <div className="score-center-container">
                      <div className="score-box">
                        {match.status === 'SCHEDULED' ? (
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                            {formatMatchTime(match.date)}
                          </span>
                        ) : (
                          <>
                            <span className="score-value">{match.score1}</span>
                            <span className="score-divider">-</span>
                            <span className="score-value">{match.score2}</span>
                          </>
                        )}
                      </div>
                      <span className={`match-status-tag ${getStatusTagClass(match.status)}`} style={{ marginTop: '0.35rem' }}>
                        {getStatusTagText(match.status, match.minute)}
                      </span>
                      <span className="match-meta-info" style={{ display: 'block', marginTop: '0.2rem', fontSize: '0.7rem' }}>
                        {lang === 'th' ? 'กลุ่ม' : 'Group'} {match.group} • {translateVenue(match.venue, lang).split('(')[0].trim()}
                      </span>
                    </div>

                    {/* ทีมเยือน */}
                    <div className="team-container team-right">
                      <span className="team-flag">{getTeamFlag(match.team2)}</span>
                      <span className="team-name">{translateTeam(match.team2, lang)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

