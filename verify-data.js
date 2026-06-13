// verify-data.js - สคริปต์ทดสอบความถูกต้องในการคำนวณและจัดอันดับตารางคะแนน

// คัดลอกตรรกะการคำนวณตารางคะแนนจากเซิร์ฟเวอร์หลักมาตรวจสอบความถูกต้อง
function testCalculateStandings(mockMatches, mockGroups) {
  const standings = {};

  for (const [groupName, teamList] of Object.entries(mockGroups)) {
    standings[groupName] = teamList.map(teamName => ({
      team: teamName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      form: []
    }));

    const groupMatches = mockMatches.filter(m => m.group === groupName && m.status !== 'SCHEDULED');

    groupMatches.forEach(m => {
      const t1 = standings[groupName].find(t => t.team === m.team1);
      const t2 = standings[groupName].find(t => t.team === m.team2);

      if (t1 && t2) {
        t1.played++;
        t2.played++;
        t1.gf += m.score1;
        t1.ga += m.score2;
        t2.gf += m.score2;
        t2.ga += m.score1;

        if (m.score1 > m.score2) {
          t1.won++;
          t1.pts += 3;
          t1.form.push('W');
          t2.lost++;
          t2.form.push('L');
        } else if (m.score1 < m.score2) {
          t2.won++;
          t2.pts += 3;
          t2.form.push('W');
          t1.lost++;
          t1.form.push('L');
        } else {
          t1.drawn++;
          t1.pts += 1;
          t1.form.push('D');
          t2.drawn++;
          t2.pts += 1;
          t2.form.push('D');
        }
      }
    });

    standings[groupName].forEach(team => {
      team.gd = team.gf - team.ga;
    });

    // เรียงตาม Points -> Goal Difference -> Goals For
    standings[groupName].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
  }

  return standings;
}

// ----------------------------------------------------
// ข้อมูลสำหรับกรณีทดสอบ (Test Cases)
// ----------------------------------------------------
const mockGroups = {
  TEST_A: ['ทีม A', 'ทีม B', 'ทีม C', 'ทีม D']
};

const mockMatches = [
  // นัดที่ 1: ทีม A ชนะ ทีม B 3-1
  { group: 'TEST_A', team1: 'ทีม A', team2: 'ทีม B', score1: 3, score2: 1, status: 'FINISHED' },
  // นัดที่ 1: ทีม C เสมอ ทีม D 2-2
  { group: 'TEST_A', team1: 'ทีม C', team2: 'ทีม D', score1: 2, score2: 2, status: 'FINISHED' },
  // นัดที่ 2: ทีม A แพ้ ทีม C 0-2
  { group: 'TEST_A', team1: 'ทีม A', team2: 'ทีม C', score1: 0, score2: 2, status: 'FINISHED' },
  // นัดที่ 2: ทีม B เสมอ ทีม D 1-1
  { group: 'TEST_A', team1: 'ทีม B', team2: 'ทีม D', score1: 1, score2: 1, status: 'FINISHED' }
];

console.log('--- เริ่มการตรวจสอบระบบคำนวณตารางคะแนน ---');

const result = testCalculateStandings(mockMatches, mockGroups);
const groupA = result['TEST_A'];

// ตรวจสอบความถูกต้อง
let errorsCount = 0;

// คาดหวังอันดับ 1: ทีม C (แข่ง 2, ชนะ 1, เสมอ 1, แพ้ 0, ได้ 4, เสีย 2, GD +2, คะแนน 4)
const teamC = groupA[0];
if (teamC.team !== 'ทีม C' || teamC.pts !== 4 || teamC.gd !== 2) {
  console.error('❌ ข้อผิดพลาด: จัดอันดับ ทีม C ไม่ถูกต้อง', teamC);
  errorsCount++;
} else {
  console.log('✅ ผ่าน: ทีม C อันดับที่ 1 ถูกต้อง (4 คะแนน, ผลต่าง +2)');
}

// คาดหวังอันดับ 2: ทีม A (แข่ง 2, ชนะ 1, เสมอ 0, แพ้ 1, ได้ 3, เสีย 3, GD 0, คะแนน 3)
const teamA = groupA[1];
if (teamA.team !== 'ทีม A' || teamA.pts !== 3 || teamA.gd !== 0) {
  console.error('❌ ข้อผิดพลาด: จัดอันดับ ทีม A ไม่ถูกต้อง', teamA);
  errorsCount++;
} else {
  console.log('✅ ผ่าน: ทีม A อันดับที่ 2 ถูกต้อง (3 คะแนน, ผลต่าง 0)');
}

// คาดหวังอันดับ 3: ทีม D (แข่ง 2, ชนะ 0, เสมอ 2, แพ้ 0, ได้ 3, เสีย 3, GD 0, คะแนน 2)
const teamD = groupA[2];
if (teamD.team !== 'ทีม D' || teamD.pts !== 2 || teamD.gd !== 0) {
  console.error('❌ ข้อผิดพลาด: จัดอันดับ ทีม D ไม่ถูกต้อง', teamD);
  errorsCount++;
} else {
  console.log('✅ ผ่าน: ทีม D อันดับที่ 3 ถูกต้อง (2 คะแนน, ผลต่าง 0)');
}

// คาดหวังอันดับ 4: ทีม B (แข่ง 2, ชนะ 0, เสมอ 1, แพ้ 1, ได้ 2, เสีย 4, GD -2, คะแนน 1)
const teamB = groupA[3];
if (teamB.team !== 'ทีม B' || teamB.pts !== 1 || teamB.gd !== -2) {
  console.error('❌ ข้อผิดพลาด: จัดอันดับ ทีม B ไม่ถูกต้อง', teamB);
  errorsCount++;
} else {
  console.log('✅ ผ่าน: ทีม B อันดับที่ 4 ถูกต้อง (1 คะแนน, ผลต่าง -2)');
}

console.log('\n--- สรุปผลการตรวจสอบ ---');
if (errorsCount === 0) {
  console.log('🎉 สรุป: ระบบคำนวณและจัดอันดับถูกต้องสมบูรณ์ 100%');
} else {
  console.log(`❌ พบข้อผิดพลาดทั้งหมด ${errorsCount} จุด`);
}
