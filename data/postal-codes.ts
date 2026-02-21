export interface PostalCode {
  city: string
  postalCode: string
  region: string
  latitude: number
  longitude: number
}

export const SOMALI_POSTAL_CODES: PostalCode[] = [
  // Mogadishu
  { city: 'Mogadishu', postalCode: '1001', region: 'Banaadir', latitude: 2.0469, longitude: 45.3182 },
  { city: 'Mogadishu', postalCode: '1002', region: 'Banaadir', latitude: 2.0469, longitude: 45.3182 },
  { city: 'Mogadishu', postalCode: '1003', region: 'Banaadir', latitude: 2.0469, longitude: 45.3182 },
  { city: 'Mogadishu', postalCode: '1004', region: 'Banaadir', latitude: 2.0469, longitude: 45.3182 },
  { city: 'Mogadishu', postalCode: '1005', region: 'Banaadir', latitude: 2.0469, longitude: 45.3182 },

  // Hargeisa - Somaliland
  { city: 'Hargeisa', postalCode: '2001', region: 'Woqooyi Galbeed', latitude: 9.561, longitude: 44.4005 },
  { city: 'Hargeisa', postalCode: '2002', region: 'Woqooyi Galbeed', latitude: 9.561, longitude: 44.4005 },
  { city: 'Hargeisa', postalCode: '2003', region: 'Woqooyi Galbeed', latitude: 9.561, longitude: 44.4005 },

  // Bosaso - Puntland
  { city: 'Bosaso', postalCode: '3001', region: 'Bari', latitude: 11.2842, longitude: 49.1844 },
  { city: 'Bosaso', postalCode: '3002', region: 'Bari', latitude: 11.2842, longitude: 49.1844 },
  { city: 'Bosaso', postalCode: '3003', region: 'Bari', latitude: 11.2842, longitude: 49.1844 },

  // Kismayo
  { city: 'Kismayo', postalCode: '4001', region: 'Lower Juba', latitude: -0.4185, longitude: 42.5431 },
  { city: 'Kismayo', postalCode: '4002', region: 'Lower Juba', latitude: -0.4185, longitude: 42.5431 },

  // Baladweyne
  { city: 'Baladweyne', postalCode: '5001', region: 'Hiran', latitude: 3.6521, longitude: 46.2048 },
  { city: 'Baladweyne', postalCode: '5002', region: 'Hiran', latitude: 3.6521, longitude: 46.2048 },

  // Beledweyne
  { city: 'Beledweyne', postalCode: '6001', region: 'Hiiraan', latitude: 4.7295, longitude: 45.4048 },
  { city: 'Beledweyne', postalCode: '6002', region: 'Hiiraan', latitude: 4.7295, longitude: 45.4048 },

  // Galkayo
  { city: 'Galkayo', postalCode: '7001', region: 'Mudug', latitude: 6.7719, longitude: 46.9250 },
  { city: 'Galkayo', postalCode: '7002', region: 'Mudug', latitude: 6.7719, longitude: 46.9250 },

  // Jowhar
  { city: 'Jowhar', postalCode: '8001', region: 'Middle Shabelle', latitude: 2.7808, longitude: 45.5021 },
  { city: 'Jowhar', postalCode: '8002', region: 'Middle Shabelle', latitude: 2.7808, longitude: 45.5021 },

  // Kismayo Additional
  { city: 'Kismayo', postalCode: '4003', region: 'Lower Juba', latitude: -0.4185, longitude: 42.5431 },

  // Merca
  { city: 'Merca', postalCode: '9001', region: 'Lower Shabelle', latitude: 1.7298, longitude: 44.0518 },
  { city: 'Merca', postalCode: '9002', region: 'Lower Shabelle', latitude: 1.7298, longitude: 44.0518 },

  // Barawa
  { city: 'Barawa', postalCode: '9003', region: 'Lower Shabelle', latitude: 1.0654, longitude: 42.7895 },

  // Garowe - Puntland
  { city: 'Garowe', postalCode: '10001', region: 'Nugal', latitude: 8.4066, longitude: 48.4844 },
  { city: 'Garowe', postalCode: '10002', region: 'Nugal', latitude: 8.4066, longitude: 48.4844 },

  // Baidoa
  { city: 'Baidoa', postalCode: '11001', region: 'Bay', latitude: 3.1148, longitude: 43.6477 },
  { city: 'Baidoa', postalCode: '11002', region: 'Bay', latitude: 3.1148, longitude: 43.6477 },

  // Kaarani
  { city: 'Kaarani', postalCode: '12001', region: 'Gedo', latitude: 3.7, longitude: 40.3167 },
  { city: 'Kaarani', postalCode: '12002', region: 'Gedo', latitude: 3.7, longitude: 40.3167 },

  // Garissa
  { city: 'Garissa', postalCode: '13001', region: 'Bakool', latitude: 4.47, longitude: 43.64 },

  // Eyl
  { city: 'Eyl', postalCode: '14001', region: 'Nugal', latitude: 7.983, longitude: 49.183 },

  // Lascaanood
  { city: 'Lascaanood', postalCode: '15001', region: 'Sool', latitude: 9.4, longitude: 45.4 },
  { city: 'Lascaanood', postalCode: '15002', region: 'Sool', latitude: 9.4, longitude: 45.4 },

  // Taleh
  { city: 'Taleh', postalCode: '15003', region: 'Sool', latitude: 9.2, longitude: 45.2 },

  // Taleex
  { city: 'Taleex', postalCode: '16001', region: 'Sanaag', latitude: 8.7, longitude: 46.4 },
  { city: 'Taleex', postalCode: '16002', region: 'Sanaag', latitude: 8.7, longitude: 46.4 },

  // Ceerigaabo
  { city: 'Ceerigaabo', postalCode: '17001', region: 'Sanaag', latitude: 9.1, longitude: 46.1 },
  { city: 'Ceerigaabo', postalCode: '17002', region: 'Sanaag', latitude: 9.1, longitude: 46.1 },

  // Baidoa Additional
  { city: 'Baidoa', postalCode: '11003', region: 'Bay', latitude: 3.1148, longitude: 43.6477 },

  // Dinsor
  { city: 'Dinsor', postalCode: '18001', region: 'Bay', latitude: 3.3, longitude: 43.0 },

  // Burao
  { city: 'Burao', postalCode: '19001', region: 'Togdheer', latitude: 9.5141, longitude: 45.5425 },
  { city: 'Burao', postalCode: '19002', region: 'Togdheer', latitude: 9.5141, longitude: 45.5425 },

  // Berbera
  { city: 'Berbera', postalCode: '20001', region: 'Woqooyi Galbeed', latitude: 10.4105, longitude: 45.0129 },
  { city: 'Berbera', postalCode: '20002', region: 'Woqooyi Galbeed', latitude: 10.4105, longitude: 45.0129 },

  // Odweyne
  { city: 'Odweyne', postalCode: '21001', region: 'Togdheer', latitude: 8.9, longitude: 46.0 },

  // Balcad
  { city: 'Balcad', postalCode: '22001', region: 'Middle Shabelle', latitude: 2.59, longitude: 45.3 },

  // Afmadow
  { city: 'Afmadow', postalCode: '23001', region: 'Lower Juba', latitude: -1.5, longitude: 41.8 },
  { city: 'Afmadow', postalCode: '23002', region: 'Lower Juba', latitude: -1.5, longitude: 41.8 },

  // Badhaadhe
  { city: 'Badhaadhe', postalCode: '24001', region: 'Lower Juba', latitude: -0.9, longitude: 41.5 },

  // Baidoa Region Additional Cities
  { city: 'Xudur', postalCode: '25001', region: 'Bakool', latitude: 4.12, longitude: 43.66 },
  { city: 'Xudur', postalCode: '25002', region: 'Bakool', latitude: 4.12, longitude: 43.66 },

  // Qardho
  { city: 'Qardho', postalCode: '26001', region: 'Sanaag', latitude: 8.7, longitude: 47.0 },

  // Sheikh
  { city: 'Sheikh', postalCode: '27001', region: 'Somaliland', latitude: 9.8, longitude: 44.2 },

  // Oog
  { city: 'Oog', postalCode: '28001', region: 'Hiran', latitude: 4.0, longitude: 46.5 },

  // Dhuusamareeb
  { city: 'Dhuusamareeb', postalCode: '29001', region: 'Galmudug', latitude: 5.8, longitude: 47.5 },
  { city: 'Dhuusamareeb', postalCode: '29002', region: 'Galmudug', latitude: 5.8, longitude: 47.5 },

  // Leogo
  { city: 'Leogo', postalCode: '30001', region: 'Bakool', latitude: 3.8, longitude: 43.2 },

  // Luuq
  { city: 'Luuq', postalCode: '31001', region: 'Gedo', latitude: 3.25, longitude: 40.15 },

  // Kenia
  { city: 'Kenia', postalCode: '32001', region: 'Gedo', latitude: 3.43, longitude: 40.24 },

  // Doolow
  { city: 'Doolow', postalCode: '33001', region: 'Gedo', latitude: 3.37, longitude: 40.4 },
  { city: 'Doolow', postalCode: '33002', region: 'Gedo', latitude: 3.37, longitude: 40.4 },

  // Banadir Additional
  { city: 'Mogadishu', postalCode: '1006', region: 'Banaadir', latitude: 2.0469, longitude: 45.3182 },
  { city: 'Mogadishu', postalCode: '1007', region: 'Banaadir', latitude: 2.0469, longitude: 45.3182 },

  // Burao Additional
  { city: 'Burao', postalCode: '19003', region: 'Togdheer', latitude: 9.5141, longitude: 45.5425 },

  // Hargeisa Additional
  { city: 'Hargeisa', postalCode: '2004', region: 'Woqooyi Galbeed', latitude: 9.561, longitude: 44.4005 },
]
