import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ข้อมูลกลุ่มสายการแข่งขัน (Groups A - L)
const GROUPS = {
  A: ['เม็กซิโก', 'แอฟริกาใต้', 'เกาหลีใต้', 'เช็กเกีย'],
  B: ['แคนาดา', 'บอสเนียและเฮอร์เซโกวีนา', 'กาตาร์', 'สวิตเซอร์แลนด์'],
  C: ['บราซิล', 'โมร็อกโก', 'ไฮติ', 'สกอตแลนด์'],
  D: ['สหรัฐอเมริกา', 'ปารากวัย', 'ออสเตรเลีย', 'ตุรกี'],
  E: ['เยอรมนี', 'เอกวาดอร์', 'ไอวอรีโคสต์', 'กูราเซา'],
  F: ['เนเธอร์แลนด์', 'สวีเดน', 'ญี่ปุ่น', 'ตูนิเซีย'],
  G: ['เบลเยียม', 'อียิปต์', 'อิหร่าน', 'นิวซีแลนด์'],
  H: ['สเปน', 'อุรุกวัย', 'เคปเวิร์ด', 'ซาอุดีอาระเบีย'],
  I: ['ฝรั่งเศส', 'นอร์เวย์', 'เซเนกัล', 'อิรัก'],
  J: ['อาร์เจนตินา', 'ออสเตรีย', 'แอลจีเรีย', 'จอร์แดน'],
  K: ['โปรตุเกส', 'โคลอมเบีย', 'ดีอาร์ คองโก', 'อุซเบกิสถาน'],
  L: ['อังกฤษ', 'โครเอเชีย', 'กานา', 'ปานามา']
};

// รายชื่อนักเตะดาวดังจำลองเหตุการณ์
const TEAM_PLAYERS = {
  'เม็กซิโก': ['Raúl Jiménez', 'Julián Quiñones', 'Hirving Lozano', 'Santiago Giménez'],
  'แอฟริกาใต้': ['Percy Tau', 'Themba Zwane', 'Teboho Mokoena'],
  'เกาหลีใต้': ['Son Heung-min', 'Hwang Hee-chan', 'Lee Kang-in', 'Oh Hyeon-gyu', 'Hwang In-beom'],
  'เช็กเกีย': ['Patrik Schick', 'Tomas Soucek', 'Adam Hlozek', 'Ladislav Krejci'],
  'แคนาดา': ['Alphonso Davies', 'Jonathan David', 'Cyle Larin', 'Tajon Buchanan'],
  'บอสเนียและเฮอร์เซโกวีนา': ['Edin Dzeko', 'Ermedin Demirovic', 'Sead Kolasinac'],
  'กาตาร์': ['Almoez Ali', 'Akram Afif', 'Hassan Al-Haydos'],
  'สวิตเซอร์แลนด์': ['Granit Xhaka', 'Xherdan Shaqiri', 'Breel Embolo', 'Manuel Akanji'],
  'บราซิล': ['Vinicius Jr', 'Rodrygo', 'Neymar Jr', 'Raphinha', 'Gabriel Martinelli'],
  'โมร็อกโก': ['Achraf Hakimi', 'Hakim Ziyech', 'Youssef En-Nesyri', 'Sofyan Amrabat'],
  'ไฮติ': ['Duckens Nazon', 'Frantzdy Pierrot'],
  'สกอตแลนด์': ['Scott McTominay', 'John McGinn', 'Andy Robertson', 'Che Adams'],
  'สหรัฐอเมริกา': ['Christian Pulisic', 'Weston McKennie', 'Timothy Weah', 'Folarin Balogun', 'Gio Reyna'],
  'ปารากวัย': ['Julio Enciso', 'Miguel Almirón', 'Antonio Sanabria', 'Maurício'],
  'ออสเตรเลีย': ['Mathew Leckie', 'Craig Goodwin', 'Mitchell Duke'],
  'ตุรกี': ['Hakan Calhanoglu', 'Arda Güler', 'Kenan Yildiz', 'Kerem Akturkoglu'],
  'เยอรมนี': ['Florian Wirtz', 'Jamal Musiala', 'Kai Havertz', 'Niclas Füllkrug', 'Leroy Sané'],
  'เอกวาดอร์': ['Enner Valencia', 'Moisés Caicedo', 'Piero Hincapié'],
  'ไอวอรีโคสต์': ['Sébastien Haller', 'Franck Kessié', 'Simon Adingra'],
  'กูราเซา': ['Leandro Bacuna', 'Juninho Bacuna'],
  'เนเธอร์แลนด์': ['Memphis Depay', 'Cody Gakpo', 'Frenkie de Jong', 'Virgil van Dijk'],
  'สวีเดน': ['Alexander Isak', 'Dejan Kulusevski', 'Viktor Gyökeres'],
  'ญี่ปุ่น': ['Kaoru Mitoma', 'Wataru Endo', 'Takefusa Kubo', 'Ritsu Doan'],
  'ตูนิเซีย': ['Youssef Msakni', 'Elias Achouri'],
  'เบลเยียม': ['Kevin De Bruyne', 'Romelu Lukaku', 'Leandro Trossard', 'Jeremy Doku'],
  'อียิปต์': ['Mohamed Salah', 'Mostafa Mohamed', 'Trezeguet'],
  'อิหร่าน': ['Sardar Azmoun', 'Mehdi Taremi', 'Alireza Jahanbakhsh'],
  'นิวซีแลนด์': ['Chris Wood', 'Liberato Cacace'],
  'สเปน': ['Lamine Yamal', 'Nico Williams', 'Alvaro Morata', 'Pedri', 'Rodri'],
  'อุรุกวัย': ['Darwin Núñez', 'Luis Suárez', 'Federico Valverde', 'Ronald Araújo'],
  'เคปเวิร์ด': ['Ryan Mendes', 'Garry Rodrigues'],
  'ซาอุดีอาระเบีย': ['Salem Al-Dawsari', 'Firas Al-Buraikan'],
  'ฝรั่งเศส': ['Kylian Mbappé', 'Antoine Griezmann', 'Ousmane Dembélé', 'Olivier Giroud'],
  'นอร์เวย์': ['Erling Haaland', 'Martin Ødegaard', 'Alexander Sørloth'],
  'เซเนกัล': ['Sadio Mané', 'Nicolas Jackson', 'Ismaïla Sarr'],
  'อิรัก': ['Aymen Hussein', 'Mohanad Ali'],
  'อาร์เจนตินา': ['Lionel Messi', 'Lautaro Martínez', 'Julián Álvarez', 'Angel Di Maria', 'Enzo Fernández'],
  'ออสเตรีย': ['Marcel Sabitzer', 'Konrad Laimer', 'Marko Arnautović'],
  'แอลจีเรีย': ['Riyad Mahrez', 'Baghdad Bounedjah', 'Houssem Aouar'],
  'จอร์แดน': ['Mousa Al-Tamari', 'Yazan Al-Naimat'],
  'โปรตุเกส': ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Rafael Leão'],
  'โคลอมเบีย': ['Luis Díaz', 'James Rodríguez', 'Jhon Durán'],
  'ดีอาร์ คองโก': ['Yoane Wissa', 'Chancel Mbemba'],
  'อุซเบกิสถาน': ['Eldor Shomurodov', 'Abbosbek Fayzullaev'],
  'อังกฤษ': ['Jude Bellingham', 'Harry Kane', 'Bukayo Saka', 'Phil Foden', 'Cole Palmer'],
  'ปานามา': ['Adalberto Carrasquilla', 'Ismael Díaz'],
  'โครเอเชีย': ['Luka Modrić', 'Andrej Kramarić', 'Mateo Kovačić', 'Ivan Perišić'],
  'กานา': ['Mohammed Kudus', 'Inaki Williams', 'Jordan Ayew']
};

