import React from 'react';
import { getTeamFlag } from '../utils/flags';
import { t, translateTeam } from '../utils/translations';
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

interface LiveScoreProps {
  matches: Match[];
  onMatchClick: (match: Match) => void;
  onStartSimulation: () => void;
  isSimulationRunning: boolean;
  lang: LangType;
}

export const LiveScore: React.FC<LiveScoreProps> = ({
  matches,
  onMatchClick,
  onStartSimulation,
  isSimulationRunning,
  lang
}) => {
  const liveMatches = matches.filter(m => m.status === 'LIVE');
  const finishedMatches = matches.filter(m => m.status === 'FINISHED' && (m.id === 1 || m.id === 2 || m.id === 3 || m.id === 7 || m.id === 4)); // กรองให้แสดงเฉพาะแมตช์หลักที่จำลองหรือแข่งจบไปแล้วของกลุ่มแรกๆ

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ส่วนแข่งขันสด */}
      <div className="dashboard-card">
        <div className="card-title-bar">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="ticker-pulse" style={{ display: liveMatches.length > 0 ? 'inline-block' : 'none' }}></span>
            {t('liveMatchesTitle', lang)}
          </h2>
          {liveMatches.length > 0 && (
            <span style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: '700' }}>
              {lang === 'th' ? `กำลังแข่งขันอยู่ ${liveMatches.length} คู่` : `${liveMatches.length} Matches Live`}
            </span>
          )}
        </div>

        {liveMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🏟️</span>
            <div style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '1rem' }}>
              {t('noLiveMatches', lang)}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '450px', lineHeight: '1.6' }}>
              {t('simPrompt', lang)}
            </p>
            {!isSimulationRunning && (
              <button className="btn btn-primary" onClick={onStartSimulation} style={{ marginTop: '0.5rem' }}>
                {t('startSimBtn', lang)}
              </button>
            )}
          </div>
        ) : (
          <div className="match-list-vertical">
            {liveMatches.map(match => (
              <div 
                key={match.id} 
                className="match-row-card match-live"
                onClick={() => onMatchClick(match)}
              >
                {/* ทีมเจ้าบ้าน */}
                <div className="team-container team-left">
                  <span className="team-name">{translateTeam(match.team1, lang)}</span>
                  <span className="team-flag">{getTeamFlag(match.team1)}</span>
                </div>

                {/* สกอร์ตรงกลาง */}
                <div className="score-center-container">
                  <div className="score-box">
                    <span className="score-value">{match.score1}</span>
                    <span className="score-divider">-</span>
                    <span className="score-value">{match.score2}</span>
                  </div>
                  <div className="match-meta-info" style={{ color: 'var(--green)', fontWeight: '700', marginTop: '0.3rem' }}>
                    {lang === 'th' ? `นาทีที่ ${match.minute}'` : `Min ${match.minute}'`}
                  </div>
                  
                  {/* แถบความคืบหน้าเวลาการแข่งขัน */}
                  <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.4rem' }}>
                    <div style={{ width: `${(match.minute / 90) * 100}%`, height: '100%', background: 'var(--green)' }}></div>
                  </div>
                </div>

                {/* ทีมเยือน */}
                <div className="team-container team-right">
                  <span className="team-flag">{getTeamFlag(match.team2)}</span>
                  <span className="team-name">{translateTeam(match.team2, lang)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ส่วนแข่งขันเสร็จสิ้นล่าสุด */}
      <div className="dashboard-card">
        <div className="card-title-bar">
          <h2 className="card-title">{t('recentResultsTitle', lang)}</h2>
        </div>

        {finishedMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            {t('noRecentResults', lang)}
          </div>
        ) : (
          <div className="match-list-vertical">
            {finishedMatches.map(match => (
              <div 
                key={match.id} 
                className="match-row-card"
                onClick={() => onMatchClick(match)}
              >
                {/* ทีมเจ้าบ้าน */}
                <div className="team-container team-left">
                  <span className="team-name">{translateTeam(match.team1, lang)}</span>
                  <span className="team-flag">{getTeamFlag(match.team1)}</span>
                </div>

                {/* สกอร์ตรงกลาง */}
                <div className="score-center-container">
                  <div className="score-box">
                    <span className="score-value" style={{ color: match.score1 > match.score2 ? 'var(--gold)' : '#fff' }}>{match.score1}</span>
                    <span className="score-divider">-</span>
                    <span className="score-value" style={{ color: match.score2 > match.score1 ? 'var(--gold)' : '#fff' }}>{match.score2}</span>
                  </div>
                  <span className="match-status-tag tag-finished" style={{ marginTop: '0.3rem' }}>{t('matchFinishedText', lang)}</span>
                </div>

                {/* ทีมเยือน */}
                <div className="team-container team-right">
                  <span className="team-flag">{getTeamFlag(match.team2)}</span>
                  <span className="team-name">{translateTeam(match.team2, lang)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

