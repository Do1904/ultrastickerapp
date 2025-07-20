import { Club, Country, Football, League } from "../model/football";

export const FOOTBALL: Football[] = [
    {
        countryId: 1, countryName: 'England', leagues: [
            {
                leagueId: 101, leagueName: 'Premier League',
                clubs: [
                    { clubId: 10101, clubName: 'Arsenal' },
                    { clubId: 10102, clubName: 'Aston Villa' },
                    { clubId: 10103, clubName: 'Bournemouth' },
                    { clubId: 10104, clubName: 'Brentford' },
                    { clubId: 10105, clubName: 'Brighton & Hove Albion' },
                    { clubId: 10106, clubName: 'Burnley' },
                    { clubId: 10107, clubName: 'Chelsea' },
                    { clubId: 10108, clubName: 'Crystal Palace' },
                    { clubId: 10109, clubName: 'Everton' },
                    { clubId: 10110, clubName: 'Fulham' },
                    { clubId: 10111, clubName: 'Leeds United' },
                    { clubId: 10112, clubName: 'Liverpool' },
                    { clubId: 10113, clubName: 'Manchester City' },
                    { clubId: 10114, clubName: 'Manchester United' },
                    { clubId: 10115, clubName: 'Newcastle United' },
                    { clubId: 10116, clubName: 'Nottingham Forest' },
                    { clubId: 10117, clubName: 'Sunderland' },
                    { clubId: 10118, clubName: 'Tottenham Hotspur' },
                    { clubId: 10119, clubName: 'West Ham United' },
                    { clubId: 10120, clubName: 'Wolverhampton Wanderers' }
                ],
            },
            {
                leagueId: 102, leagueName: 'Championship', clubs: [],
            }
        ],
    },
    {
        countryId: 2, countryName: 'Germany', leagues: [
            {
                leagueId: 201, leagueName: 'Bundesliga',
                clubs: [
                    { clubId: 20101, clubName: 'Bayern München' },
                    { clubId: 20102, clubName: 'Bayer Leverkusen' },
                    { clubId: 20103, clubName: 'Borussia Dortmund' },
                    { clubId: 20104, clubName: 'Eintracht Frankfurt' },
                    { clubId: 20105, clubName: 'SC Freiburg' },
                    { clubId: 20106, clubName: 'Mainz 05' },
                    { clubId: 20107, clubName: 'Werder Bremen' },
                    { clubId: 20108, clubName: 'VfB Stuttgart' },
                    { clubId: 20109, clubName: 'VfL Wolfsburg' },
                    { clubId: 20110, clubName: 'Union Berlin' },
                    { clubId: 20111, clubName: 'Borussia Mönchengladbach' },
                    { clubId: 20112, clubName: 'FC Augsburg' },
                    { clubId: 20113, clubName: 'St.Pauli' },
                    { clubId: 20114, clubName: 'Hamburger SV' },
                    { clubId: 20115, clubName: 'Heidenheim' },
                    { clubId: 20116, clubName: 'Hoffenheim' },
                    { clubId: 20117, clubName: 'RB Leipzig' },
                    { clubId: 20118, clubName: '1.FC Köln' }
                ]
            },
            {
                leagueId: 202, leagueName: '2. Bundesliga',
                clubs: [
                    { clubId: 20201, clubName: '1.FC Nürnberg' },
                    { clubId: 20202, clubName: 'Fortuna Düsseldorf' },
                    { clubId: 20203, clubName: 'Hannover 96' },
                    { clubId: 20204, clubName: 'Schalke 04' },
                    { clubId: 20205, clubName: 'Karlsruher SC' },
                    { clubId: 20206, clubName: 'VFL Bochum' },
                    { clubId: 20207, clubName: '1.FC Kaiserslautern' },
                    { clubId: 20208, clubName: 'Eintracht Braunschweig' },
                    { clubId: 20209, clubName: 'Dynamo Dresden' },
                    { clubId: 20210, clubName: 'Elversberg' },
                    { clubId: 20211, clubName: 'Hertha Berlin' },
                    { clubId: 20212, clubName: 'Arminia Bielefeld' },
                    { clubId: 20213, clubName: 'FC Magdeburg' },
                    { clubId: 20214, clubName: 'Preußen Münster' },
                    { clubId: 20215, clubName: 'SV Darmstadt 98' },
                    { clubId: 20216, clubName: 'SSV Ulm' },
                    { clubId: 20217, clubName: 'Greuter Fürth' },
                    { clubId: 20218, clubName: 'Holstein Kiel' }
                ]
            },
            {
                leagueId: 203, leagueName: '3. Liga',
                clubs: [
                    { clubId: 20301, clubName: 'Jahn Regensburg' },
                    { clubId: 20302, clubName: 'Alemannia Aachen' },
                    { clubId: 20303, clubName: 'VFB StuttgartⅡ' },
                    { clubId: 20304, clubName: 'Energie Cottbus' },
                    { clubId: 20305, clubName: 'Rot-Weiss Essen' },
                    { clubId: 20306, clubName: 'FC Ingolstadt' },
                    { clubId: 20307, clubName: 'Viktoria Köln' },
                    { clubId: 20308, clubName: '1. FC Saarbrücken' },
                    { clubId: 20309, clubName: 'Wehen Wiesbaden' },
                    { clubId: 20310, clubName: 'VfL Osnabrück' },
                    { clubId: 20311, clubName: '1860 München' },
                    { clubId: 20312, clubName: 'Schweinfurt 05' },
                    { clubId: 20313, clubName: 'Waldhof Mannheim' },
                    { clubId: 20314, clubName: 'TSV Havelse' },
                    { clubId: 20315, clubName: 'Unterhaching' },
                    { clubId: 20316, clubName: 'SSV Ulm' },
                    { clubId: 20317, clubName: 'Hansa Rostock' },
                    { clubId: 20318, clubName: 'Erzgebirge Aue' },
                    { clubId: 20319, clubName: 'MSV Duisburg' },
                    { clubId: 20320, clubName: 'TSG HoffenheimⅡ' }
                ]
            }
        ]
    }
    // { id: 3, name: 'Spain' },
    // { id: 4, name: 'Italy' },
    // { id: 5, name: 'France' },
    // { id: 6, name: 'Portugal' },
    // { id: 7, name: 'Netherlands' },
    // { id: 8, name: 'Scotland' },
    // { id: 9, name: 'Belgium' },
    // { id: 10, name: 'Turkey' }
];

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
    { leagueId: 101, leagueName: 'Premier League', countryId: 1 },
    { leagueId: 102, leagueName: 'Championship', countryId: 1 },
    { leagueId: 201, leagueName: 'Bundesliga', countryId: 2 },
    { leagueId: 202, leagueName: '2. Bundesliga', countryId: 2 },
    { leagueId: 203, leagueName: '3. Liga', countryId: 2 },
    { leagueId: 204, leagueName: 'Regionalliga West', countryId: 2 },
    { leagueId: 301, leagueName: 'La Liga', countryId: 3 },
    { leagueId: 302, leagueName: 'Segunda División', countryId: 3 },
    { leagueId: 401, leagueName: 'Serie A', countryId: 4 },
    { leagueId: 402, leagueName: 'Serie B', countryId: 4 },
    { leagueId: 501, leagueName: 'Ligue 1', countryId: 5 },
    { leagueId: 502, leagueName: 'Ligue 2', countryId: 5 },
    { leagueId: 601, leagueName: 'Primeira Liga', countryId: 6 },
    { leagueId: 701, leagueName: 'Eredivisie', countryId: 7 },
    { leagueId: 801, leagueName: 'Scottish Premiership', countryId: 8 },
    { leagueId: 901, leagueName: 'Belgian Pro League', countryId: 9 },
    { leagueId: 1001, leagueName: 'Süper Lig', countryId: 10 },
    { leagueId: 9999, leagueName: 'test', countryId: 99 } // test
];