// รายการแมตช์การแข่งขันทั้งหมด (Matchday 1 ครบทั้ง 12 กลุ่ม)
let INITIAL_MATCHES = [
  {
    "id": 1,
    "group": "A",
    "team1": "เม็กซิโก",
    "team2": "แอฟริกาใต้",
    "score1": 2,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-11T13:00:00-05:00",
    "venue": "สนามกีฬากลางเม็กซิโกซิตี้ (Estadio Azteca)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 2,
    "group": "A",
    "team1": "เกาหลีใต้",
    "team2": "เช็กเกีย",
    "score1": 2,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-11T20:00:00-05:00",
    "venue": "สนามกีฬากัวดาลาฮารา (Estadio Akron)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 3,
    "group": "B",
    "team1": "แคนาดา",
    "team2": "บอสเนียและเฮอร์เซโกวีนา",
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-12T15:00:00-04:00",
    "venue": "สนามกีฬาโตรอนโต (BMO Field)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 4,
    "group": "D",
    "team1": "สหรัฐอเมริกา",
    "team2": "ปารากวัย",
    "score1": 4,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-12T18:00:00-07:00",
    "venue": "โลสแอนเจลิส สเตเดียม (SoFi Stadium)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 5,
    "group": "C",
    "team1": "ไฮติ",
    "team2": "สกอตแลนด์",
    "score1": 0,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-13T21:00:00-04:00",
    "venue": "ยิลเล็ตต์ สเตเดียม (Boston)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 6,
    "group": "D",
    "team1": "ออสเตรเลีย",
    "team2": "ตุรกี",
    "score1": 2,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-13T21:00:00-07:00",
    "venue": "บีซี เพลส (Vancouver)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 7,
    "group": "C",
    "team1": "บราซิล",
    "team2": "โมร็อกโก",
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-13T18:00:00-04:00",
    "venue": "เม็ทไลฟ์ สเตเดียม (East Rutherford)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 8,
    "group": "B",
    "team1": "กาตาร์",
    "team2": "สวิตเซอร์แลนด์",
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-13T12:00:00-07:00",
    "venue": "ลีวายส์ สเตเดียม (Santa Clara)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 9,
    "group": "E",
    "team1": "ไอวอรีโคสต์",
    "team2": "เอกวาดอร์",
    "score1": 1,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-14T19:00:00-04:00",
    "venue": "ลินคอล์น ไฟแนนเชียล ฟิลด์ (Philadelphia)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 10,
    "group": "E",
    "team1": "เยอรมนี",
    "team2": "กูราเซา",
    "score1": 7,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-14T12:00:00-05:00",
    "venue": "เอ็นอาร์จี สเตเดียม (Houston)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 11,
    "group": "F",
    "team1": "เนเธอร์แลนด์",
    "team2": "ญี่ปุ่น",
    "score1": 2,
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-14T15:00:00-05:00",
    "venue": "เอทีแอนด์ที สเตเดียม (Arlington)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 12,
    "group": "F",
    "team1": "สวีเดน",
    "team2": "ตูนิเซีย",
    "score1": 5,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-14T20:00:00-05:00",
    "venue": "สนามกีฬาบีบีวีเอ (Estadio Monterrey)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 13,
    "group": "G",
    "team1": "อิหร่าน",
    "team2": "นิวซีแลนด์",
    "score1": 2,
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-15T18:00:00-07:00",
    "venue": "โลสแอนเจลิส สเตเดียม (SoFi Stadium)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 14,
    "group": "H",
    "team1": "สเปน",
    "team2": "เคปเวิร์ด",
    "score1": 0,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-15T12:00:00-04:00",
    "venue": "เมอร์เซเดส-เบนซ์ สเตเดียม (Atlanta)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 15,
    "group": "G",
    "team1": "เบลเยียม",
    "team2": "อียิปต์",
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-15T12:00:00-07:00",
    "venue": "สนามกีฬาลูเมนฟิลด์ (Seattle)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 16,
    "group": "H",
    "team1": "ซาอุดีอาระเบีย",
    "team2": "อุรุกวัย",
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-15T18:00:00-04:00",
    "venue": "สนามกีฬาฮาร์ดร็อค (Miami)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 17,
    "group": "I",
    "team1": "ฝรั่งเศส",
    "team2": "เซเนกัล",
    "score1": 3,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-16T15:00:00-04:00",
    "venue": "เม็ทไลฟ์ สเตเดียม (East Rutherford)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 18,
    "group": "I",
    "team1": "อิรัก",
    "team2": "นอร์เวย์",
    "score1": 1,
    "score2": 4,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-16T18:00:00-04:00",
    "venue": "ยิลเล็ตต์ สเตเดียม (Boston)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 19,
    "group": "J",
    "team1": "อาร์เจนตินา",
    "team2": "แอลจีเรีย",
    "score1": 3,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-16T20:00:00-05:00",
    "venue": "สนามกีฬาลูกศร (Arrowhead Stadium)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 20,
    "group": "J",
    "team1": "ออสเตรีย",
    "team2": "จอร์แดน",
    "score1": 3,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-16T21:00:00-07:00",
    "venue": "ลีวายส์ สเตเดียม (Santa Clara)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 21,
    "group": "K",
    "team1": "โปรตุเกส",
    "team2": "ดีอาร์ คองโก",
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-17T12:00:00-05:00",
    "venue": "เอ็นอาร์จี สเตเดียม (Houston)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 22,
    "group": "L",
    "team1": "อังกฤษ",
    "team2": "โครเอเชีย",
    "score1": 4,
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-17T15:00:00-05:00",
    "venue": "เอทีแอนด์ที สเตเดียม (Arlington)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 23,
    "group": "K",
    "team1": "อุซเบกิสถาน",
    "team2": "โคลอมเบีย",
    "score1": 1,
    "score2": 3,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-17T20:00:00-05:00",
    "venue": "สนามกีฬากลางเม็กซิโกซิตี้ (Estadio Azteca)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 24,
    "group": "L",
    "team1": "กานา",
    "team2": "ปานามา",
    "score1": 1,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-17T19:00:00-04:00",
    "venue": "สนามกีฬาโตรอนโต (BMO Field)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 25,
    "group": "A",
    "team1": "เม็กซิโก",
    "team2": "เกาหลีใต้",
    "score1": 1,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-18T19:00:00-05:00",
    "venue": "สนามกีฬากัวดาลาฮารา (Estadio Akron)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 26,
    "group": "B",
    "team1": "สวิตเซอร์แลนด์",
    "team2": "บอสเนียและเฮอร์เซโกวีนา",
    "score1": 4,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-18T12:00:00-07:00",
    "venue": "โลสแอนเจลิส สเตเดียม (SoFi Stadium)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 27,
    "group": "B",
    "team1": "แคนาดา",
    "team2": "กาตาร์",
    "score1": 6,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-18T15:00:00-07:00",
    "venue": "บีซี เพลส (Vancouver)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 28,
    "group": "A",
    "team1": "เช็กเกีย",
    "team2": "แอฟริกาใต้",
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-18T12:00:00-04:00",
    "venue": "เมอร์เซเดส-เบนซ์ สเตเดียม (Atlanta)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 29,
    "group": "C",
    "team1": "บราซิล",
    "team2": "ไฮติ",
    "score1": 3,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-19T21:00:00-04:00",
    "venue": "ลินคอล์น ไฟแนนเชียล ฟิลด์ (Philadelphia)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 30,
    "group": "C",
    "team1": "สกอตแลนด์",
    "team2": "โมร็อกโก",
    "score1": 0,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-19T18:00:00-04:00",
    "venue": "ยิลเล็ตต์ สเตเดียม (Boston)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 31,
    "group": "D",
    "team1": "สหรัฐอเมริกา",
    "team2": "ออสเตรเลีย",
    "score1": 2,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-19T12:00:00-07:00",
    "venue": "สนามกีฬาลูเมนฟิลด์ (Seattle)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 32,
    "group": "D",
    "team1": "ตุรกี",
    "team2": "ปารากวัย",
    "score1": 0,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-19T20:00:00-07:00",
    "venue": "ลีวายส์ สเตเดียม (Santa Clara)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 33,
    "group": "E",
    "team1": "เยอรมนี",
    "team2": "ไอวอรีโคสต์",
    "score1": 2,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-20T16:00:00-04:00",
    "venue": "สนามกีฬาโตรอนโต (BMO Field)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 34,
    "group": "E",
    "team1": "เอกวาดอร์",
    "team2": "กูราเซา",
    "score1": 0,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-20T19:00:00-05:00",
    "venue": "สนามกีฬาลูกศร (Arrowhead Stadium)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 35,
    "group": "F",
    "team1": "เนเธอร์แลนด์",
    "team2": "สวีเดน",
    "score1": 5,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-20T12:00:00-05:00",
    "venue": "เอ็นอาร์จี สเตเดียม (Houston)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 36,
    "group": "F",
    "team1": "ตูนิเซีย",
    "team2": "ญี่ปุ่น",
    "score1": 0,
    "score2": 4,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-20T22:00:00-05:00",
    "venue": "สนามกีฬาบีบีวีเอ (Estadio Monterrey)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 37,
    "group": "G",
    "team1": "เบลเยียม",
    "team2": "อิหร่าน",
    "score1": 0,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-21T12:00:00-07:00",
    "venue": "โลสแอนเจลิส สเตเดียม (SoFi Stadium)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 38,
    "group": "G",
    "team1": "นิวซีแลนด์",
    "team2": "อียิปต์",
    "score1": 1,
    "score2": 3,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-21T18:00:00-07:00",
    "venue": "บีซี เพลส (Vancouver)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 39,
    "group": "H",
    "team1": "สเปน",
    "team2": "ซาอุดีอาระเบีย",
    "score1": 4,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-21T12:00:00-04:00",
    "venue": "เมอร์เซเดส-เบนซ์ สเตเดียม (Atlanta)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 40,
    "group": "H",
    "team1": "อุรุกวัย",
    "team2": "เคปเวิร์ด",
    "score1": 2,
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-21T18:00:00-04:00",
    "venue": "สนามกีฬาฮาร์ดร็อค (Miami)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 41,
    "group": "I",
    "team1": "ฝรั่งเศส",
    "team2": "อิรัก",
    "score1": 3,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-22T17:00:00-04:00",
    "venue": "ลินคอล์น ไฟแนนเชียล ฟิลด์ (Philadelphia)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 42,
    "group": "I",
    "team1": "นอร์เวย์",
    "team2": "เซเนกัล",
    "score1": 3,
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-22T20:00:00-04:00",
    "venue": "เม็ทไลฟ์ สเตเดียม (East Rutherford)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 43,
    "group": "J",
    "team1": "อาร์เจนตินา",
    "team2": "ออสเตรีย",
    "score1": 2,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-22T12:00:00-05:00",
    "venue": "เอทีแอนด์ที สเตเดียม (Arlington)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 44,
    "group": "J",
    "team1": "จอร์แดน",
    "team2": "แอลจีเรีย",
    "score1": 1,
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-22T20:00:00-07:00",
    "venue": "ลีวายส์ สเตเดียม (Santa Clara)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 45,
    "group": "K",
    "team1": "โปรตุเกส",
    "team2": "อุซเบกิสถาน",
    "score1": 5,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-23T12:00:00-05:00",
    "venue": "เอ็นอาร์จี สเตเดียม (Houston)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 46,
    "group": "L",
    "team1": "ปานามา",
    "team2": "โครเอเชีย",
    "score1": 0,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-23T19:00:00-04:00",
    "venue": "สนามกีฬาโตรอนโต (BMO Field)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 47,
    "group": "K",
    "team1": "โคลอมเบีย",
    "team2": "ดีอาร์ คองโก",
    "score1": 0,
    "score2": 0,
    "status": "LIVE",
    "minute": 45,
    "date": "2026-06-23T20:00:00-05:00",
    "venue": "สนามกีฬากัวดาลาฮารา (Estadio Akron)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 48,
    "group": "L",
    "team1": "อังกฤษ",
    "team2": "กานา",
    "score1": 0,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-23T16:00:00-04:00",
    "venue": "ยิลเล็ตต์ สเตเดียม (Boston)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 49,
    "group": "C",
    "team1": "สกอตแลนด์",
    "team2": "บราซิล",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-24T18:00:00-04:00",
    "venue": "สนามกีฬาฮาร์ดร็อค (Miami)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 50,
    "group": "C",
    "team1": "โมร็อกโก",
    "team2": "ไฮติ",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-24T18:00:00-04:00",
    "venue": "เมอร์เซเดส-เบนซ์ สเตเดียม (Atlanta)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 51,
    "group": "A",
    "team1": "แอฟริกาใต้",
    "team2": "เกาหลีใต้",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-24T19:00:00-05:00",
    "venue": "สนามกีฬาบีบีวีเอ (Estadio Monterrey)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 52,
    "group": "A",
    "team1": "เช็กเกีย",
    "team2": "เม็กซิโก",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-24T19:00:00-05:00",
    "venue": "สนามกีฬากลางเม็กซิโกซิตี้ (Estadio Azteca)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 53,
    "group": "B",
    "team1": "บอสเนียและเฮอร์เซโกวีนา",
    "team2": "กาตาร์",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-24T12:00:00-07:00",
    "venue": "สนามกีฬาลูเมนฟิลด์ (Seattle)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 54,
    "group": "B",
    "team1": "สวิตเซอร์แลนด์",
    "team2": "แคนาดา",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-24T12:00:00-07:00",
    "venue": "บีซี เพลส (Vancouver)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 55,
    "group": "E",
    "team1": "กูราเซา",
    "team2": "ไอวอรีโคสต์",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-25T16:00:00-04:00",
    "venue": "ลินคอล์น ไฟแนนเชียล ฟิลด์ (Philadelphia)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 56,
    "group": "E",
    "team1": "เอกวาดอร์",
    "team2": "เยอรมนี",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-25T16:00:00-04:00",
    "venue": "เม็ทไลฟ์ สเตเดียม (East Rutherford)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 57,
    "group": "D",
    "team1": "ปารากวัย",
    "team2": "ออสเตรเลีย",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-25T19:00:00-07:00",
    "venue": "ลีวายส์ สเตเดียม (Santa Clara)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 58,
    "group": "D",
    "team1": "ตุรกี",
    "team2": "สหรัฐอเมริกา",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-25T19:00:00-07:00",
    "venue": "โลสแอนเจลิส สเตเดียม (SoFi Stadium)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 59,
    "group": "F",
    "team1": "ญี่ปุ่น",
    "team2": "สวีเดน",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-25T18:00:00-05:00",
    "venue": "เอทีแอนด์ที สเตเดียม (Arlington)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 60,
    "group": "F",
    "team1": "ตูนิเซีย",
    "team2": "เนเธอร์แลนด์",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-25T18:00:00-05:00",
    "venue": "สนามกีฬาลูกศร (Arrowhead Stadium)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 61,
    "group": "I",
    "team1": "เซเนกัล",
    "team2": "อิรัก",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-26T15:00:00-04:00",
    "venue": "สนามกีฬาโตรอนโต (BMO Field)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 62,
    "group": "I",
    "team1": "นอร์เวย์",
    "team2": "ฝรั่งเศส",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-26T15:00:00-04:00",
    "venue": "ยิลเล็ตต์ สเตเดียม (Boston)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 63,
    "group": "G",
    "team1": "อียิปต์",
    "team2": "อิหร่าน",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-26T20:00:00-07:00",
    "venue": "สนามกีฬาลูเมนฟิลด์ (Seattle)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 64,
    "group": "G",
    "team1": "นิวซีแลนด์",
    "team2": "เบลเยียม",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-26T20:00:00-07:00",
    "venue": "บีซี เพลส (Vancouver)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 65,
    "group": "H",
    "team1": "เคปเวิร์ด",
    "team2": "ซาอุดีอาระเบีย",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-26T19:00:00-05:00",
    "venue": "เอ็นอาร์จี สเตเดียม (Houston)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 66,
    "group": "H",
    "team1": "อุรุกวัย",
    "team2": "สเปน",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-26T18:00:00-05:00",
    "venue": "สนามกีฬากัวดาลาฮารา (Estadio Akron)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 67,
    "group": "L",
    "team1": "ปานามา",
    "team2": "อังกฤษ",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-27T17:00:00-04:00",
    "venue": "เม็ทไลฟ์ สเตเดียม (East Rutherford)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 68,
    "group": "L",
    "team1": "โครเอเชีย",
    "team2": "กานา",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-27T17:00:00-04:00",
    "venue": "ลินคอล์น ไฟแนนเชียล ฟิลด์ (Philadelphia)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 69,
    "group": "J",
    "team1": "แอลจีเรีย",
    "team2": "ออสเตรีย",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-27T21:00:00-05:00",
    "venue": "สนามกีฬาลูกศร (Arrowhead Stadium)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 70,
    "group": "J",
    "team1": "จอร์แดน",
    "team2": "อาร์เจนตินา",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-27T21:00:00-05:00",
    "venue": "เอทีแอนด์ที สเตเดียม (Arlington)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 71,
    "group": "K",
    "team1": "โคลอมเบีย",
    "team2": "โปรตุเกส",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-27T19:30:00-04:00",
    "venue": "สนามกีฬาฮาร์ดร็อค (Miami)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 72,
    "group": "K",
    "team1": "ดีอาร์ คองโก",
    "team2": "อุซเบกิสถาน",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-06-27T19:30:00-04:00",
    "venue": "เมอร์เซเดส-เบนซ์ สเตเดียม (Atlanta)",
    "events": [],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        0,
        0
      ],
      "shotsOnTarget": [
        0,
        0
      ],
      "fouls": [
        0,
        0
      ],
      "corners": [
        0,
        0
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  }
];


