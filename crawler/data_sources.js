const sources = [
  { 
    code: "advisory_information",
    api_url: "http://api.bart.gov/api/bsa.aspx?cmd=bsa&key=MW9S-E7SL-26DU-VV8V&date=today", 
  },
  { 
    code: "train_count",
    api_url: "http://api.bart.gov/api/bsa.aspx?cmd=count&key=MW9S-E7SL-26DU-VV8V", 
  },
  { 
    code: "elevator_infromation",
    api_url: "http://api.bart.gov/api/bsa.aspx?cmd=elev&key=MW9S-E7SL-26DU-VV8V", 
  },
  { 
    code: "special_information",
    api_url: "http://api.bart.gov/api/sched.aspx?cmd=special&key=MW9S-E7SL-26DU-VV8V&l=1", 
  },
  { 
    code: "all_stations",
    api_url: "http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V", 
  },
]

export default sources;