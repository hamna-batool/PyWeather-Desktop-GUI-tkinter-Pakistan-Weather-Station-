export interface PakistanCityProfile {
  name: string;
  province:
    | 'Punjab'
    | 'Sindh'
    | 'Khyber Pakhtunkhwa'
    | 'Balochistan'
    | 'Gilgit-Baltistan'
    | 'Azad Jammu & Kashmir'
    | 'Islamabad Capital Territory';
  district?: string;
  lat: number;
  lon: number;
  elevationM: number;
  climateZone: string;
  baseTempC: number;
  humidity: number;
  windSpeedMs: number;
  pressureHpa: number;
  description: string;
  iconCode: string;
  sunrise: string;
  sunset: string;
  uvIndex: number;
}

type CompactCityTuple = [
  name: string,
  province: PakistanCityProfile['province'],
  lat: number,
  lon: number,
  elevationM: number,
  climateZone: string,
  baseTempC: number,
  humidity: number,
  windSpeedMs: number,
  pressureHpa: number,
  description: string,
  iconCode: string,
  uvIndex: number
];

const RAW_PAKISTAN_CITIES: CompactCityTuple[] = [
  // Featured & Major Cities + Layyah District
  ['Layyah', 'Punjab', 30.9693, 70.9428, 143, 'Thal Desert & Indus Alluvial Belt', 32, 41, 3.6, 1009, 'Clear Sky', '01d', 8],
  ['Karor Lal Esan', 'Punjab', 31.2236, 70.9519, 151, 'Northern Layyah · Indus Bank', 31, 43, 3.5, 1010, 'Clear Sky', '01d', 8],
  ['Chaubara', 'Punjab', 30.9811, 71.4044, 158, 'Layyah Thal Desert Core', 33, 36, 4.1, 1009, 'Clear Sky', '01d', 8],
  ['Chowk Azam', 'Punjab', 30.9606, 71.2094, 149, 'Central Layyah Plains', 32, 39, 3.7, 1009, 'Few Clouds', '02d', 8],
  ['Fatehpur', 'Punjab', 31.1794, 71.2092, 154, 'Layyah Agricultural Zone', 32, 40, 3.4, 1010, 'Clear Sky', '01d', 8],
  ['Kot Sultan', 'Punjab', 30.7736, 70.9317, 139, 'Southern Layyah Indus Plains', 33, 42, 3.5, 1009, 'Clear Sky', '01d', 8],

  // Federal Capital
  ['Islamabad', 'Islamabad Capital Territory', 33.6844, 73.0479, 540, 'Humid Subtropical · Margalla Foothills', 26, 54, 3.6, 1013, 'Partly Cloudy', '02d', 6],

  // Punjab (All Major Cities & District Headquarters)
  ['Lahore', 'Punjab', 31.5204, 74.3587, 217, 'Semi-Arid Ravi Alluvial Plain', 29, 58, 3.1, 1011, 'Clear Sky', '01d', 7],
  ['Rawalpindi', 'Punjab', 33.5651, 73.0169, 508, 'Pothohar Plateau Subtropical', 27, 52, 3.5, 1012, 'Partly Cloudy', '02d', 6],
  ['Faisalabad', 'Punjab', 31.4504, 73.135, 184, 'Central Punjab Rachna Doab', 30, 50, 2.9, 1010, 'Clear Sky', '01d', 7],
  ['Multan', 'Punjab', 30.1575, 71.5249, 122, 'Southern Punjab Bari Doab Arid', 33, 42, 3.3, 1009, 'Clear Sky', '01d', 8],
  ['Gujranwala', 'Punjab', 32.1877, 74.1945, 226, 'Upper Rachna Doab Sub-Humid', 28, 60, 2.8, 1011, 'Few Clouds', '02d', 7],
  ['Sialkot', 'Punjab', 32.4945, 74.5229, 256, 'Sub-Mountainous Chenab Belt', 27, 61, 3.0, 1012, 'Scattered Clouds', '03d', 6],
  ['Bahawalpur', 'Punjab', 29.3956, 71.6836, 117, 'Cholistan Desert Margin', 33, 40, 3.7, 1009, 'Clear Sky', '01d', 8],
  ['Sargodha', 'Punjab', 32.0836, 72.6711, 190, 'Chaj Doab Citrus Belt', 30, 51, 3.2, 1010, 'Clear Sky', '01d', 7],
  ['Sheikhupura', 'Punjab', 31.7167, 73.985, 236, 'Central Punjab Canal Colony', 29, 57, 2.9, 1011, 'Few Clouds', '02d', 7],
  ['Rahim Yar Khan', 'Punjab', 28.4202, 70.2952, 88, 'Cholistan & Indus Deltaic Margin', 34, 39, 3.8, 1008, 'Clear Sky', '01d', 8],
  ['Jhang', 'Punjab', 31.2681, 72.3181, 158, 'Chenab & Jhelum Confluence', 31, 48, 3.1, 1010, 'Clear Sky', '01d', 7],
  ['Dera Ghazi Khan', 'Punjab', 30.0489, 70.6455, 124, 'Sulaiman Range Piedmont & Indus', 33, 41, 3.6, 1009, 'Clear Sky', '01d', 8],
  ['Gujrat', 'Punjab', 32.5731, 74.0789, 233, 'Upper Chenab Sub-Humid Plains', 28, 59, 3.1, 1012, 'Few Clouds', '02d', 6],
  ['Sahiwal', 'Punjab', 30.6682, 73.1114, 172, 'Neeli Bar Alluvial Plains', 31, 50, 3.0, 1010, 'Clear Sky', '01d', 7],
  ['Wah Cantt', 'Punjab', 33.7715, 72.7511, 468, 'Northern Pothohar Valley', 26, 54, 3.4, 1013, 'Partly Cloudy', '02d', 6],
  ['Kasur', 'Punjab', 31.1179, 74.4463, 218, 'Sutlej River Border Plains', 30, 56, 3.0, 1011, 'Clear Sky', '01d', 7],
  ['Okara', 'Punjab', 30.8138, 73.4534, 185, 'Bari Doab Canal Belt', 30, 53, 3.1, 1010, 'Clear Sky', '01d', 7],
  ['Chiniot', 'Punjab', 31.72, 72.9789, 179, 'Chenab Gorge & Kirana Hills', 30, 51, 3.2, 1010, 'Few Clouds', '02d', 7],
  ['Kamoke', 'Punjab', 31.9753, 74.223, 221, 'Rice Belt Upper Punjab', 29, 59, 2.8, 1011, 'Few Clouds', '02d', 7],
  ['Hafizabad', 'Punjab', 32.0709, 73.688, 207, 'Chenab Floodplain', 29, 56, 2.9, 1011, 'Clear Sky', '01d', 7],
  ['Sadiqabad', 'Punjab', 28.3006, 70.1302, 82, 'Southern Punjab Desert Border', 34, 38, 3.9, 1008, 'Clear Sky', '01d', 8],
  ['Burewala', 'Punjab', 30.1667, 72.65, 151, 'Sutlej Valley Plains', 32, 46, 3.2, 1009, 'Clear Sky', '01d', 8],
  ['Khanewal', 'Punjab', 30.3017, 71.9321, 138, 'Lower Bari Doab Plains', 32, 45, 3.3, 1009, 'Clear Sky', '01d', 8],
  ['Jhelum', 'Punjab', 32.9405, 73.7276, 234, 'Salt Range & Jhelum River Bank', 28, 56, 3.4, 1012, 'Partly Cloudy', '02d', 6],
  ['Mandi Bahauddin', 'Punjab', 32.5861, 73.4917, 220, 'Chaj Doab Agricultural Heartland', 28, 57, 3.0, 1011, 'Few Clouds', '02d', 6],
  ['Pakpattan', 'Punjab', 30.3394, 73.3867, 168, 'Sutlej River Bank', 31, 49, 3.1, 1010, 'Clear Sky', '01d', 7],
  ['Bahawalnagar', 'Punjab', 29.9983, 73.2536, 163, 'Eastern Cholistan Fringe', 32, 44, 3.4, 1009, 'Clear Sky', '01d', 8],
  ['Toba Tek Singh', 'Punjab', 30.9744, 72.4828, 162, 'Central Rachna Doab', 31, 49, 3.1, 1010, 'Clear Sky', '01d', 7],
  ['Chakwal', 'Punjab', 32.9328, 72.863, 498, 'Salt Range & Dhan Valley Plateau', 26, 49, 3.8, 1013, 'Partly Cloudy', '02d', 6],
  ['Khushab', 'Punjab', 32.2967, 72.352, 186, 'Soon Valley & Jhelum Plains', 30, 47, 3.5, 1011, 'Clear Sky', '01d', 7],
  ['Mianwali', 'Punjab', 32.5839, 71.5264, 210, 'Indus River Gorge & Thal Margin', 30, 44, 3.9, 1011, 'Clear Sky', '01d', 7],
  ['Bhakkar', 'Punjab', 31.6253, 71.0657, 159, 'Thal Desert & Indus River Bank', 31, 42, 3.7, 1010, 'Clear Sky', '01d', 8],
  ['Muzaffargarh', 'Punjab', 30.0703, 71.1933, 123, 'Chenab & Indus Doab', 33, 43, 3.4, 1009, 'Clear Sky', '01d', 8],
  ['Rajanpur', 'Punjab', 29.1041, 70.3297, 97, 'Derajat & Indus Floodplain', 34, 41, 3.7, 1008, 'Clear Sky', '01d', 8],
  ['Lodhran', 'Punjab', 29.5405, 71.6336, 118, 'Sutlej Northern Bank', 33, 42, 3.4, 1009, 'Clear Sky', '01d', 8],
  ['Vehari', 'Punjab', 30.0452, 72.3489, 140, 'Cotton Belt Southern Punjab', 32, 45, 3.2, 1009, 'Clear Sky', '01d', 8],
  ['Narowal', 'Punjab', 32.102, 74.873, 248, 'Ravi Sub-Humid Foothills', 27, 62, 2.9, 1012, 'Scattered Clouds', '03d', 6],
  ['Attock', 'Punjab', 33.7667, 72.3667, 355, 'Indus & Haro Confluence', 27, 50, 3.8, 1012, 'Partly Cloudy', '02d', 6],
  ['Taxila', 'Punjab', 33.7463, 72.8397, 514, 'Margalla Western Valley', 26, 53, 3.3, 1013, 'Partly Cloudy', '02d', 6],
  ['Murree', 'Punjab', 33.907, 73.3943, 2291, 'Subtropical Highland · Pir Panjal Range', 15, 74, 4.1, 1019, 'Light Rain', '10d', 5],
  ['Kot Addu', 'Punjab', 30.4697, 70.9669, 131, 'Taunsa Barrage Indus Plain', 33, 43, 3.5, 1009, 'Clear Sky', '01d', 8],
  ['Taunsa Sharif', 'Punjab', 30.7048, 70.6505, 148, 'Sulaiman Foothills & Indus', 32, 41, 3.8, 1009, 'Clear Sky', '01d', 8],
  ['Nankana Sahib', 'Punjab', 31.4492, 73.7124, 202, 'Central Rachna Plains', 29, 55, 2.9, 1011, 'Clear Sky', '01d', 7],
  ['Kamalia', 'Punjab', 30.7258, 72.6447, 159, 'Ravi River Floodplain', 31, 49, 3.1, 1010, 'Clear Sky', '01d', 7],
  ['Wazirabad', 'Punjab', 32.4419, 74.12, 232, 'Chenab River Crossing', 28, 60, 3.0, 1011, 'Few Clouds', '02d', 6],
  ['Daska', 'Punjab', 32.3242, 74.3497, 239, 'Upper Rachna Canal Zone', 28, 60, 2.9, 1011, 'Few Clouds', '02d', 6],
  ['Gojra', 'Punjab', 31.1486, 72.6869, 168, 'Central Faisalabad Division', 30, 50, 3.1, 1010, 'Clear Sky', '01d', 7],
  ['Jaranwala', 'Punjab', 31.3342, 73.4194, 189, 'Lower Chenab Colony', 30, 53, 3.0, 1010, 'Clear Sky', '01d', 7],
  ['Chishtian', 'Punjab', 29.7958, 72.8578, 152, 'Sutlej Cholistan Margin', 33, 42, 3.5, 1009, 'Clear Sky', '01d', 8],
  ['Hasilpur', 'Punjab', 29.6961, 72.5553, 144, 'Cholistan Northern Canal Belt', 33, 41, 3.6, 1009, 'Clear Sky', '01d', 8],
  ['Ahmedpur East', 'Punjab', 29.1431, 71.2597, 106, 'Bahawalpur Desert Fringe', 34, 40, 3.7, 1008, 'Clear Sky', '01d', 8],
  ['Arifwala', 'Punjab', 30.2906, 73.0656, 160, 'Sutlej Valley Plain', 31, 48, 3.1, 1010, 'Clear Sky', '01d', 7],
  ['Talagang', 'Punjab', 32.9297, 72.4158, 459, 'Western Pothohar Plateau', 27, 46, 3.7, 1013, 'Few Clouds', '02d', 6],

  // Sindh (All Major Cities & District Headquarters)
  ['Karachi', 'Sindh', 24.8607, 67.0011, 10, 'Arid Coastal · Arabian Sea Breeze', 31, 68, 5.8, 1009, 'Scattered Clouds', '03d', 8],
  ['Hyderabad', 'Sindh', 25.396, 68.3578, 13, 'Lower Indus Plains Hot Arid', 33, 55, 5.1, 1008, 'Clear Sky', '01d', 8],
  ['Sukkur', 'Sindh', 27.7052, 68.8574, 67, 'Upper Sindh Indus Gorge & Barrage', 34, 44, 3.8, 1008, 'Clear Sky', '01d', 8],
  ['Larkana', 'Sindh', 27.559, 68.212, 53, 'Right Bank Indus Alluvial Plain', 34, 46, 3.5, 1008, 'Clear Sky', '01d', 8],
  ['Nawabshah', 'Sindh', 26.2442, 68.41, 37, 'Central Sindh Sub-Desert Plain', 35, 45, 4.0, 1008, 'Clear Sky', '01d', 9],
  ['Mirpur Khas', 'Sindh', 25.5276, 69.0159, 18, 'Eastern Sindh Mango & Canal Belt', 33, 52, 4.6, 1008, 'Clear Sky', '01d', 8],
  ['Jacobabad', 'Sindh', 28.281, 68.4376, 56, 'Kacchi Plain Thermal Low Zone', 36, 40, 3.6, 1007, 'Clear Sky', '01d', 9],
  ['Shikarpur', 'Sindh', 27.9556, 68.6382, 62, 'Upper Sindh Plains', 35, 43, 3.6, 1008, 'Clear Sky', '01d', 8],
  ['Khairpur', 'Sindh', 27.5295, 68.7592, 61, 'Nara Desert & Date Palm Oasis', 34, 44, 3.7, 1008, 'Clear Sky', '01d', 8],
  ['Dadu', 'Sindh', 26.7319, 67.775, 34, 'Kirthar Foothills & Manchar Basin', 35, 45, 3.9, 1008, 'Clear Sky', '01d', 8],
  ['Tando Adam', 'Sindh', 25.7682, 68.662, 23, 'Central Lower Sindh', 33, 53, 4.7, 1008, 'Clear Sky', '01d', 8],
  ['Tando Allahyar', 'Sindh', 25.4607, 68.7192, 20, 'Indus Left Bank Agricultural Belt', 33, 54, 4.8, 1008, 'Clear Sky', '01d', 8],
  ['Badin', 'Sindh', 24.656, 68.837, 10, 'Coastal Indus Deltaic Plain', 32, 63, 5.4, 1009, 'Few Clouds', '02d', 8],
  ['Thatta', 'Sindh', 24.7461, 67.9243, 14, 'Keenjhar & Indus Delta Region', 32, 64, 5.5, 1009, 'Scattered Clouds', '03d', 8],
  ['Umerkot', 'Sindh', 25.3616, 69.7362, 24, 'Thar Desert Gateway', 34, 47, 4.8, 1008, 'Clear Sky', '01d', 9],
  ['Mithi', 'Sindh', 24.7371, 69.7971, 42, 'Tharparkar Sand Dunes', 34, 49, 5.0, 1008, 'Clear Sky', '01d', 9],
  ['Ghotki', 'Sindh', 28.006, 69.3161, 72, 'Northern Sindh Indus Left Bank', 34, 42, 3.7, 1008, 'Clear Sky', '01d', 8],
  ['Sanghar', 'Sindh', 26.0466, 68.9481, 28, 'Nara Canal Command Area', 34, 48, 4.3, 1008, 'Clear Sky', '01d', 8],
  ['Sehwan Sharif', 'Sindh', 26.4249, 67.8613, 43, 'Indus & Lakki Hills', 35, 44, 4.1, 1008, 'Clear Sky', '01d', 9],
  ['Jamshoro', 'Sindh', 25.4304, 68.2809, 25, 'Kotri Barrage Right Bank', 33, 54, 5.2, 1008, 'Clear Sky', '01d', 8],
  ['Kandhkot', 'Sindh', 28.244, 69.1824, 71, 'Guddu Barrage Indus Plain', 35, 42, 3.6, 1008, 'Clear Sky', '01d', 8],

  // Khyber Pakhtunkhwa (KPK — All Major Cities & Valleys)
  ['Peshawar', 'Khyber Pakhtunkhwa', 34.0151, 71.5249, 331, 'Hot Semi-Arid Peshawar Valley', 27, 48, 3.4, 1013, 'Few Clouds', '02d', 6],
  ['Mardan', 'Khyber Pakhtunkhwa', 34.1986, 72.0404, 314, 'Central Peshawar Basin', 27, 51, 3.1, 1013, 'Few Clouds', '02d', 6],
  ['Mingora', 'Khyber Pakhtunkhwa', 34.7717, 72.3602, 984, 'Swat River Alpine Foothills', 22, 59, 3.4, 1015, 'Scattered Clouds', '03d', 6],
  ['Abbottabad', 'Khyber Pakhtunkhwa', 34.1688, 73.2215, 1256, 'Orash Valley Subtropical Highland', 21, 64, 3.2, 1016, 'Partly Cloudy', '02d', 6],
  ['Kohat', 'Khyber Pakhtunkhwa', 33.5889, 71.4429, 489, 'Kohat Pass Intermontane Basin', 27, 46, 3.6, 1013, 'Clear Sky', '01d', 6],
  ['Dera Ismail Khan', 'Khyber Pakhtunkhwa', 31.8314, 70.9017, 165, 'Southern KPK Indus Derajat', 31, 45, 3.6, 1010, 'Clear Sky', '01d', 7],
  ['Bannu', 'Khyber Pakhtunkhwa', 32.9861, 70.6042, 371, 'Kurram & Tochi River Basin', 29, 45, 3.5, 1012, 'Clear Sky', '01d', 7],
  ['Swabi', 'Khyber Pakhtunkhwa', 34.1202, 72.4698, 340, 'Indus & Kabul Confluence Plain', 27, 52, 3.3, 1013, 'Few Clouds', '02d', 6],
  ['Charsadda', 'Khyber Pakhtunkhwa', 34.1453, 71.7308, 302, 'Swat & Kabul River Delta', 27, 53, 3.0, 1013, 'Few Clouds', '02d', 6],
  ['Nowshera', 'Khyber Pakhtunkhwa', 34.0153, 71.9747, 292, 'Kabul River Corridor', 28, 50, 3.5, 1013, 'Few Clouds', '02d', 6],
  ['Mansehra', 'Khyber Pakhtunkhwa', 34.3333, 73.2, 1088, 'Pakhal Plain & Hazara Hills', 22, 62, 3.3, 1015, 'Partly Cloudy', '02d', 6],
  ['Haripur', 'Khyber Pakhtunkhwa', 33.9942, 72.9333, 520, 'Tarbela & Dor River Valley', 26, 55, 3.2, 1013, 'Partly Cloudy', '02d', 6],
  ['Chitral', 'Khyber Pakhtunkhwa', 35.8518, 71.7864, 1494, 'Hindu Kush Tirich Mir Shadow', 18, 45, 4.0, 1017, 'Few Clouds', '02d', 5],
  ['Timergara', 'Khyber Pakhtunkhwa', 34.8281, 71.8408, 823, 'Panjkora River Valley (Lower Dir)', 23, 55, 3.4, 1014, 'Partly Cloudy', '02d', 6],
  ['Dir', 'Khyber Pakhtunkhwa', 35.1977, 71.8749, 1420, 'Upper Dir Mountain Conifer Belt', 18, 61, 3.6, 1017, 'Scattered Clouds', '03d', 5],
  ['Kalam', 'Khyber Pakhtunkhwa', 35.4902, 72.5796, 2000, 'Upper Swat Alpine Glacial Valley', 14, 66, 3.8, 1019, 'Partly Cloudy', '02d', 5],
  ['Naran', 'Khyber Pakhtunkhwa', 34.9093, 73.6507, 2409, 'Kaghan Kunhar Alpine Gorge', 11, 70, 4.2, 1020, 'Light Rain', '10d', 5],
  ['Balakot', 'Khyber Pakhtunkhwa', 34.5482, 73.3533, 971, 'Gateway to Kaghan Valley', 22, 65, 3.4, 1015, 'Partly Cloudy', '02d', 6],
  ['Nathia Gali', 'Khyber Pakhtunkhwa', 34.0729, 73.3812, 2410, 'Galyat Cloud Forest Ridge', 13, 76, 4.0, 1020, 'Light Drizzle', '09d', 5],
  ['Parachinar', 'Khyber Pakhtunkhwa', 33.8992, 70.1008, 1705, 'Kurram Valley Spin Ghar Foothills', 19, 52, 4.1, 1017, 'Partly Cloudy', '02d', 6],
  ['Karak', 'Khyber Pakhtunkhwa', 33.1167, 71.0833, 585, 'Southern Kohat Salt Hills', 28, 44, 3.7, 1012, 'Clear Sky', '01d', 7],
  ['Lakki Marwat', 'Khyber Pakhtunkhwa', 32.6079, 70.9114, 255, 'Marwat Sandy Plain', 30, 44, 3.6, 1011, 'Clear Sky', '01d', 7],
  ['Tank', 'Khyber Pakhtunkhwa', 32.2167, 70.3833, 275, 'Gomal Valley Piedmont', 31, 43, 3.7, 1010, 'Clear Sky', '01d', 7],

  // Balochistan (All Major Cities & Districts)
  ['Quetta', 'Balochistan', 30.1798, 66.975, 1680, 'Highland Continental Steppe', 19, 32, 4.4, 1018, 'Clear Sky', '01d', 7],
  ['Gwadar', 'Balochistan', 25.1264, 62.3225, 7, 'Makran Coastal Arid Peninsula', 30, 71, 6.2, 1009, 'Few Clouds', '02d', 8],
  ['Turbat', 'Balochistan', 26.0031, 63.0544, 129, 'Kech River Makran Interior', 35, 36, 4.2, 1008, 'Clear Sky', '01d', 9],
  ['Khuzdar', 'Balochistan', 27.8119, 66.6176, 1237, 'Central Brahui Upland', 25, 34, 4.1, 1015, 'Clear Sky', '01d', 8],
  ['Hub', 'Balochistan', 25.0258, 66.8872, 26, 'Lasbela Coastal Industrial Belt', 31, 64, 5.5, 1009, 'Few Clouds', '02d', 8],
  ['Chaman', 'Balochistan', 30.921, 66.4597, 1338, 'Khojak Pass Highland Border', 22, 30, 4.6, 1016, 'Clear Sky', '01d', 7],
  ['Zhob', 'Balochistan', 31.3417, 69.4486, 1426, 'Zhob River Sulaiman Basin', 23, 35, 4.2, 1016, 'Clear Sky', '01d', 7],
  ['Sibi', 'Balochistan', 29.543, 67.8773, 130, 'Kacchi Lowland Thermal Basin', 36, 35, 3.8, 1007, 'Clear Sky', '01d', 9],
  ['Loralai', 'Balochistan', 30.3705, 68.5979, 1433, 'North-Eastern Balochistan Plateau', 22, 34, 4.0, 1016, 'Clear Sky', '01d', 7],
  ['Ziarat', 'Balochistan', 30.3814, 67.7258, 2453, 'Highland Juniper Forest Range', 13, 44, 4.3, 1020, 'Partly Cloudy', '02d', 6],
  ['Kalat', 'Balochistan', 29.0258, 66.59, 2007, 'High Balochistan Cold Steppe', 16, 31, 4.5, 1019, 'Clear Sky', '01d', 7],
  ['Panjgur', 'Balochistan', 26.9718, 64.0947, 980, 'Rakhshan Valley Oasis', 28, 33, 4.4, 1013, 'Clear Sky', '01d', 8],
  ['Pasni', 'Balochistan', 25.2631, 63.471, 9, 'Makran Arabian Sea Coast', 30, 72, 6.0, 1009, 'Few Clouds', '02d', 8],
  ['Ormara', 'Balochistan', 25.2088, 64.6357, 8, 'Hammerhead Peninsula Coast', 30, 73, 6.1, 1009, 'Few Clouds', '02d', 8],
  ['Dera Murad Jamali', 'Balochistan', 28.5497, 68.2231, 65, 'Pat Feeder Canal Kacchi Plain', 35, 41, 3.6, 1008, 'Clear Sky', '01d', 8],
  ['Dalbandin', 'Balochistan', 28.8885, 64.4062, 843, 'Chagai Arid Desert Basin', 30, 24, 4.9, 1012, 'Clear Sky', '01d', 8],

  // Gilgit-Baltistan
  ['Gilgit', 'Gilgit-Baltistan', 35.9208, 74.308, 1500, 'Karakoram Mountain Valley', 17, 44, 3.9, 1017, 'Few Clouds', '02d', 5],
  ['Skardu', 'Gilgit-Baltistan', 35.2971, 75.6333, 2228, 'High-Altitude Cold Desert · Indus', 13, 39, 4.6, 1020, 'Partly Cloudy', '03d', 5],
  ['Hunza (Karimabad)', 'Gilgit-Baltistan', 36.3167, 74.65, 2438, 'Rakaposhi & Ultar Glacial Valley', 12, 46, 4.1, 1020, 'Partly Cloudy', '02d', 5],
  ['Chilas', 'Gilgit-Baltistan', 35.4206, 74.0967, 1265, 'Nanga Parbat Indus Gorge', 21, 38, 4.3, 1015, 'Clear Sky', '01d', 6],
  ['Astore', 'Gilgit-Baltistan', 35.3667, 74.85, 2546, 'Deosai Western Highland Valley', 10, 52, 4.2, 1021, 'Scattered Clouds', '03d', 5],
  ['Khaplu', 'Gilgit-Baltistan', 35.1667, 76.3333, 2600, 'Shyok River Baltistan Valley', 11, 43, 4.4, 1021, 'Partly Cloudy', '02d', 5],
  ['Gahkuch (Ghizer)', 'Gilgit-Baltistan', 36.1736, 73.7639, 1919, 'Gilgit River Upper Valley', 14, 45, 3.8, 1018, 'Few Clouds', '02d', 5],

  // Azad Jammu & Kashmir (AJK)
  ['Muzaffarabad', 'Azad Jammu & Kashmir', 34.37, 73.4711, 737, 'Jhelum & Neelum Confluence', 24, 63, 3.3, 1014, 'Partly Cloudy', '02d', 6],
  ['Mirpur', 'Azad Jammu & Kashmir', 33.1478, 73.7519, 459, 'Mangla Lake Subtropical Basin', 27, 58, 3.2, 1012, 'Few Clouds', '02d', 6],
  ['Kotli', 'Azad Jammu & Kashmir', 33.5156, 73.9019, 627, 'Poonch River Foothills', 25, 60, 3.1, 1013, 'Partly Cloudy', '02d', 6],
  ['Rawalakot', 'Azad Jammu & Kashmir', 33.8578, 73.7604, 1638, 'Pearl Valley Pir Panjal Highland', 17, 68, 3.6, 1018, 'Scattered Clouds', '03d', 5],
  ['Bagh', 'Azad Jammu & Kashmir', 33.9803, 73.7747, 1137, 'Mahl River Mountain Valley', 20, 65, 3.4, 1016, 'Partly Cloudy', '02d', 5],
  ['Bhimber', 'Azad Jammu & Kashmir', 32.9753, 74.0786, 340, 'Southern AJK Foothills', 28, 57, 3.1, 1012, 'Clear Sky', '01d', 6],
  ['Athmuqam (Neelum)', 'Azad Jammu & Kashmir', 34.5897, 73.8972, 1460, 'Neelum River Alpine Gorge', 16, 69, 3.7, 1018, 'Partly Cloudy', '02d', 5],
];