// สำเนาข้อมูลเพื่อการจำลองเหตุการณ์
let matches = JSON.parse(JSON.stringify(INITIAL_MATCHES));

// สำหรับควบคุมระบบการจำลองเหตุการณ์ (Simulation State)
let isSimulationRunning = false;
let simulationInterval = null;
let newEventsList = []; // เก็บประวัติเหตุการณ์จำลองเพื่อทำ Ticker

// เก็บข้อมูลคำทายผลจากผู้ใช้งาน (Seed ข้อมูลเริ่มต้นเพื่อตารางสวยงาม)
let userPredictions = [
  { username: 'กูรูสมชาย', matchId: 1, score1: 2, score2: 0 },
  { username: 'กูรูแป๊ะ', matchId: 1, score1: 1, score2: 0 },
  { username: 'Admin', matchId: 1, score1: 3, score2: 1 },

  { username: 'กูรูสมชาย', matchId: 2, score1: 2, score2: 1 },
  { username: 'กูรูแป๊ะ', matchId: 2, score1: 1, score2: 1 },
  { username: 'Admin', matchId: 2, score1: 2, score2: 1 },

  { username: 'กูรูสมชาย', matchId: 3, score1: 2, score2: 2 },
  { username: 'กูรูแป๊ะ', matchId: 3, score1: 1, score2: 1 },
  { username: 'Admin', matchId: 3, score1: 1, score2: 2 },

  { username: 'กูรูสมชาย', matchId: 4, score1: 3, score2: 1 },
  { username: 'กูรูแป๊ะ', matchId: 4, score1: 4, score2: 1 },
  { username: 'Admin', matchId: 4, score1: 2, score2: 0 }
];

