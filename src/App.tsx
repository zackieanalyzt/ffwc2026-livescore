import { useState, useEffect, useCallback } from 'react';
import { LiveScore } from './components/LiveScore';
import { StandingsTable } from './components/StandingsTable';
import { MatchList } from './components/MatchList';
import { MatchModal } from './components/MatchModal';
import { KnockoutBracket } from './components/KnockoutBracket';
import { getTeamFlag } from './utils/flags';
import { t, translateTeam, translateTickerText } from './utils/translations';
import type { LangType } from './utils/translations';

// ดึงโฮสต์ของเบราว์เซอร์มาสร้าง API_BASE เพื่อให้รองรับเครื่องของผู้ใช้
const API_BASE = typeof window !== 'undefined'
  ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? `http://localhost:5001`
      : `${window.location.protocol}//${window.location.host}`)
  : `http://localhost:5001`;

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

interface TopScorer {
  player: string;
  team: string;
  goals: number;
}

interface LeaderboardEntry {
  username: string;
  exact: number;
  outcome: number;
  points: number;
}

type TabType = 'live' | 'standings' | 'matches' | 'knockout' | 'leaderboard';

interface ConfettiProps {
  delay: number;
  left: number;
  size: number;
  rotation: number;
  duration: number;
  bg: string;
  borderRadius: string;
}

function getDeterministicConfetti(i: number): ConfettiProps {
  const hash1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453123;
  const hash2 = Math.sin(i * 4.898 + 123.456) * 789221.143123;
  const hash3 = Math.sin(i * 9.542 + 23.45) * 58912.143;
  const hash4 = Math.sin(i * 3.14159 + 98.76) * 23812.54;
  const hash5 = Math.sin(i * 1.618 + 45.67) * 98412.33;

  const r1 = hash1 - Math.floor(hash1);
  const r2 = hash2 - Math.floor(hash2);
  const r3 = hash3 - Math.floor(hash3);
  const r4 = hash4 - Math.floor(hash4);
  const r5 = hash5 - Math.floor(hash5);

  const colors = ['#06b6d4', '#eab308', '#10b981', '#f43f5e', '#a855f7'];
  const bg = colors[Math.floor(r1 * colors.length)];

  return {
    delay: r2 * 2,
    left: r3 * 100,
    size: r4 * 8 + 4,
    rotation: r5 * 360,
    duration: r1 * 1.5 + 1.5,
    bg,
    borderRadius: r2 > 0.5 ? '50%' : '2px',
  };
}