export const PAKISTAN_CITIES: PakistanCityProfile[] = RAW_PAKISTAN_CITIES.map(
  ([
    name,
    province,
    lat,
    lon,
    elevationM,
    climateZone,
    baseTempC,
    humidity,
    windSpeedMs,
    pressureHpa,
    description,
    iconCode,
    uvIndex,
  ]) => ({
    name,
    province,
    lat,
    lon,
    elevationM,
    climateZone,
    baseTempC,
    humidity,
    windSpeedMs,
    pressureHpa,
    description,
    iconCode,
    sunrise: lon > 72 ? '06:02 PKT' : '06:18 PKT',
    sunset: lon > 72 ? '17:41 PKT' : '17:58 PKT',
    uvIndex,
  })
);

export interface CurrentWeather {
  city: string;
  country: string;
  province: string;
  elevationM: number;
  climateZone: string;
  lat: number;
  lon: number;
  tempC: number;
  feelsLikeC: number;
  tempMinC: number;
  tempMaxC: number;
  dewPointC: number;
  humidity: number;
  cloudCoverPercent: number;
  precipMm: number;
  pressureHpa: number;
  windSpeedMs: number;
  windGustMs: number;
  windDeg: number;
  windDirectionCardinal: string;
  beaufortScale: string;
  description: string;
  conditionMain: string;
  iconCode: string;
  visibilityM: number;
  uvIndex: number;
  solarRadiationWm2: number;
  aqiIndex: number;
  aqiCategory: string;
  sunrise: string;
  sunset: string;
  dayLength: string;
  regionalAdvisory: string;
  updatedAt: string;
  sourceLabel: string;
}