// ฟังก์ชันสุ่มผู้ทำประตู
function getRandomPlayer(team) {
  const players = TEAM_PLAYERS[team] || ['ผู้เล่นปริศนา'];
  const randomIndex = Math.floor(Math.random() * players.length);
  return players[randomIndex];
}

// เริ่มการจำลอง
function startSimulation() {
  if (isSimulationRunning) return;
  isSimulationRunning = true;
  newEventsList = [];

  // ปรับสถานะคู่ที่กำหนดให้เริ่มแข่งสดในวันแรก (แคนาดา vs บอสเนีย, สหรัฐ vs ปารากวัย)
  matches = matches.map(m => {
    if (m.id === 3 || m.id === 7 || m.id === 4) {
      if (m.status === 'SCHEDULED') {
        return {
          ...m,
          status: 'LIVE',
          minute: 1,
          score1: 0,
          score2: 0,
          events: [],
          stats: {
            possession: [50, 50],
            shots: [0, 0],
            shotsOnTarget: [0, 0],
            fouls: [0, 0],
            corners: [0, 0],
            offsides: [0, 0],
            yellowCards: [0, 0],
            redCards: [0, 0]
          }
        };
      }
    }
    return m;
  });

  simulationInterval = setInterval(() => {
    let allFinished = true;

    matches = matches.map(m => {
      if (m.status === 'LIVE') {
        allFinished = false;
        const nextMin = m.minute + 1;

        // สุ่มเพิ่มสถิติต่างๆ ในแต่ละนาที
        const newStats = { ...m.stats };
        newStats.possession = [
          Math.min(75, Math.max(25, newStats.possession[0] + Math.floor(Math.random() * 7) - 3)),
          0
        ];
        newStats.possession[1] = 100 - newStats.possession[0];

        // สุ่มเพิ่มเตะมุม ยิง ฟาวล์
        if (Math.random() < 0.15) newStats.shots[0]++;
        if (Math.random() < 0.15) newStats.shots[1]++;
        if (Math.random() < 0.08) newStats.shotsOnTarget[0]++;
        if (Math.random() < 0.08) newStats.shotsOnTarget[1]++;
        if (Math.random() < 0.12) newStats.fouls[0]++;
        if (Math.random() < 0.12) newStats.fouls[1]++;
        if (Math.random() < 0.10) newStats.corners[0]++;
        if (Math.random() < 0.10) newStats.corners[1]++;
        if (Math.random() < 0.05) newStats.offsides[0]++;
        if (Math.random() < 0.05) newStats.offsides[1]++;

        const currentEvents = [...m.events];
        let score1 = m.score1;
        let score2 = m.score2;

        // สุ่มการยิงประตู
        // โอกาสทำประตูได้: 1.2% ต่อนาที
        if (Math.random() < 0.012) {
          score1++;
          const scorer = getRandomPlayer(m.team1);
          const event = { type: 'GOAL', minute: nextMin, team: m.team1, player: scorer };
          currentEvents.push(event);
          newEventsList.unshift({ matchId: m.id, text: `ประตู! ${m.team1} ขึ้นนำ/ได้ประตูเพิ่ม ${score1}-${score2} โดย ${scorer} (นาทีที่ ${nextMin})` });
        } else if (Math.random() < 0.012) {
          score2++;
          const scorer = getRandomPlayer(m.team2);
          const event = { type: 'GOAL', minute: nextMin, team: m.team2, player: scorer };
          currentEvents.push(event);
          newEventsList.unshift({ matchId: m.id, text: `ประตู! ${m.team2} ขึ้นนำ/ได้ประตูเพิ่ม ${score1}-${score2} โดย ${scorer} (นาทีที่ ${nextMin})` });
        }

        // สุ่มใบเหลือง (โอกาส 1.5% ต่อนาที)
        if (Math.random() < 0.015) {
          const isTeam1 = Math.random() < 0.5;
          const targetTeam = isTeam1 ? m.team1 : m.team2;
          const player = getRandomPlayer(targetTeam);
          newStats.yellowCards[isTeam1 ? 0 : 1]++;
          const event = { type: 'YELLOW', minute: nextMin, team: targetTeam, player };
          currentEvents.push(event);
          newEventsList.unshift({ matchId: m.id, text: `ใบเหลือง! ${player} (${targetTeam}) ได้รับใบเหลือง (นาทีที่ ${nextMin})` });
        }

        // สุ่มใบแดง (โอกาส 0.08% ต่อนาที)
        if (Math.random() < 0.0008) {
          const isTeam1 = Math.random() < 0.5;
          const targetTeam = isTeam1 ? m.team1 : m.team2;
          const player = getRandomPlayer(targetTeam);
          newStats.redCards[isTeam1 ? 0 : 1]++;
          const event = { type: 'RED', minute: nextMin, team: targetTeam, player };
          currentEvents.push(event);
          newEventsList.unshift({ matchId: m.id, text: `ใบแดง! ${player} (${targetTeam}) ได้รับใบแดงไล่ออกจากสนาม! (นาทีที่ ${nextMin})` });
        }

        return {
          ...m,
          score1,
          score2,
          minute: nextMin,
          status: nextMin >= 90 ? 'FINISHED' : 'LIVE',
          events: currentEvents,
          stats: newStats
        };
      }
      return m;
    });

    if (allFinished) {
      clearInterval(simulationInterval);
      isSimulationRunning = false;
      newEventsList.unshift({ matchId: 0, text: 'การจำลองแมตช์สดเสร็จสิ้นลงแล้ว (ทุกคู่แข่งขันครบ 90 นาที)' });
    }
  }, 1000); // 1 วินาทีจริง = 1 นาทีในการแข่งขันจำลอง
}

