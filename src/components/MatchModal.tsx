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

interface Prediction {
  guru: string;
  forecast: string;
  details: string;
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
  predictions?: Prediction[];
}

interface MatchModalProps {
  match: Match | null;
  onClose: () => void;
  onUpdateScore?: (matchId: number, score1: number, score2: number) => void;
  isSimulationRunning?: boolean;
  lang: LangType;
  username?: string;
  API_BASE?: string;
}

export const MatchModal: React.FC<MatchModalProps> = ({ 
  match, 
  onClose,
  onUpdateScore,
  isSimulationRunning = false,
  lang,
  username,
  API_BASE
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editScore1, setEditScore1] = useState(match ? match.score1.toString() : '');
  const [editScore2, setEditScore2] = useState(match ? match.score2.toString() : '');

  // การทำนายผลของเพื่อน
  const [predScore1, setPredScore1] = useState<string>('');
  const [predScore2, setPredScore2] = useState<string>('');
  const [myPrediction, setMyPrediction] = useState<{ score1: number; score2: number } | null>(null);
  const [isSubmittingPred, setIsSubmittingPred] = useState<boolean>(false);

  const matchId = match?.id;
  const [prevMatchId, setPrevMatchId] = useState<number | undefined>(matchId);

  // โหลดผลคำทำนายเดิม
  React.useEffect(() => {
    if (!matchId || !username || !API_BASE) return;
    
    const loadUserPrediction = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/predictions/user/${encodeURIComponent(username)}`);
        if (res.ok) {
          const data = await res.json();
          interface PredictionItem {
            matchId: number;
            score1: number;
            score2: number;
          }
          const matchPred = data.predictions?.find((p: PredictionItem) => p.matchId === matchId);
          if (matchPred) {
            setMyPrediction({ score1: matchPred.score1, score2: matchPred.score2 });
            setPredScore1(matchPred.score1.toString());
            setPredScore2(matchPred.score2.toString());
          } else {
            setMyPrediction(null);
            setPredScore1('');
            setPredScore2('');
          }
        }
      } catch (error) {
        console.error('Error loading prediction:', error);
      }
    };

    loadUserPrediction();
  }, [matchId, username, API_BASE]);

  // ซิงก์คะแนนการแก้ไขเวลาสลับแมตช์
  if (matchId !== prevMatchId) {
    setPrevMatchId(matchId);
    setEditScore1(match ? match.score1.toString() : '');
    setEditScore2(match ? match.score2.toString() : '');
    setIsEditing(false);
  }

  if (!match) return null;

  const handleSavePrediction = async () => {
    if (!username || !API_BASE || !match) return;

    const s1 = parseInt(predScore1);
    const s2 = parseInt(predScore2);
    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
      alert(t('inputScoreAlert', lang));
      return;
    }

    setIsSubmittingPred(true);
    try {
      const res = await fetch(`${API_BASE}/api/predictions/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          matchId: match.id,
          score1: s1,
          score2: s2
        })
      });

      if (res.ok) {
        setMyPrediction({ score1: s1, score2: s2 });
      } else {
        const data = await res.json();
        alert(data.message || 'Error submitting prediction');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to prediction server.');
    } finally {
      setIsSubmittingPred(false);
    }
  };

  // ฟังก์ชันแปลงรูปแบบเวลาเป็นเวลาไทย (GMT+7)
  const formatThaiTime = (isoString: string) => {
    try {
      const dateObj = new Date(isoString);
      if (lang === 'th') {
        const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const formattedDate = dateObj.toLocaleDateString('th-TH', dateOptions);
        const formattedTime = dateObj.toLocaleTimeString('th-TH', timeOptions);
        return `${formattedDate} เวลา ${formattedTime} น.`;
      } else {
        const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const formattedDate = dateObj.toLocaleDateString('en-US', dateOptions);
        const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);
        return `${formattedDate} at ${formattedTime}`;
      }
    } catch {
      return lang === 'th' ? 'ยังไม่ระบุเวลา' : 'Unknown Time';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'GOAL': return '⚽';
      case 'YELLOW': return '🟨';
      case 'RED': return '🟥';
      default: return '📢';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'GOAL': return lang === 'th' ? 'ทำประตู' : 'Goal';
      case 'YELLOW': return lang === 'th' ? 'ใบเหลือง' : 'Yellow Card';
      case 'RED': return lang === 'th' ? 'ใบแดงไล่ออก' : 'Red Card';
      default: return lang === 'th' ? 'เหตุการณ์' : 'Event';
    }
  };

  const handleSaveScore = () => {
    const s1 = parseInt(editScore1);
    const s2 = parseInt(editScore2);
    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
      alert(t('inputScoreAlert', lang));
      return;
    }
    if (onUpdateScore) {
      onUpdateScore(match.id, s1, s2);
      setIsEditing(false);
    }
  };

  const getPrediction = (p: Prediction) => {
    const isAi = p.guru.includes('AI') || p.guru.includes('เรดาร์') || p.guru.includes('SportRadar');
    const t1 = translateTeam(match.team1, lang);
    const t2 = translateTeam(match.team2, lang);
    
    if (lang === 'th') {
      return {
        guru: p.guru,
        forecast: p.forecast,
        details: p.details
      };
    }
    
    if (isAi) {
      return {
        guru: 'SportRadar AI Assistant',
        forecast: `Win Prob: ${t1} 48% | Draw 30% | ${t2} 22%`,
        details: `Based on statistical modeling, ${t1} is projected to control the tempo with higher offensive efficacy.`
      };
    } else {
      const scorePart = p.forecast.replace(/.*ชนะ\s*/, '').trim();
      return {
        guru: 'Guru Somchai (Football pundit)',
        forecast: `${t1} to win ${scorePart || '1-0'}`,
        details: `Pundit believes ${t1} has the squad depth and experience to secure a narrow victory.`
      };
    }
  };

  const statsLabels: { key: keyof MatchStats; label: string }[] = [
    { key: 'possession', label: lang === 'th' ? 'การครองบอล (%)' : 'Possession (%)' },
    { key: 'shots', label: lang === 'th' ? 'โอกาสยิงทั้งหมด' : 'Total Shots' },
    { key: 'shotsOnTarget', label: lang === 'th' ? 'ยิงเข้ากรอบ' : 'Shots on Target' },
    { key: 'corners', label: lang === 'th' ? 'เตะมุม' : 'Corners' },
    { key: 'fouls', label: lang === 'th' ? 'การฟาวล์' : 'Fouls' },
    { key: 'offsides', label: lang === 'th' ? 'ล้ำหน้า' : 'Offsides' },
    { key: 'yellowCards', label: lang === 'th' ? 'ใบเหลือง' : 'Yellow Cards' },
    { key: 'redCards', label: lang === 'th' ? 'ใบแดง' : 'Red Cards' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header-banner">
          <div className="match-meta-info" style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--gold)' }}>
            {lang === 'th' ? 'กลุ่ม' : 'Group'} {match.group} • {translateVenue(match.venue, lang)}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', margin: '1rem 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '35%' }}>
              <span style={{ fontSize: '3rem' }}>{getTeamFlag(match.team1)}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '700', textAlign: 'center' }}>{translateTeam(match.team1, lang)}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              {isEditing ? (
                /* โหมดป้อนผลการแข่งขันด้วยตัวเอง */
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    value={editScore1}
                    onChange={(e) => setEditScore1(e.target.value)}
                    style={{ width: '50px', fontSize: '1.5rem', padding: '0.2rem', background: '#1e293b', border: '1px solid var(--cyan)', color: '#fff', borderRadius: '4px', textAlign: 'center' }}
                    min="0"
                  />
                  <span style={{ fontSize: '1.5rem' }}>-</span>
                  <input
                    type="number"
                    value={editScore2}
                    onChange={(e) => setEditScore2(e.target.value)}
                    style={{ width: '50px', fontSize: '1.5rem', padding: '0.2rem', background: '#1e293b', border: '1px solid var(--cyan)', color: '#fff', borderRadius: '4px', textAlign: 'center' }}
                    min="0"
                  />
                </div>
              ) : match.status === 'SCHEDULED' ? (
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>VS</div>
              ) : (
                <div style={{ fontSize: '3rem', fontWeight: '800', fontFamily: 'var(--font-eng)', color: '#fff', letterSpacing: '2px' }}>
                   {match.score1} - {match.score2}
                </div>
              )}
              
              <span className={`match-status-tag ${
                match.status === 'LIVE' ? 'tag-live' : match.status === 'FINISHED' ? 'tag-finished' : 'tag-scheduled'
              }`}>
                {match.status === 'LIVE' ? (lang === 'th' ? `สด (${match.minute}')` : `LIVE (${match.minute}')`) : match.status === 'FINISHED' ? t('matchFinishedText', lang) : t('matchScheduledText', lang)}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '35%' }}>
              <span style={{ fontSize: '3rem' }}>{getTeamFlag(match.team2)}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '700', textAlign: 'center' }}>{translateTeam(match.team2, lang)}</span>
            </div>
          </div>

          {/* ปุ่มบันทึก/ป้อนคะแนนด้วยตัวเอง */}
          {!isSimulationRunning && (
            <div style={{ margin: '1rem 0 0.5rem' }}>
              {isEditing ? (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={handleSaveScore} style={{ padding: '0.3rem 1rem', fontSize: '0.8rem' }}>
                    {t('saveBtn', lang)}
                  </button>
                  <button className="btn" onClick={() => setIsEditing(false)} style={{ padding: '0.3rem 1rem', fontSize: '0.8rem' }}>
                    {t('cancelBtn', lang)}
                  </button>
                </div>
              ) : (
                <button 
                  className="btn" 
                  onClick={() => {
                    setEditScore1(match.score1.toString());
                    setEditScore2(match.score2.toString());
                    setIsEditing(true);
                  }}
                  style={{ margin: '0 auto', padding: '0.3rem 1rem', fontSize: '0.8rem', borderColor: 'var(--gold)', color: 'var(--gold)' }}
                >
                  {t('editBtn', lang)}
                </button>
              )}
            </div>
          )}
          
          <div className="match-meta-info" style={{ marginTop: '1rem' }}>
            {lang === 'th' ? 'เวลาแข่งขัน:' : 'Kick-off Time:'} {formatThaiTime(match.date)}
          </div>
        </div>

        <div className="modal-match-details">
          {/* แสดงการทำนายผลของตัวเอง หากแมตช์เริ่มแข่งหรือจบไปแล้ว */}
          {match.status !== 'SCHEDULED' && myPrediction && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.6rem 1rem',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: 'var(--green)',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {t('predictionShow', lang)
                .replace('{t1}', translateTeam(match.team1, lang))
                .replace('{t2}', translateTeam(match.team2, lang))
                .replace('{score1}', myPrediction.score1.toString())
                .replace('{score2}', myPrediction.score2.toString())}
            </div>
          )}

          {/* ฟอร์มกรอกคำทายผลสกอร์ */}
          {match.status === 'SCHEDULED' && (
            <div style={{
              marginBottom: '1.5rem',
              background: 'rgba(6, 182, 212, 0.04)',
              border: '1px dashed var(--cyan)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--cyan)', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {t('predictTitle', lang)}
              </h3>
              
              {!username ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  {lang === 'th' ? '💡 กรุณาตั้งชื่อเล่นในแท็บ "🏆 คะแนนทายผล" เพื่อเริ่มทายผลสกอร์และจัดอันดับกับเพื่อน!' : '💡 Set your nickname in the "🏆 Predictor League" tab to start predicting and ranking!'}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#fff' }}>{translateTeam(match.team1, lang)}</span>
                      <input 
                        type="number"
                        value={predScore1}
                        onChange={(e) => setPredScore1(e.target.value)}
                        style={{ width: '45px', padding: '0.2rem', background: '#0f172a', border: '1px solid var(--border)', color: '#fff', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem' }}
                        min="0"
                      />
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <input 
                        type="number"
                        value={predScore2}
                        onChange={(e) => setPredScore2(e.target.value)}
                        style={{ width: '45px', padding: '0.2rem', background: '#0f172a', border: '1px solid var(--border)', color: '#fff', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem' }}
                        min="0"
                      />
                      <span style={{ fontSize: '0.8rem', color: '#fff' }}>{translateTeam(match.team2, lang)}</span>
                    </div>
                    
                    <button 
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}
                      onClick={handleSavePrediction}
                      disabled={isSubmittingPred}
                    >
                      {t('predictBtn', lang)}
                    </button>
                  </div>

                  {myPrediction && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>✓</span>
                      <span>
                        {t('predictionShow', lang)
                          .replace('{t1}', translateTeam(match.team1, lang))
                          .replace('{t2}', translateTeam(match.team2, lang))
                          .replace('{score1}', myPrediction.score1.toString())
                          .replace('{score2}', myPrediction.score2.toString())}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 1. แสดงบทวิเคราะห์พยากรณ์จากกูรู หากยังไม่แข่ง */}
          {match.status === 'SCHEDULED' && match.predictions && (
            <div style={{ marginBottom: '2rem', background: 'rgba(229, 179, 35, 0.03)', border: '1px dashed var(--gold-dark)', borderRadius: '12px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--gold)', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {t('modalGuruTitle', lang)}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {match.predictions.map((p, idx) => {
                  const pred = getPrediction(p);
                  return (
                    <div key={idx} style={{ fontSize: '0.85rem', borderLeft: '2px solid var(--gold)', paddingLeft: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                        <span style={{ fontWeight: '700', color: '#fff' }}>{pred.guru}</span>
                        <span style={{ fontWeight: '700', color: 'var(--cyan)', fontFamily: 'var(--font-eng)' }}>{pred.forecast}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>{pred.details}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {match.status === 'SCHEDULED' && !isEditing ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {t('modalNoStats', lang)}
            </div>
          ) : (
            <>
              {/* รายการสถิติแมตช์ */}
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                {t('modalStatsTitle', lang)}
              </h3>
              
              <div className="stats-container">
                {statsLabels.map(({ key, label }) => {
                  const val1 = match.stats[key][0];
                  const val2 = match.stats[key][1];
                  const total = val1 + val2;
                  const pct1 = total === 0 ? 50 : (val1 / total) * 100;
                  const pct2 = total === 0 ? 50 : (val2 / total) * 100;

                  return (
                    <div key={key} className="stat-row">
                      <div className="stat-label-row">
                        <span style={{ fontFamily: 'var(--font-eng)', fontWeight: '700', color: 'var(--cyan)' }}>{val1}</span>
                        <span className="stat-label">{label}</span>
                        <span style={{ fontFamily: 'var(--font-eng)', fontWeight: '700', color: 'var(--gold)' }}>{val2}</span>
                      </div>
                      <div className="stat-bar-track">
                        <div className="stat-bar-left" style={{ width: `${pct1}%` }}></div>
                        <div className="stat-bar-right" style={{ width: `${pct2}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* เส้นเวลาเหตุการณ์ (Timeline) */}
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginTop: '2.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                {t('modalEventsTitle', lang)}
              </h3>
              
              <div className="timeline-container">
                {match.events.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {t('modalNoEvents', lang)}
                  </div>
                ) : (
                  <>
                    <div className="timeline-line"></div>
                    {match.events.map((event, idx) => {
                      const isTeam1 = event.team === match.team1;
                      return (
                        <div key={idx} className={`timeline-event ${isTeam1 ? 'event-left' : 'event-right'}`}>
                          <div className="timeline-badge">
                            {event.minute}'
                          </div>
                          <div className="timeline-box">
                            <span className="event-icon">{getEventIcon(event.type)}</span>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{event.player}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {getEventTypeText(event.type)} ({translateTeam(event.team, lang)})
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

