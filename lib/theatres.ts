import { Theatre } from "@/types";

const theatres: Theatre[] = [
  {
    name: "Arcade Comedy Theater",
    city: "Pittsburgh",
    state: "PA",
    zipcode: "15222",
    website: "https://www.arcadecomedytheater.com",
    logo: "https://www.arcadecomedytheater.com/wp-content/uploads/2014/05/ArcadeFinalLogo.png"
  },
  {
    name: "Steel City Improv Theater",
    city: "Pittsburgh",
    state: "PA",
    zipcode: "15203",
    website: "https://www.steelcityimprov.com",
    logo: "https://i0.wp.com/steelcityimprov.com/wp-content/uploads/2025/07/SCIT-Logo-2025_512.jpg?w=512&ssl=1"
  },
  {
    name: "The Second City",
    city: "Chicago",
    state: "IL",
    zipcode: "60614",
    website: "https://www.secondcity.com",
    logo: "data:image/png;base64,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"  },
  {
    name: "iO Theater",
    city: "Chicago",
    state: "IL",
    zipcode: "60614",
    website: "https://ioimprov.com",
    logo: "https://ioimprov.com/wp-content/uploads/2023/12/iO-Horizontal-Lockup_dark.svg"  },
  {
    name: "The Annoyance Theatre",
    city: "Chicago",
    state: "IL",
    zipcode: "60614",
    website: "https://www.theannoyance.com",
    logo: "https://static.wixstatic.com/media/895f45_920fe9fd56804aeb99fd40fe95999157~mv2_d_2279_1396_s_2.png/v1/fill/w_154,h_94,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/895f45_920fe9fd56804aeb99fd40fe95999157~mv2_d_2279_1396_s_2.png"
  },
  {
    name: "The Groundlings",
    city: "Los Angeles",
    state: "CA",
    zipcode: "90046",
    website: "https://www.groundlings.com",
    logo: "https://groundlings.com/img/containers/main/cropuntitled-%282000-x-2000-px%29.png/0078b3a9815080870c9bb13edffa04c6/cropuntitled-%282000-x-2000-px%29.png"
  },
  {
    name: "Upright Citizens Brigade (UCB) Theatre",
    city: "Los Angeles",
    state: "CA",
    zipcode: "90028",
    website: "https://ucbcomedy.com",
    logo: "https://ucbcomedy.com/wp-content/uploads/2025/10/UCB_COMEDY_LOGO_MAINFLAT.jpg"
  },
  {
    name: "The PIT",
    city: "New York",
    state: "NY",
    zipcode: "10018",
    website: "https://thepit-nyc.com",
    logo: "https://media.thepit-nyc.com/app/uploads/20241031161322/PIT-logo-est2002-WhiteLogo_RedStars.png"
  },
  {
    name: "Magnet Theater",
    city: "New York",
    state: "NY",
    zipcode: "10018",
    website: "https://magnettheater.com",
    logo: "https://magnettheater.com/wp-content/themes/magnettheater/imgs/logo-primary.png"
  },
  {
    name: "Upright Citizens Brigade (UCB) Theatre",
    city: "New York",
    state: "NY",
    zipcode: "10003",
    website: "https://ucbcomedy.com",
    logo: "https://ucbcomedy.com/wp-content/uploads/2025/10/UCB_COMEDY_LOGO_MAINFLAT.jpg"
  },
  {
    name: "Chicago City Limits",
    city: "New York",
    state: "NY",
    zipcode: "10021",
    website: "https://www.chicagocitylimits.com",
    logo: "https://www.chicagocitylimits.com/"
  },
  {
    name: "BATS Improv",
    city: "San Francisco",
    state: "CA",
    zipcode: "94123",
    website: "https://www.improv.org",
    logo: "https://www.improv.org/wp-content/uploads/2024/10/logo.svg"
  },
  {
    name: "Endgames Improv",
    city: "San Francisco",
    state: "CA",
    zipcode: "94110",
    website: "https://www.endgamesimprov.com",
    logo: "https://endgamesimprov.com/wp-content/uploads/2021/05/logo.png"
  },
  {
    name: "Leela Improv Theatre",
    city: "San Francisco",
    state: "CA",
    zipcode: "94103",
    website: "https://www.leela-sf.com",
    logo: "https://www.leela-sf.com/wp-content/uploads/2021/05/leela-logo.png"
  },
  {
    name: "Westside Comedy Theater",
    city: "Santa Monica",
    state: "CA",
    zipcode: "90404",
    website: "https://www.westsidecomedy.com",
    logo: "https://www.westsidecomedy.com/wp-content/uploads/2019/03/westside-logo.png"
  },
  {
    name: "Finest City Improv",
    city: "San Diego",
    state: "CA",
    zipcode: "92109",
    website: "https://www.finestcityimprov.com",
    logo: "https://www.finestcityimprov.com/wp-content/uploads/2024/09/241762951_4563029353763448_859376555201247906_n.jpg"
  },
  {
    name: "Sacramento Comedy Spot",
    city: "Sacramento",
    state: "CA",
    zipcode: "95814",
    website: "https://www.saccomedyspot.com",
    logo: "https://www.saccomedyspot.com/wp-content/uploads/2018/05/comedy-spot-logo.png"
  },
  {
    name: "Dad’s Garage Theatre Company",
    city: "Atlanta",
    state: "GA",
    zipcode: "30318",
    website: "https://www.dadsgarage.com",
    logo: "https://www.dadsgarage.com/wp-content/uploads/2020/08/dads-garage-logo.png"
  },
  {
    name: "Curious Comedy Theater",
    city: "Portland",
    state: "OR",
    zipcode: "97227",
    website: "https://curiouscomedy.org",
    logo: "https://curiouscomedy.org/wp-content/uploads/2019/02/curious-comedy-logo.png"
  },
  {
    name: "The Pack Theater",
    city: "Los Angeles",
    state: "CA",
    zipcode: "90027",
    website: "https://www.packtheater.com",
    logo: "https://www.packtheater.com/wp-content/uploads/2020/01/pack-logo.png"
  },
  {
    name: "The Clubhouse",
    city: "Los Angeles",
    state: "CA",
    zipcode: "90027",
    website: "https://www.clubhousecomedy.com",
    logo: "https://www.clubhousecomedy.com/wp-content/uploads/2019/06/clubhouse-logo.png"
  },
  {
    name: "Impro Theatre",
    city: "Los Angeles",
    state: "CA",
    zipcode: "90025",
    website: "https://www.improtheatre.com",
    logo: "https://www.improtheatre.com/wp-content/uploads/2018/04/impro-theatre-logo.png"
  },
  {
    name: "Sea Tea Improv",
    city: "Hartford",
    state: "CT",
    zipcode: "06103",
    website: "https://seateaimprov.com",
    logo: "https://seateaimprov.com/wp-content/uploads/2b8adc3e-19d5-46fe-bf8b-89a8e643b3cd.jpg"
  },
  {
    name: "Bovine Metropolis Theater",
    city: "Denver",
    state: "CO",
    zipcode: "80202",
    website: "https://www.bovinemetropolis.com",
    logo: "https://www.bovinemetropolis.com/wp-content/uploads/2018/06/bovine-logo.png"
  },
  {
    name: "Rise Comedy",
    city: "Denver",
    state: "CO",
    zipcode: "80205",
    website: "https://risecomedy.com",
    logo: "https://risecomedy.com/wp-content/uploads/2019/03/outside-voodoo_courtesy-voodoo-comedy-playhouse.jpg"
  },
  {
    name: "What If Theatre",
    city: "Lakewood",
    state: "CO",
    zipcode: "80215",
    website: "https://www.whatiftheatre.com",
    logo: "https://www.whatiftheatre.com/wp-content/uploads/2021/05/what-if-theatre-logo.png"
  },
  {
    name: "The Push Comedy Theater",
    city: "Norfolk",
    state: "VA",
    zipcode: "23510",
    website: "https://pushcomedytheater.com",
    logo: "https://pushcomedytheater.com/wp-content/uploads/2021/05/Push-Mural.jpg"
  },
  {
    name: "The Coalition Theater",
    city: "Richmond",
    state: "VA",
    zipcode: "23220",
    website: "https://rvacomedy.com",
    logo: "https://rvacomedy.com/wp-content/uploads/2019/02/ct_classes_boosted_new_2019.png"
  },
  {
    name: "The Nest Theatre",
    city: "Columbus",
    state: "OH",
    zipcode: "43215",
    website: "https://nesttheatre.com",
    logo: "https://nesttheatre.com/wp-content/uploads/2019/07/nest-logo.png"
  },
  {
    name: "HUGE Improv Theater",
    city: "Minneapolis",
    state: "MN",
    zipcode: "55404",
    website: "https://www.hugetheater.com",
    logo: "https://www.hugetheater.com/wp-content/uploads/2019/05/huge-logo.png"
  },
  {
    name: "Strike Theater",
    city: "Minneapolis",
    state: "MN",
    zipcode: "55413",
    website: "https://www.strike.theater",
    logo: "https://www.strike.theater/wp-content/uploads/2018/06/strike-logo.png"
  },
  {
    name: "Brave New Workshop",
    city: "Minneapolis",
    state: "MN",
    zipcode: "55403",
    website: "https://www.bravenewworkshop.com",
    logo: "https://www.bravenewworkshop.com/wp-content/uploads/2019/04/bnw-logo.png"
  },
  {
    name: "The Improv Shop",
    city: "St. Louis",
    state: "MO",
    zipcode: "63103",
    website: "https://www.theimprovshop.com",
    logo: "https://www.theimprovshop.com/wp-content/uploads/2020/02/improv-shop-logo.png"
  },
  {
    name: "Go Comedy! Improv Theater",
    city: "Ferndale",
    state: "MI",
    zipcode: "48220",
    website: "https://gocomedy.net",
    logo: "https://gocomedy.net/wp-content/uploads/2019/03/go-comedy-logo.png"
  },
  {
    name: "Planet Ant Theatre",
    city: "Hamtramck",
    state: "MI",
    zipcode: "48212",
    website: "https://www.planetant.com",
    logo: "https://www.planetant.com/wp-content/uploads/2018/05/planet-ant-logo.png"
  },
  {
    name: "The Backline Comedy Theatre",
    city: "Omaha",
    state: "NE",
    zipcode: "68102",
    website: "https://www.backlinecomedy.com",
    logo: "https://www.backlinecomedy.com/wp-content/uploads/2019/08/backline-logo.png"
  },
  {
    name: "Last Best Comedy",
    city: "Bozeman",
    state: "MT",
    zipcode: "59715",
    website: "https://www.lastbestcomedy.com",
    logo: "https://www.lastbestcomedy.com/wp-content/uploads/2020/01/last-best-logo.png"
  },
  {
    name: "Third Coast Comedy Club",
    city: "Nashville",
    state: "TN",
    zipcode: "37203",
    website: "https://www.thirdcoastcomedy.club",
    logo: "https://www.thirdcoastcomedy.club/wp-content/uploads/2019/06/third-coast-logo.png"
  },
  {
    name: "Vermont Comedy Club",
    city: "Burlington",
    state: "VT",
    zipcode: "05401",
    website: "https://www.vtcomedy.com",
    logo: "https://www.vtcomedy.com/wp-content/uploads/2018/04/vermont-comedy-club-logo.png"
  },
  {
    name: "The Hideout Theatre",
    city: "Austin",
    state: "TX",
    zipcode: "78701",
    website: "https://www.hideouttheatre.com",
    logo: "https://www.hideouttheatre.com/wp-content/uploads/2018/05/hideout-logo.png"
  },
  {
    name: "ColdTowne Theater",
    city: "Austin",
    state: "TX",
    zipcode: "78702",
    website: "https://www.coldtowne.com",
    logo: "https://www.coldtowne.com/wp-content/uploads/2019/03/coldtowne-logo.png"
  },
  {
    name: "Fallout Theater",
    city: "Austin",
    state: "TX",
    zipcode: "78701",
    website: "https://falloutcomedy.com",
    logo: "https://falloutcomedy.com/wp-content/uploads/2023/03/fallout-theater2.jpeg"
  },
  {
    name: "Station Theater",
    city: "Houston",
    state: "TX",
    zipcode: "77007",
    website: "https://www.stationtheater.com",
    logo: "https://www.stationtheater.com/wp-content/uploads/2019/02/station-logo.png"
  },
  {
    name: "Stomping Ground Comedy Theater",
    city: "Dallas",
    state: "TX",
    zipcode: "75206",
    website: "https://www.stompinggroundcomedy.org",
    logo: "https://www.stompinggroundcomedy.org/wp-content/uploads/2019/01/stomping-ground-logo.png"
  },
  {
    name: "Dallas Comedy House",
    city: "Dallas",
    state: "TX",
    zipcode: "75226",
    website: "https://www.dallascomedyhouse.com",
    logo: "https://www.dallascomedyhouse.com/wp-content/uploads/2018/06/dch-logo.png"
  },
  {
    name: "Four Day Weekend",
    city: "Fort Worth",
    state: "TX",
    zipcode: "76102",
    website: "https://www.fourdayweekend.com",
    logo: "https://www.fourdayweekend.com/wp-content/uploads/2019/04/fdw-logo.png"
  },
  {
    name: "ComedySportz Houston",
    city: "Houston",
    state: "TX",
    zipcode: "77002",
    website: "https://www.comedysportzhouston.com",
    logo: "https://www.comedysportzhouston.com/wp-content/uploads/2018/05/csz-logo.png"
  },
  {
    name: "ComedySportz Dallas",
    city: "Dallas",
    state: "TX",
    zipcode: "75204",
    website: "https://www.cszdallas.com",
    logo: "https://www.cszdallas.com/wp-content/uploads/2019/03/csz-dallas-logo.png"
  },
  {
    name: "ComedySportz Austin",
    city: "Austin",
    state: "TX",
    zipcode: "78702",
    website: "https://www.cszatx.com",
    logo: "https://www.cszatx.com/wp-content/uploads/2019/05/csz-austin-logo.png"
  },
  {
    name: "Kickstand Comedy",
    city: "Portland",
    state: "OR",
    zipcode: "97214",
    website: "https://www.kickstandcomedy.org",
    logo: "https://images.squarespace-cdn.com/content/v1/60ed03ab2477d23d838c509e/a1e91014-82bd-4b00-b4d8-cf151c085b36/Logo%2BLarge%2BWhite.png"
  },
  {
    name: "Unexpected Productions",
    city: "Seattle",
    state: "WA",
    zipcode: "98101",
    website: "https://unexpectedproductions.org",
    logo: "https://unexpectedproductions.org/wp-content/uploads/2018/06/unexpected-logo.png"
  },
  {
    name: "Jet City Improv",
    city: "Seattle",
    state: "WA",
    zipcode: "98103",
    website: "https://jetcityimprov.org",
    logo: "https://jetcityimprov.org/wp-content/uploads/2019/04/jet-city-logo.png"
  },
  {
    name: "Bandit Theater",
    city: "Seattle",
    state: "WA",
    zipcode: "98121",
    website: "https://www.bandittheater.org",
    logo: "https://www.bandittheater.org/wp-content/uploads/2020/02/bandit-logo.png"
  },
  {
    name: "ComedySportz Portland",
    city: "Portland",
    state: "OR",
    zipcode: "97205",
    website: "https://www.portlandcomedy.com",
    logo: "https://www.portlandcomedy.com/wp-content/uploads/2019/03/csz-portland-logo.png"
  },
  {
    name: "ComedySportz Seattle",
    city: "Seattle",
    state: "WA",
    zipcode: "98104",
    website: "https://www.cszseattle.com",
    logo: "https://www.cszseattle.com/wp-content/uploads/2018/07/csz-seattle-logo.png"
  },
  {
    name: "The New Movement",
    city: "New Orleans",
    state: "LA",
    zipcode: "70119",
    website: "https://www.thenewmovement.com",
    logo: "https://www.thenewmovement.com/wp-content/uploads/2019/01/tnm-logo.png"
  },
  {
    name: "Big Couch",
    city: "New Orleans",
    state: "LA",
    zipcode: "70119",
    website: "https://www.bigcouchnola.com",
    logo: "https://www.bigcouchnola.com/wp-content/uploads/2018/05/big-couch-logo.png"
  },
  {
    name: "Anubis Improv",
    city: "New Orleans",
    state: "LA",
    zipcode: "70130",
    website: "https://www.anubisimprov.com",
    logo: "https://www.anubisimprov.com/wp-content/uploads/2019/06/anubis-logo.png"
  },
  {
    name: "Crowdsource Comedy",
    city: "Salt Lake City",
    state: "UT",
    zipcode: "84101",
    website: "https://crowdsourcecomedy.com",
    logo: "https://crowdsourcecomedy.com/wp-content/uploads/2019/02/crowdsource-logo.png"
  },
  {
    name: "Baltimore Improv Group",
    city: "Baltimore",
    state: "MD",
    zipcode: "21202",
    website: "https://www.bigimprov.org",
    logo: "https://www.bigimprov.org/wp-content/uploads/2019/03/big-logo.png"
  },
  {
    name: "Improv Asylum",
    city: "Boston",
    state: "MA",
    zipcode: "02109",
    website: "https://www.improvasylum.com",
    logo: "https://www.improvasylum.com/wp-content/uploads/2018/04/improv-asylum-logo.png"
  },
  {
    name: "ComedySportz Philadelphia",
    city: "Philadelphia",
    state: "PA",
    zipcode: "19107",
    website: "https://www.comedysportzphilly.com",
    logo: "https://www.comedysportzphilly.com/wp-content/uploads/2019/05/csz-philly-logo.png"
  },
  {
    name: "Lancaster Improv Players",
    city: "Lancaster",
    state: "PA",
    zipcode: "17603",
    website: "https://www.lancasterimprov.com",
    logo: "https://www.lancasterimprov.com/wp-content/uploads/2019/01/lip-logo.png"
  },
  {
    name: "Happy Valley Improv",
    city: "State College",
    state: "PA",
    zipcode: "16801",
    website: "https://www.happyvalleyimprov.com",
    logo: "https://www.happyvalleyimprov.com/wp-content/uploads/2018/06/hvi-logo.png"
  },
  {
    name: "Providence Improv Guild",
    city: "Providence",
    state: "RI",
    zipcode: "02903",
    website: "https://www.providenceimprovguild.com",
    logo: "https://www.providenceimprovguild.com/wp-content/uploads/2019/02/pig-logo.png"
  },
  {
    name: "Kismet Improv",
    city: "Pawtucket",
    state: "RI",
    zipcode: "02860",
    website: "https://www.kismetimprov.com",
    logo: "https://www.kismetimprov.com/wp-content/uploads/2018/05/kismet-logo.png"
  },
  {
    name: "Alchemy Comedy Theater",
    city: "Greenville",
    state: "SC",
    zipcode: "29601",
    website: "https://alchemycomedy.com",
    logo: "https://alchemycomedy.com/wp-content/uploads/2019/03/alchemy-logo.png"
  },
  {
    name: "OKC Improv",
    city: "Oklahoma City",
    state: "OK",
    zipcode: "73102",
    website: "https://www.okcimprov.com",
    logo: "https://www.okcimprov.com/wp-content/uploads/2018/07/okc-improv-logo.png"
  },
  {
    name: "Atlas Improv Company",
    city: "Madison",
    state: "WI",
    zipcode: "53703",
    website: "https://www.atlasimprov.com",
    logo: "https://www.atlasimprov.com/wp-content/uploads/2019/04/atlas-logo.png"
  },
  {
    name: "Monkey Business Institute",
    city: "Madison",
    state: "WI",
    zipcode: "53703",
    website: "https://monkeybusinessinstitute.com",
    logo: "https://monkeybusinessinstitute.com/wp-content/uploads/2018/05/mbi-logo.png"
  },
  {
    name: "ComedySportz Milwaukee",
    city: "Milwaukee",
    state: "WI",
    zipcode: "53202",
    website: "https://www.comedysportzmilwaukee.com",
    logo: "https://www.comedysportzmilwaukee.com/wp-content/uploads/2019/03/csz-milwaukee-logo.png"
  },
  {
    name: "The Box Performance Space",
    city: "Albuquerque",
    state: "NM",
    zipcode: "87102",
    website: "https://www.theboxabq.com",
    logo: "https://www.theboxabq.com/wp-content/uploads/2019/01/box-logo.png"
  },
  {
    name: "Cue Zero Theatre Company",
    city: "Manchester",
    state: "NH",
    zipcode: "03101",
    website: "https://www.cuezero.com",
    logo: "https://www.cuezero.com/wp-content/uploads/2018/06/cue-zero-logo.png"
  },
  {
    name: "Las Vegas Improvisation Players",
    city: "Las Vegas",
    state: "NV",
    zipcode: "89101",
    website: "https://www.lviplay.com",
    logo: "https://www.lviplay.com/wp-content/uploads/2019/02/lvip-logo.png"
  },
  {
    name: "The Guild Theater",
    city: "Lawrence",
    state: "KS",
    zipcode: "66044",
    website: "https://www.guildtheater.com",
    logo: "https://www.guildtheater.com/wp-content/uploads/2019/04/guild-logo.png"
  },
  {
    name: "No Shame Theatre",
    city: "Iowa City",
    state: "IA",
    zipcode: "52240",
    website: "https://www.noshame.org",
    logo: "https://www.noshame.org/wp-content/uploads/2018/05/no-shame-logo.png"
  },
  {
    name: "Broken Pencil Improv",
    city: "Fort Wayne",
    state: "IN",
    zipcode: "46802",
    website: "https://www.brokenpencilimprov.com",
    logo: "https://www.brokenpencilimprov.com/wp-content/uploads/2025/12/BPI_Oz_Nov_2025.png"
  },
  {
    name: "Recycled Minds Comedy",
    city: "Boise",
    state: "ID",
    zipcode: "83702",
    website: "https://www.recycledmindscomedy.com",
    logo: "https://www.recycledmindscomedy.com/wp-content/uploads/2018/06/rm-logo.png"
  },
  {
    name: "Improv Hawaii",
    city: "Honolulu",
    state: "HI",
    zipcode: "96813",
    website: "https://www.improvhawaii.com",
    logo: "https://www.improvhawaii.com/wp-content/uploads/2019/02/improv-hawaii-logo.png"
  },
  {
    name: "The Playground Theater",
    city: "Chicago",
    state: "IL",
    zipcode: "60647",
    website: "https://theplaygroundtheater.com",
    logo: "https://theplaygroundtheater.com/wp-content/uploads/2019/03/playground-logo.png"
  },
  {
    name: "Bughouse Theater",
    city: "Chicago",
    state: "IL",
    zipcode: "60647",
    website: "https://bughousetheater.com",
    logo: "https://bughousetheater.com/wp-content/uploads/2018/05/bughouse-logo.png"
  },
  {
    name: "Improv Playhouse",
    city: "Libertyville",
    state: "IL",
    zipcode: "60048",
    website: "https://improvplayhouse.com",
    logo: "https://improvplayhouse.com/wp-content/uploads/2019/04/improv-playhouse-logo.png"
  },
  {
    name: "ComedySportz Chicago",
    city: "Chicago",
    state: "IL",
    zipcode: "60611",
    website: "https://www.comedysportzchicago.com",
    logo: "https://www.comedysportzchicago.com/wp-content/uploads/2019/05/csz-chicago-logo.png"
  },
  {
    name: "ComedySportz Twin Cities",
    city: "Minneapolis",
    state: "MN",
    zipcode: "55404",
    website: "https://www.csztwincities.com",
    logo: "https://www.csztwincities.com/wp-content/uploads/2018/06/csz-tc-logo.png"
  },
  {
    name: "ComedySportz Indianapolis",
    city: "Indianapolis",
    state: "IN",
    zipcode: "46204",
    website: "https://www.cszindianapolis.com",
    logo: "https://www.cszindianapolis.com/wp-content/uploads/2019/03/csz-indy-logo.png"
  },
  {
    name: "ComedySportz Charlotte",
    city: "Charlotte",
    state: "NC",
    zipcode: "28202",
    website: "https://www.comedysportzcharlotte.com",
    logo: "https://www.comedysportzcharlotte.com/wp-content/uploads/2019/04/csz-charlotte-logo.png"
  },
  {
    name: "Dsi Comedy Theater",
    city: "Raleigh",
    state: "NC",
    zipcode: "27601",
    website: "https://www.dsicomedy.com",
    logo: "https://www.dsicomedy.com/wp-content/uploads/2018/07/dsi-logo.png"
  },
  {
    name: "Comedy Arts Theater of Charlotte",
    city: "Charlotte",
    state: "NC",
    zipcode: "28203",
    website: "https://www.catzcharlotte.com",
    logo: "https://www.catzcharlotte.com/wp-content/uploads/2019/02/catz-logo.png"
  },
  {
    name: "Improv Cincinnati",
    city: "Covington",
    state: "KY",
    zipcode: "41011",
    website: "https://www.improvcincinnati.com",
    logo: "https://www.improvcincinnati.com/wp-content/uploads/2019/03/improv-cincy-logo.png"
  },
  {
    name: "The Annoyance Theatre",
    city: "New York",
    state: "NY",
    zipcode: "11237",
    website: "https://theannoyance.nyc",
    logo: "https://theannoyance.nyc/wp-content/uploads/2019/05/annoyance-ny-logo.png"
  },
  {
    name: "Mopco Improv Theatre",
    city: "Schenectady",
    state: "NY",
    zipcode: "12305",
    website: "https://www.mopco.org",
    logo: "https://www.mopco.org/wp-content/uploads/2018/06/mopco-logo.png"
  },
  {
    name: "The Un-Scripted Theater Company",
    city: "San Francisco",
    state: "CA",
    zipcode: "94102",
    website: "https://www.unscriptedtheater.com",
    logo: "https://www.unscriptedtheater.com/wp-content/uploads/2019/04/unscripted-logo.png"
  },
  {
    name: "National Comedy Theatre",
    city: "San Diego",
    state: "CA",
    zipcode: "92101",
    website: "https://nationalcomedy.com",
    logo: "https://nationalcomedy.com/wp-content/uploads/2019/09/cropped-NCT-logo.png"
  },
  {
    name: "Central Coast Comedy Theater",
    city: "San Luis Obispo",
    state: "CA",
    zipcode: "93401",
    website: "https://www.centralcoastcomedytheater.com",
    logo: "https://www.centralcoastcomedytheater.com/wp-content/uploads/2019/03/ccct-logo.png"
  },
  {
    name: "Villain Theater",
    city: "Miami",
    state: "FL",
    zipcode: "33132",
    website: "https://www.villaintheater.com",
    logo: "https://www.villaintheater.com/wp-content/uploads/2019/02/villain-logo.png"
  },
  {
    name: "SAK Comedy Lab",
    city: "Orlando",
    state: "FL",
    zipcode: "32801",
    website: "https://www.sakcomedylab.com",
    logo: "http://sakcomedylab.s3.amazonaws.com/sak_comedy_lab.jpg"
  },
  {
    name: "AdLib Theater",
    city: "Boca Raton",
    state: "FL",
    zipcode: "33432",
    website: "https://www.adlibtheater.com",
    logo: "https://www.adlibtheater.com/wp-content/uploads/2019/03/adlib-logo.png"
  },
  {
    name: "Front Porch Improv",
    city: "Savannah",
    state: "GA",
    zipcode: "31401",
    website: "https://www.frontporchimprov.com",
    logo: "https://www.frontporchimprov.com/wp-content/uploads/2019/04/front-porch-logo.png"
  },
  {
    name: "Whole World Improv Theatre",
    city: "Atlanta",
    state: "GA",
    zipcode: "30307",
    website: "https://www.wholeworldtheatre.com",
    logo: "https://www.wholeworldtheatre.com/wp-content/uploads/2020/01/logo.png"
  },
  {
    name: "Village Theatre",
    city: "Atlanta",
    state: "GA",
    zipcode: "30307",
    website: "https://www.villagecomedy.com",
    logo: "https://www.villagecomedy.com/wp-content/uploads/2019/03/village-logo.png"
  },
  {
    name: "Improv Asylum",
    city: "Orlando",
    state: "FL",
    zipcode: "32801",
    website: "https://www.improvasylum.com/orlando",
    logo: "https://www.improvasylum.com/wp-content/uploads/2018/04/improv-asylum-logo.png"
  },
  {
    name: "The Comedy Spot",
    city: "Scottsdale",
    state: "AZ",
    zipcode: "85251",
    website: "https://www.thecomedyspot.net",
    logo: "https://www.thecomedyspot.net/wp-content/uploads/2019/03/comedy-spot-logo.png"
  },
  {
    name: "Torch Theatre",
    city: "Phoenix",
    state: "AZ",
    zipcode: "85004",
    website: "https://www.torchtheatre.com",
    logo: "https://www.torchtheatre.com/wp-content/uploads/2019/04/torch-logo.png"
  },
  {
    name: "Unscrewed Theater",
    city: "Tucson",
    state: "AZ",
    zipcode: "85716",
    website: "https://unscrewedtheater.org",
    logo: "https://unscrewedtheater.org/wp-content/uploads/2019/02/unscrewed-logo.png"
  },
  {
    name: "Bridge Improv Theater",
    city: "Tempe",
    state: "AZ",
    zipcode: "85281",
    website: "https://www.bridgeimprovtheater.com",
    logo: "https://www.bridgeimprovtheater.com/wp-content/uploads/2018/06/bridge-logo.png"
  },
  {
    name: "Sea Tea Comedy Theater",
    city: "Hartford",
    state: "CT",
    zipcode: "06103",
    website: "https://seateaimprov.com",
    logo: "https://seateaimprov.com/wp-content/uploads/2b8adc3e-19d5-46fe-bf8b-89a8e643b3cd.jpg"
  },
  {
    name: "The Bent Theatre",
    city: "Charlottesville",
    state: "VA",
    zipcode: "22902",
    website: "https://www.thebenttheatre.com",
    logo: "https://www.thebenttheatre.com/wp-content/uploads/2019/03/bent-logo.png"
  },
  {
    name: "ComedySportz Richmond",
    city: "Richmond",
    state: "VA",
    zipcode: "23230",
    website: "https://www.comedysportzrichmond.com",
    logo: "https://www.comedysportzrichmond.com/wp-content/uploads/2019/04/csz-richmond-logo.png"
  },
  {
    name: "ComedySportz Washington DC",
    city: "Washington",
    state: "DC",
    zipcode: "20007",
    website: "https://www.comedysportzdc.com",
    logo: "https://www.comedysportzdc.com/wp-content/uploads/2019/03/csz-dc-logo.png"
  },
  {
    name: "Washington Improv Theater",
    city: "Washington",
    state: "DC",
    zipcode: "20009",
    website: "https://witdc.org",
    logo: "https://witdc.org/wp-content/uploads/2019/04/wit-logo.png"
  },
  {
    name: "ComedySportz San Jose",
    city: "San Jose",
    state: "CA",
    zipcode: "95113",
    website: "https://www.cszsanjose.com",
    logo: "https://www.cszsanjose.com/wp-content/uploads/2019/03/csz-sj-logo.png"
  },
  {
    name: "Pan Theater",
    city: "Oakland",
    state: "CA",
    zipcode: "94612",
    website: "https://www.pantheater.com",
    logo: "https://www.pantheater.com/wp-content/uploads/2018/06/pan-logo.png"
  },
  {
    name: "Made Up Theatre",
    city: "Fremont",
    state: "CA",
    zipcode: "94536",
    website: "https://madeuptheatre.com",
    logo: "https://madeuptheatre.com/wp-content/uploads/2019/02/mut-logo.png"
  },
  {
    name: "ImprovCity",
    city: "Tustin",
    state: "CA",
    zipcode: "92780",
    website: "https://improvcityonline.com",
    logo: "https://improvcityonline.com/wp-content/uploads/2019/05/improvcity-logo.png"
  },
  {
    name: "ComedySportz Los Angeles",
    city: "Los Angeles",
    state: "CA",
    zipcode: "90025",
    website: "https://www.cszla.com",
    logo: "https://www.cszla.com/wp-content/uploads/2019/03/csz-la-logo.png"
  },
  {
    name: "ComedySportz San Diego",
    city: "San Diego",
    state: "CA",
    zipcode: "92101",
    website: "https://www.comedysportzsd.com",
    logo: "https://www.comedysportzsd.com/wp-content/uploads/2019/04/csz-sd-logo.png"
  },
  {
    name: "ComedySportz Sacramento",
    city: "Sacramento",
    state: "CA",
    zipcode: "95816",
    website: "https://www.cszsacramento.com",
    logo: "https://www.cszsacramento.com/wp-content/uploads/2019/02/csz-sac-logo.png"
  },
  {
    name: "ComedySportz New York",
    city: "New York",
    state: "NY",
    zipcode: "10011",
    website: "https://www.csznewyork.com",
    logo: "https://www.csznewyork.com/wp-content/uploads/2019/03/csz-ny-logo.png"
  },
  {
    name: "ComedySportz Baltimore",
    city: "Baltimore",
    state: "MD",
    zipcode: "21230",
    website: "https://www.cszbaltimore.com",
    logo: "https://www.cszbaltimore.com/wp-content/uploads/2019/03/csz-baltimore-logo.png"
  },
  {
    name: "The Armory Comedy",
    city: "Minneapolis",
    state: "MN",
    zipcode: "55413",
    website: "https://www.thearmorycomedy.com",
    logo: "https://www.thearmorycomedy.com/wp-content/uploads/2020/01/armory-logo.png"
  },
  {
    name: "ComedySportz Boston",
    city: "Boston",
    state: "MA",
    zipcode: "02116",
    website: "https://www.cszboston.com",
    logo: "https://www.cszboston.com/wp-content/uploads/2019/03/csz-boston-logo.png"
  },
  {
    name: "ComedySportz Cleveland",
    city: "Cleveland",
    state: "OH",
    zipcode: "44113",
    website: "https://www.comedysportzcleveland.com",
    logo: "https://www.comedysportzcleveland.com/wp-content/uploads/2019/04/csz-cleveland-logo.png"
  },
  {
    name: "ComedySportz Cincinnati",
    city: "Cincinnati",
    state: "OH",
    zipcode: "45202",
    website: "https://www.comedysportzcincinnati.com",
    logo: "https://www.comedysportzcincinnati.com/wp-content/uploads/2019/03/csz-cincinnati-logo.png"
  },
  {
    name: "ComedySportz Detroit",
    city: "Detroit",
    state: "MI",
    zipcode: "48201",
    website: "https://www.comedysportzdetroit.com",
    logo: "https://www.comedysportzdetroit.com/wp-content/uploads/2019/03/csz-detroit-logo.png"
  },
  {
    name: "ComedySportz Kansas City",
    city: "Kansas City",
    state: "MO",
    zipcode: "64111",
    website: "https://www.comedysportzkc.com",
    logo: "https://www.comedysportzkc.com/wp-content/uploads/2019/03/csz-kc-logo.png"
  },
  {
    name: "ComedySportz St. Louis",
    city: "St. Louis",
    state: "MO",
    zipcode: "63108",
    website: "https://www.comedysportzstl.com",
    logo: "https://www.comedysportzstl.com/wp-content/uploads/2019/04/csz-stl-logo.png"
  },
  {
    name: "ComedySportz Twin Cities (St. Paul)",
    city: "St. Paul",
    state: "MN",
    zipcode: "55102",
    website: "https://www.csztwincities.com",
    logo: "https://www.csztwincities.com/wp-content/uploads/2018/06/csz-tc-logo.png"
  },
  {
    name: "ComedySportz Tampa",
    city: "Tampa",
    state: "FL",
    zipcode: "33602",
    website: "https://www.comedysportztampa.com",
    logo: "https://www.comedysportztampa.com/wp-content/uploads/2019/03/csz-tampa-logo.png"
  },
  {
    name: "ComedySportz Phoenix",
    city: "Phoenix",
    state: "AZ",
    zipcode: "85004",
    website: "https://www.cszphoenix.com",
    logo: "https://www.cszphoenix.com/wp-content/uploads/2019/03/csz-phoenix-logo.png"
  }
]

export const getTheatreNames = () => {
    const nameCounts = theatres.reduce((acc, theatre) => {
        acc[theatre.name] = (acc[theatre.name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    return theatres.map(theatre => {
        const name = theatre.name;
        if (nameCounts[name] > 1) {
            return `${name} (${theatre.city})`;
        }
        return name;
    });
}

export const getTheatreByName = (name: string) => theatres.find((t) => t.name === name) || theatres.find((t) => `${t.name} (${t.city})` === name);

export const getTheatresByState = (state: string) => theatres.filter((t) => t.state === state);