// หยุดการจำลอง
function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  isSimulationRunning = false;
}

// รีเซ็ตการแข่งขันกลับสู่ค่าตั้งต้น
function resetSimulation() {
  stopSimulation();
  matches = JSON.parse(JSON.stringify(INITIAL_MATCHES));
  newEventsList = [];
}

// คำนวณตารางคะแนนจากผลแข่งขันล่าสุด
function calculateStandings() {
  const standings = {};

  // วนรอบทุกกลุ่มการแข่งขัน
  for (const [groupName, teamList] of Object.entries(GROUPS)) {
    standings[groupName] = teamList.map(teamName => ({
      team: teamName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0, // Goals For
      ga: 0, // Goals Against
      gd: 0, // Goal Difference
      pts: 0, // Points
      form: [] // ประวัติฟอร์ม (W, D, L)
    }));

    // ดึงแมตช์ในกลุ่มนี้ที่เริ่มแข่งไปแล้ว (LIVE หรือ FINISHED)
    const groupMatches = matches.filter(m => m.group === groupName && m.status !== 'SCHEDULED');

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

    // คำนวณผลต่างประตูได้เสีย GD
    standings[groupName].forEach(team => {
      team.gd = team.gf - team.ga;
    });

    // เรียงลำดับทีมตามกฎ: Points -> Goal Difference -> Goals For -> ชนะ
    standings[groupName].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
  }

  return standings;
}