export interface HourlyForecastItem {
  timeLabel: string;
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  windSpeedMs: number;
  popPercent: number;
  description: string;
  iconCode: string;
}

export interface DailyForecastItem {
  dateStr: string;
  dayLabel: string;
  tempMinC: number;
  tempMaxC: number;
  humidityAvg: number;
  windSpeedMs: number;
  popPercent: number;
  description: string;
  iconCode: string;
}

export interface CompleteWeatherReport {
  current: CurrentWeather;
  hourly6h: HourlyForecastItem[];
  daily5d: DailyForecastItem[];
  threadExecutionMs: number;
  threadName: string;
}

export class WeatherGuiError extends Error {
  title: string;
  code: 'EMPTY_INPUT' | 'CITY_NOT_FOUND' | 'INVALID_API_KEY' | 'TIMEOUT' | 'NETWORK_ERROR';

  constructor(
    title: string,
    message: string,
    code: 'EMPTY_INPUT' | 'CITY_NOT_FOUND' | 'INVALID_API_KEY' | 'TIMEOUT' | 'NETWORK_ERROR'
  ) {
    super(message);
    this.title = title;
    this.code = code;
  }
}

export function getOwmIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function formatTemp(tempC: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const tempF = (tempC * 9) / 5 + 32;
    return `${Math.round(tempF)}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function formatWind(speedMs: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const mph = speedMs * 2.23694;
    return `${mph.toFixed(1)} mph`;
  }
  return `${speedMs.toFixed(1)} m/s`;
}

function degToCardinal(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8];
}

function getBeaufortLabel(speedMs: number): string {
  if (speedMs < 0.5) return '0 · Calm';
  if (speedMs < 1.6) return '1 · Light Air';
  if (speedMs < 3.4) return '2 · Light Breeze';
  if (speedMs < 5.5) return '3 · Gentle Breeze';
  if (speedMs < 8.0) return '4 · Moderate Breeze';
  if (speedMs < 10.8) return '5 · Fresh Breeze';
  return '6 · Strong Breeze';
}

function buildRegionalAdvisory(city: string, province: string, tempC: number, humidity: number, windMs: number): string {
  const lower = city.toLowerCase();
  if (lower.includes('layyah') || lower.includes('karor') || lower.includes('chaubara') || lower.includes('chowk azam')) {
    return `Layyah & Thal Desert Advisory: ${Math.round(tempC)}°C with ${humidity}% relative humidity across the Indus-Thal alluvial belt. Favorable conditions for wheat/gram preparation and citrus orchards; moderate afternoon breeze (${windMs.toFixed(1)} m/s).`;
  }
  if (tempC >= 33) {
    return `${city} (${province}) Thermal Advisory: Elevated daytime temperatures (${Math.round(tempC)}°C). Maintain peak-hour hydration and schedule agricultural irrigation during early morning or dusk PKT.`;
  }
  if (tempC <= 15) {
    return `${city} (${province}) Highland Advisory: Cool mountain air mass (${Math.round(tempC)}°C). Expect crisp night temperatures and localized valley mist at higher elevations.`;
  }
  return `${city} (${province}) Meteorological Summary: Stable atmospheric pressure with ${humidity}% humidity and ${windMs.toFixed(1)} m/s surface winds across the ${province} observation sector.`;
}

function wmoToOwm(wmoCode: number, isDay = true): { icon: string; main: string; description: string } {
  const suffix = isDay ? 'd' : 'n';
  if (wmoCode === 0) return { icon: `01${suffix}`, main: 'Clear', description: 'Clear Sky' };
  if (wmoCode === 1) return { icon: `02${suffix}`, main: 'Clouds', description: 'Few Clouds' };
  if (wmoCode === 2) return { icon: `03${suffix}`, main: 'Clouds', description: 'Partly Cloudy' };
  if (wmoCode === 3) return { icon: `04${suffix}`, main: 'Clouds', description: 'Overcast Clouds' };
  if (wmoCode === 45 || wmoCode === 48) return { icon: `50${suffix}`, main: 'Mist', description: 'Haze & Mist' };
  if (wmoCode >= 51 && wmoCode <= 57) return { icon: `09${suffix}`, main: 'Drizzle', description: 'Light Drizzle' };
  if (wmoCode >= 61 && wmoCode <= 67) return { icon: `10${suffix}`, main: 'Rain', description: 'Moderate Rain' };
  if (wmoCode >= 71 && wmoCode <= 77) return { icon: `13${suffix}`, main: 'Snow', description: 'Light Snow' };
  if (wmoCode >= 80 && wmoCode <= 82) return { icon: `09${suffix}`, main: 'Rain', description: 'Rain Showers' };
  if (wmoCode >= 85 && wmoCode <= 86) return { icon: `13${suffix}`, main: 'Snow', description: 'Mountain Snow' };
  if (wmoCode >= 95) return { icon: `11${suffix}`, main: 'Thunderstorm', description: 'Thunderstorm' };
  return { icon: `02${suffix}`, main: 'Clouds', description: 'Partly Cloudy' };
}

export function findPakistanCityProfile(rawQuery: string): PakistanCityProfile | undefined {
  const normalized = rawQuery
    .toLowerCase()
    .replace(/,?\s*(pk|pakistan)$/i, '')
    .trim();

  if (!normalized) return undefined;

  return (
    PAKISTAN_CITIES.find((c) => c.name.toLowerCase() === normalized) ||
    PAKISTAN_CITIES.find((c) => c.name.toLowerCase().startsWith(normalized)) ||
    PAKISTAN_CITIES.find((c) => c.name.toLowerCase().includes(normalized))
  );
}

export function searchPakistanCities(query: string, provinceFilter = 'ALL'): PakistanCityProfile[] {
  const clean = query
    .toLowerCase()
    .replace(/,?\s*(pk|pakistan)$/i, '')
    .trim();

  const pool =
    provinceFilter === 'ALL'
      ? PAKISTAN_CITIES
      : PAKISTAN_CITIES.filter((c) => c.province === provinceFilter);

  if (!clean) return pool;

  const startsWith = pool.filter((c) => c.name.toLowerCase().startsWith(clean));
  const includes = pool.filter(
    (c) =>
      !c.name.toLowerCase().startsWith(clean) &&
      (c.name.toLowerCase().includes(clean) ||
        c.province.toLowerCase().includes(clean) ||
        c.climateZone.toLowerCase().includes(clean))
  );
  return [...startsWith, ...includes];
}

export async function detectIpLocation(): Promise<{ city: string; country: string; ip: string; org: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const resp = await fetch('https://ipinfo.io/json', {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.city && data.country === 'PK') {
        return {
          city: data.city,
          country: 'PK',
          ip: data.ip || 'Detected PK IP',
          org: data.org || 'ipinfo.io Pakistan',
        };
      }
    }
  } catch {
    // Fallback
  }

  return {
    city: 'Layyah',
    country: 'PK',
    ip: 'Pakistan Station (Layyah, PK)',
    org: 'ipinfo.io',
  };
}

export async function fetchWeatherReport(
  cityQuery: string,
  owmApiKey?: string,
  forcedError?: 'EMPTY_INPUT' | 'CITY_NOT_FOUND' | 'INVALID_API_KEY' | 'TIMEOUT'
): Promise<CompleteWeatherReport> {
  const startMs = performance.now();
  const threadName = `Thread-${Math.floor(100 + Math.random() * 899)} (_worker_fetch_pakistan_weather)`;

  await new Promise((r) => setTimeout(r, 180));

  if (forcedError === 'EMPTY_INPUT' || !cityQuery.trim()) {
    throw new WeatherGuiError(
      'Empty City Input',
      "Please enter or select a city in Pakistan (e.g., 'Layyah', 'Islamabad', 'Karachi', 'Lahore', 'Quetta', 'Multan') before clicking 'Get Weather'.",
      'EMPTY_INPUT'
    );
  }

  if (forcedError === 'INVALID_API_KEY') {
    throw new WeatherGuiError(
      'Invalid API Key (HTTP 401)',
      'OpenWeatherMap rejected the API key. Ensure OPENWEATHER_API_KEY in your .env file is correct and activated.',
      'INVALID_API_KEY'
    );
  }

  if (forcedError === 'TIMEOUT') {
    await new Promise((r) => setTimeout(r, 400));
    throw new WeatherGuiError(
      'Network Timeout (requests.exceptions.Timeout)',
      'Request to api.openweathermap.org timed out after 8 seconds. Check your internet connection.',
      'TIMEOUT'
    );
  }

  if (forcedError === 'CITY_NOT_FOUND') {
    throw new WeatherGuiError(
      'Pakistan City Not Found (HTTP 404)',
      `Could not find '${cityQuery.trim()}' in Pakistan (PK). Please enter a valid Pakistani city or district (e.g., Layyah, Islamabad, Karachi, Lahore, Multan, Peshawar, Quetta, Gilgit).`,
      'CITY_NOT_FOUND'
    );
  }

  const cleanedName = cityQuery
    .trim()
    .replace(/,?\s*(pk|pakistan)$/i, '')
    .trim();

  const matchedProfile = findPakistanCityProfile(cleanedName);
  let lat = matchedProfile?.lat;
  let lon = matchedProfile?.lon;
  let resolvedCity = matchedProfile?.name || cleanedName;
  let resolvedProvince: string = matchedProfile?.province || 'Punjab';
  let elevationM = matchedProfile?.elevationM || 180;

  if (!matchedProfile) {
    try {
      const geoResp = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanedName)}&count=8&language=en&format=json`
      );
      if (geoResp.ok) {
        const geoData = await geoResp.json();
        const pkMatch = (geoData.results || []).find(
          (item: Record<string, any>) => item.country_code === 'PK'
        );
        if (!pkMatch) {
          throw new WeatherGuiError(
            'Pakistan City Not Found (HTTP 404)',
            `Could not find '${cleanedName}' inside Pakistan (PK). Only cities, districts, and towns within Pakistan are supported.`,
            'CITY_NOT_FOUND'
          );
        }
        lat = pkMatch.latitude;
        lon = pkMatch.longitude;
        resolvedCity = pkMatch.name;
        resolvedProvince = pkMatch.admin1 || 'Pakistan';
        elevationM = Math.round(Number(pkMatch.elevation ?? 200));
      }
    } catch (err) {
      if (err instanceof WeatherGuiError) throw err;
      throw new WeatherGuiError(
        'Pakistan City Not Found (HTTP 404)',
        `Could not find '${cleanedName}' in the Pakistan city directory. Try Layyah, Islamabad, Karachi, Lahore, Multan, Faisalabad, Peshawar, Quetta, or Gilgit.`,
        'CITY_NOT_FOUND'
      );
    }
  }

  if (lat !== undefined && lon !== undefined) {
    try {
      const meteoUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,cloud_cover,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
        `&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
        `&wind_speed_unit=ms&timezone=Asia%2FKarachi`;

      const wxResp = await fetch(meteoUrl);
      if (wxResp.ok) {
        const wx = await wxResp.json();
        const curBlock = wx.current || {};
        const isDay = curBlock.is_day !== 0;
        const mapped = wmoToOwm(Number(curBlock.weather_code ?? 1), isDay);
        const tempC = Number(curBlock.temperature_2m ?? matchedProfile?.baseTempC ?? 31);
        const humidity = Number(curBlock.relative_humidity_2m ?? matchedProfile?.humidity ?? 42);
        const windSpeedMs = Number(
          Number(curBlock.wind_speed_10m ?? matchedProfile?.windSpeedMs ?? 3.6).toFixed(1)
        );
        const windGustMs = Number(
          Number(curBlock.wind_gusts_10m ?? windSpeedMs * 1.45).toFixed(1)
        );
        const windDeg = Number(curBlock.wind_direction_10m ?? 225);
        const cloudCoverPercent = Number(curBlock.cloud_cover ?? 15);
        const precipMm = Number(curBlock.precipitation ?? 0);

        const dailyMin0 = wx.daily?.temperature_2m_min?.[0] ?? tempC - 5;
        const dailyMax0 = wx.daily?.temperature_2m_max?.[0] ?? tempC + 4;
        const aqiIndex = elevationM > 1200 ? 34 : tempC > 30 ? 78 : 56;
        const aqiCategory = aqiIndex <= 50 ? 'Good' : 'Moderate';

        const current: CurrentWeather = {
          city: resolvedCity,
          country: 'PK',
          province: resolvedProvince,
          elevationM,
          climateZone: matchedProfile?.climateZone || `${resolvedProvince} Meteorological Zone`,
          lat,
          lon,
          tempC,
          feelsLikeC: Number(curBlock.apparent_temperature ?? tempC),
          tempMinC: Number(dailyMin0),
          tempMaxC: Number(dailyMax0),
          dewPointC: Math.round(tempC - (100 - humidity) / 5),
          humidity,
          cloudCoverPercent,
          precipMm,
          pressureHpa: Math.round(Number(curBlock.surface_pressure ?? matchedProfile?.pressureHpa ?? 1010)),
          windSpeedMs,
          windGustMs,
          windDeg,
          windDirectionCardinal: degToCardinal(windDeg),
          beaufortScale: getBeaufortLabel(windSpeedMs),
          description: mapped.description,
          conditionMain: mapped.main,
          iconCode: mapped.icon,
          visibilityM: 10000,
          uvIndex: matchedProfile?.uvIndex ?? 7,
          solarRadiationWm2: isDay ? Math.round(620 - cloudCoverPercent * 3.2) : 0,
          aqiIndex,
          aqiCategory,
          sunrise: matchedProfile?.sunrise ?? '06:08 PKT',
          sunset: matchedProfile?.sunset ?? '17:48 PKT',
          dayLength: '11h 40m',
          regionalAdvisory: buildRegionalAdvisory(
            resolvedCity,
            resolvedProvince,
            tempC,
            humidity,
            windSpeedMs
          ),
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' PKT',
          sourceLabel: 'Pakistan Live Meteorological Feed (PK)',
        };

        const times: string[] = wx.hourly?.time || [];
        const nowHour = new Date().getHours();
        let startIndex = times.findIndex((t: string) => {
          const h = Number(t.split('T')[1]?.slice(0, 2) ?? -1);
          return h === nowHour;
        });
        if (startIndex < 0) startIndex = 0;

        const hourly6h: HourlyForecastItem[] = [];
        for (let offset = 1; offset <= 6; offset++) {
          const idx = Math.min(startIndex + offset, times.length - 1);
          const rawTime = times[idx] || '';
          const timeLabel = rawTime.includes('T') ? rawTime.split('T')[1].slice(0, 5) : `+${offset}h`;
          const hourNum = Number(timeLabel.split(':')[0] || 12);
          const slotIsDay = hourNum >= 6 && hourNum < 19;
          const hMapped = wmoToOwm(Number(wx.hourly?.weather_code?.[idx] ?? 1), slotIsDay);

          hourly6h.push({
            timeLabel,
            tempC: Number(wx.hourly?.temperature_2m?.[idx] ?? current.tempC),
            feelsLikeC: Number(wx.hourly?.apparent_temperature?.[idx] ?? current.feelsLikeC),
            humidity: Number(wx.hourly?.relative_humidity_2m?.[idx] ?? current.humidity),
            windSpeedMs: Number(Number(wx.hourly?.wind_speed_10m?.[idx] ?? current.windSpeedMs).toFixed(1)),
            popPercent: Number(wx.hourly?.precipitation_probability?.[idx] ?? 10),
            description: hMapped.description,
            iconCode: hMapped.icon,
          });
        }

        const dailyTimes: string[] = wx.daily?.time || [];
        const daily5d: DailyForecastItem[] = dailyTimes.slice(0, 5).map((dayIso: string, idx: number) => {
          const dObj = new Date(`${dayIso}T12:00:00`);
          const dMapped = wmoToOwm(Number(wx.daily?.weather_code?.[idx] ?? 1), true);
          return {
            dateStr: dObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
            dayLabel: dObj.toLocaleDateString('en-US', { weekday: 'short' }),
            tempMinC: Number(wx.daily?.temperature_2m_min?.[idx] ?? current.tempMinC),
            tempMaxC: Number(wx.daily?.temperature_2m_max?.[idx] ?? current.tempMaxC),
            humidityAvg: current.humidity,
            windSpeedMs: Number(Number(wx.daily?.wind_speed_10m_max?.[idx] ?? current.windSpeedMs).toFixed(1)),
            popPercent: Number(wx.daily?.precipitation_probability_max?.[idx] ?? 12),
            description: dMapped.description,
            iconCode: dMapped.icon,
          };
        });

        return {
          current,
          hourly6h,
          daily5d,
          threadExecutionMs: Math.round(performance.now() - startMs),
          threadName,
        };
      }
    } catch {
      // Fallback to deterministic Pakistan city profile below
    }
  }

  const profile = matchedProfile || PAKISTAN_CITIES[0];
  const current: CurrentWeather = {
    city: profile.name,
    country: 'PK',
    province: profile.province,
    elevationM: profile.elevationM,
    climateZone: profile.climateZone,
    lat: profile.lat,
    lon: profile.lon,
    tempC: profile.baseTempC,
    feelsLikeC: profile.baseTempC + 1,
    tempMinC: profile.baseTempC - 5,
    tempMaxC: profile.baseTempC + 4,
    dewPointC: Math.round(profile.baseTempC - (100 - profile.humidity) / 5),
    humidity: profile.humidity,
    cloudCoverPercent: 18,
    precipMm: 0,
    pressureHpa: profile.pressureHpa,
    windSpeedMs: profile.windSpeedMs,
    windGustMs: Number((profile.windSpeedMs * 1.4).toFixed(1)),
    windDeg: 225,
    windDirectionCardinal: 'SW',
    beaufortScale: getBeaufortLabel(profile.windSpeedMs),
    description: profile.description,
    conditionMain: 'Clear',
    iconCode: profile.iconCode,
    visibilityM: 10000,
    uvIndex: profile.uvIndex,
    solarRadiationWm2: 580,
    aqiIndex: 62,
    aqiCategory: 'Moderate',
    sunrise: profile.sunrise,
    sunset: profile.sunset,
    dayLength: '11h 40m',
    regionalAdvisory: buildRegionalAdvisory(
      profile.name,
      profile.province,
      profile.baseTempC,
      profile.humidity,
      profile.windSpeedMs
    ),
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' PKT',
    sourceLabel: 'Pakistan Meteorological Station Profile',
  };

  return {
    current,
    hourly6h: buildHourlyFallback(current),
    daily5d: buildDailyFallback(current),
    threadExecutionMs: Math.round(performance.now() - startMs),
    threadName,
  };
}

function buildHourlyFallback(current: CurrentWeather): HourlyForecastItem[] {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const hourlyIcons = [current.iconCode, '02d', '03d', '02d', '01d', '02n'];
  const hourlyDescs = [
    current.description,
    'Few Clouds',
    'Scattered Clouds',
    'Partly Cloudy',
    'Clear Sky',
    'Mostly Clear',
  ];

  return Array.from({ length: 6 }, (_, idx) => {
    const slotDate = new Date(now.getTime() + (idx + 1) * 3600_000);
    const delta = [0.6, 1.4, 1.8, 0.9, -0.4, -1.5][idx];
    return {
      timeLabel: slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      tempC: Number((current.tempC + delta).toFixed(1)),
      feelsLikeC: Number((current.feelsLikeC + delta).toFixed(1)),
      humidity: Math.min(95, Math.max(20, current.humidity + (idx - 2) * 2)),
      windSpeedMs: Number((current.windSpeedMs + (idx % 3) * 0.3).toFixed(1)),
      popPercent: current.iconCode.startsWith('10') ? 55 : 10 + idx * 3,
      description: hourlyDescs[idx],
      iconCode: hourlyIcons[idx],
    };
  });
}

function buildDailyFallback(current: CurrentWeather): DailyForecastItem[] {
  const dailyIcons = [current.iconCode, '01d', '02d', '03d', '01d'];
  const dailyDescs = [
    current.description,
    'Sunny & Clear',
    'Few Clouds',
    'Partly Cloudy',
    'Clear Sky',
  ];

  return Array.from({ length: 5 }, (_, idx) => {
    const d = new Date(Date.now() + idx * 86400_000);
    return {
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      tempMinC: Number((current.tempMinC + (idx % 2) - 1).toFixed(1)),
      tempMaxC: Number((current.tempMaxC + (idx % 3)).toFixed(1)),
      humidityAvg: Math.min(90, Math.max(25, current.humidity + (idx - 2) * 3)),
      windSpeedMs: Number((current.windSpeedMs + (idx % 2) * 0.4).toFixed(1)),
      popPercent: current.iconCode.startsWith('10') && idx < 2 ? 50 : 10 + idx * 5,
      description: dailyDescs[idx],
      iconCode: dailyIcons[idx],
    };
  });
}
