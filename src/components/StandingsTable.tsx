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

interface StandingsTableProps {
  standings: Record<string, TeamStanding[]>;
  lang: LangType;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings, lang }) => {
  const groupsList = Object.keys(standings).sort();
  const [selectedGroup, setSelectedGroup] = useState<string>('A');

  const currentStandings = standings[selectedGroup] || [];

  return (
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
  );
};