// ฟังก์ชันคำนวณผู้ทำประตูสูงสุด (ดาวซัลโว)
function calculateTopScorers() {
  const scorers = {};
  matches.forEach(m => {
    if (m.status !== 'SCHEDULED' && m.events) {
      m.events.forEach(e => {
        if (e.type === 'GOAL') {
          // ไม่นับลูกทำเข้าประตูตัวเอง
          if (e.player.includes('ทำเข้าประตูตัวเอง') || e.player.includes('OG') || e.player.includes('own goal')) {
            return;
          }
          const key = `${e.player}_${e.team}`;
          if (!scorers[key]) {
            scorers[key] = {
              player: e.player,
              team: e.team,
              goals: 0
            };
          }
          scorers[key].goals++;
        }
      });
    }
  });
  return Object.values(scorers).sort((a, b) => b.goals - a.goals);
}

// API Endpoints
app.get('/api/matches', (req, res) => {
  // ใส่บทวิเคราะห์การพยากรณ์สำหรับแมตช์ที่ยังไม่แข่ง
  const matchesWithPredictions = matches.map(m => {
    if (m.status === 'SCHEDULED') {
      return {
        ...m,
        predictions: [
          { guru: 'กูรูสปอร์ตเรดาร์ (ระบบ AI วิเคราะห์)', forecast: `โอกาสชนะ: ${m.team1} 48% | เสมอ 30% | ${m.team2} 22%`, details: `จากการประมวลผลทางสถิติ คาดว่า ${m.team1} จะเป็นฝ่ายครองเกมบุกเข้ากดดันได้ดีกว่า และมีโอกาสชนะมากกว่า` },
          { guru: 'กูรูสมชาย (ทีเด็ดลูกหนัง)', forecast: `${m.team1} ชนะ ${m.team1 === 'แคนาดา' || m.team1 === 'สหรัฐอเมริกา' || m.team1 === 'บราซิล' || m.team1 === 'เยอรมนี' || m.team1 === 'อังกฤษ' ? '2-1' : '1-0'}`, details: `เชื่อว่าทีมฝั่งเจ้าบ้านหรือทีมที่มีประสบการณ์เหนือกว่าอย่าง ${m.team1} จะสามารถคุมจังหวะเกมและเฉือนเอาชนะไปได้สำเร็จ` }
        ]
      };
    }
    return m;
  });
  
  res.json({
    matches: matchesWithPredictions,
    isSimulationRunning,
    tickerEvents: newEventsList.slice(0, 10), // ดึง 10 เหตุการณ์ล่าสุดมาทำ Ticker
    topScorers: calculateTopScorers()
  });
});

// API สำหรับให้ผู้ใช้แก้ไขหรือป้อนสกอร์การแข่งขันด้วยตัวเอง
app.post('/api/matches/update', (req, res) => {
  const { id, score1, score2, status } = req.body;
  const matchId = parseInt(id);
  const matchIndex = matches.findIndex(m => m.id === matchId);
  
  if (matchIndex !== -1) {
    matches[matchIndex].score1 = parseInt(score1);
    matches[matchIndex].score2 = parseInt(score2);
    matches[matchIndex].status = status || 'FINISHED';
    if (status === 'FINISHED') {
      matches[matchIndex].minute = 90;
    }
    
    // เติมสถิติจำลองเพื่อความสมจริงหากยังไม่มีสถิติ
    if (matches[matchIndex].stats.shots[0] === 0) {
      matches[matchIndex].stats = {
        possession: [55, 45],
        shots: [12, 8],
        shotsOnTarget: [5, 3],
        fouls: [10, 13],
        corners: [6, 4],
        offsides: [2, 1],
        yellowCards: [1, 2],
        redCards: [0, 0]
      };
    }
    
    res.json({ success: true, message: 'บันทึกคะแนนการแข่งขันด้วยตนเองเรียบร้อยแล้ว' });
  } else {
    res.status(404).json({ success: false, message: 'ไม่พบแมตช์ที่ระบุ' });
  }
});

app.get('/api/standings', (req, res) => {
  const standings = calculateStandings();
  res.json(standings);
});

app.post('/api/simulation/start', (req, res) => {
  startSimulation();
  res.json({ success: true, message: 'เริ่มการจำลองการแข่งขันสดแล้ว' });
});

app.post('/api/simulation/stop', (req, res) => {
  stopSimulation();
  res.json({ success: true, message: 'หยุดการจำลองชั่วคราวแล้ว' });
});

app.post('/api/simulation/reset', (req, res) => {
  resetSimulation();
  res.json({ success: true, message: 'รีเซ็ตข้อมูลผลแข่งขันกลับสู่ค่าดั้งเดิมแล้ว' });
});

