const theatres = [
  {
    name: "Arcade Comedy Theater",
    city: "Pittsburgh",
    state: "PA",
    zipcode: "15222",
    website: "https://www.arcadecomedytheater.com",
    logo: "https://www.arcadecomedytheater.com/wp-content/uploads/2019/05/arcade-logo.png"
  },
  {
    name: "Steel City Improv Theater",
    city: "Pittsburgh",
    state: "PA",
    zipcode: "15203",
    website: "https://www.steelcityimprov.com",
    logo: "https://www.steelcityimprov.com/wp-content/uploads/2021/06/steel-city-improv-logo.png"
  },
  {
    name: "The Second City",
    city: "Chicago",
    state: "IL",
    zipcode: "60614",
    website: "https://www.secondcity.com",
    logo: "https://www.secondcity.com/wp-content/themes/secondcity/assets/images/logo.svg"
  },
  {
    name: "iO Theater",
    city: "Chicago",
    state: "IL",
    zipcode: "60614",
    website: "https://ioimprov.com",
    logo: "https://ioimprov.com/wp-content/uploads/2022/03/io-logo.png"
  },
  {
    name: "The Annoyance Theatre",
    city: "Chicago",
    state: "IL",
    zipcode: "60614",
    website: "https://www.theannoyance.com",
    logo: "https://www.theannoyance.com/wp-content/uploads/2018/05/annoyance-logo.png"
  },
  {
    name: "The Groundlings",
    city: "Los Angeles",
    state: "CA",
    zipcode: "90046",
    website: "https://www.groundlings.com",
    logo: "https://www.groundlings.com/assets/images/logo.png"
  },
  {
    name: "Upright Citizens Brigade (UCB) Theatre",
    city: "Los Angeles",
    state: "CA",
    zipcode: "90028",
    website: "https://ucbcomedy.com",
    logo: "https://ucbcomedy.com/wp-content/uploads/2021/05/ucb-logo.png"
  },
  {
    name: "The PIT",
    city: "New York",
    state: "NY",
    zipcode: "10018",
    website: "https://thepit-nyc.com",
    logo: "https://thepit-nyc.com/wp-content/uploads/2020/03/pit-logo.png"
  },
  {
    name: "Magnet Theater",
    city: "New York",
    state: "NY",
    zipcode: "10018",
    website: "https://magnettheater.com",
    logo: "https://magnettheater.com/wp-content/uploads/2019/03/magnet-logo.png"
  },
  {
    name: "ImprovBoston",
    city: "Cambridge",
    state: "MA",
    zipcode: "02139",
    website: "https://www.improvboston.com",
    logo: "https://www.improvboston.com/wp-content/uploads/2017/01/logo.png"
  },
  {
    name: "Upright Citizens Brigade (UCB) Theatre",
    city: "New York",
    state: "NY",
    zipcode: "10003",
    website: "https://ucbcomedy.com",
    logo: "https://ucbcomedy.com/wp-content/uploads/2021/05/ucb-logo.png"
  },
  {
    name: "Chicago City Limits",
    city: "New York",
    state: "NY",
    zipcode: "10021",
    website: "https://www.chicagocitylimits.com",
    logo: "https://www.chicagocitylimits.com/uploads/1/2/3/9/123909886/published/ccl-logo.png"
  },
  {
    name: "BATS Improv",
    city: "San Francisco",
    state: "CA",
    zipcode: "94123",
    website: "https://www.improv.org",
    logo: "https://www.improv.org/wp-content/uploads/2021/08/bats-logo.png"
  },
  {
    name: "Endgames Improv",
    city: "San Francisco",
    state: "CA",
    zipcode: "94110",
    website: "https://www.endgamesimprov.com",
    logo: "https://www.endgamesimprov.com/wp-content/uploads/2018/03/endgames-logo.png"
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
    logo: "https://www.finestcityimprov.com/wp-content/uploads/2019/06/fci-logo.png"
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
    logo: "https://seateaimprov.com/wp-content/uploads/2019/01/sea-tea-logo.png"
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
    logo: "https://risecomedy.com/wp-content/uploads/2020/03/rise-logo.png"
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
    logo: "https://pushcomedytheater.com/wp-content/uploads/2019/03/push-logo.png"
  },
  {
    name: "The Coalition Theater",
    city: "Richmond",
    state: "VA",
    zipcode: "23220",
    website: "https://rvacomedy.com",
    logo: "https://rvacomedy.com/wp-content/uploads/2018/05/coalition-logo.png"
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
    logo: "https://falloutcomedy.com/wp-content/uploads/2018/07/fallout-logo.png"
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
    logo: "https://www.kickstandcomedy.org/wp-content/uploads/2019/05/kickstand-logo.png"
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
    logo: "https://www.brokenpencilimprov.com/wp-content/uploads/2019/03/bpi-logo.png"
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
    logo: "https://nationalcomedy.com/wp-content/uploads/2018/05/nct-logo.png"
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
    logo: "https://www.sakcomedylab.com/wp-content/uploads/2018/05/sak-logo.png"
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
    logo: "https://www.wholeworldtheatre.com/wp-content/uploads/2018/06/whole-world-logo.png"
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
    logo: "https://seateaimprov.com/wp-content/uploads/2019/01/sea-tea-logo.png"
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
