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
    "events": [
      {
        "type": "GOAL",
        "minute": 9,
        "team": "เม็กซิโก",
        "player": "J. Quiñones"
      },
      {
        "type": "GOAL",
        "minute": 67,
        "team": "เม็กซิโก",
        "player": "R. Jiménez"
      }
    ],
    "stats": {
      "possession": [
        48,
        52
      ],
      "shots": [
        5,
        5
      ],
      "shotsOnTarget": [
        2,
        1
      ],
      "fouls": [
        12,
        13
      ],
      "corners": [
        7,
        5
      ],
      "offsides": [
        3,
        2
      ],
      "yellowCards": [
        0,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 59,
        "team": "เช็กเกีย",
        "player": "L. Krejčí"
      },
      {
        "type": "GOAL",
        "minute": 67,
        "team": "เกาหลีใต้",
        "player": "I.B. Hwang"
      },
      {
        "type": "GOAL",
        "minute": 80,
        "team": "เกาหลีใต้",
        "player": "H.G. Oh"
      }
    ],
    "stats": {
      "possession": [
        59,
        41
      ],
      "shots": [
        11,
        5
      ],
      "shotsOnTarget": [
        3,
        2
      ],
      "fouls": [
        10,
        9
      ],
      "corners": [
        4,
        7
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        2,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 11,
        "team": "แคนาดา",
        "player": "C. Larin"
      },
      {
        "type": "GOAL",
        "minute": 21,
        "team": "บอสเนียและเฮอร์เซโกวีนา",
        "player": "Jovo Lukić"
      }
    ],
    "stats": {
      "possession": [
        53,
        47
      ],
      "shots": [
        5,
        14
      ],
      "shotsOnTarget": [
        2,
        6
      ],
      "fouls": [
        10,
        13
      ],
      "corners": [
        3,
        6
      ],
      "offsides": [
        1,
        3
      ],
      "yellowCards": [
        2,
        1
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
    "events": [
      {
        "type": "OWN",
        "minute": 7,
        "team": "สหรัฐอเมริกา",
        "player": "D. Bobadilla"
      },
      {
        "type": "GOAL",
        "minute": 31,
        "team": "สหรัฐอเมริกา",
        "player": "F. Balogun"
      },
      {
        "type": "GOAL",
        "minute": 73,
        "team": "ปารากวัย",
        "player": "Maurício"
      }
    ],
    "stats": {
      "possession": [
        60,
        40
      ],
      "shots": [
        9,
        13
      ],
      "shotsOnTarget": [
        4,
        7
      ],
      "fouls": [
        9,
        12
      ],
      "corners": [
        7,
        6
      ],
      "offsides": [
        3,
        0
      ],
      "yellowCards": [
        1,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 28,
        "team": "สกอตแลนด์",
        "player": "J. McGinn"
      }
    ],
    "stats": {
      "possession": [
        52,
        48
      ],
      "shots": [
        5,
        5
      ],
      "shotsOnTarget": [
        2,
        2
      ],
      "fouls": [
        12,
        15
      ],
      "corners": [
        5,
        3
      ],
      "offsides": [
        3,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 27,
        "team": "ออสเตรเลีย",
        "player": "Nestory Irankunda"
      },
      {
        "type": "GOAL",
        "minute": 75,
        "team": "ออสเตรเลีย",
        "player": "C. Metcalfe"
      }
    ],
    "stats": {
      "possession": [
        58,
        42
      ],
      "shots": [
        6,
        8
      ],
      "shotsOnTarget": [
        3,
        4
      ],
      "fouls": [
        12,
        10
      ],
      "corners": [
        5,
        6
      ],
      "offsides": [
        1,
        0
      ],
      "yellowCards": [
        1,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 21,
        "team": "โมร็อกโก",
        "player": "I. Saibari"
      },
      {
        "type": "GOAL",
        "minute": 32,
        "team": "บราซิล",
        "player": "V. Júnior"
      }
    ],
    "stats": {
      "possession": [
        59,
        41
      ],
      "shots": [
        13,
        13
      ],
      "shotsOnTarget": [
        5,
        7
      ],
      "fouls": [
        12,
        13
      ],
      "corners": [
        2,
        5
      ],
      "offsides": [
        1,
        1
      ],
      "yellowCards": [
        1,
        1
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
    "events": [
      {
        "type": "PENALTY",
        "minute": 17,
        "team": "สวิตเซอร์แลนด์",
        "player": "Breel Embolo"
      }
    ],
    "stats": {
      "possession": [
        45,
        55
      ],
      "shots": [
        10,
        14
      ],
      "shotsOnTarget": [
        4,
        5
      ],
      "fouls": [
        15,
        11
      ],
      "corners": [
        2,
        2
      ],
      "offsides": [
        3,
        0
      ],
      "yellowCards": [
        1,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 90,
        "team": "ไอวอรีโคสต์",
        "player": "A. Diallo"
      }
    ],
    "stats": {
      "possession": [
        55,
        45
      ],
      "shots": [
        7,
        10
      ],
      "shotsOnTarget": [
        4,
        3
      ],
      "fouls": [
        11,
        15
      ],
      "corners": [
        3,
        2
      ],
      "offsides": [
        0,
        3
      ],
      "yellowCards": [
        2,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 7,
        "team": "เยอรมนี",
        "player": "Felix Nmecha"
      },
      {
        "type": "GOAL",
        "minute": 21,
        "team": "กูราเซา",
        "player": "L. Comenencia"
      },
      {
        "type": "GOAL",
        "minute": 38,
        "team": "เยอรมนี",
        "player": "N. Schlotterbeck"
      },
      {
        "type": "GOAL",
        "minute": 47,
        "team": "เยอรมนี",
        "player": "J. Musiala"
      },
      {
        "type": "GOAL",
        "minute": 68,
        "team": "เยอรมนี",
        "player": "N. Brown"
      },
      {
        "type": "GOAL",
        "minute": 78,
        "team": "เยอรมนี",
        "player": "D. Undav"
      },
      {
        "type": "GOAL",
        "minute": 88,
        "team": "เยอรมนี",
        "player": "K. Havertz"
      }
    ],
    "stats": {
      "possession": [
        55,
        45
      ],
      "shots": [
        9,
        12
      ],
      "shotsOnTarget": [
        7,
        6
      ],
      "fouls": [
        12,
        8
      ],
      "corners": [
        4,
        6
      ],
      "offsides": [
        0,
        2
      ],
      "yellowCards": [
        1,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 51,
        "team": "เนเธอร์แลนด์",
        "player": "Virgil van Dijk"
      },
      {
        "type": "GOAL",
        "minute": 57,
        "team": "ญี่ปุ่น",
        "player": "K. Nakamura"
      },
      {
        "type": "GOAL",
        "minute": 64,
        "team": "เนเธอร์แลนด์",
        "player": "C. Summerville"
      },
      {
        "type": "GOAL",
        "minute": 89,
        "team": "ญี่ปุ่น",
        "player": "K. Ogawa"
      }
    ],
    "stats": {
      "possession": [
        53,
        47
      ],
      "shots": [
        12,
        10
      ],
      "shotsOnTarget": [
        5,
        4
      ],
      "fouls": [
        9,
        11
      ],
      "corners": [
        7,
        6
      ],
      "offsides": [
        3,
        3
      ],
      "yellowCards": [
        2,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 7,
        "team": "สวีเดน",
        "player": "Y.Ayari"
      },
      {
        "type": "GOAL",
        "minute": 30,
        "team": "สวีเดน",
        "player": "A. Isak"
      },
      {
        "type": "GOAL",
        "minute": 43,
        "team": "ตูนิเซีย",
        "player": "O. Rekik"
      },
      {
        "type": "GOAL",
        "minute": 59,
        "team": "สวีเดน",
        "player": "V. Gyökeres"
      },
      {
        "type": "GOAL",
        "minute": 84,
        "team": "สวีเดน",
        "player": "M. Svanberg"
      }
    ],
    "stats": {
      "possession": [
        45,
        55
      ],
      "shots": [
        12,
        14
      ],
      "shotsOnTarget": [
        5,
        5
      ],
      "fouls": [
        13,
        11
      ],
      "corners": [
        6,
        2
      ],
      "offsides": [
        1,
        0
      ],
      "yellowCards": [
        1,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 7,
        "team": "นิวซีแลนด์",
        "player": "Elijah Just"
      },
      {
        "type": "GOAL",
        "minute": 32,
        "team": "อิหร่าน",
        "player": "Ramin Rezaiian"
      },
      {
        "type": "GOAL",
        "minute": 54,
        "team": "นิวซีแลนด์",
        "player": "Elijah Just"
      },
      {
        "type": "GOAL",
        "minute": 64,
        "team": "อิหร่าน",
        "player": "Mohammad Mohebi"
      }
    ],
    "stats": {
      "possession": [
        40,
        60
      ],
      "shots": [
        6,
        7
      ],
      "shotsOnTarget": [
        3,
        3
      ],
      "fouls": [
        15,
        15
      ],
      "corners": [
        5,
        4
      ],
      "offsides": [
        1,
        3
      ],
      "yellowCards": [
        1,
        1
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
        54,
        46
      ],
      "shots": [
        14,
        6
      ],
      "shotsOnTarget": [
        7,
        2
      ],
      "fouls": [
        10,
        10
      ],
      "corners": [
        2,
        6
      ],
      "offsides": [
        3,
        1
      ],
      "yellowCards": [
        1,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 20,
        "team": "อียิปต์",
        "player": "Emam Ashour"
      },
      {
        "type": "GOAL",
        "minute": 66,
        "team": "เบลเยียม",
        "player": "Mohamed Hany"
      }
    ],
    "stats": {
      "possession": [
        45,
        55
      ],
      "shots": [
        11,
        5
      ],
      "shotsOnTarget": [
        6,
        2
      ],
      "fouls": [
        11,
        8
      ],
      "corners": [
        2,
        6
      ],
      "offsides": [
        1,
        0
      ],
      "yellowCards": [
        2,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 41,
        "team": "ซาอุดีอาระเบีย",
        "player": "Abdulelah Al-Amri"
      },
      {
        "type": "GOAL",
        "minute": 80,
        "team": "อุรุกวัย",
        "player": "Maximiliano Araújo"
      }
    ],
    "stats": {
      "possession": [
        60,
        40
      ],
      "shots": [
        5,
        8
      ],
      "shotsOnTarget": [
        1,
        4
      ],
      "fouls": [
        10,
        13
      ],
      "corners": [
        4,
        5
      ],
      "offsides": [
        1,
        0
      ],
      "yellowCards": [
        2,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 66,
        "team": "ฝรั่งเศส",
        "player": "K. Mbappé"
      },
      {
        "type": "GOAL",
        "minute": 82,
        "team": "ฝรั่งเศส",
        "player": "B. Barcola"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "ฝรั่งเศส",
        "player": "K. Mbappé"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "เซเนกัล",
        "player": "I. Mbaye"
      }
    ],
    "stats": {
      "possession": [
        45,
        55
      ],
      "shots": [
        6,
        9
      ],
      "shotsOnTarget": [
        3,
        3
      ],
      "fouls": [
        8,
        10
      ],
      "corners": [
        5,
        3
      ],
      "offsides": [
        2,
        2
      ],
      "yellowCards": [
        1,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 29,
        "team": "นอร์เวย์",
        "player": "Erling Haaland"
      },
      {
        "type": "GOAL",
        "minute": 39,
        "team": "อิรัก",
        "player": "Aymen Hussein"
      },
      {
        "type": "GOAL",
        "minute": 43,
        "team": "นอร์เวย์",
        "player": "Erling Haaland"
      },
      {
        "type": "GOAL",
        "minute": 76,
        "team": "นอร์เวย์",
        "player": "Leo Østigård"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "นอร์เวย์",
        "player": "Aymen Hussein"
      }
    ],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        5,
        9
      ],
      "shotsOnTarget": [
        2,
        4
      ],
      "fouls": [
        12,
        10
      ],
      "corners": [
        7,
        2
      ],
      "offsides": [
        1,
        0
      ],
      "yellowCards": [
        2,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 17,
        "team": "อาร์เจนตินา",
        "player": "Lionel Messi"
      },
      {
        "type": "GOAL",
        "minute": 60,
        "team": "อาร์เจนตินา",
        "player": "Lionel Messi"
      },
      {
        "type": "GOAL",
        "minute": 76,
        "team": "อาร์เจนตินา",
        "player": "Lionel Messi"
      }
    ],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        10,
        13
      ],
      "shotsOnTarget": [
        3,
        6
      ],
      "fouls": [
        9,
        9
      ],
      "corners": [
        2,
        7
      ],
      "offsides": [
        3,
        1
      ],
      "yellowCards": [
        2,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 21,
        "team": "ออสเตรีย",
        "player": "Rvmanv Ashmid"
      },
      {
        "type": "GOAL",
        "minute": 50,
        "team": "จอร์แดน",
        "player": "Ali Avlvan"
      },
      {
        "type": "GOAL",
        "minute": 76,
        "team": "ออสเตรีย",
        "player": "Izn Alarb"
      }
    ],
    "stats": {
      "possession": [
        57,
        43
      ],
      "shots": [
        5,
        6
      ],
      "shotsOnTarget": [
        3,
        2
      ],
      "fouls": [
        14,
        10
      ],
      "corners": [
        6,
        2
      ],
      "offsides": [
        1,
        0
      ],
      "yellowCards": [
        1,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 6,
        "team": "โปรตุเกส",
        "player": "J. Neves"
      },
      {
        "type": "GOAL",
        "minute": 45,
        "team": "ดีอาร์ คองโก",
        "player": "Y. Wissa"
      }
    ],
    "stats": {
      "possession": [
        60,
        40
      ],
      "shots": [
        9,
        11
      ],
      "shotsOnTarget": [
        5,
        6
      ],
      "fouls": [
        14,
        11
      ],
      "corners": [
        7,
        7
      ],
      "offsides": [
        0,
        3
      ],
      "yellowCards": [
        1,
        1
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
    "events": [
      {
        "type": "PENALTY",
        "minute": 12,
        "team": "อังกฤษ",
        "player": "H. Kane"
      },
      {
        "type": "GOAL",
        "minute": 36,
        "team": "โครเอเชีย",
        "player": "M. Baturina"
      },
      {
        "type": "GOAL",
        "minute": 42,
        "team": "อังกฤษ",
        "player": "H. Kane"
      },
      {
        "type": "GOAL",
        "minute": 45,
        "team": "โครเอเชีย",
        "player": "P. Musa"
      },
      {
        "type": "GOAL",
        "minute": 47,
        "team": "อังกฤษ",
        "player": "J. Bellingham"
      },
      {
        "type": "GOAL",
        "minute": 85,
        "team": "อังกฤษ",
        "player": "M. Rashford"
      }
    ],
    "stats": {
      "possession": [
        47,
        53
      ],
      "shots": [
        10,
        12
      ],
      "shotsOnTarget": [
        4,
        6
      ],
      "fouls": [
        10,
        10
      ],
      "corners": [
        5,
        2
      ],
      "offsides": [
        3,
        0
      ],
      "yellowCards": [
        2,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 40,
        "team": "โคลอมเบีย",
        "player": "Dnil Mvnvz"
      },
      {
        "type": "GOAL",
        "minute": 60,
        "team": "อุซเบกิสถาน",
        "player": "Abas Bk Fiz Allh Af"
      },
      {
        "type": "GOAL",
        "minute": 65,
        "team": "โคลอมเบีย",
        "player": "Lviiz Diaz"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "โคลอมเบีย",
        "player": "Khamintvn Kampaz"
      }
    ],
    "stats": {
      "possession": [
        52,
        48
      ],
      "shots": [
        8,
        8
      ],
      "shotsOnTarget": [
        4,
        3
      ],
      "fouls": [
        15,
        8
      ],
      "corners": [
        7,
        3
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        2,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 90,
        "team": "กานา",
        "player": "Kalb Iirnki"
      }
    ],
    "stats": {
      "possession": [
        43,
        57
      ],
      "shots": [
        13,
        12
      ],
      "shotsOnTarget": [
        7,
        6
      ],
      "fouls": [
        10,
        8
      ],
      "corners": [
        5,
        3
      ],
      "offsides": [
        0,
        2
      ],
      "yellowCards": [
        0,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 50,
        "team": "เม็กซิโก",
        "player": "Luis Romo"
      }
    ],
    "stats": {
      "possession": [
        51,
        49
      ],
      "shots": [
        8,
        12
      ],
      "shotsOnTarget": [
        2,
        6
      ],
      "fouls": [
        11,
        9
      ],
      "corners": [
        7,
        5
      ],
      "offsides": [
        0,
        3
      ],
      "yellowCards": [
        2,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 74,
        "team": "สวิตเซอร์แลนด์",
        "player": "Jvhan Mnzambi"
      },
      {
        "type": "GOAL",
        "minute": 84,
        "team": "สวิตเซอร์แลนด์",
        "player": "Rvbn Vargas"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "สวิตเซอร์แลนด์",
        "player": "Jvhan Mnzambi"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "บอสเนียและเฮอร์เซโกวีนา",
        "player": "Armin Mhmich"
      }
    ],
    "stats": {
      "possession": [
        44,
        56
      ],
      "shots": [
        11,
        6
      ],
      "shotsOnTarget": [
        4,
        3
      ],
      "fouls": [
        15,
        12
      ],
      "corners": [
        7,
        2
      ],
      "offsides": [
        3,
        2
      ],
      "yellowCards": [
        1,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 16,
        "team": "แคนาดา",
        "player": "Kail Larin"
      },
      {
        "type": "GOAL",
        "minute": 29,
        "team": "แคนาดา",
        "player": "Jonathan David"
      },
      {
        "type": "GOAL",
        "minute": 45,
        "team": "แคนาดา",
        "player": "Jonathan David"
      },
      {
        "type": "GOAL",
        "minute": 64,
        "team": "แคนาดา",
        "player": "Nathan Saliba"
      },
      {
        "type": "GOAL",
        "minute": 75,
        "team": "แคนาดา",
        "player": "Mohamed Almnai"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "แคนาดา",
        "player": "Jonathan David"
      }
    ],
    "stats": {
      "possession": [
        40,
        60
      ],
      "shots": [
        8,
        11
      ],
      "shotsOnTarget": [
        6,
        3
      ],
      "fouls": [
        13,
        14
      ],
      "corners": [
        2,
        4
      ],
      "offsides": [
        2,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 6,
        "team": "เช็กเกีย",
        "player": "‫mikhal Sadilk"
      }
    ],
    "stats": {
      "possession": [
        45,
        55
      ],
      "shots": [
        12,
        13
      ],
      "shotsOnTarget": [
        4,
        4
      ],
      "fouls": [
        10,
        14
      ],
      "corners": [
        5,
        3
      ],
      "offsides": [
        0,
        3
      ],
      "yellowCards": [
        1,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 23,
        "team": "บราซิล",
        "player": "Matheus Cunha"
      },
      {
        "type": "GOAL",
        "minute": 36,
        "team": "บราซิล",
        "player": "Matheus Cunha"
      },
      {
        "type": "GOAL",
        "minute": 45,
        "team": "บราซิล",
        "player": "Vinícius Júnior"
      }
    ],
    "stats": {
      "possession": [
        40,
        60
      ],
      "shots": [
        13,
        6
      ],
      "shotsOnTarget": [
        5,
        3
      ],
      "fouls": [
        10,
        11
      ],
      "corners": [
        4,
        7
      ],
      "offsides": [
        1,
        3
      ],
      "yellowCards": [
        0,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 2,
        "team": "โมร็อกโก",
        "player": "Asmaail Saibari"
      }
    ],
    "stats": {
      "possession": [
        57,
        43
      ],
      "shots": [
        8,
        8
      ],
      "shotsOnTarget": [
        3,
        3
      ],
      "fouls": [
        9,
        14
      ],
      "corners": [
        6,
        5
      ],
      "offsides": [
        3,
        3
      ],
      "yellowCards": [
        1,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 11,
        "team": "สหรัฐอเมริกา",
        "player": "Kamrvn Bargs"
      },
      {
        "type": "GOAL",
        "minute": 43,
        "team": "สหรัฐอเมริกา",
        "player": "Alex Freeman"
      }
    ],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        10,
        6
      ],
      "shotsOnTarget": [
        3,
        2
      ],
      "fouls": [
        14,
        15
      ],
      "corners": [
        5,
        7
      ],
      "offsides": [
        3,
        1
      ],
      "yellowCards": [
        2,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 2,
        "team": "ปารากวัย",
        "player": "Matías Galarza"
      }
    ],
    "stats": {
      "possession": [
        40,
        60
      ],
      "shots": [
        14,
        11
      ],
      "shotsOnTarget": [
        5,
        4
      ],
      "fouls": [
        12,
        13
      ],
      "corners": [
        3,
        6
      ],
      "offsides": [
        0,
        1
      ],
      "yellowCards": [
        2,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 30,
        "team": "ไอวอรีโคสต์",
        "player": "Franck Kessié"
      },
      {
        "type": "GOAL",
        "minute": 68,
        "team": "เยอรมนี",
        "player": "Dniz Avndav"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "เยอรมนี",
        "player": "Dniz Avndav"
      }
    ],
    "stats": {
      "possession": [
        59,
        41
      ],
      "shots": [
        8,
        7
      ],
      "shotsOnTarget": [
        3,
        3
      ],
      "fouls": [
        13,
        11
      ],
      "corners": [
        3,
        5
      ],
      "offsides": [
        1,
        3
      ],
      "yellowCards": [
        0,
        1
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
        43,
        57
      ],
      "shots": [
        11,
        9
      ],
      "shotsOnTarget": [
        6,
        4
      ],
      "fouls": [
        13,
        14
      ],
      "corners": [
        6,
        3
      ],
      "offsides": [
        3,
        0
      ],
      "yellowCards": [
        2,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 5,
        "team": "เนเธอร์แลนด์",
        "player": "Brian Brobbey"
      },
      {
        "type": "GOAL",
        "minute": 17,
        "team": "เนเธอร์แลนด์",
        "player": "Brian Brobbey"
      },
      {
        "type": "GOAL",
        "minute": 47,
        "team": "เนเธอร์แลนด์",
        "player": "Kvdi Khakpv"
      },
      {
        "type": "GOAL",
        "minute": 54,
        "team": "เนเธอร์แลนด์",
        "player": "Kvdi Khakpv"
      },
      {
        "type": "GOAL",
        "minute": 59,
        "team": "สวีเดน",
        "player": "Anthony Elanga"
      },
      {
        "type": "GOAL",
        "minute": 89,
        "team": "เนเธอร์แลนด์",
        "player": "Crysencio Summerville"
      }
    ],
    "stats": {
      "possession": [
        55,
        45
      ],
      "shots": [
        14,
        7
      ],
      "shotsOnTarget": [
        6,
        2
      ],
      "fouls": [
        14,
        8
      ],
      "corners": [
        2,
        7
      ],
      "offsides": [
        3,
        3
      ],
      "yellowCards": [
        1,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 4,
        "team": "ญี่ปุ่น",
        "player": "Daichi Kamada"
      },
      {
        "type": "GOAL",
        "minute": 31,
        "team": "ญี่ปุ่น",
        "player": "Aiash Ivida"
      },
      {
        "type": "GOAL",
        "minute": 69,
        "team": "ญี่ปุ่น",
        "player": "Junya Itō"
      },
      {
        "type": "GOAL",
        "minute": 83,
        "team": "ญี่ปุ่น",
        "player": "Aiash Ivida"
      }
    ],
    "stats": {
      "possession": [
        53,
        47
      ],
      "shots": [
        11,
        7
      ],
      "shotsOnTarget": [
        3,
        4
      ],
      "fouls": [
        8,
        9
      ],
      "corners": [
        5,
        2
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        2
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
        48,
        52
      ],
      "shots": [
        11,
        8
      ],
      "shotsOnTarget": [
        3,
        4
      ],
      "fouls": [
        8,
        12
      ],
      "corners": [
        4,
        5
      ],
      "offsides": [
        0,
        3
      ],
      "yellowCards": [
        0,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 15,
        "team": "นิวซีแลนด์",
        "player": "Fin Svrman"
      },
      {
        "type": "GOAL",
        "minute": 58,
        "team": "อียิปต์",
        "player": "Mostafa Ziko"
      },
      {
        "type": "GOAL",
        "minute": 67,
        "team": "อียิปต์",
        "player": "Mohamed Salah"
      },
      {
        "type": "GOAL",
        "minute": 82,
        "team": "อียิปต์",
        "player": "Mahmoud Hassan Trezeguet"
      }
    ],
    "stats": {
      "possession": [
        60,
        40
      ],
      "shots": [
        5,
        13
      ],
      "shotsOnTarget": [
        1,
        7
      ],
      "fouls": [
        9,
        9
      ],
      "corners": [
        7,
        3
      ],
      "offsides": [
        0,
        3
      ],
      "yellowCards": [
        2,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 10,
        "team": "สเปน",
        "player": "Lamine Yamal"
      },
      {
        "type": "GOAL",
        "minute": 21,
        "team": "สเปน",
        "player": "Mikel Oyarzabal"
      },
      {
        "type": "GOAL",
        "minute": 24,
        "team": "สเปน",
        "player": "Mikel Oyarzabal"
      },
      {
        "type": "GOAL",
        "minute": 49,
        "team": "สเปน",
        "player": "Hassan Mohamed Altmbkti"
      }
    ],
    "stats": {
      "possession": [
        46,
        54
      ],
      "shots": [
        7,
        7
      ],
      "shotsOnTarget": [
        4,
        4
      ],
      "fouls": [
        15,
        10
      ],
      "corners": [
        3,
        2
      ],
      "offsides": [
        2,
        1
      ],
      "yellowCards": [
        2,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 21,
        "team": "เคปเวิร์ด",
        "player": "Kevin Pina"
      },
      {
        "type": "GOAL",
        "minute": 44,
        "team": "อุรุกวัย",
        "player": "Maximiliano Araújo"
      },
      {
        "type": "GOAL",
        "minute": 45,
        "team": "อุรุกวัย",
        "player": "Agustín Canobbio"
      },
      {
        "type": "GOAL",
        "minute": 61,
        "team": "เคปเวิร์ด",
        "player": "Hliv Varla"
      }
    ],
    "stats": {
      "possession": [
        44,
        56
      ],
      "shots": [
        12,
        6
      ],
      "shotsOnTarget": [
        4,
        3
      ],
      "fouls": [
        14,
        12
      ],
      "corners": [
        7,
        5
      ],
      "offsides": [
        3,
        0
      ],
      "yellowCards": [
        1,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 14,
        "team": "ฝรั่งเศส",
        "player": "Kylian Mbappé"
      },
      {
        "type": "GOAL",
        "minute": 54,
        "team": "ฝรั่งเศส",
        "player": "Kylian Mbappé"
      },
      {
        "type": "GOAL",
        "minute": 66,
        "team": "ฝรั่งเศส",
        "player": "Ousmane Dembélé"
      }
    ],
    "stats": {
      "possession": [
        45,
        55
      ],
      "shots": [
        9,
        6
      ],
      "shotsOnTarget": [
        5,
        3
      ],
      "fouls": [
        13,
        14
      ],
      "corners": [
        5,
        7
      ],
      "offsides": [
        1,
        1
      ],
      "yellowCards": [
        2,
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
    "events": [
      {
        "type": "GOAL",
        "minute": 43,
        "team": "นอร์เวย์",
        "player": "Markvs Hlmgrn Pdrsn"
      },
      {
        "type": "GOAL",
        "minute": 48,
        "team": "นอร์เวย์",
        "player": "Erling Haaland"
      },
      {
        "type": "GOAL",
        "minute": 53,
        "team": "เซเนกัล",
        "player": "Ismaïla Sarr"
      },
      {
        "type": "GOAL",
        "minute": 58,
        "team": "นอร์เวย์",
        "player": "Erling Haaland"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "เซเนกัล",
        "player": "Ismaïla Sarr"
      }
    ],
    "stats": {
      "possession": [
        45,
        55
      ],
      "shots": [
        7,
        6
      ],
      "shotsOnTarget": [
        3,
        3
      ],
      "fouls": [
        13,
        8
      ],
      "corners": [
        3,
        7
      ],
      "offsides": [
        0,
        2
      ],
      "yellowCards": [
        0,
        1
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
    "events": [
      {
        "type": "GOAL",
        "minute": 38,
        "team": "อาร์เจนตินา",
        "player": "Lionel Messi"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "อาร์เจนตินา",
        "player": "Lionel Messi"
      }
    ],
    "stats": {
      "possession": [
        40,
        60
      ],
      "shots": [
        11,
        10
      ],
      "shotsOnTarget": [
        6,
        5
      ],
      "fouls": [
        8,
        12
      ],
      "corners": [
        3,
        7
      ],
      "offsides": [
        1,
        1
      ],
      "yellowCards": [
        2,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 36,
        "team": "จอร์แดน",
        "player": "Al Rashdan"
      },
      {
        "type": "GOAL",
        "minute": 69,
        "team": "แอลจีเรีย",
        "player": "Nzir Bnbvali"
      },
      {
        "type": "GOAL",
        "minute": 82,
        "team": "แอลจีเรีย",
        "player": "Amine Gouiri"
      }
    ],
    "stats": {
      "possession": [
        52,
        48
      ],
      "shots": [
        9,
        11
      ],
      "shotsOnTarget": [
        5,
        5
      ],
      "fouls": [
        12,
        12
      ],
      "corners": [
        2,
        7
      ],
      "offsides": [
        1,
        0
      ],
      "yellowCards": [
        1,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 6,
        "team": "โปรตุเกส",
        "player": "Cristiano Ronaldo"
      },
      {
        "type": "GOAL",
        "minute": 17,
        "team": "โปรตุเกส",
        "player": "Nvnv Mndz"
      },
      {
        "type": "GOAL",
        "minute": 39,
        "team": "โปรตุเกส",
        "player": "Cristiano Ronaldo"
      },
      {
        "type": "GOAL",
        "minute": 60,
        "team": "โปรตุเกส",
        "player": "Abdalvhid Namtvf"
      },
      {
        "type": "GOAL",
        "minute": 87,
        "team": "โปรตุเกส",
        "player": "Rafael Leão"
      }
    ],
    "stats": {
      "possession": [
        40,
        60
      ],
      "shots": [
        12,
        6
      ],
      "shotsOnTarget": [
        6,
        2
      ],
      "fouls": [
        9,
        10
      ],
      "corners": [
        3,
        6
      ],
      "offsides": [
        1,
        3
      ],
      "yellowCards": [
        0,
        2
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
    "events": [
      {
        "type": "GOAL",
        "minute": 54,
        "team": "โครเอเชีย",
        "player": "Ante Budimir"
      }
    ],
    "stats": {
      "possession": [
        45,
        55
      ],
      "shots": [
        14,
        12
      ],
      "shotsOnTarget": [
        5,
        5
      ],
      "fouls": [
        15,
        14
      ],
      "corners": [
        7,
        7
      ],
      "offsides": [
        0,
        2
      ],
      "yellowCards": [
        2,
        2
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
    "score1": 1,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-23T20:00:00-05:00",
    "venue": "สนามกีฬากัวดาลาฮารา (Estadio Akron)",
    "events": [
      {
        "type": "GOAL",
        "minute": 76,
        "team": "โคลอมเบีย",
        "player": "Dnil Mvnvz"
      }
    ],
    "stats": {
      "possession": [
        53,
        47
      ],
      "shots": [
        14,
        13
      ],
      "shotsOnTarget": [
        6,
        4
      ],
      "fouls": [
        10,
        12
      ],
      "corners": [
        2,
        5
      ],
      "offsides": [
        2,
        3
      ],
      "yellowCards": [
        1,
        1
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
        44,
        56
      ],
      "shots": [
        13,
        13
      ],
      "shotsOnTarget": [
        6,
        6
      ],
      "fouls": [
        8,
        10
      ],
      "corners": [
        3,
        7
      ],
      "offsides": [
        0,
        1
      ],
      "yellowCards": [
        0,
        2
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
    "score2": 3,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-24T18:00:00-04:00",
    "venue": "สนามกีฬาฮาร์ดร็อค (Miami)",
    "events": [
      {
        "type": "GOAL",
        "minute": 7,
        "team": "บราซิล",
        "player": "Vinícius Júnior"
      },
      {
        "type": "GOAL",
        "minute": 45,
        "team": "บราซิล",
        "player": "Vinícius Júnior"
      },
      {
        "type": "GOAL",
        "minute": 60,
        "team": "บราซิล",
        "player": "Matheus Cunha"
      }
    ],
    "stats": {
      "possession": [
        57,
        43
      ],
      "shots": [
        12,
        6
      ],
      "shotsOnTarget": [
        5,
        3
      ],
      "fouls": [
        15,
        15
      ],
      "corners": [
        6,
        7
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        0,
        2
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
    "score1": 4,
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-24T18:00:00-04:00",
    "venue": "เมอร์เซเดส-เบนซ์ สเตเดียม (Atlanta)",
    "events": [
      {
        "type": "GOAL",
        "minute": 10,
        "team": "ไฮติ",
        "player": "Yassine Bounou"
      },
      {
        "type": "GOAL",
        "minute": 39,
        "team": "โมร็อกโก",
        "player": "Achraf Hakimi"
      },
      {
        "type": "GOAL",
        "minute": 43,
        "team": "ไฮติ",
        "player": "Wilson Isidor"
      },
      {
        "type": "GOAL",
        "minute": 45,
        "team": "โมร็อกโก",
        "player": "Asmaail Saibari"
      },
      {
        "type": "GOAL",
        "minute": 78,
        "team": "โมร็อกโก",
        "player": "Svfian Rhimi"
      },
      {
        "type": "GOAL",
        "minute": 89,
        "team": "โมร็อกโก",
        "player": "Gessime Yassine"
      }
    ],
    "stats": {
      "possession": [
        49,
        51
      ],
      "shots": [
        7,
        14
      ],
      "shotsOnTarget": [
        4,
        7
      ],
      "fouls": [
        15,
        12
      ],
      "corners": [
        2,
        3
      ],
      "offsides": [
        1,
        1
      ],
      "yellowCards": [
        1,
        2
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
    "score1": 1,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-24T19:00:00-05:00",
    "venue": "สนามกีฬาบีบีวีเอ (Estadio Monterrey)",
    "events": [
      {
        "type": "GOAL",
        "minute": 63,
        "team": "แอฟริกาใต้",
        "player": "Taplv Maskv"
      }
    ],
    "stats": {
      "possession": [
        57,
        43
      ],
      "shots": [
        8,
        9
      ],
      "shotsOnTarget": [
        4,
        3
      ],
      "fouls": [
        15,
        8
      ],
      "corners": [
        5,
        5
      ],
      "offsides": [
        3,
        2
      ],
      "yellowCards": [
        2,
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
    "score2": 3,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-24T19:00:00-05:00",
    "venue": "สนามกีฬากลางเม็กซิโกซิตี้ (Estadio Azteca)",
    "events": [
      {
        "type": "GOAL",
        "minute": 55,
        "team": "เม็กซิโก",
        "player": "Mateo Chávez"
      },
      {
        "type": "GOAL",
        "minute": 61,
        "team": "เม็กซิโก",
        "player": "Jvlian Kviinvnz"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "เม็กซิโก",
        "player": "Álvaro Fidalgo"
      }
    ],
    "stats": {
      "possession": [
        45,
        55
      ],
      "shots": [
        14,
        7
      ],
      "shotsOnTarget": [
        5,
        3
      ],
      "fouls": [
        8,
        14
      ],
      "corners": [
        5,
        6
      ],
      "offsides": [
        2,
        2
      ],
      "yellowCards": [
        2,
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
    "score1": 3,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-24T12:00:00-07:00",
    "venue": "สนามกีฬาลูเมนฟิลด์ (Seattle)",
    "events": [
      {
        "type": "GOAL",
        "minute": 29,
        "team": "บอสเนียและเฮอร์เซโกวีนา",
        "player": "Karim Alaibgvvich"
      },
      {
        "type": "GOAL",
        "minute": 34,
        "team": "บอสเนียและเฮอร์เซโกวีนา",
        "player": "Abvnad"
      },
      {
        "type": "GOAL",
        "minute": 42,
        "team": "กาตาร์",
        "player": "Hassan Al-Haydos"
      },
      {
        "type": "GOAL",
        "minute": 80,
        "team": "บอสเนียและเฮอร์เซโกวีนา",
        "player": "Armin Mhmich"
      }
    ],
    "stats": {
      "possession": [
        40,
        60
      ],
      "shots": [
        8,
        9
      ],
      "shotsOnTarget": [
        4,
        4
      ],
      "fouls": [
        9,
        8
      ],
      "corners": [
        4,
        7
      ],
      "offsides": [
        2,
        2
      ],
      "yellowCards": [
        1,
        2
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
    "score1": 2,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-24T12:00:00-07:00",
    "venue": "บีซี เพลส (Vancouver)",
    "events": [
      {
        "type": "GOAL",
        "minute": 46,
        "team": "สวิตเซอร์แลนด์",
        "player": "Rubén Vargas"
      },
      {
        "type": "GOAL",
        "minute": 57,
        "team": "สวิตเซอร์แลนด์",
        "player": "Jvhan Mnzambi"
      },
      {
        "type": "GOAL",
        "minute": 76,
        "team": "แคนาดา",
        "player": "Prvmis Divid"
      }
    ],
    "stats": {
      "possession": [
        53,
        47
      ],
      "shots": [
        6,
        5
      ],
      "shotsOnTarget": [
        2,
        2
      ],
      "fouls": [
        10,
        14
      ],
      "corners": [
        6,
        5
      ],
      "offsides": [
        3,
        1
      ],
      "yellowCards": [
        2,
        2
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
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-25T16:00:00-04:00",
    "venue": "ลินคอล์น ไฟแนนเชียล ฟิลด์ (Philadelphia)",
    "events": [
      {
        "type": "GOAL",
        "minute": 7,
        "team": "ไอวอรีโคสต์",
        "player": "Nikvlas Ph Ph"
      },
      {
        "type": "GOAL",
        "minute": 64,
        "team": "ไอวอรีโคสต์",
        "player": "Nikvlas Ph Ph"
      }
    ],
    "stats": {
      "possession": [
        43,
        57
      ],
      "shots": [
        12,
        12
      ],
      "shotsOnTarget": [
        7,
        4
      ],
      "fouls": [
        13,
        9
      ],
      "corners": [
        7,
        2
      ],
      "offsides": [
        1,
        1
      ],
      "yellowCards": [
        1,
        2
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
    "score1": 2,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-25T16:00:00-04:00",
    "venue": "เม็ทไลฟ์ สเตเดียม (East Rutherford)",
    "events": [
      {
        "type": "GOAL",
        "minute": 2,
        "team": "เยอรมนี",
        "player": "Leroy Sané"
      },
      {
        "type": "GOAL",
        "minute": 9,
        "team": "เอกวาดอร์",
        "player": "Nilsvn Angvlv"
      },
      {
        "type": "GOAL",
        "minute": 77,
        "team": "เอกวาดอร์",
        "player": "Gvnzalv Plata"
      }
    ],
    "stats": {
      "possession": [
        56,
        44
      ],
      "shots": [
        8,
        5
      ],
      "shotsOnTarget": [
        3,
        2
      ],
      "fouls": [
        8,
        12
      ],
      "corners": [
        5,
        4
      ],
      "offsides": [
        0,
        3
      ],
      "yellowCards": [
        2,
        2
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
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-25T19:00:00-07:00",
    "venue": "ลีวายส์ สเตเดียม (Santa Clara)",
    "events": [],
    "stats": {
      "possession": [
        58,
        42
      ],
      "shots": [
        9,
        10
      ],
      "shotsOnTarget": [
        3,
        4
      ],
      "fouls": [
        9,
        8
      ],
      "corners": [
        2,
        4
      ],
      "offsides": [
        3,
        2
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
    "score1": 3,
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-25T19:00:00-07:00",
    "venue": "โลสแอนเจลิส สเตเดียม (SoFi Stadium)",
    "events": [
      {
        "type": "GOAL",
        "minute": 3,
        "team": "สหรัฐอเมริกา",
        "player": "Auston Trusty"
      },
      {
        "type": "GOAL",
        "minute": 10,
        "team": "ตุรกี",
        "player": "Arda Güler"
      },
      {
        "type": "GOAL",
        "minute": 31,
        "team": "ตุรกี",
        "player": "Baris Alpr Ailmaz"
      },
      {
        "type": "GOAL",
        "minute": 49,
        "team": "สหรัฐอเมริกา",
        "player": "Sebastian Berhalter"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "ตุรกี",
        "player": "Kan Aihan"
      }
    ],
    "stats": {
      "possession": [
        56,
        44
      ],
      "shots": [
        5,
        6
      ],
      "shotsOnTarget": [
        3,
        2
      ],
      "fouls": [
        12,
        10
      ],
      "corners": [
        6,
        7
      ],
      "offsides": [
        2,
        3
      ],
      "yellowCards": [
        2,
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
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-25T18:00:00-05:00",
    "venue": "เอทีแอนด์ที สเตเดียม (Arlington)",
    "events": [
      {
        "type": "GOAL",
        "minute": 56,
        "team": "ญี่ปุ่น",
        "player": "Daizen Maeda"
      },
      {
        "type": "GOAL",
        "minute": 62,
        "team": "สวีเดน",
        "player": "Anthony Elanga"
      }
    ],
    "stats": {
      "possession": [
        58,
        42
      ],
      "shots": [
        8,
        8
      ],
      "shotsOnTarget": [
        4,
        2
      ],
      "fouls": [
        13,
        8
      ],
      "corners": [
        6,
        2
      ],
      "offsides": [
        3,
        0
      ],
      "yellowCards": [
        2,
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
    "score1": 1,
    "score2": 3,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-25T18:00:00-05:00",
    "venue": "สนามกีฬาลูกศร (Arrowhead Stadium)",
    "events": [
      {
        "type": "GOAL",
        "minute": 3,
        "team": "เนเธอร์แลนด์",
        "player": "Alis Skhiri"
      },
      {
        "type": "GOAL",
        "minute": 7,
        "team": "เนเธอร์แลนด์",
        "player": "Brian Brobbey"
      },
      {
        "type": "GOAL",
        "minute": 54,
        "team": "ตูนิเซีย",
        "player": "Hazm Mstvri"
      },
      {
        "type": "GOAL",
        "minute": 62,
        "team": "เนเธอร์แลนด์",
        "player": "Ian Fn Hkh"
      }
    ],
    "stats": {
      "possession": [
        50,
        50
      ],
      "shots": [
        10,
        7
      ],
      "shotsOnTarget": [
        4,
        3
      ],
      "fouls": [
        14,
        10
      ],
      "corners": [
        2,
        3
      ],
      "offsides": [
        0,
        1
      ],
      "yellowCards": [
        0,
        1
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
    "score1": 5,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-26T15:00:00-04:00",
    "venue": "สนามกีฬาโตรอนโต (BMO Field)",
    "events": [
      {
        "type": "GOAL",
        "minute": 4,
        "team": "เซเนกัล",
        "player": "Habib Diarra"
      },
      {
        "type": "GOAL",
        "minute": 56,
        "team": "เซเนกัล",
        "player": "Ismaïla Sarr"
      },
      {
        "type": "GOAL",
        "minute": 59,
        "team": "เซเนกัล",
        "player": "Paph Gviih"
      },
      {
        "type": "GOAL",
        "minute": 71,
        "team": "เซเนกัล",
        "player": "Paph Gviih"
      },
      {
        "type": "GOAL",
        "minute": 82,
        "team": "เซเนกัล",
        "player": "Ailman Andiaih"
      }
    ],
    "stats": {
      "possession": [
        46,
        54
      ],
      "shots": [
        8,
        9
      ],
      "shotsOnTarget": [
        5,
        4
      ],
      "fouls": [
        11,
        12
      ],
      "corners": [
        5,
        3
      ],
      "offsides": [
        3,
        3
      ],
      "yellowCards": [
        1,
        2
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
    "score1": 1,
    "score2": 4,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-26T15:00:00-04:00",
    "venue": "ยิลเล็ตต์ สเตเดียม (Boston)",
    "events": [
      {
        "type": "GOAL",
        "minute": 7,
        "team": "ฝรั่งเศส",
        "player": "Ousmane Dembélé"
      },
      {
        "type": "GOAL",
        "minute": 20,
        "team": "ฝรั่งเศส",
        "player": "Ousmane Dembélé"
      },
      {
        "type": "GOAL",
        "minute": 21,
        "team": "นอร์เวย์",
        "player": "Thelo Aasgaard"
      },
      {
        "type": "GOAL",
        "minute": 32,
        "team": "ฝรั่งเศส",
        "player": "Ousmane Dembélé"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "ฝรั่งเศส",
        "player": "Désiré Doué"
      }
    ],
    "stats": {
      "possession": [
        51,
        49
      ],
      "shots": [
        14,
        14
      ],
      "shotsOnTarget": [
        4,
        5
      ],
      "fouls": [
        9,
        14
      ],
      "corners": [
        3,
        7
      ],
      "offsides": [
        3,
        0
      ],
      "yellowCards": [
        2,
        2
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
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-26T20:00:00-07:00",
    "venue": "สนามกีฬาลูเมนฟิลด์ (Seattle)",
    "events": [
      {
        "type": "GOAL",
        "minute": 5,
        "team": "อียิปต์",
        "player": "Mahmoud Saber"
      },
      {
        "type": "GOAL",
        "minute": 14,
        "team": "อิหร่าน",
        "player": "Ramin Rezaeian"
      }
    ],
    "stats": {
      "possession": [
        43,
        57
      ],
      "shots": [
        7,
        8
      ],
      "shotsOnTarget": [
        3,
        2
      ],
      "fouls": [
        10,
        10
      ],
      "corners": [
        2,
        7
      ],
      "offsides": [
        3,
        1
      ],
      "yellowCards": [
        1,
        1
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
    "score1": 1,
    "score2": 5,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-26T20:00:00-07:00",
    "venue": "บีซี เพลส (Vancouver)",
    "events": [
      {
        "type": "GOAL",
        "minute": 28,
        "team": "เบลเยียม",
        "player": "Leandro Trossard"
      },
      {
        "type": "GOAL",
        "minute": 50,
        "team": "เบลเยียม",
        "player": "Leandro Trossard"
      },
      {
        "type": "GOAL",
        "minute": 66,
        "team": "เบลเยียม",
        "player": "Kevin De Bruyne"
      },
      {
        "type": "GOAL",
        "minute": 84,
        "team": "นิวซีแลนด์",
        "player": "Ali Jast"
      },
      {
        "type": "GOAL",
        "minute": 86,
        "team": "เบลเยียม",
        "player": "Romelu Lukaku"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "เบลเยียม",
        "player": "Alexis Saelemaekers"
      }
    ],
    "stats": {
      "possession": [
        57,
        43
      ],
      "shots": [
        12,
        7
      ],
      "shotsOnTarget": [
        4,
        5
      ],
      "fouls": [
        8,
        12
      ],
      "corners": [
        2,
        6
      ],
      "offsides": [
        0,
        1
      ],
      "yellowCards": [
        0,
        1
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
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-26T19:00:00-05:00",
    "venue": "เอ็นอาร์จี สเตเดียม (Houston)",
    "events": [],
    "stats": {
      "possession": [
        47,
        53
      ],
      "shots": [
        7,
        5
      ],
      "shotsOnTarget": [
        2,
        1
      ],
      "fouls": [
        14,
        9
      ],
      "corners": [
        4,
        2
      ],
      "offsides": [
        2,
        0
      ],
      "yellowCards": [
        1,
        2
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
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-26T18:00:00-05:00",
    "venue": "สนามกีฬากัวดาลาฮารา (Estadio Akron)",
    "events": [
      {
        "type": "GOAL",
        "minute": 42,
        "team": "สเปน",
        "player": "Álex Baena"
      }
    ],
    "stats": {
      "possession": [
        51,
        49
      ],
      "shots": [
        11,
        8
      ],
      "shotsOnTarget": [
        4,
        2
      ],
      "fouls": [
        8,
        13
      ],
      "corners": [
        4,
        3
      ],
      "offsides": [
        3,
        2
      ],
      "yellowCards": [
        0,
        1
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
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-27T17:00:00-04:00",
    "venue": "เม็ทไลฟ์ สเตเดียม (East Rutherford)",
    "events": [
      {
        "type": "GOAL",
        "minute": 62,
        "team": "อังกฤษ",
        "player": "Jvd Blingham"
      },
      {
        "type": "GOAL",
        "minute": 67,
        "team": "อังกฤษ",
        "player": "Hri Kin"
      }
    ],
    "stats": {
      "possession": [
        51,
        49
      ],
      "shots": [
        8,
        6
      ],
      "shotsOnTarget": [
        2,
        2
      ],
      "fouls": [
        10,
        13
      ],
      "corners": [
        6,
        4
      ],
      "offsides": [
        1,
        1
      ],
      "yellowCards": [
        1,
        2
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
    "score1": 2,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-27T17:00:00-04:00",
    "venue": "ลินคอล์น ไฟแนนเชียล ฟิลด์ (Philadelphia)",
    "events": [
      {
        "type": "GOAL",
        "minute": 31,
        "team": "โครเอเชีย",
        "player": "Petar Sučić"
      },
      {
        "type": "GOAL",
        "minute": 73,
        "team": "กานา",
        "player": "Drik Lvkasn"
      },
      {
        "type": "GOAL",
        "minute": 83,
        "team": "โครเอเชีย",
        "player": "Nikola Vlašić"
      }
    ],
    "stats": {
      "possession": [
        45,
        55
      ],
      "shots": [
        14,
        10
      ],
      "shotsOnTarget": [
        6,
        3
      ],
      "fouls": [
        8,
        10
      ],
      "corners": [
        5,
        4
      ],
      "offsides": [
        2,
        1
      ],
      "yellowCards": [
        2,
        2
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
    "score1": 3,
    "score2": 3,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-27T21:00:00-05:00",
    "venue": "สนามกีฬาลูกศร (Arrowhead Stadium)",
    "events": [
      {
        "type": "GOAL",
        "minute": 28,
        "team": "ออสเตรีย",
        "player": "Marko Arnautović"
      },
      {
        "type": "GOAL",
        "minute": 45,
        "team": "แอลจีเรีย",
        "player": "Rafik Blghali"
      },
      {
        "type": "GOAL",
        "minute": 55,
        "team": "ออสเตรีย",
        "player": "Marcel Sabitzer"
      },
      {
        "type": "GOAL",
        "minute": 60,
        "team": "แอลจีเรีย",
        "player": "Riyad Mahrez"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "แอลจีเรีย",
        "player": "Riyad Mahrez"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "ออสเตรีย",
        "player": "Saša Kalajdžić"
      }
    ],
    "stats": {
      "possession": [
        40,
        60
      ],
      "shots": [
        6,
        7
      ],
      "shotsOnTarget": [
        3,
        3
      ],
      "fouls": [
        11,
        10
      ],
      "corners": [
        7,
        5
      ],
      "offsides": [
        0,
        1
      ],
      "yellowCards": [
        1,
        1
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
    "score1": 1,
    "score2": 3,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-27T21:00:00-05:00",
    "venue": "เอทีแอนด์ที สเตเดียม (Arlington)",
    "events": [
      {
        "type": "GOAL",
        "minute": 19,
        "team": "อาร์เจนตินา",
        "player": "Jivani Lv Slsv"
      },
      {
        "type": "PENALTY",
        "minute": 31,
        "team": "อาร์เจนตินา",
        "player": "Lautaro Martínez"
      },
      {
        "type": "GOAL",
        "minute": 55,
        "team": "จอร์แดน",
        "player": "Mvsi Altmari"
      },
      {
        "type": "GOAL",
        "minute": 80,
        "team": "อาร์เจนตินา",
        "player": "Lionel Messi"
      }
    ],
    "stats": {
      "possession": [
        56,
        44
      ],
      "shots": [
        7,
        7
      ],
      "shotsOnTarget": [
        3,
        3
      ],
      "fouls": [
        8,
        13
      ],
      "corners": [
        5,
        6
      ],
      "offsides": [
        0,
        2
      ],
      "yellowCards": [
        1,
        1
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
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-27T19:30:00-04:00",
    "venue": "สนามกีฬาฮาร์ดร็อค (Miami)",
    "events": [],
    "stats": {
      "possession": [
        44,
        56
      ],
      "shots": [
        11,
        5
      ],
      "shotsOnTarget": [
        5,
        1
      ],
      "fouls": [
        15,
        14
      ],
      "corners": [
        6,
        4
      ],
      "offsides": [
        2,
        1
      ],
      "yellowCards": [
        1,
        1
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
    "score1": 3,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-27T19:30:00-04:00",
    "venue": "เมอร์เซเดส-เบนซ์ สเตเดียม (Atlanta)",
    "events": [
      {
        "type": "GOAL",
        "minute": 10,
        "team": "อุซเบกิสถาน",
        "player": "Aldvr Shvmvrvdvf"
      },
      {
        "type": "GOAL",
        "minute": 78,
        "team": "ดีอาร์ คองโก",
        "player": "Fistvn Mail"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "ดีอาร์ คองโก",
        "player": "Yoane Wissa"
      }
    ],
    "stats": {
      "possession": [
        42,
        58
      ],
      "shots": [
        8,
        8
      ],
      "shotsOnTarget": [
        4,
        4
      ],
      "fouls": [
        15,
        9
      ],
      "corners": [
        4,
        4
      ],
      "offsides": [
        3,
        3
      ],
      "yellowCards": [
        1,
        2
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 73,
    "group": "R32",
    "team1": "แอฟริกาใต้",
    "team2": "แคนาดา",
    "score1": 0,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-28T05:00:00.000Z",
    "venue": "Stadium ID 16",
    "events": [
      {
        "type": "GOAL",
        "minute": 90,
        "team": "แคนาดา",
        "player": "Astfan Avstakviv"
      }
    ],
    "stats": {
      "possession": [
        54,
        46
      ],
      "shots": [
        10,
        8
      ],
      "shotsOnTarget": [
        5,
        3
      ],
      "fouls": [
        9,
        14
      ],
      "corners": [
        4,
        2
      ],
      "offsides": [
        1,
        3
      ],
      "yellowCards": [
        2,
        2
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 74,
    "group": "R32",
    "team1": "เยอรมนี",
    "team2": "ปารากวัย",
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-29T09:30:00.000Z",
    "venue": "Stadium ID 9",
    "events": [
      {
        "type": "GOAL",
        "minute": 42,
        "team": "ปารากวัย",
        "player": "Khvliv Ansisv"
      },
      {
        "type": "GOAL",
        "minute": 54,
        "team": "เยอรมนี",
        "player": "Kai Havertz"
      }
    ],
    "stats": {
      "possession": [
        55,
        45
      ],
      "shots": [
        11,
        11
      ],
      "shotsOnTarget": [
        5,
        6
      ],
      "fouls": [
        15,
        13
      ],
      "corners": [
        6,
        5
      ],
      "offsides": [
        0,
        2
      ],
      "yellowCards": [
        0,
        2
      ],
      "redCards": [
        0,
        0
      ]
    },
    "penalty1": 3,
    "penalty2": 4
  },
  {
    "id": 75,
    "group": "R32",
    "team1": "เนเธอร์แลนด์",
    "team2": "โมร็อกโก",
    "score1": 1,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-29T12:00:00.000Z",
    "venue": "Stadium ID 3",
    "events": [
      {
        "type": "GOAL",
        "minute": 72,
        "team": "เนเธอร์แลนด์",
        "player": "Kvdi Khakpv"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "โมร็อกโก",
        "player": "Issa Diop"
      }
    ],
    "stats": {
      "possession": [
        51,
        49
      ],
      "shots": [
        8,
        5
      ],
      "shotsOnTarget": [
        4,
        2
      ],
      "fouls": [
        12,
        9
      ],
      "corners": [
        5,
        5
      ],
      "offsides": [
        0,
        1
      ],
      "yellowCards": [
        1,
        2
      ],
      "redCards": [
        0,
        0
      ]
    },
    "penalty1": 2,
    "penalty2": 3
  },
  {
    "id": 76,
    "group": "R32",
    "team1": "บราซิล",
    "team2": "ญี่ปุ่น",
    "score1": 2,
    "score2": 1,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-29T05:00:00.000Z",
    "venue": "Stadium ID 5",
    "events": [
      {
        "type": "GOAL",
        "minute": 29,
        "team": "ญี่ปุ่น",
        "player": "Kaishū Sano"
      },
      {
        "type": "GOAL",
        "minute": 56,
        "team": "บราซิล",
        "player": "Casemiro"
      },
      {
        "type": "GOAL",
        "minute": 90,
        "team": "บราซิล",
        "player": "Gabriel Martinelli"
      }
    ],
    "stats": {
      "possession": [
        59,
        41
      ],
      "shots": [
        6,
        8
      ],
      "shotsOnTarget": [
        2,
        3
      ],
      "fouls": [
        15,
        15
      ],
      "corners": [
        3,
        3
      ],
      "offsides": [
        3,
        1
      ],
      "yellowCards": [
        0,
        2
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 77,
    "group": "R32",
    "team1": "ฝรั่งเศส",
    "team2": "สวีเดน",
    "score1": 3,
    "score2": 0,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-30T10:00:00.000Z",
    "venue": "Stadium ID 11",
    "events": [
      {
        "type": "GOAL",
        "minute": 45,
        "team": "ฝรั่งเศส",
        "player": "Kylian Mbappé"
      },
      {
        "type": "GOAL",
        "minute": 53,
        "team": "ฝรั่งเศส",
        "player": "Bradley Barcola"
      },
      {
        "type": "GOAL",
        "minute": 74,
        "team": "ฝรั่งเศส",
        "player": "Kylian Mbappé"
      }
    ],
    "stats": {
      "possession": [
        57,
        43
      ],
      "shots": [
        9,
        9
      ],
      "shotsOnTarget": [
        3,
        4
      ],
      "fouls": [
        11,
        8
      ],
      "corners": [
        7,
        2
      ],
      "offsides": [
        3,
        2
      ],
      "yellowCards": [
        2,
        1
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 78,
    "group": "R32",
    "team1": "ไอวอรีโคสต์",
    "team2": "นอร์เวย์",
    "score1": 1,
    "score2": 2,
    "status": "FINISHED",
    "minute": 90,
    "date": "2026-06-30T05:00:00.000Z",
    "venue": "Stadium ID 4",
    "events": [
      {
        "type": "GOAL",
        "minute": 39,
        "team": "นอร์เวย์",
        "player": "Antonio Nusa"
      },
      {
        "type": "GOAL",
        "minute": 74,
        "team": "ไอวอรีโคสต์",
        "player": "Amad Diallo"
      },
      {
        "type": "GOAL",
        "minute": 86,
        "team": "นอร์เวย์",
        "player": "Erling Haaland"
      }
    ],
    "stats": {
      "possession": [
        46,
        54
      ],
      "shots": [
        9,
        14
      ],
      "shotsOnTarget": [
        4,
        6
      ],
      "fouls": [
        10,
        11
      ],
      "corners": [
        4,
        5
      ],
      "offsides": [
        0,
        0
      ],
      "yellowCards": [
        1,
        0
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 79,
    "group": "R32",
    "team1": "เม็กซิโก",
    "team2": "เอกวาดอร์",
    "score1": 0,
    "score2": 0,
    "status": "LIVE",
    "minute": 45,
    "date": "2026-06-30T12:00:00.000Z",
    "venue": "Stadium ID 1",
    "events": [],
    "stats": {
      "possession": [
        52,
        48
      ],
      "shots": [
        5,
        10
      ],
      "shotsOnTarget": [
        2,
        5
      ],
      "fouls": [
        12,
        13
      ],
      "corners": [
        3,
        4
      ],
      "offsides": [
        1,
        3
      ],
      "yellowCards": [
        2,
        2
      ],
      "redCards": [
        0,
        0
      ]
    }
  },
  {
    "id": 80,
    "group": "R32",
    "team1": "อังกฤษ",
    "team2": "ดีอาร์ คองโก",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-01T05:00:00.000Z",
    "venue": "Stadium ID 7",
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
    "id": 81,
    "group": "R32",
    "team1": "สหรัฐอเมริกา",
    "team2": "บอสเนียและเฮอร์เซโกวีนา",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-01T10:00:00.000Z",
    "venue": "Stadium ID 15",
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
    "id": 82,
    "group": "R32",
    "team1": "เบลเยียม",
    "team2": "เซเนกัล",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-01T06:00:00.000Z",
    "venue": "Stadium ID 14",
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
    "id": 83,
    "group": "R32",
    "team1": "โปรตุเกส",
    "team2": "โครเอเชีย",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-02T12:00:00.000Z",
    "venue": "Stadium ID 12",
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
    "id": 84,
    "group": "R32",
    "team1": "สเปน",
    "team2": "ออสเตรีย",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-02T05:00:00.000Z",
    "venue": "Stadium ID 16",
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
    "id": 85,
    "group": "R32",
    "team1": "สวิตเซอร์แลนด์",
    "team2": "แอลจีเรีย",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-02T13:00:00.000Z",
    "venue": "Stadium ID 13",
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
    "id": 86,
    "group": "R32",
    "team1": "อาร์เจนตินา",
    "team2": "เคปเวิร์ด",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-03T11:00:00.000Z",
    "venue": "Stadium ID 8",
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
    "id": 87,
    "group": "R32",
    "team1": "โคลอมเบีย",
    "team2": "กานา",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-03T13:30:00.000Z",
    "venue": "Stadium ID 6",
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
    "id": 88,
    "group": "R32",
    "team1": "ออสเตรเลีย",
    "team2": "อียิปต์",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-03T06:00:00.000Z",
    "venue": "Stadium ID 4",
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
    "id": 89,
    "group": "R16",
    "team1": "ปารากวัย",
    "team2": "ฝรั่งเศส",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-04T10:00:00.000Z",
    "venue": "Stadium ID 10",
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
    "id": 90,
    "group": "R16",
    "team1": "แคนาดา",
    "team2": "โมร็อกโก",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-04T05:00:00.000Z",
    "venue": "Stadium ID 5",
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
    "id": 91,
    "group": "R16",
    "team1": "บราซิล",
    "team2": "นอร์เวย์",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-05T09:00:00.000Z",
    "venue": "Stadium ID 11",
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
    "id": 92,
    "group": "R16",
    "team1": "ผู้ชนะคู่ที่ 79",
    "team2": "ผู้ชนะคู่ที่ 80",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-05T11:00:00.000Z",
    "venue": "Stadium ID 1",
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
    "id": 93,
    "group": "R16",
    "team1": "ผู้ชนะคู่ที่ 83",
    "team2": "ผู้ชนะคู่ที่ 84",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-06T07:00:00.000Z",
    "venue": "Stadium ID 4",
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
    "id": 94,
    "group": "R16",
    "team1": "ผู้ชนะคู่ที่ 81",
    "team2": "ผู้ชนะคู่ที่ 82",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-06T10:00:00.000Z",
    "venue": "Stadium ID 14",
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
    "id": 95,
    "group": "R16",
    "team1": "ผู้ชนะคู่ที่ 86",
    "team2": "ผู้ชนะคู่ที่ 88",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-07T05:00:00.000Z",
    "venue": "Stadium ID 7",
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
    "id": 96,
    "group": "R16",
    "team1": "ผู้ชนะคู่ที่ 85",
    "team2": "ผู้ชนะคู่ที่ 87",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-07T06:00:00.000Z",
    "venue": "Stadium ID 13",
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
    "id": 97,
    "group": "QF",
    "team1": "ผู้ชนะคู่ที่ 89",
    "team2": "ผู้ชนะคู่ที่ 90",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-09T09:00:00.000Z",
    "venue": "Stadium ID 9",
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
    "id": 98,
    "group": "QF",
    "team1": "ผู้ชนะคู่ที่ 93",
    "team2": "ผู้ชนะคู่ที่ 94",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-10T05:00:00.000Z",
    "venue": "Stadium ID 16",
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
    "id": 99,
    "group": "QF",
    "team1": "ผู้ชนะคู่ที่ 91",
    "team2": "ผู้ชนะคู่ที่ 92",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-11T10:00:00.000Z",
    "venue": "Stadium ID 8",
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
    "id": 100,
    "group": "QF",
    "team1": "ผู้ชนะคู่ที่ 95",
    "team2": "ผู้ชนะคู่ที่ 96",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-11T13:00:00.000Z",
    "venue": "Stadium ID 6",
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
    "id": 101,
    "group": "SF",
    "team1": "ผู้ชนะคู่ที่ 97",
    "team2": "ผู้ชนะคู่ที่ 98",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-14T07:00:00.000Z",
    "venue": "Stadium ID 4",
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
    "id": 102,
    "group": "SF",
    "team1": "ผู้ชนะคู่ที่ 99",
    "team2": "ผู้ชนะคู่ที่ 100",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-15T08:00:00.000Z",
    "venue": "Stadium ID 7",
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
    "id": 103,
    "group": "3RD",
    "team1": "ผู้แพ้คู่ที่ 101",
    "team2": "ผู้แพ้คู่ที่ 102",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-18T10:00:00.000Z",
    "venue": "Stadium ID 8",
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
    "id": 104,
    "group": "FINAL",
    "team1": "ผู้ชนะคู่ที่ 101",
    "team2": "ผู้ชนะคู่ที่ 102",
    "score1": 0,
    "score2": 0,
    "status": "SCHEDULED",
    "minute": 0,
    "date": "2026-07-19T08:00:00.000Z",
    "venue": "Stadium ID 11",
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
        const match = matches.find(m => m.id === parseInt(game.id));

        if (match) {
          const team1Thai = TEAM_EN_TO_TH[game.home_team_name_en] || (game.home_team_label ? game.home_team_label.replace('Winner Match ', 'ผู้ชนะคู่ที่ ').replace('Loser Match ', 'ผู้แพ้คู่ที่ ').replace('Winner Group ', 'อันดับ 1 กลุ่ม ').replace('Runner-up Group ', 'อันดับ 2 กลุ่ม ').replace('3rd Group ', 'อันดับ 3 กลุ่ม ') : '') || game.home_team_name_en || match.team1;
          const team2Thai = TEAM_EN_TO_TH[game.away_team_name_en] || (game.away_team_label ? game.away_team_label.replace('Winner Match ', 'ผู้ชนะคู่ที่ ').replace('Loser Match ', 'ผู้แพ้คู่ที่ ').replace('Winner Group ', 'อันดับ 1 กลุ่ม ').replace('Runner-up Group ', 'อันดับ 2 กลุ่ม ').replace('3rd Group ', 'อันดับ 3 กลุ่ม ') : '') || game.away_team_name_en || match.team2;
          
          match.team1 = team1Thai;
          match.team2 = team2Thai;

          const finished = game.finished === 'TRUE';
          const isLive = game.time_elapsed === 'live' || (!finished && game.time_elapsed !== 'notstarted' && game.time_elapsed !== 'null');
          
          const isHomeTeam1 = match.team1 === team1Thai;
          const score1Val = parseInt(isHomeTeam1 ? game.home_score : game.away_score);
          const score2Val = parseInt(isHomeTeam1 ? game.away_score : game.home_score);
          
          if (!isNaN(score1Val) && !isNaN(score2Val)) {
            match.score1 = score1Val;
            match.score2 = score2Val;
          }

          const homePen = parseInt(game.home_penalty_score);
          const awayPen = parseInt(game.away_penalty_score);
          if (!isNaN(homePen) && !isNaN(awayPen)) {
            match.penalty1 = isHomeTeam1 ? homePen : awayPen;
            match.penalty2 = isHomeTeam1 ? awayPen : homePen;
          }
          
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