export const CLUBS: Club[] = [
    {
        clubId: 999901, clubName: 'testClub', leagueId: 9999,
        color1: "#999999",
        color2: "#cccccc"
    },
    {
        clubId: 10101, clubName: 'Arsenal', leagueId: 101,
        color1: "#EF0107", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 10102, clubName: 'Aston Villa', leagueId: 101,
        color1: "#95BFE5", // 水色
        color2: "#670E36"  // バーガンディ
    },
    {
        clubId: 10103, clubName: 'Bournemouth', leagueId: 101,
        color1: "#DA291C", // 赤
        color2: "#000000"  // 黒
    },
    {
        clubId: 10104, clubName: 'Brentford', leagueId: 101,
        color1: "#D00027", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 10105, clubName: 'Brighton & Hove Albion', leagueId: 101,
        color1: "#0057B8", // 青
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 10106, clubName: 'Burnley', leagueId: 101,
        color1: "#6C1D45", // ワインレッド
        color2: "#99D6EA"  // 水色
    },
    {
        clubId: 10107, clubName: 'Chelsea', leagueId: 101,
        color1: "#034694", // 青
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 10108, clubName: 'Crystal Palace', leagueId: 101,
        color1: "#1B458F", // 青
        color2: "#C8102E"  // 赤
    },
    {
        clubId: 10109, clubName: 'Everton', leagueId: 101,
        color1: "#003399", // 青
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 10110, clubName: 'Fulham', leagueId: 101,
        color1: "#FFFFFF", // 白
        color2: "#000000"  // 黒
    },
    {
        clubId: 10111, clubName: 'Leeds United', leagueId: 101,
        color1: "#FFCD00", // 黄色
        color2: "#1D428A"  // 青
    },
    {
        clubId: 10112, clubName: 'Liverpool', leagueId: 101,
        color1: "#C8102E", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 10113, clubName: 'Manchester City', leagueId: 101,
        color1: "#6CABDD", // 水色
        color2: "#1C2C5B"  // ネイビー
    },
    {
        clubId: 10114, clubName: 'Manchester United', leagueId: 101,
        color1: "#DA291C", // 赤
        color2: "#241F20"  // 黒
    },
    {
        clubId: 10115, clubName: 'Newcastle United', leagueId: 101,
        color1: "#241F20", // 黒
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 10116, clubName: 'Nottingham Forest', leagueId: 101,
        color1: "#DD1E2F", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 10117, clubName: 'Sunderland', leagueId: 101,
        color1: "#E2231A", // 赤
        color2: "#000000"  // 黒
    },
    {
        clubId: 10118, clubName: 'Tottenham Hotspur', leagueId: 101,
        color1: "#132257", // ネイビー
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 10119, clubName: 'West Ham United', leagueId: 101,
        color1: "#7A263A", // バーガンディ
        color2: "#1BB1E7"  // 水色
    },
    {
        clubId: 10120, clubName: 'Wolverhampton Wanderers', leagueId: 101,
        color1: "#FDB913", // 黄金色
        color2: "#231F20"  // 黒
    },
    // Bundesliga (leagueId: 201)
    {
        clubId: 20101, clubName: 'Bayern München', leagueId: 201,
        color1: "#DC052D", // 赤
        color2: "#0066B2"  // 青
    },
    {
        clubId: 20102, clubName: 'Bayer Leverkusen', leagueId: 201,
        color1: "#E32219", // 赤
        color2: "#000000"  // 黒
    },
    {
        clubId: 20103, clubName: 'Borussia Dortmund', leagueId: 201,
        color1: "#FDE100", // 黄
        color2: "#000000"  // 黒
    },
    {
        clubId: 20104, clubName: 'Eintracht Frankfurt', leagueId: 201,
        color1: "#E1000F", // 赤
        color2: "#000000"  // 黒
    },
    {
        clubId: 20105, clubName: 'SC Freiburg', leagueId: 201,
        color1: "#ED1C24", // 赤
        color2: "#000000"  // 黒
    },
    {
        clubId: 20106, clubName: 'Mainz 05', leagueId: 201,
        color1: "#C20017", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 20107, clubName: 'Werder Bremen', leagueId: 201,
        color1: "#1E944B", // 緑
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 20108, clubName: 'VfB Stuttgart', leagueId: 201,
        color1: "#FFFFFF", // 白
        color2: "#E30613"  // 赤
    },
    {
        clubId: 20109, clubName: 'VfL Wolfsburg', leagueId: 201,
        color1: "#65B32E", // 緑
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 20110, clubName: 'Union Berlin', leagueId: 201,
        color1: "#DD0000", // 赤
        color2: "#FFD700"  // 黄
    },
    {
        clubId: 20111, clubName: 'Borussia Mönchengladbach', leagueId: 201,
        color1: "#FFFFFF", // 白
        color2: "#000000"  // 黒
    },
    {
        clubId: 20112, clubName: 'FC Augsburg', leagueId: 201,
        color1: "#C20C0C", // 赤
        color2: "#1B5E20"  // 緑
    },
    {
        clubId: 20113, clubName: 'St.Pauli', leagueId: 201,
        color1: "#3C1E1E", // 茶色
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 20114, clubName: 'Hamburger SV', leagueId: 201,
        color1: "#0066B2", // 青
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 20115, clubName: 'HeclubIdenheim', leagueId: 201,
        color1: "#005BAC", // 青
        color2: "#E30613"  // 赤
    },
    {
        clubId: 20116, clubName: 'Hoffenheim', leagueId: 201,
        color1: "#0066B3", // 青
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 20117, clubName: 'RB Leipzig', leagueId: 201,
        color1: "#E30613", // 赤
        color2: "#FFFFFF"  // 白
    },
    {
        clubId: 20118, clubName: '1.FC Köln', leagueId: 201,
        color1: "#F00000", // 赤
        color2: "#FFFFFF"  // 白
    },
    // 2. Bundesliga (leagueId: 202)
    {
        clubId: 20201, clubName: '1.FC Nürnberg', leagueId: 202,
        color1: "#A0000D", // 赤
        color2: "#FFFFFF"
    },
    {
        clubId: 20202, clubName: 'Fortuna Düsseldorf', leagueId: 202,
        color1: "#D10000", // 赤
        color2: "#FFFFFF"
    },
    {
        clubId: 20203, clubName: 'Hannover 96', leagueId: 202,
        color1: "#007F36", // 緑
        color2: "#000000"
    },
    {
        clubId: 20204, clubName: 'Schalke 04', leagueId: 202,
        color1: "#004D9D", // 青
        color2: "#FFFFFF"
    },
    {
        clubId: 20205, clubName: 'Karlsruher SC', leagueId: 202,
        color1: "#005BAC", // 青
        color2: "#FFFFFF"
    },
    {
        clubId: 20206, clubName: 'VFL Bochum', leagueId: 202,
        color1: "#1D428A", // 青
        color2: "#FFFFFF"
    },
    {
        clubId: 20207, clubName: '1.FC Kaiserslautern', leagueId: 202,
        color1: "#A0001C", // 赤
        color2: "#FFFFFF"
    },
    {
        clubId: 20208, clubName: 'Eintracht Braunschweig', leagueId: 202,
        color1: "#FFD700", // 黄
        color2: "#1D428A"
    },
    {
        clubId: 20209, clubName: 'Dynamo Dresden', leagueId: 202,
        color1: "#FDB813", // 金色
        color2: "#000000"
    },
    {
        clubId: 20210, clubName: 'Elversberg', leagueId: 202,
        color1: "#FFFFFF",
        color2: "#000000"
    },
    {
        clubId: 20211, clubName: 'Hertha Berlin', leagueId: 202,
        color1: "#004B87", // 青
        color2: "#FFFFFF"
    },
    {
        clubId: 20212, clubName: 'Arminia Bielefeld', leagueId: 202,
        color1: "#0066B3",
        color2: "#FFFFFF"
    },
    {
        clubId: 20213, clubName: 'FC Magdeburg', leagueId: 202,
        color1: "#005BAC",
        color2: "#FFFFFF"
    },
    {
        clubId: 20214, clubName: 'Preußen Münster', leagueId: 202,
        color1: "#007F36",
        color2: "#000000"
    },
    {
        clubId: 20215, clubName: 'SV Darmstadt 98', leagueId: 202,
        color1: "#0033A0",
        color2: "#FFFFFF"
    },
    {
        clubId: 20216, clubName: 'SSV Ulm', leagueId: 202,
        color1: "#000000",
        color2: "#FFFFFF"
    },
    {
        clubId: 20217, clubName: 'Greuter Fürth', leagueId: 202,
        color1: "#007A33",
        color2: "#FFFFFF"
    },
    {
        clubId: 20218, clubName: 'Holstein Kiel', leagueId: 202,
        color1: "#005BAC",
        color2: "#E30613"
    },
    // 3. Liga (leagueId: 203)
    {
        clubId: 20301, clubName: 'Jahn Regensburg', leagueId: 203,
        color1: "#d1001c", color2: "#ffffff"
    },
    {
        clubId: 20302, clubName: 'Alemannia Aachen', leagueId: 203,
        color1: "#ffd500", color2: "#000000"
    },
    {
        clubId: 20303, clubName: 'VFB StuttgartⅡ', leagueId: 203,
        color1: "#ffffff", color2: "#e60000"
    },
    {
        clubId: 20304, clubName: 'Energie Cottbus', leagueId: 203,
        color1: "#d50032", color2: "#ffffff"
    },
    {
        clubId: 20305, clubName: 'Rot-Weiss Essen', leagueId: 203,
        color1: "#ed1c24", color2: "#ffffff"
    },
    {
        clubId: 20306, clubName: 'FC Ingolstadt', leagueId: 203,
        color1: "#c8001e", color2: "#000000"
    },
    {
        clubId: 20307, clubName: 'Viktoria Köln', leagueId: 203,
        color1: "#000000", color2: "#e00034"
    },
    {
        clubId: 20308, clubName: '1. FC Saarbrücken', leagueId: 203,
        color1: "#0000ff", color2: "#ffff00"
    },
    {
        clubId: 20309, clubName: 'Wehen Wiesbaden', leagueId: 203,
        color1: "#c20f2f", color2: "#000000"
    },
    {
        clubId: 20310, clubName: 'VfL Osnabrück', leagueId: 203,
        color1: "#5a2a82", color2: "#ffffff"
    },
    {
        clubId: 20311, clubName: '1860 München', leagueId: 203,
        color1: "#5eb6e4", color2: "#ffffff"
    },
    {
        clubId: 20312, clubName: 'Schweinfurt 05', leagueId: 203,
        color1: "#00703c", color2: "#ffffff"
    },
    {
        clubId: 20313, clubName: 'Waldhof Mannheim', leagueId: 203,
        color1: "#005bac", color2: "#ffffff"
    },
    {
        clubId: 20314, clubName: 'TSV Havelse', leagueId: 203,
        color1: "#ff0000", color2: "#ffffff"
    },
    {
        clubId: 20315, clubName: 'Unterhaching', leagueId: 203,
        color1: "#d6001c", color2: "#0033a0"
    },
    {
        clubId: 20316, clubName: 'SSV Ulm', leagueId: 203,
        color1: "#000000", color2: "#ffffff"
    },
    {
        clubId: 20317, clubName: 'Hansa Rostock', leagueId: 203,
        color1: "#006cb7", color2: "#e3000f"
    },
    {
        clubId: 20318, clubName: 'Erzgebirge Aue', leagueId: 203,
        color1: "#5a2a82", color2: "#ffcc00"
    },
    {
        clubId: 20319, clubName: 'MSV Duisburg', leagueId: 203,
        color1: "#005bac", color2: "#ffffff"
    },
    {
        clubId: 20320, clubName: 'TSG HoffenheimⅡ', leagueId: 203,
        color1: "#0066b3", color2: "#ffffff"
    },
    // La Liga (leagueId: 301)
    {
        clubId: 30101, clubName: 'FC Barcelona', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30102, clubName: 'Real MadrclubId CF', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30103, clubName: 'Atlético de MadrclubId', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30104, clubName: 'Sevilla FC', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30105, clubName: 'Real Betis Balompié', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30106, clubName: 'RC Celta de Vigo', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30107, clubName: 'RCD Mallorca', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30108, clubName: 'Valencia CF', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30109, clubName: 'Villarreal CF', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30110, clubName: 'Rayo Vallecano', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30111, clubName: 'Granada CF', leagueId: 301,
        color1: "",
        color2: ""
    }, // 降格残留
    {
        clubId: 30112, clubName: 'UD Almería', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30113, clubName: 'Getafe CF', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30114, clubName: 'Athletic Club', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30115, clubName: 'Real Sociedad', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30116, clubName: 'CA Osasuna', leagueId: 301,
        color1: "",
        color2: ""
    },
    {
        clubId: 30117, clubName: 'RC Deportivo La Coruña', leagueId: 301,
        color1: "",
        color2: ""
    }, // 2部
    // La Liga 2 (leagueId: 302)
    {
        clubId: 30201, clubName: 'UD Las Palmas', leagueId: 302,
        color1: "",
        color2: ""
    },
    {
        clubId: 30202, clubName: 'CD Leganés', leagueId: 302,
        color1: "",
        color2: ""
    },
    {
        clubId: 30203, clubName: 'Real ValladolclubId', leagueId: 302,
        color1: "",
        color2: ""
    },
    {
        clubId: 30204, clubName: 'Real Oviedo', leagueId: 302,
        color1: "",
        color2: ""
    },
    {
        clubId: 30205, clubName: 'Cultural y Deportiva Leonesa', leagueId: 302,
        color1: "",
        color2: ""
    },
    {
        clubId: 30206, clubName: 'FC Andorra', leagueId: 302,
        color1: "",
        color2: ""
    },
    {
        clubId: 30207, clubName: 'AD Ceuta FC', leagueId: 302,
        color1: "",
        color2: ""
    },
    // Serie A (leagueId: 401)
    {
        clubId: 40101, clubName: 'AC Milan', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40102, clubName: 'AS Roma', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40103, clubName: 'Atalanta BC', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40104, clubName: 'Bologna FC 1909', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40105, clubName: 'Cagliari Calcio', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40106, clubName: 'Como 1907', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40107, clubName: 'Cremonese', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40108, clubName: 'Empoli FC', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40109, clubName: 'Fiorentina', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40110, clubName: 'Genoa CFC', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40111, clubName: 'Hellas Verona FC', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40112, clubName: 'Inter Milan', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40113, clubName: 'Juventus FC', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40114, clubName: 'Lazio Roma', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40115, clubName: 'Napoli', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40116, clubName: 'Parma Calcio 1913', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40117, clubName: 'Sassuolo', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40118, clubName: 'SSC Venezia', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40119, clubName: 'Udinese Calcio', leagueId: 401,
        color1: "",
        color2: ""
    },
    {
        clubId: 40120, clubName: 'US Lecce', leagueId: 401,
        color1: "",
        color2: ""
    },
    // Serie B (leagueId: 402) 例示で省略
    {
        clubId: 40201, clubName: 'Brescia Calcio', leagueId: 402,
        color1: "",
        color2: ""
    },
    {
        clubId: 40202, clubName: 'Cosenza Calcio', leagueId: 402,
        color1: "",
        color2: ""
    },
    {
        clubId: 40203, clubName: 'FC Südtirol', leagueId: 402,
        color1: "",
        color2: ""
    },
    {
        clubId: 40204, clubName: 'Pisa SC', leagueId: 402,
        color1: "",
        color2: ""
    },
    // Ligue 1 (leagueId: 501)
    {
        clubId: 50101, clubName: 'Paris Saint‑Germain', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50102, clubName: 'Olympique de Marseille', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50103, clubName: 'AS Monaco', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50104, clubName: 'OGC Nice', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50105, clubName: 'LOSC Lille', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50106, clubName: 'Olympique Lyonnais', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50107, clubName: 'RC Strasbourg Alsace', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50108, clubName: 'Stade Rennais FC', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50109, clubName: 'FC Nantes', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50110, clubName: 'Angers SCO', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50111, clubName: 'FC Lorient', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50112, clubName: 'Paris FC', leagueId: 501,
        color1: "",
        color2: ""
    },
    {
        clubId: 50113, clubName: 'FC Metz', leagueId: 501,
        color1: "",
        color2: ""
    },
    // Ligue 2 (leagueId: 502)
    {
        clubId: 50114, clubName: 'SM Caen', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50115, clubName: 'Toulouse FC', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50116, clubName: 'Stade de Reims', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50117, clubName: 'Clermont Foot', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50118, clubName: 'Amiens SC', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50119, clubName: 'Valenciennes FC', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50120, clubName: 'Chamois Niortais FC', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50112, clubName: 'Paris FC', leagueId: 502,
        color1: "",
        color2: ""
    }, // Ligue 2
    {
        clubId: 50113, clubName: 'FC Metz', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50114, clubName: 'SM Caen', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50115, clubName: 'Toulouse FC', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50116, clubName: 'Stade de Reims', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50117, clubName: 'Clermont Foot', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50118, clubName: 'Amiens SC', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50119, clubName: 'Valenciennes FC', leagueId: 502,
        color1: "",
        color2: ""
    },
    {
        clubId: 50120, clubName: 'Chamois Niortais FC', leagueId: 502,
        color1: "",
        color2: ""
    },
    // Primeira Liga (leagueId: 601)
    {
        clubId: 6001, clubName: 'FC Porto', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6002, clubName: 'SL Benfica', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6003, clubName: 'Sporting CP', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6004, clubName: 'SC Braga', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6005, clubName: 'Boavista FC', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6006, clubName: 'Vitória SC', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6007, clubName: 'Marítimo Funchal', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6008, clubName: 'CD Tondela', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6009, clubName: 'Belenenses SAD', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6010, clubName: 'Estoril Praia', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6011, clubName: 'Gil Vicente FC', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6012, clubName: 'Moreirense FC', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6013, clubName: 'CD Nacional', leagueId: 601,
        color1: "",
        color2: ""
    },
    {
        clubId: 6014, clubName: 'Portimonense SC', leagueId: 601,
        color1: "",
        color2: ""
    },
    // Eredivisie (leagueId: 701)
    {
        clubId: 7001, clubName: 'AFC Ajax', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7002, clubName: 'PSV Eindhoven', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7003, clubName: 'Feyenoord Rotterdam', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7004, clubName: 'AZ Alkmaar', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7005, clubName: 'Vitesse Arnhem', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7006, clubName: 'FC Utrecht', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7007, clubName: 'SC Heerenveen', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7008, clubName: 'FC Groningen', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7009, clubName: 'Heracles Almelo', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7010, clubName: 'Willem II Tilburg', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7011, clubName: 'Sparta Rotterdam', leagueId: 701,
        color1: "",
        color2: ""
    },
    {
        clubId: 7012, clubName: 'ADO Den Haag', leagueId: 701,
        color1: "",
        color2: ""
    },
    // Scottish Premiership (leagueId: 801)
    {
        clubId: 8001, clubName: 'Celtic FC', leagueId: 801,
        color1: "",
        color2: ""
    },
    {
        clubId: 8002, clubName: 'Rangers FC', leagueId: 801,
        color1: "",
        color2: ""
    },
    {
        clubId: 8003, clubName: 'Aberdeen FC', leagueId: 801,
        color1: "",
        color2: ""
    },
    {
        clubId: 8004, clubName: 'Heart of MclubIdlothian', leagueId: 801,
        color1: "",
        color2: ""
    },
    {
        clubId: 8005, clubName: 'Hibernian FC', leagueId: 801,
        color1: "",
        color2: ""
    },
    {
        clubId: 8006, clubName: 'Livingston FC', leagueId: 801,
        color1: "",
        color2: ""
    },
    {
        clubId: 8007, clubName: 'St Johnstone FC', leagueId: 801,
        color1: "",
        color2: ""
    },
    {
        clubId: 8008, clubName: 'Dundee United FC', leagueId: 801,
        color1: "",
        color2: ""
    },
    {
        clubId: 8009, clubName: 'Ross County FC', leagueId: 801,
        color1: "",
        color2: ""
    },
    {
        clubId: 8010, clubName: 'Kilmarnock FC', leagueId: 801,
        color1: "",
        color2: ""
    },
    // Belgian Pro League (leagueId: 901)
    {
        clubId: 9001, clubName: 'Club Brugge KV', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9002, clubName: 'RSC Anderlecht', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9003, clubName: 'KRC Genk', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9004, clubName: 'Standard Liège', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9005, clubName: 'Royal Antwerp FC', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9006, clubName: 'KAS Eupen', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9007, clubName: 'Sint-TruclubIdense VV', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9008, clubName: 'KV Mechelen', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9009, clubName: 'Zulte Waregem', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9010, clubName: 'KV Kortrijk', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9011, clubName: 'Cercle Brugge KSV', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9012, clubName: 'K Beerschot VA', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9013, clubName: 'Oud-Heverlee Leuven', leagueId: 901,
        color1: "",
        color2: ""
    },
    {
        clubId: 9014, clubName: 'Waasland-Beveren', leagueId: 901,
        color1: "",
        color2: ""
    },
    // Süper Lig (leagueId: 1001)
    {
        clubId: 10001, clubName: 'Galatasaray SK', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10002, clubName: 'Fenerbahçe SK', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10003, clubName: 'Beşiktaş JK', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10004, clubName: 'Trabzonspor', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10005, clubName: 'İstanbul Başakşehir FK', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10006, clubName: 'Antalyaspor', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10007, clubName: 'Alanyaspor', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10008, clubName: 'Kasımpaşa SK', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10009, clubName: 'Gaziantep FK', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10010, clubName: 'Sivasspor', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10011, clubName: 'Çaykur Rizespor', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10012, clubName: 'Yeni Malatyaspor', leagueId: 1001,
        color1: "",
        color2: ""
    },
    {
        clubId: 10013, clubName: 'Göztepe SK', leagueId: 1001,
        color1: "",
        color2: ""
    }
];