const TEAM_EN_TO_TH = {
  'Mexico': 'เม็กซิโก',
  'South Africa': 'แอฟริกาใต้',
  'South Korea': 'เกาหลีใต้',
  'Czech Republic': 'เช็กเกีย',
  'Canada': 'แคนาดา',
  'Bosnia and Herzegovina': 'บอสเนียและเฮอร์เซโกวีนา',
  'Qatar': 'กาตาร์',
  'Switzerland': 'สวิตเซอร์แลนด์',
  'Brazil': 'บราซิล',
  'Morocco': 'โมร็อกโก',
  'Haiti': 'ไฮติ',
  'Scotland': 'สกอตแลนด์',
  'United States': 'สหรัฐอเมริกา',
  'Paraguay': 'ปารากวัย',
  'Australia': 'ออสเตรเลีย',
  'Turkey': 'ตุรกี',
  'Germany': 'เยอรมนี',
  'Ecuador': 'เอกวาดอร์',
  'Ivory Coast': 'ไอวอรีโคสต์',
  'Curaçao': 'กูราเซา',
  'Netherlands': 'เนเธอร์แลนด์',
  'Sweden': 'สวีเดน',
  'Japan': 'ญี่ปุ่น',
  'Tunisia': 'ตูนิเซีย',
  'Belgium': 'เบลเยียม',
  'Egypt': 'อียิปต์',
  'Iran': 'อิหร่าน',
  'New Zealand': 'นิวซีแลนด์',
  'Spain': 'สเปน',
  'Uruguay': 'อุรุกวัย',
  'Cape Verde': 'เคปเวิร์ด',
  'Saudi Arabia': 'ซาอุดีอาระเบีย',
  'France': 'ฝรั่งเศส',
  'Norway': 'นอร์เวย์',
  'Senegal': 'เซเนกัล',
  'Iraq': 'อิรัก',
  'Argentina': 'อาร์เจนตินา',
  'Austria': 'ออสเตรีย',
  'Algeria': 'แอลจีเรีย',
  'Jordan': 'จอร์แดน',
  'Portugal': 'โปรตุเกส',
  'Colombia': 'โคลอมเบีย',
  'Democratic Republic of the Congo': 'ดีอาร์ คองโก',
  'Uzbekistan': 'อุซเบกิสถาน',
  'England': 'อังกฤษ',
  'Panama': 'ปานามา',
  'Croatia': 'โครเอเชีย',
  'Ghana': 'กานา'
};

function parseScorers(scorersStr, teamName) {
  if (!scorersStr || scorersStr === 'null' || scorersStr === '""') return [];
  const events = [];
  try {
    let cleaned = scorersStr.trim();
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      cleaned = '[' + cleaned.substring(1, cleaned.length - 1) + ']';
    }
    cleaned = cleaned.replace(/”/g, '"').replace(/“/g, '"');
    
    const arr = JSON.parse(cleaned);
    if (Array.isArray(arr)) {
      arr.forEach(scorer => {
        const match = scorer.match(/^(.*?)\s+(\d+)(?:\+\d+)?'(?:\s*\((OG|p)\))?$/i);
        if (match) {
          const player = match[1].trim();
          const min = parseInt(match[2]);
          const isOG = match[3] && match[3].toLowerCase() === 'og';
          events.push({
            type: 'GOAL',
            minute: min,
            team: teamName,
            player: isOG ? `${player} (OG)` : player
          });
        }
      });
    }
  } catch (e) {
    try {
      const matchesList = scorersStr.match(/"([^"]+)"|'([^']+)'|([^,{}"]+)/g);
      if (matchesList) {
        matchesList.forEach(item => {
          const scorer = item.replace(/[{}"']/g, '').trim();
          const match = scorer.match(/^(.*?)\s+(\d+)(?:\+\d+)?'(?:\s*\((OG|p)\))?$/i);
          if (match) {
            const player = match[1].trim();
            const min = parseInt(match[2]);
            const isOG = match[3] && match[3].toLowerCase() === 'og';
            events.push({
              type: 'GOAL',
              minute: min,
              team: teamName,
              player: isOG ? `${player} (OG)` : player
            });
          }
        });
      }
    } catch (err) {
      console.error('Scorers parse error:', err);
    }
  }
  return events;
}

async function fetchRealWorldMatches() {
  try {
    const res = await fetch('https://worldcup26.ir/get/games');
    if (!res.ok) throw new Error('Failed to fetch real-world matches');
    const data = await res.json();
    if (data && Array.isArray(data.games)) {
      data.games.forEach(game => {
        const team1Thai = TEAM_EN_TO_TH[game.home_team_name_en];
        const team2Thai = TEAM_EN_TO_TH[game.away_team_name_en];
        if (!team1Thai || !team2Thai) return;

        const match = matches.find(m => 
          (m.team1 === team1Thai && m.team2 === team2Thai) ||
          (m.team1 === team2Thai && m.team2 === team1Thai)
        );

        if (match) {
          const finished = game.finished === 'TRUE';
          const isLive = game.time_elapsed === 'live' || (!finished && game.time_elapsed !== 'notstarted' && game.time_elapsed !== 'null');
          
          const isHomeTeam1 = match.team1 === team1Thai;
          const score1Val = parseInt(isHomeTeam1 ? game.home_score : game.away_score) || 0;
          const score2Val = parseInt(isHomeTeam1 ? game.away_score : game.home_score) || 0;
          
          match.score1 = score1Val;
          match.score2 = score2Val;
          
          if (finished) {
            match.status = 'FINISHED';
            match.minute = 90;
          } else if (isLive) {
            match.status = 'LIVE';
            match.minute = parseInt(game.time_elapsed) || 45;
          } else {
            match.status = 'SCHEDULED';
            match.minute = 0;
          }

          const homeEvents = parseScorers(game.home_scorers, game.home_team_name_en);
          const awayEvents = parseScorers(game.away_scorers, game.away_team_name_en);
          
          const events = [];
          homeEvents.forEach(e => {
            events.push({
              type: e.type,
              minute: e.minute,
              team: TEAM_EN_TO_TH[e.team] || e.team,
              player: e.player
            });
          });
          awayEvents.forEach(e => {
            events.push({
              type: e.type,
              minute: e.minute,
              team: TEAM_EN_TO_TH[e.team] || e.team,
              player: e.player
            });
          });

          events.sort((a, b) => a.minute - b.minute);
          match.events = events;

          // If match stats are empty or zeroed out, populate them with realistic values based on the score
          if (finished || isLive) {
            if (!match.stats || !match.stats.shots || match.stats.shots[0] === 0) {
              const shots1 = Math.max(score1Val + 2, Math.floor(Math.random() * 10) + 5);
              const shots2 = Math.max(score2Val + 2, Math.floor(Math.random() * 10) + 5);
              const target1 = Math.max(score1Val, Math.floor(shots1 * (0.3 + Math.random() * 0.3)));
              const target2 = Math.max(score2Val, Math.floor(shots2 * (0.3 + Math.random() * 0.3)));
              const possession1 = 40 + Math.floor(Math.random() * 21);
              
              const red1 = events.filter(e => e.type === 'RED' && e.team === match.team1).length;
              const red2 = events.filter(e => e.type === 'RED' && e.team === match.team2).length;
              const yellow1 = events.filter(e => e.type === 'YELLOW' && e.team === match.team1).length || Math.floor(Math.random() * 3);
              const yellow2 = events.filter(e => e.type === 'YELLOW' && e.team === match.team2).length || Math.floor(Math.random() * 3);

              match.stats = {
                possession: [possession1, 100 - possession1],
                shots: [shots1, shots2],
                shotsOnTarget: [target1, target2],
                fouls: [8 + Math.floor(Math.random() * 8), 8 + Math.floor(Math.random() * 8)],
                corners: [2 + Math.floor(Math.random() * 6), 2 + Math.floor(Math.random() * 6)],
                offsides: [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)],
                yellowCards: [yellow1, yellow2],
                redCards: [red1, red2]
              };
            }
          }
        }
      });
      console.log(`[FIFA Scraper] Successfully updated ${data.games.length} matches from real-world API.`);
    }
  } catch (error) {
    console.error('[FIFA Scraper] Error fetching real-world matches:', error);
  }
}

