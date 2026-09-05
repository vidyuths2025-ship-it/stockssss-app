const COMPANIES = [
  {
    "symbol": "RELIANCE.NS",
    "name": "Reliance Industries"
  },
  {
    "symbol": "TCS.NS",
    "name": "Tata Consultancy Services"
  },
  {
    "symbol": "HDFCBANK.NS",
    "name": "HDFC Bank"
  },
  {
    "symbol": "ICICIBANK.NS",
    "name": "ICICI Bank"
  },
  {
    "symbol": "INFY.NS",
    "name": "Infosys"
  },
  {
    "symbol": "HINDUNILVR.NS",
    "name": "Hindustan Unilever"
  },
  {
    "symbol": "ITC.NS",
    "name": "ITC Limited"
  },
  {
    "symbol": "SBIN.NS",
    "name": "State Bank of India"
  },
  {
    "symbol": "BHARTIARTL.NS",
    "name": "Bharti Airtel"
  },
  {
    "symbol": "KOTAKBANK.NS",
    "name": "Kotak Mahindra Bank"
  },
  {
    "symbol": "LT.NS",
    "name": "Larsen & Toubro"
  },
  {
    "symbol": "AXISBANK.NS",
    "name": "Axis Bank"
  },
  {
    "symbol": "BAJFINANCE.NS",
    "name": "Bajaj Finance"
  },
  {
    "symbol": "ASIANPAINT.NS",
    "name": "Asian Paints"
  },
  {
    "symbol": "MARUTI.NS",
    "name": "Maruti Suzuki India"
  },
  {
    "symbol": "SUNPHARMA.NS",
    "name": "Sun Pharmaceutical"
  },
  {
    "symbol": "TITAN.NS",
    "name": "Titan Company"
  },
  {
    "symbol": "ULTRACEMCO.NS",
    "name": "UltraTech Cement"
  },
  {
    "symbol": "WIPRO.NS",
    "name": "Wipro"
  },
  {
    "symbol": "NESTLEIND.NS",
    "name": "Nestle India"
  },
  {
    "symbol": "ONGC.NS",
    "name": "Oil and Natural Gas Corporation"
  },
  {
    "symbol": "NTPC.NS",
    "name": "NTPC Limited"
  },
  {
    "symbol": "POWERGRID.NS",
    "name": "Power Grid Corporation"
  },
  {
    "symbol": "M&M.NS",
    "name": "Mahindra & Mahindra"
  },
  {
    "symbol": "TATASTEEL.NS",
    "name": "Tata Steel"
  },
  {
    "symbol": "TATAMOTORS.NS",
    "name": "Tata Motors"
  },
  {
    "symbol": "ADANIENT.NS",
    "name": "Adani Enterprises"
  },
  {
    "symbol": "ADANIPORTS.NS",
    "name": "Adani Ports and SEZ"
  },
  {
    "symbol": "JSWSTEEL.NS",
    "name": "JSW Steel"
  },
  {
    "symbol": "HCLTECH.NS",
    "name": "HCL Technologies"
  },
  {
    "symbol": "BAJAJFINSV.NS",
    "name": "Bajaj Finserv"
  },
  {
    "symbol": "INDUSINDBK.NS",
    "name": "IndusInd Bank"
  },
  {
    "symbol": "GRASIM.NS",
    "name": "Grasim Industries"
  },
  {
    "symbol": "TECHM.NS",
    "name": "Tech Mahindra"
  },
  {
    "symbol": "CIPLA.NS",
    "name": "Cipla"
  },
  {
    "symbol": "DRREDDY.NS",
    "name": "Dr Reddy's Laboratories"
  },
  {
    "symbol": "DIVISLAB.NS",
    "name": "Divi's Laboratories"
  },
  {
    "symbol": "BRITANNIA.NS",
    "name": "Britannia Industries"
  },
  {
    "symbol": "EICHERMOT.NS",
    "name": "Eicher Motors"
  },
  {
    "symbol": "HEROMOTOCO.NS",
    "name": "Hero MotoCorp"
  },
  {
    "symbol": "BAJAJ-AUTO.NS",
    "name": "Bajaj Auto"
  },
  {
    "symbol": "COALINDIA.NS",
    "name": "Coal India"
  },
  {
    "symbol": "HINDALCO.NS",
    "name": "Hindalco Industries"
  },
  {
    "symbol": "BPCL.NS",
    "name": "Bharat Petroleum"
  },
  {
    "symbol": "IOC.NS",
    "name": "Indian Oil Corporation"
  },
  {
    "symbol": "SBILIFE.NS",
    "name": "SBI Life Insurance"
  },
  {
    "symbol": "HDFCLIFE.NS",
    "name": "HDFC Life Insurance"
  },
  {
    "symbol": "APOLLOHOSP.NS",
    "name": "Apollo Hospitals"
  },
  {
    "symbol": "UPL.NS",
    "name": "UPL Limited"
  },
  {
    "symbol": "SHREECEM.NS",
    "name": "Shree Cement"
  },
  {
    "symbol": "PIDILITIND.NS",
    "name": "Pidilite Industries"
  },
  {
    "symbol": "DABUR.NS",
    "name": "Dabur India"
  },
  {
    "symbol": "GODREJCP.NS",
    "name": "Godrej Consumer Products"
  },
  {
    "symbol": "HAVELLS.NS",
    "name": "Havells India"
  },
  {
    "symbol": "MARICO.NS",
    "name": "Marico"
  },
  {
    "symbol": "SIEMENS.NS",
    "name": "Siemens"
  },
  {
    "symbol": "DLF.NS",
    "name": "DLF Limited"
  },
  {
    "symbol": "VEDL.NS",
    "name": "Vedanta"
  },
  {
    "symbol": "AMBUJACEM.NS",
    "name": "Ambuja Cements"
  },
  {
    "symbol": "BANKBARODA.NS",
    "name": "Bank of Baroda"
  },
  {
    "symbol": "PNB.NS",
    "name": "Punjab National Bank"
  },
  {
    "symbol": "CANBK.NS",
    "name": "Canara Bank"
  },
  {
    "symbol": "IDFCFIRSTB.NS",
    "name": "IDFC First Bank"
  },
  {
    "symbol": "BANDHANBNK.NS",
    "name": "Bandhan Bank"
  },
  {
    "symbol": "FEDERALBNK.NS",
    "name": "Federal Bank"
  },
  {
    "symbol": "AUBANK.NS",
    "name": "AU Small Finance Bank"
  },
  {
    "symbol": "CHOLAFIN.NS",
    "name": "Cholamandalam Investment"
  },
  {
    "symbol": "MUTHOOTFIN.NS",
    "name": "Muthoot Finance"
  },
  {
    "symbol": "LICI.NS",
    "name": "Life Insurance Corporation of India"
  },
  {
    "symbol": "IRCTC.NS",
    "name": "Indian Railway Catering and Tourism Corp"
  },
  {
    "symbol": "ZOMATO.NS",
    "name": "Zomato"
  },
  {
    "symbol": "NYKAA.NS",
    "name": "FSN E-Commerce (Nykaa)"
  },
  {
    "symbol": "PAYTM.NS",
    "name": "One97 Communications (Paytm)"
  },
  {
    "symbol": "POLICYBZR.NS",
    "name": "PB Fintech (Policybazaar)"
  },
  {
    "symbol": "DMART.NS",
    "name": "Avenue Supermarts (DMart)"
  },
  {
    "symbol": "TRENT.NS",
    "name": "Trent Limited"
  },
  {
    "symbol": "PAGEIND.NS",
    "name": "Page Industries"
  },
  {
    "symbol": "BOSCHLTD.NS",
    "name": "Bosch Limited"
  },
  {
    "symbol": "MOTHERSON.NS",
    "name": "Samvardhana Motherson International"
  },
  {
    "symbol": "TVSMOTOR.NS",
    "name": "TVS Motor Company"
  },
  {
    "symbol": "ASHOKLEY.NS",
    "name": "Ashok Leyland"
  },
  {
    "symbol": "BALKRISIND.NS",
    "name": "Balkrishna Industries"
  },
  {
    "symbol": "MRF.NS",
    "name": "MRF Limited"
  },
  {
    "symbol": "APOLLOTYRE.NS",
    "name": "Apollo Tyres"
  },
  {
    "symbol": "ESCORTS.NS",
    "name": "Escorts Kubota"
  },
  {
    "symbol": "BHARATFORG.NS",
    "name": "Bharat Forge"
  },
  {
    "symbol": "CUMMINSIND.NS",
    "name": "Cummins India"
  },
  {
    "symbol": "ABB.NS",
    "name": "ABB India"
  },
  {
    "symbol": "HAL.NS",
    "name": "Hindustan Aeronautics"
  },
  {
    "symbol": "BEL.NS",
    "name": "Bharat Electronics"
  },
  {
    "symbol": "BHEL.NS",
    "name": "Bharat Heavy Electricals"
  },
  {
    "symbol": "GAIL.NS",
    "name": "GAIL India"
  },
  {
    "symbol": "PETRONET.NS",
    "name": "Petronet LNG"
  },
  {
    "symbol": "IGL.NS",
    "name": "Indraprastha Gas"
  },
  {
    "symbol": "GUJGASLTD.NS",
    "name": "Gujarat Gas"
  },
  {
    "symbol": "TORNTPHARM.NS",
    "name": "Torrent Pharmaceuticals"
  },
  {
    "symbol": "LUPIN.NS",
    "name": "Lupin Limited"
  },
  {
    "symbol": "AUROPHARMA.NS",
    "name": "Aurobindo Pharma"
  },
  {
    "symbol": "ALKEM.NS",
    "name": "Alkem Laboratories"
  },
  {
    "symbol": "BIOCON.NS",
    "name": "Biocon"
  },
  {
    "symbol": "GLENMARK.NS",
    "name": "Glenmark Pharmaceuticals"
  },
  {
    "symbol": "ZYDUSLIFE.NS",
    "name": "Zydus Lifesciences"
  },
  {
    "symbol": "LTIM.NS",
    "name": "LTIMindtree"
  },
  {
    "symbol": "MPHASIS.NS",
    "name": "Mphasis"
  },
  {
    "symbol": "PERSISTENT.NS",
    "name": "Persistent Systems"
  },
  {
    "symbol": "COFORGE.NS",
    "name": "Coforge"
  },
  {
    "symbol": "LTTS.NS",
    "name": "L&T Technology Services"
  },
  {
    "symbol": "OFSS.NS",
    "name": "Oracle Financial Services Software"
  },
  {
    "symbol": "NAUKRI.NS",
    "name": "Info Edge (Naukri)"
  },
  {
    "symbol": "JUBLFOOD.NS",
    "name": "Jubilant FoodWorks"
  },
  {
    "symbol": "UBL.NS",
    "name": "United Breweries"
  },
  {
    "symbol": "MCDOWELL-N.NS",
    "name": "United Spirits"
  },
  {
    "symbol": "COLPAL.NS",
    "name": "Colgate-Palmolive India"
  },
  {
    "symbol": "EMAMILTD.NS",
    "name": "Emami"
  },
  {
    "symbol": "TATACONSUM.NS",
    "name": "Tata Consumer Products"
  },
  {
    "symbol": "VBL.NS",
    "name": "Varun Beverages"
  },
  {
    "symbol": "BERGEPAINT.NS",
    "name": "Berger Paints"
  },
  {
    "symbol": "KANSAINER.NS",
    "name": "Kansai Nerolac Paints"
  },
  {
    "symbol": "ACC.NS",
    "name": "ACC Limited"
  },
  {
    "symbol": "JKCEMENT.NS",
    "name": "JK Cement"
  },
  {
    "symbol": "DALBHARAT.NS",
    "name": "Dalmia Bharat"
  },
  {
    "symbol": "RAMCOCEM.NS",
    "name": "The Ramco Cements"
  },
  {
    "symbol": "SAIL.NS",
    "name": "Steel Authority of India"
  },
  {
    "symbol": "JINDALSTEL.NS",
    "name": "Jindal Steel & Power"
  },
  {
    "symbol": "NMDC.NS",
    "name": "NMDC Limited"
  },
  {
    "symbol": "NATIONALUM.NS",
    "name": "National Aluminium Company"
  },
  {
    "symbol": "HINDCOPPER.NS",
    "name": "Hindustan Copper"
  },
  {
    "symbol": "INDIGO.NS",
    "name": "InterGlobe Aviation (IndiGo)"
  },
  {
    "symbol": "SPICEJET.NS",
    "name": "SpiceJet"
  },
  {
    "symbol": "CONCOR.NS",
    "name": "Container Corporation of India"
  },
  {
    "symbol": "IRFC.NS",
    "name": "Indian Railway Finance Corporation"
  },
  {
    "symbol": "RVNL.NS",
    "name": "Rail Vikas Nigam"
  },
  {
    "symbol": "IREDA.NS",
    "name": "Indian Renewable Energy Development Agency"
  },
  {
    "symbol": "PFC.NS",
    "name": "Power Finance Corporation"
  },
  {
    "symbol": "RECLTD.NS",
    "name": "REC Limited"
  },
  {
    "symbol": "ADANIGREEN.NS",
    "name": "Adani Green Energy"
  },
  {
    "symbol": "ADANIPOWER.NS",
    "name": "Adani Power"
  },
  {
    "symbol": "TATAPOWER.NS",
    "name": "Tata Power"
  },
  {
    "symbol": "NHPC.NS",
    "name": "NHPC Limited"
  },
  {
    "symbol": "SJVN.NS",
    "name": "SJVN Limited"
  },
  {
    "symbol": "SUZLON.NS",
    "name": "Suzlon Energy"
  },
  {
    "symbol": "INOXWIND.NS",
    "name": "Inox Wind"
  },
  {
    "symbol": "YESBANK.NS",
    "name": "Yes Bank"
  },
  {
    "symbol": "RBLBANK.NS",
    "name": "RBL Bank"
  },
  {
    "symbol": "IDBI.NS",
    "name": "IDBI Bank"
  },
  {
    "symbol": "UNIONBANK.NS",
    "name": "Union Bank of India"
  },
  {
    "symbol": "INDIANB.NS",
    "name": "Indian Bank"
  },
  {
    "symbol": "CENTRALBK.NS",
    "name": "Central Bank of India"
  },
  {
    "symbol": "MFSL.NS",
    "name": "Max Financial Services"
  },
  {
    "symbol": "ICICIPRULI.NS",
    "name": "ICICI Prudential Life Insurance"
  },
  {
    "symbol": "ICICIGI.NS",
    "name": "ICICI Lombard General Insurance"
  },
  {
    "symbol": "STARHEALTH.NS",
    "name": "Star Health and Allied Insurance"
  },
  {
    "symbol": "NIACL.NS",
    "name": "New India Assurance"
  },
  {
    "symbol": "GICRE.NS",
    "name": "General Insurance Corporation of India"
  },
  {
    "symbol": "CDSL.NS",
    "name": "Central Depository Services"
  },
  {
    "symbol": "BSE.NS",
    "name": "BSE Limited"
  },
  {
    "symbol": "MCX.NS",
    "name": "Multi Commodity Exchange of India"
  },
  {
    "symbol": "ANGELONE.NS",
    "name": "Angel One"
  },
  {
    "symbol": "IIFL.NS",
    "name": "IIFL Finance"
  },
  {
    "symbol": "LODHA.NS",
    "name": "Macrotech Developers (Lodha)"
  },
  {
    "symbol": "GODREJPROP.NS",
    "name": "Godrej Properties"
  },
  {
    "symbol": "OBEROIRLTY.NS",
    "name": "Oberoi Realty"
  },
  {
    "symbol": "PRESTIGE.NS",
    "name": "Prestige Estates Projects"
  },
  {
    "symbol": "PHOENIXLTD.NS",
    "name": "Phoenix Mills"
  },
  {
    "symbol": "BRIGADE.NS",
    "name": "Brigade Enterprises"
  },
  {
    "symbol": "SONACOMS.NS",
    "name": "Sona BLW Precision Forgings"
  },
  {
    "symbol": "EXIDEIND.NS",
    "name": "Exide Industries"
  },
  {
    "symbol": "AMARAJABAT.NS",
    "name": "Amara Raja Energy & Mobility"
  },
  {
    "symbol": "POLYCAB.NS",
    "name": "Polycab India"
  },
  {
    "symbol": "KEI.NS",
    "name": "KEI Industries"
  },
  {
    "symbol": "VOLTAS.NS",
    "name": "Voltas"
  },
  {
    "symbol": "BLUESTARCO.NS",
    "name": "Blue Star"
  },
  {
    "symbol": "WHIRLPOOL.NS",
    "name": "Whirlpool of India"
  },
  {
    "symbol": "CROMPTON.NS",
    "name": "Crompton Greaves Consumer Electricals"
  },
  {
    "symbol": "DIXON.NS",
    "name": "Dixon Technologies"
  },
  {
    "symbol": "AMBER.NS",
    "name": "Amber Enterprises India"
  }
];
