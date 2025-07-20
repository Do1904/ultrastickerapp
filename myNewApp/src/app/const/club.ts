import { Club, Country, League } from "../model/football";

export const COUNTRIES: Country[] = [
    { countryId: 1, countryName: 'England' },
    { countryId: 2, countryName: 'Germany' },
    { countryId: 3, countryName: 'Spain' },
    { countryId: 4, countryName: 'Italy' },
    { countryId: 5, countryName: 'France' },
    { countryId: 6, countryName: 'Portugal' },
    { countryId: 7, countryName: 'Netherlands' },
    { countryId: 8, countryName: 'Scotland' },
    { countryId: 9, countryName: 'Belgium' },
    { countryId: 10, countryName: 'Turkey' },
    { countryId: 99, countryName: 'test' } // test
]

export const LEAGUES: League[] = [
    { leagueId: 1001, leagueName: 'Premier League', countryId: 1 },
    { leagueId: 1002, leagueName: 'Championship', countryId: 1 },
    { leagueId: 2001, leagueName: 'Bundesliga', countryId: 2 },
    { leagueId: 2002, leagueName: '2. Bundesliga', countryId: 2 },
    { leagueId: 2003, leagueName: '3. Liga', countryId: 2 },
    { leagueId: 2004, leagueName: 'Regionalliga West', countryId: 2 },
    { leagueId: 3001, leagueName: 'La Liga', countryId: 3 },
    { leagueId: 3002, leagueName: 'Segunda División', countryId: 3 },
    { leagueId: 4001, leagueName: 'Serie A', countryId: 4 },
    { leagueId: 4002, leagueName: 'Serie B', countryId: 4 },
    { leagueId: 5001, leagueName: 'Ligue 1', countryId: 5 },
    { leagueId: 5002, leagueName: 'Ligue 2', countryId: 5 },
    { leagueId: 6001, leagueName: 'Primeira Liga', countryId: 6 },
    { leagueId: 7001, leagueName: 'Eredivisie', countryId: 7 },
    { leagueId: 8001, leagueName: 'Scottish Premiership', countryId: 8 },
    { leagueId: 9001, leagueName: 'Belgian Pro League', countryId: 9 },
    { leagueId: 10001, leagueName: 'Süper Lig', countryId: 10 },
    { leagueId: 9999, leagueName: 'test', countryId: 99 } // test
];