// Endpoint ดึงข้อมูลจาก fifa.com แบบจำลอง Scraper
app.get('/api/scrape', async (req, res) => {
  try {
    await fetchRealWorldMatches();
    res.json({
      success: true,
      message: 'อัปเดตข้อมูลผลการแข่งขันจริงฟุตบอลโลก 2026 สำเร็จแล้ว!',
      lastUpdate: new Date().toLocaleTimeString('th-TH')
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API สำหรับส่งคำทายผล
app.post('/api/predictions/submit', (req, res) => {
  const { username, matchId, score1, score2 } = req.body;
  
  if (!username || matchId === undefined || score1 === undefined || score2 === undefined) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' });
  }

  const mId = parseInt(matchId);
  const s1 = parseInt(score1);
  const s2 = parseInt(score2);

  if (isNaN(mId) || isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
    return res.status(400).json({ success: false, message: 'ข้อมูลสกอร์ต้องเป็นตัวเลขที่ถูกต้อง' });
  }

  // หาแมตช์ที่ระบุ
  const match = matches.find(m => m.id === mId);
  if (!match) {
    return res.status(404).json({ success: false, message: 'ไม่พบแมตช์ที่ระบุ' });
  }

  // ห้ามทายผลแมตช์ที่เริ่มแข่งขันไปแล้ว (LIVE หรือ FINISHED)
  if (match.status !== 'SCHEDULED') {
    return res.status(400).json({ success: false, message: 'ไม่สามารถทายผลแมตช์ที่กำลังแข่งขันหรือแข่งขันจบลงแล้วได้' });
  }

  // บันทึกหรืออัปเดตคำทายผล
  const existingIndex = userPredictions.findIndex(p => p.username === username && p.matchId === mId);
  if (existingIndex !== -1) {
    userPredictions[existingIndex].score1 = s1;
    userPredictions[existingIndex].score2 = s2;
  } else {
    userPredictions.push({ username, matchId: mId, score1: s1, score2: s2 });
  }

  res.json({ success: true, message: 'บันทึกการทำนายผลเรียบร้อยแล้ว' });
});

// API สำหรับดึงตารางผู้นำ (Leaderboard)
app.get('/api/predictions/leaderboard', (req, res) => {
  const scores = {};

  // ตรวจสอบคะแนนสำหรับคำทำนายทั้งหมด
  userPredictions.forEach(pred => {
    const match = matches.find(m => m.id === pred.matchId);
    if (!match) return;

    if (!scores[pred.username]) {
      scores[pred.username] = {
        username: pred.username,
        points: 0,
        exact: 0,
        outcome: 0,
        played: 0
      };
    }

    if (match.status === 'FINISHED') {
      scores[pred.username].played++;
      
      const act1 = match.score1;
      const act2 = match.score2;
      const pred1 = pred.score1;
      const pred2 = pred.score2;

      // 1. ตรงสกอร์เป๊ะ
      if (act1 === pred1 && act2 === pred2) {
        scores[pred.username].points += 3;
        scores[pred.username].exact++;
      } 
      // 2. ตรงผลแพ้ชนะ/เสมอ
      else {
        const actualDiff = act1 - act2;
        const predDiff = pred1 - pred2;
        
        const isActualDraw = actualDiff === 0;
        const isPredDraw = predDiff === 0;
        const isActualWinnerHome = actualDiff > 0;
        const isPredWinnerHome = predDiff > 0;

        if ((isActualDraw && isPredDraw) || 
            (isActualWinnerHome && isPredWinnerHome) || 
            (!isActualDraw && !isActualWinnerHome && !isPredDraw && !isPredWinnerHome)) {
          scores[pred.username].points += 1;
          scores[pred.username].outcome++;
        }
      }
    }
  });

  const leaderboardList = Object.values(scores).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.exact !== a.exact) return b.exact - a.exact;
    return b.outcome - a.outcome;
  });

  res.json({ success: true, leaderboard: leaderboardList });
});

// API สำหรับดึงคำทายผลของผู้ใช้เฉพาะราย
app.get('/api/predictions/user/:username', (req, res) => {
  const { username } = req.params;
  const preds = userPredictions.filter(p => p.username === username);
  res.json({ success: true, predictions: preds });
});

// เสิร์ฟไฟล์หน้าบ้านเมื่อสร้าง Build เสร็จแล้ว
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// เริ่มต้นฟังพอร์ต
app.listen(PORT, () => {
  console.log(`[FIFA Web App] Server is running on port ${PORT}`);
  
  // ดึงข้อมูลจริงจาก API ทันทีที่เซิร์ฟเวอร์เปิดใช้งาน
  fetchRealWorldMatches();
  
  // ตั้งค่าดึงข้อมูลใหม่ทุกๆ 1 ชั่วโมง (3600000 ms)
  setInterval(fetchRealWorldMatches, 3600000);
});