function App() {
  const [lang, setLang] = useState<LangType>('th');
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Record<string, TeamStanding[]>>({});
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(false);
  const [tickerEvents, setTickerEvents] = useState<{ matchId: number; text: string }[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // โซเชียลฟีเจอร์: ทายผลกับเพื่อนๆ
  const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [tempUsername, setTempUsername] = useState<string>('');
  const [goalAlert, setGoalAlert] = useState<{ team: string; score1: number; score2: number; flag: string } | null>(null);

  // ระบบอัปเดตอัตโนมัติ (หน่วย: วินาที)
  // 0 = ปิด, 3600 = 1 ชม, 10800 = 3 ชม, 21600 = 6 ชม, 43200 = 12 ชม, 86400 = 24 ชม
  const [updateInterval, setUpdateInterval] = useState<number>(3600); // ดีฟอลต์ที่ 1 ชม.
  const [secondsLeft, setSecondsLeft] = useState<number>(3600);
  const [prevUpdateInterval, setPrevUpdateInterval] = useState<number>(3600);
  if (updateInterval !== prevUpdateInterval) {
    setPrevUpdateInterval(updateInterval);
    setSecondsLeft(updateInterval);
  }

  // ฟังก์ชันดึงข้อมูลทายผลของกลุ่มเพื่อน
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/predictions/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (e) {
      console.error('Error loading leaderboard:', e);
    }
  }, []);

  // ระบบเสียงหวีดและแฟนบอลสังเคราะห์ (Audio Synthesis)
  const playGoalAudio = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      const playWhistle = (time: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, time);
        osc.frequency.linearRampToValueAtTime(1600, time + duration);
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };
      
      playWhistle(ctx.currentTime, 0.15);
      playWhistle(ctx.currentTime + 0.2, 0.3);

      setTimeout(() => {
        const bufferSize = ctx.sampleRate * 2.5; 
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 350; 
        filter.Q.value = 1.2;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.12, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.20, ctx.currentTime + 0.5); 
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.3);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start();
      }, 300);
    } catch (e) {
      console.error('AudioContext error:', e);
    }
  };

  const triggerGoalAlert = useCallback((team: string, s1: number, s2: number) => {
    setGoalAlert({ team, score1: s1, score2: s2, flag: getTeamFlag(team) });
    playGoalAudio();
    setTimeout(() => {
      setGoalAlert(null);
    }, 4000);
  }, []);

  // ฟังก์ชันดึงข้อมูลจากเซิร์ฟเวอร์
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // ดึงข้อมูลการแข่งขัน
      const matchesRes = await fetch(`${API_BASE}/api/matches`);
      if (!matchesRes.ok) throw new Error('เกิดข้อผิดพลาดในการโหลดข้อมูลแมตช์');
      const matchesData = await matchesRes.json();
      
      // ตรวจสอบความแตกต่างของสกอร์เพื่อทริกเกอร์แอนิเมชันประตูสด
      setMatches((prevMatchesVal) => {
        if (prevMatchesVal.length > 0 && matchesData.isSimulationRunning) {
          matchesData.matches.forEach((m: Match) => {
            const pm = prevMatchesVal.find((p: Match) => p.id === m.id);
            if (pm) {
              const goalScored = (m.score1 > pm.score1) || (m.score2 > pm.score2);
              if (goalScored) {
                const scoringTeam = m.score1 > pm.score1 ? m.team1 : m.team2;
                triggerGoalAlert(scoringTeam, m.score1, m.score2);
              }
            }
          });
        }
        return matchesData.matches;
      });

      setIsSimulationRunning(matchesData.isSimulationRunning);
      setTickerEvents(matchesData.tickerEvents);
      setTopScorers(matchesData.topScorers || []);

      // ดึงตารางคะแนน
      const standingsRes = await fetch(`${API_BASE}/api/standings`);
      if (!standingsRes.ok) throw new Error('เกิดข้อผิดพลาดในการโหลดตารางคะแนน');
      const standingsData = await standingsRes.json();
      setStandings(standingsData);

      // ดึงคะแนน Leaderboard ทายผล
      fetchLeaderboard();

      // อัปเดตข้อมูลแมตช์ที่เปิดหน้าต่าง Modal อยู่แบบเรียลไทม์
      if (selectedMatch) {
        const updatedMatch = matchesData.matches.find((m: Match) => m.id === selectedMatch.id);
        if (updatedMatch) {
          setSelectedMatch(updatedMatch);
        }
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ API ได้ กรุณาตรวจสอบการรันเซิร์ฟเวอร์หลังบ้าน');
    } finally {
      setIsLoading(false);
    }
  }, [selectedMatch, fetchLeaderboard, triggerGoalAlert]);

  // รันในครั้งแรกเพื่อโหลดข้อมูล
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchData();
      }
    });
    return () => {
      active = false;
    };
  }, [fetchData]);

  // จัดการการอัปเดตอัตโนมัติตามระยะเวลา (Auto-update interval)
  useEffect(() => {
    if (updateInterval === 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          fetchData();
          return updateInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [updateInterval, fetchData]);

  // ฟังก์ชันควบคุมการจำลองแข่งขัน
  const handleStartSimulation = async () => {
    try {
      await fetch(`${API_BASE}/api/simulation/start`, { method: 'POST' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStopSimulation = async () => {
    try {
      await fetch(`${API_BASE}/api/simulation/stop`, { method: 'POST' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetSimulation = async () => {
    try {
      await fetch(`${API_BASE}/api/simulation/reset`, { method: 'POST' });
      fetchData();
      setSelectedMatch(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ฟังก์ชันป้อนผลการแข่งขันด้วยตัวเอง
  const handleUpdateScore = async (matchId: number, score1: number, score2: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/matches/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: matchId, score1, score2, status: 'FINISHED' })
      });
      if (!res.ok) throw new Error('ไม่สามารถอัปเดตคะแนนการแข่งขันได้');
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  // แปลงวินาทีที่เหลือนับถอยหลังเป็น ชม:นาที:วินาที
  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // แถบแสดงเวลานับถอยหลังเปอร์เซ็นต์
  const progressPercent = updateInterval > 0 ? (secondsLeft / updateInterval) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
      <style>{`
        @keyframes fall {
          0% { top: -20px; transform: translateY(0) rotate(0deg); }
          100% { top: 105vh; transform: translateY(105vh) rotate(720deg); }
        }
        @keyframes scaleUp {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Goal Alert Overlay */}
      {goalAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3,7,18,0.92)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div className="confetti-container" style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
            {Array.from({ length: 40 }).map((_, i) => {
              const { delay, left, size, rotation, duration, bg, borderRadius } = getDeterministicConfetti(i);

              return (
                <div 
                  key={i} 
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    background: bg,
                    transform: `rotate(${rotation}deg)`,
                    animation: `fall ${duration}s linear infinite`,
                    animationDelay: `${delay}s`,
                    borderRadius: borderRadius
                  }}
                />
              );
            })}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(229,179,35,0.1) 0%, rgba(6,182,212,0.1) 100%)',
            border: '2px solid var(--gold)',
            borderRadius: '24px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 0 30px var(--gold-glow)',
            animation: 'scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            maxWidth: '450px',
            width: '90%'
          }}>
            <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '0.5rem', animation: 'pulse 1s infinite' }}>
              ⚽
            </span>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '950',
              color: 'var(--gold)',
              margin: '0 0 0.5rem',
              letterSpacing: '3px',
              textShadow: '0 0 20px rgba(229,179,35,0.6)'
            }}>
              {t('goalAlertTitle', lang)}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: '1.5rem 0', justifyContent: 'center' }}>
              <span style={{ fontSize: '3rem' }}>{goalAlert.flag}</span>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
                {translateTeam(goalAlert.team, lang)}
              </span>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: 0 }}>
              {lang === 'th' ? 'ได้ประตูเพิ่ม! ผลสกอร์ขณะนี้' : 'Goal! Current Score:'}
            </p>
            <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--cyan)', marginTop: '0.4rem', fontFamily: 'var(--font-eng)' }}>
              {goalAlert.score1} - {goalAlert.score2}
            </div>
          </div>
        </div>
      )}
      
      {/* ส่วนหัวของแดชบอร์ด */}
      <header className="dashboard-header">
        <div className="brand">
          <h1 className="brand-logo">FIFA <span>2026</span></h1>
          <span className="brand-badge">LiveScore</span>
          <div className="lang-switcher" style={{ marginLeft: '1rem', display: 'flex', gap: '0.2rem', background: 'rgba(255,255,255,0.03)', padding: '0.2rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setLang('th')} 
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                border: 'none',
                background: lang === 'th' ? 'var(--cyan)' : 'transparent',
                color: lang === 'th' ? '#000' : 'var(--text-muted)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              TH
            </button>
            <button 
              onClick={() => setLang('en')} 
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                border: 'none',
                background: lang === 'en' ? 'var(--cyan)' : 'transparent',
                color: lang === 'en' ? '#000' : 'var(--text-muted)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              EN
            </button>
          </div>
        </div>

        {/* แผงควบคุมระบบอัปเดตและโหมดจำลอง */}
        <div className="controls-group">
          {/* เลือกเวลาอัปเดตอัตโนมัติเป็นรายชั่วโมง */}
          <div className="control-item">
            <span className="control-label">{t('autoUpdate', lang)}</span>
            <select
              className="update-select"
              value={updateInterval}
              onChange={(e) => {
                const val = Number(e.target.value);
                setUpdateInterval(val);
                setSecondsLeft(val);
              }}
            >
              <option value={0}>{t('autoUpdateOff', lang)}</option>
              <option value={3600}>{t('autoUpdateHour', lang).replace('{h}', '1')}</option>
              <option value={10800}>{t('autoUpdateHour', lang).replace('{h}', '3')}</option>
              <option value={21600}>{t('autoUpdateHour', lang).replace('{h}', '6')}</option>
              <option value={43200}>{t('autoUpdateHour', lang).replace('{h}', '12')}</option>
              <option value={86400}>{t('autoUpdateHour', lang).replace('{h}', '24')}</option>
            </select>
            {updateInterval > 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontFamily: 'var(--font-eng)', marginLeft: '0.25rem', fontWeight: '600' }}>
                ({formatCountdown(secondsLeft)})
              </span>
            )}
          </div>

          {/* ปุ่มกดรีเฟรชเอง */}
          <button 
            className={`btn ${isLoading ? 'btn-neon-active' : ''}`}
            onClick={fetchData}
            disabled={isLoading}
          >
            {isLoading ? t('refreshing', lang) : t('refreshBtn', lang)}
          </button>

          {/* แผงควบคุมระบบการจำลองแมตช์จำลอง */}
          <div className="control-item" style={{ gap: '0.5rem', background: 'rgba(229,179,35,0.02)' }}>
            <span className="control-label" style={{ color: 'var(--gold)' }}>{t('simControl', lang)}</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {isSimulationRunning ? (
                <button className="btn btn-primary" onClick={handleStopSimulation} style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem', background: '#e11d48' }}>
                  {t('simStopMsg', lang)}
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleStartSimulation} style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>
                  {t('simStartMsg', lang)}
                </button>
              )}
              <button className="btn" onClick={handleResetSimulation} style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>
                {t('simReset', lang)}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* แถบตัวนับเวลาถอยหลัง (Auto-update countdown bar) */}
      {updateInterval > 0 && (
        <div className="progress-bar-container" title={lang === 'th' ? `จะอัปเดตข้อมูลอัตโนมัติในอีก ${formatCountdown(secondsLeft)}` : `Auto updating in ${formatCountdown(secondsLeft)}`}>
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      )}

      {/* แสดงข้อความแจ้งเตือนข้อผิดพลาด หากมี */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--red)',
          color: '#fca5a5',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          textAlign: 'center',
          fontSize: '0.95rem'
        }}>
          ⚠️ {lang === 'th' ? error : 'Unable to connect to the API server. Please check your backend server.'}
        </div>
      )}

      {/* แถบรายงานข่าวสารและเหตุการณ์สด (Simulation Events Ticker) */}
      {(isSimulationRunning || tickerEvents.length > 0) && (
        <div className="ticker-container">
          <div className="ticker-title">
            <span className="ticker-pulse"></span>
            {t('recentTicker', lang)}
          </div>
          <div className="ticker-content">
            {tickerEvents.length > 0 ? (
              <div className="ticker-item" key={tickerEvents[0].text}>
                {translateTickerText(tickerEvents[0].text, lang)}
              </div>
            ) : (
              <div className="ticker-item" style={{ color: 'var(--text-muted)' }}>
                {t('tickerPlaceholder', lang)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* แถบนำทางหมวดหมู่ข้อมูลหลัก (Tabs Navigation) */}
      <nav className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          {t('liveScoreTab', lang)}
        </button>
        <button
          className={`tab-btn ${activeTab === 'standings' ? 'active' : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          {t('standingsTab', lang)}
        </button>
        <button
          className={`tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          {t('matchesTab', lang)}
        </button>
        <button
          className={`tab-btn ${activeTab === 'knockout' ? 'active' : ''}`}
          onClick={() => setActiveTab('knockout')}
        >
          {t('knockoutTab', lang)}
        </button>
        <button
          className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('leaderboard');
            fetchLeaderboard();
          }}
        >
          {t('leaderboardTab', lang)}
        </button>
      </nav>

      {/* พื้นที่แสดงเนื้อหาตามแท็บที่เลือก */}
      <main style={{ flexGrow: 1 }}>
        {activeTab === 'live' && (
          <div className="grid-layout">
            {/* ฝั่งซ้าย: รายชื่อแมตช์แข่งขันและสกอร์สด */}
            <LiveScore 
              matches={matches} 
              onMatchClick={setSelectedMatch}
              onStartSimulation={handleStartSimulation}
              isSimulationRunning={isSimulationRunning}
              lang={lang}
            />
            
            {/* ฝั่งขวา: ตารางดาวซัลโวสูงสุด (Top Scorers) */}
            <div className="dashboard-card" style={{ height: 'fit-content' }}>
              <div className="card-title-bar">
                <h2 className="card-title">{t('topScorerTitle', lang)}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topScorers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {t('noScorers', lang)}
                  </div>
                ) : (
                  topScorers.slice(0, 7).map((scorer, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.8rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ 
                          fontWeight: '800', 
                          color: idx === 0 ? 'var(--gold)' : idx === 1 ? 'var(--cyan)' : 'var(--text-muted)',
                          fontSize: '0.9rem',
                          width: '15px',
                          textAlign: 'center'
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '1.3rem' }}>{getTeamFlag(scorer.team)}</span>
                        <div>
                          <div style={{ fontWeight: '600', color: '#fff' }}>{scorer.player}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{translateTeam(scorer.team, lang)}</div>
                        </div>
                      </div>
                      <div style={{ 
                        fontFamily: 'var(--font-eng)',
                        fontWeight: '800',
                        fontSize: '1rem',
                        color: 'var(--gold)',
                        background: 'rgba(229, 179, 35, 0.1)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px'
                      }}>
                        {scorer.goals} {t('goalsUnit', lang)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'standings' && (
          <StandingsTable standings={standings} lang={lang} />
        )}
        
        {activeTab === 'matches' && (
          <MatchList matches={matches} onMatchClick={setSelectedMatch} lang={lang} />
        )}

        {activeTab === 'knockout' && (
          <KnockoutBracket standings={standings} lang={lang} />
        )}

        {activeTab === 'leaderboard' && (
          <div className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card-title-bar">
              <h2 className="card-title">{t('friendLeaderboardTitle', lang)}</h2>
            </div>

            {/* ส่วนลงชื่อเข้าใช้ / ตั้งชื่อเล่น */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {!username ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--gold)' }}>
                    {t('registerLabel', lang)}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text"
                      className="update-select"
                      placeholder="e.g. Bobby, Somchai"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      style={{ flexGrow: 1, background: '#0f172a', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 1rem', color: '#fff' }}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        const trimmed = tempUsername.trim();
                        if (trimmed) {
                          localStorage.setItem('username', trimmed);
                          setUsername(trimmed);
                          fetchLeaderboard();
                        }
                      }}
                    >
                      {t('registerBtn', lang)}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>👋</span>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--cyan)' }}>
                      {t('userWelcome', lang).replace('{name}', username)}
                    </span>
                  </div>
                  <button 
                    className="btn"
                    style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                    onClick={() => {
                      localStorage.removeItem('username');
                      setUsername('');
                      setTempUsername('');
                    }}
                  >
                    {t('changeUserBtn', lang)}
                  </button>
                </div>
              )}
            </div>

            {/* ตารางจัดอันดับ */}
            <div className="standings-table-container">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>{t('lbRank', lang)}</th>
                    <th style={{ textAlign: 'left' }}>{t('lbName', lang)}</th>
                    <th style={{ width: '180px', textAlign: 'center' }}>{t('lbExact', lang)}</th>
                    <th style={{ width: '180px', textAlign: 'center' }}>{t('lbOutcome', lang)}</th>
                    <th style={{ width: '120px', textAlign: 'center', fontWeight: '800', color: 'var(--gold)' }}>{t('lbPoints', lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        {t('noLbData', lang)}
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((userRow, index) => {
                      const isCurrentUser = userRow.username === username;
                      return (
                        <tr key={userRow.username} style={{ background: isCurrentUser ? 'rgba(6, 182, 212, 0.08)' : 'transparent', borderLeft: isCurrentUser ? '3px solid var(--cyan)' : 'none' }}>
                          <td style={{ textAlign: 'center' }}>
                            <div className="pos-badge" style={{ background: index === 0 ? 'var(--gold)' : index === 1 ? 'var(--cyan)' : 'rgba(255,255,255,0.05)' }}>
                              {index + 1}
                            </div>
                          </td>
                          <td style={{ fontWeight: isCurrentUser ? '700' : 'normal', color: isCurrentUser ? 'var(--cyan)' : '#fff' }}>
                            {userRow.username} {isCurrentUser && ' (You)'}
                          </td>
                          <td className="number" style={{ textAlign: 'center' }}>{userRow.exact}</td>
                          <td className="number" style={{ textAlign: 'center' }}>{userRow.outcome}</td>
                          <td className="number" style={{ textAlign: 'center', fontWeight: '800', fontSize: '1.1rem', color: index === 0 ? 'var(--gold)' : '#fff' }}>
                            {userRow.points}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* หน้าจอแสดงผลแบบ Modal รายละเอียดแมตช์เชิงลึก */}
      {selectedMatch && (
        <MatchModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
          onUpdateScore={handleUpdateScore}
          isSimulationRunning={isSimulationRunning}
          lang={lang}
          username={username}
          API_BASE={API_BASE}
        />
      )}

      {/* ส่วนท้ายแสดงรายละเอียดลิขสิทธิ์ */}
      <footer className="dashboard-footer">
        <p>{t('footerTitle', lang)} <span>fifa.com</span></p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
          {t('footerSub', lang)}
        </p>
      </footer>
    </div>
  );
}

export default App;