export const CLUBS: Club[] = [
    {
        clubId: 999901, clubName: 'testClub', leagueId: 9999,
        color1: "#999999",
        color2: "#cccccc"
    },
    {
        clubId: 1001001, clubName: 'Arsenal', leagueId: 1001,
        color1: "#EF0107", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 1001002, clubName: 'Aston Villa', leagueId: 1001,
        color1: "#95BFE5", // 水色
        color2: "#670E36"  // バーガンディ
    },
    {
        clubId: 1001003, clubName: 'Bournemouth', leagueId: 1001,
        color1: "#DA291C", // 赤
        color2: "#000000"  // 黒
    },
    {
        clubId: 1001004, clubName: 'Brentford', leagueId: 1001,
        color1: "#D00027", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 1001005, clubName: 'Brighton & Hove Albion', leagueId: 1001,
        color1: "#0057B8", // 青
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 1001006, clubName: 'Burnley', leagueId: 1001,
        color1: "#6C1D45", // ワインレッド
        color2: "#99D6EA"  // 水色
    },
    {
        clubId: 1001007, clubName: 'Chelsea', leagueId: 1001,
        color1: "#034694", // 青
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 1001008, clubName: 'Crystal Palace', leagueId: 1001,
        color1: "#1B458F", // 青
        color2: "#C8102E"  // 赤
    },
    {
        clubId: 1001009, clubName: 'Everton', leagueId: 1001,
        color1: "#003399", // 青
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 1001010, clubName: 'Fulham', leagueId: 1001,
        color1: "#FFFFFF", // 白
        color2: "#000000"  // 黒
    },
    {
        clubId: 1001011, clubName: 'Leeds United', leagueId: 1001,
        color1: "#FFCD00", // 黄色
        color2: "#1D428A"  // 青
    },
    {
        clubId: 1001012, clubName: 'Liverpool', leagueId: 1001,
        color1: "#C8102E", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 1001013, clubName: 'Manchester City', leagueId: 1001,
        color1: "#6CABDD", // 水色
        color2: "#1C2C5B"  // ネイビー
    },
    {
        clubId: 1001014, clubName: 'Manchester United', leagueId: 1001,
        color1: "#DA291C", // 赤
        color2: "#241F20"  // 黒
    },
    {
        clubId: 1001015, clubName: 'Newcastle United', leagueId: 1001,
        color1: "#241F20", // 黒
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 1001016, clubName: 'Nottingham Forest', leagueId: 1001,
        color1: "#DD1E2F", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 1001017, clubName: 'Sunderland', leagueId: 1001,
        color1: "#E2231A", // 赤
        color2: "#000000"  // 黒
    },
    {
        clubId: 1001018, clubName: 'Tottenham Hotspur', leagueId: 1001,
        color1: "#132257", // ネイビー
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 1001019, clubName: 'West Ham United', leagueId: 1001,
        color1: "#7A263A", // バーガンディ
        color2: "#1BB1E7"  // 水色
    },
    {
        clubId: 1001020, clubName: 'Wolverhampton Wanderers', leagueId: 1001,
        color1: "#FDB913", // 黄金色
        color2: "#231F20"  // 黒
    },
    // Bundesliga (leagueId: 2001)
    {
        clubId: 2001001, clubName: 'Bayern München', leagueId: 2001,
        color1: "#DC052D", // 赤
        color2: "#0066B2"  // 青
    },
    {
        clubId: 2001002, clubName: 'Bayer Leverkusen', leagueId: 2001,
        color1: "#E32219", // 赤
        color2: "#000000"  // 黒
    },
    {
        clubId: 2001003, clubName: 'Borussia Dortmund', leagueId: 2001,
        color1: "#FDE100", // 黄
        color2: "#000000"  // 黒
    },
    {
        clubId: 2001004, clubName: 'Eintracht Frankfurt', leagueId: 2001,
        color1: "#E1000F", // 赤
        color2: "#000000"  // 黒
    },
    {
        clubId: 2001005, clubName: 'SC Freiburg', leagueId: 2001,
        color1: "#ED1C24", // 赤
        color2: "#000000"  // 黒
    },
    {
        clubId: 2001006, clubName: 'Mainz 05', leagueId: 2001,
        color1: "#C20017", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 2001007, clubName: 'Werder Bremen', leagueId: 2001,
        color1: "#1E944B", // 緑
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 2001008, clubName: 'VfB Stuttgart', leagueId: 2001,
        color1: "#FFFFFF", // 白
        color2: "#E30613"  // 赤
    },
    {
        clubId: 2001009, clubName: 'VfL Wolfsburg', leagueId: 2001,
        color1: "#65B32E", // 緑
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 2001010, clubName: 'Union Berlin', leagueId: 2001,
        color1: "#DD0000", // 赤
        color2: "#FFD700"  // 黄
    },
    {
        clubId: 2001011, clubName: 'Borussia Mönchengladbach', leagueId: 2001,
        color1: "#FFFFFF", // 白
        color2: "#000000"  // 黒
    },
    {
        clubId: 2001012, clubName: 'FC Augsburg', leagueId: 2001,
        color1: "#C20C0C", // 赤
        color2: "#1B5E20"  // 緑
    },
    {
        clubId: 2001013, clubName: 'St.Pauli', leagueId: 2001,
        color1: "#3C1E1E", // 茶色
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 2001014, clubName: 'Hamburger SV', leagueId: 2001,
        color1: "#0066B2", // 青
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 2001015, clubName: 'HeclubIdenheim', leagueId: 2001,
        color1: "#005BAC", // 青
        color2: "#E30613"  // 赤
    },
    {
        clubId: 2001016, clubName: 'Hoffenheim', leagueId: 2001,
        color1: "#0066B3", // 青
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 2001017, clubName: 'RB Leipzig', leagueId: 2001,
        color1: "#E30613", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 2001018, clubName: '1.FC Köln', leagueId: 2001,
        color1: "#F00000", // 赤
        color2: "#FFFFFF"  // 白
    },
    // 2. Bundesliga (leagueId: 2002)
    {
        clubId: 2002001, clubName: '1.FC Nürnberg', leagueId: 2002,
        color1: "#A0000D", // 赤
        color2: "#FFFFFF"
    },
    {
        clubId: 2002002, clubName: 'Fortuna Düsseldorf', leagueId: 2002,
        color1: "#D10000", // 赤
        color2: "#FFFFFF"
    },
    {
        clubId: 2002003, clubName: 'Hannover 96', leagueId: 2002,
        color1: "#007F36", // 緑
        color2: "#000000"
    },
    {
        clubId: 2002004, clubName: 'Schalke 04', leagueId: 2002,
        color1: "#004D9D", // 青
        color2: "#FFFFFF"
    },
    {
        clubId: 2002005, clubName: 'Karlsruher SC', leagueId: 2002,
        color1: "#005BAC", // 青
        color2: "#FFFFFF"
    },
    {
        clubId: 2002006, clubName: 'VFL Bochum', leagueId: 2002,
        color1: "#1D428A", // 青
        color2: "#FFFFFF"
    },
    {
        clubId: 2002007, clubName: '1.FC Kaiserslautern', leagueId: 2002,
        color1: "#A0001C", // 赤
        color2: "#FFFFFF"
    },
    {
        clubId: 2002008, clubName: 'Eintracht Braunschweig', leagueId: 2002,
        color1: "#FFD700", // 黄
        color2: "#1D428A"
    },
    {
        clubId: 2002009, clubName: 'Dynamo Dresden', leagueId: 2002,
        color1: "#FDB813", // 金色
        color2: "#000000"
    },
    {
        clubId: 2002010, clubName: 'Elversberg', leagueId: 2002,
        color1: "#FFFFFF",
        color2: "#000000"
    },
    {
        clubId: 2002011, clubName: 'Hertha Berlin', leagueId: 2002,
        color1: "#004B87", // 青
        color2: "#FFFFFF"
    },
    {
        clubId: 2002012, clubName: 'Arminia Bielefeld', leagueId: 2002,
        color1: "#0066B3",
        color2: "#FFFFFF"
    },
    {
        clubId: 2002013, clubName: 'FC Magdeburg', leagueId: 2002,
        color1: "#005BAC",
        color2: "#FFFFFF"
    },
    {
        clubId: 2002014, clubName: 'Preußen Münster', leagueId: 2002,
        color1: "#007F36",
        color2: "#000000"
    },
    {
        clubId: 2002015, clubName: 'SV Darmstadt 98', leagueId: 2002,
        color1: "#0033A0",
        color2: "#FFFFFF"
    },
    {
        clubId: 2002016, clubName: 'SSV Ulm', leagueId: 2002,
        color1: "#000000",
        color2: "#FFFFFF"
    },
    {
        clubId: 2002017, clubName: 'Greuter Fürth', leagueId: 2002,
        color1: "#007A33",
        color2: "#FFFFFF"
    },
    {
        clubId: 2002018, clubName: 'Holstein Kiel', leagueId: 2002,
        color1: "#005BAC",
        color2: "#E30613"
    },
    // 3. Liga (leagueId: 2003)
    {
        clubId: 2003001, clubName: 'Jahn Regensburg', leagueId: 2003,
        color1: "#d1001c", color2: "#ffffff"
    },
    {
        clubId: 2003002, clubName: 'Alemannia Aachen', leagueId: 2003,
        color1: "#ffd500", color2: "#000000"
    },
    {
        clubId: 2003003, clubName: 'VFB StuttgartⅡ', leagueId: 2003,
        color1: "#ffffff", color2: "#e60000"
    },
    {
        clubId: 2003004, clubName: 'Energie Cottbus', leagueId: 2003,
        color1: "#d50032", color2: "#ffffff"
    },
    {
        clubId: 2003005, clubName: 'Rot-Weiss Essen', leagueId: 2003,
        color1: "#ed1c24", color2: "#ffffff"
    },
    {
        clubId: 2003006, clubName: 'FC Ingolstadt', leagueId: 2003,
        color1: "#c8001e", color2: "#000000"
    },
    {
        clubId: 2003007, clubName: 'Viktoria Köln', leagueId: 2003,
        color1: "#000000", color2: "#e00034"
    },
    {
        clubId: 2003008, clubName: '1. FC Saarbrücken', leagueId: 2003,
        color1: "#0000ff", color2: "#ffff00"
    },
    {
        clubId: 2003009, clubName: 'Wehen Wiesbaden', leagueId: 2003,
        color1: "#c20f2f", color2: "#000000"
    },
    {
        clubId: 2003010, clubName: 'VfL Osnabrück', leagueId: 2003,
        color1: "#5a2a82", color2: "#ffffff"
    },
    {
        clubId: 2003011, clubName: '1860 München', leagueId: 2003,
        color1: "#5eb6e4", color2: "#ffffff"
    },
    {
        clubId: 2003012, clubName: 'Schweinfurt 05', leagueId: 2003,
        color1: "#00703c", color2: "#ffffff"
    },
    {
        clubId: 2003013, clubName: 'Waldhof Mannheim', leagueId: 2003,
        color1: "#005bac", color2: "#ffffff"
    },
    {
        clubId: 2003014, clubName: 'TSV Havelse', leagueId: 2003,
        color1: "#ff0000", color2: "#ffffff"
    },
    {
        clubId: 2003015, clubName: 'Unterhaching', leagueId: 2003,
        color1: "#d6001c", color2: "#0033a0"
    },
    {
        clubId: 2003016, clubName: 'SSV Ulm', leagueId: 2003,
        color1: "#000000", color2: "#ffffff"
    },
    {
        clubId: 2003017, clubName: 'Hansa Rostock', leagueId: 2003,
        color1: "#006cb7", color2: "#e3000f"
    },
    {
        clubId: 2003018, clubName: 'Erzgebirge Aue', leagueId: 2003,
        color1: "#5a2a82", color2: "#ffcc00"
    },
    {
        clubId: 2003019, clubName: 'MSV Duisburg', leagueId: 2003,
        color1: "#005bac", color2: "#ffffff"
    },
    {
        clubId: 2003020, clubName: 'TSG HoffenheimⅡ', leagueId: 2003,
        color1: "#0066b3", color2: "#ffffff"
    },
    // La Liga (leagueId: 3001)
    {
        clubId: 3001001, clubName: 'FC Barcelona', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001002, clubName: 'Real MadrclubId CF', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001003, clubName: 'Atlético de MadrclubId', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001004, clubName: 'Sevilla FC', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001005, clubName: 'Real Betis Balompié', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001006, clubName: 'RC Celta de Vigo', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001007, clubName: 'RCD Mallorca', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001008, clubName: 'Valencia CF', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001009, clubName: 'Villarreal CF', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001010, clubName: 'Rayo Vallecano', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001011, clubName: 'Granada CF', leagueId: 3001,
        color1: "",
        color2: ""
    }, // 降格残留
    {
        clubId: 3001012, clubName: 'UD Almería', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001013, clubName: 'Getafe CF', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001014, clubName: 'Athletic Club', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001015, clubName: 'Real Sociedad', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001016, clubName: 'CA Osasuna', leagueId: 3001,
        color1: "",
        color2: ""
    },
    {
        clubId: 3001017, clubName: 'RC Deportivo La Coruña', leagueId: 3001,
        color1: "",
        color2: ""
    }, // 2部
    // La Liga 2 (leagueId: 3002)
    {
        clubId: 3002001, clubName: 'UD Las Palmas', leagueId: 3002,
        color1: "",
        color2: ""
    },
    {
        clubId: 3002002, clubName: 'CD Leganés', leagueId: 3002,
        color1: "",
        color2: ""
    },
    {
        clubId: 3002003, clubName: 'Real ValladolclubId', leagueId: 3002,
        color1: "",
        color2: ""
    },
    {
        clubId: 3002004, clubName: 'Real Oviedo', leagueId: 3002,
        color1: "",
        color2: ""
    },
    {
        clubId: 3002005, clubName: 'Cultural y Deportiva Leonesa', leagueId: 3002,
        color1: "",
        color2: ""
    },
    {
        clubId: 3002006, clubName: 'FC Andorra', leagueId: 3002,
        color1: "",
        color2: ""
    },
    {
        clubId: 3002007, clubName: 'AD Ceuta FC', leagueId: 3002,
        color1: "",
        color2: ""
    },
    // Serie A (leagueId: 4001)
    {
        clubId: 4001001, clubName: 'AC Milan', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001002, clubName: 'AS Roma', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001003, clubName: 'Atalanta BC', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001004, clubName: 'Bologna FC 1909', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001005, clubName: 'Cagliari Calcio', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001006, clubName: 'Como 1907', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001007, clubName: 'Cremonese', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001008, clubName: 'Empoli FC', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001009, clubName: 'Fiorentina', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001010, clubName: 'Genoa CFC', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001011, clubName: 'Hellas Verona FC', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001012, clubName: 'Inter Milan', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001013, clubName: 'Juventus FC', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001014, clubName: 'Lazio Roma', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001015, clubName: 'Napoli', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001016, clubName: 'Parma Calcio 1913', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001017, clubName: 'Sassuolo', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001018, clubName: 'SSC Venezia', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001019, clubName: 'Udinese Calcio', leagueId: 4001,
        color1: "",
        color2: ""
    },
    {
        clubId: 4001020, clubName: 'US Lecce', leagueId: 4001,
        color1: "",
        color2: ""
    },
    // Serie B (leagueId: 4002) 例示で省略
    {
        clubId: 4002001, clubName: 'Brescia Calcio', leagueId: 4002,
        color1: "",
        color2: ""
    },
    {
        clubId: 4002002, clubName: 'Cosenza Calcio', leagueId: 4002,
        color1: "",
        color2: ""
    },
    {
        clubId: 4002003, clubName: 'FC Südtirol', leagueId: 4002,
        color1: "",
        color2: ""
    },
    {
        clubId: 4002004, clubName: 'Pisa SC', leagueId: 4002,
        color1: "",
        color2: ""
    },
    // Ligue 1 (leagueId: 5001)
    {
        clubId: 5001001, clubName: 'Paris Saint‑Germain', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001002, clubName: 'Olympique de Marseille', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001003, clubName: 'AS Monaco', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001004, clubName: 'OGC Nice', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001005, clubName: 'LOSC Lille', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001006, clubName: 'Olympique Lyonnais', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001007, clubName: 'RC Strasbourg Alsace', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001008, clubName: 'Stade Rennais FC', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001009, clubName: 'FC Nantes', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001010, clubName: 'Angers SCO', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001011, clubName: 'FC Lorient', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001012, clubName: 'Paris FC', leagueId: 5001,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001013, clubName: 'FC Metz', leagueId: 5001,
        color1: "",
        color2: ""
    },
    // Ligue 2 (leagueId: 5002)
    {
        clubId: 5001014, clubName: 'SM Caen', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001015, clubName: 'Toulouse FC', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001016, clubName: 'Stade de Reims', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001017, clubName: 'Clermont Foot', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001018, clubName: 'Amiens SC', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001019, clubName: 'Valenciennes FC', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001020, clubName: 'Chamois Niortais FC', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001012, clubName: 'Paris FC', leagueId: 5002,
        color1: "",
        color2: ""
    }, // Ligue 2
    {
        clubId: 5001013, clubName: 'FC Metz', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001014, clubName: 'SM Caen', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001015, clubName: 'Toulouse FC', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001016, clubName: 'Stade de Reims', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001017, clubName: 'Clermont Foot', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001018, clubName: 'Amiens SC', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001019, clubName: 'Valenciennes FC', leagueId: 5002,
        color1: "",
        color2: ""
    },
    {
        clubId: 5001020, clubName: 'Chamois Niortais FC', leagueId: 5002,
        color1: "",
        color2: ""
    },
    // Primeira Liga (leagueId: 6001)
    {
        clubId: 6001001, clubName: 'FC Porto', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001002, clubName: 'SL Benfica', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001003, clubName: 'Sporting CP', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001004, clubName: 'SC Braga', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001005, clubName: 'Boavista FC', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001006, clubName: 'Vitória SC', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001007, clubName: 'Marítimo Funchal', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001008, clubName: 'CD Tondela', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001009, clubName: 'Belenenses SAD', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001010, clubName: 'Estoril Praia', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001011, clubName: 'Gil Vicente FC', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001012, clubName: 'Moreirense FC', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001013, clubName: 'CD Nacional', leagueId: 6001,
        color1: "",
        color2: ""
    },
    {
        clubId: 6001014, clubName: 'Portimonense SC', leagueId: 6001,
        color1: "",
        color2: ""
    },
    // Eredivisie (leagueId: 7001)
    {
        clubId: 7001001, clubName: 'AFC Ajax', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001002, clubName: 'PSV Eindhoven', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001003, clubName: 'Feyenoord Rotterdam', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001004, clubName: 'AZ Alkmaar', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001005, clubName: 'Vitesse Arnhem', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001006, clubName: 'FC Utrecht', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001007, clubName: 'SC Heerenveen', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001008, clubName: 'FC Groningen', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001009, clubName: 'Heracles Almelo', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001010, clubName: 'Willem II Tilburg', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001011, clubName: 'Sparta Rotterdam', leagueId: 7001,
        color1: "",
        color2: ""
    },
    {
        clubId: 7001012, clubName: 'ADO Den Haag', leagueId: 7001,
        color1: "",
        color2: ""
    },
    // Scottish Premiership (leagueId: 8001)
    {
        clubId: 8001001, clubName: 'Celtic FC', leagueId: 8001,
        color1: "",
        color2: ""
    },
    {
        clubId: 8001002, clubName: 'Rangers FC', leagueId: 8001,
        color1: "",
        color2: ""
    },
    {
        clubId: 8001003, clubName: 'Aberdeen FC', leagueId: 8001,
        color1: "",
        color2: ""
    },
    {
        clubId: 8001004, clubName: 'Heart of MclubIdlothian', leagueId: 8001,
        color1: "",
        color2: ""
    },
    {
        clubId: 8001005, clubName: 'Hibernian FC', leagueId: 8001,
        color1: "",
        color2: ""
    },
    {
        clubId: 8001006, clubName: 'Livingston FC', leagueId: 8001,
        color1: "",
        color2: ""
    },
    {
        clubId: 8001007, clubName: 'St Johnstone FC', leagueId: 8001,
        color1: "",
        color2: ""
    },
    {
        clubId: 8001008, clubName: 'Dundee United FC', leagueId: 8001,
        color1: "",
        color2: ""
    },
    {
        clubId: 8001009, clubName: 'Ross County FC', leagueId: 8001,
        color1: "",
        color2: ""
    },
    {
        clubId: 8001010, clubName: 'Kilmarnock FC', leagueId: 8001,
        color1: "",
        color2: ""
    },
    // Belgian Pro League (leagueId: 9001)
    {
        clubId: 9001001, clubName: 'Club Brugge KV', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001002, clubName: 'RSC Anderlecht', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001003, clubName: 'KRC Genk', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001004, clubName: 'Standard Liège', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001005, clubName: 'Royal Antwerp FC', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001006, clubName: 'KAS Eupen', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001007, clubName: 'Sint-TruclubIdense VV', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001008, clubName: 'KV Mechelen', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001009, clubName: 'Zulte Waregem', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001010, clubName: 'KV Kortrijk', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001011, clubName: 'Cercle Brugge KSV', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001012, clubName: 'K Beerschot VA', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001013, clubName: 'Oud-Heverlee Leuven', leagueId: 9001,
        color1: "",
        color2: ""
    },
    {
        clubId: 9001014, clubName: 'Waasland-Beveren', leagueId: 9001,
        color1: "",
        color2: ""
    },
    // Süper Lig (leagueId: 10001)
    {
        clubId: 10001001, clubName: 'Galatasaray SK', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001002, clubName: 'Fenerbahçe SK', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001003, clubName: 'Beşiktaş JK', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001004, clubName: 'Trabzonspor', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001005, clubName: 'İstanbul Başakşehir FK', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001006, clubName: 'Antalyaspor', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001007, clubName: 'Alanyaspor', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001008, clubName: 'Kasımpaşa SK', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001009, clubName: 'Gaziantep FK', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001010, clubName: 'Sivasspor', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001011, clubName: 'Çaykur Rizespor', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001012, clubName: 'Yeni Malatyaspor', leagueId: 10001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10001013, clubName: 'Göztepe SK', leagueId: 10001,
        color1: "",
        color2: ""
    }
];
