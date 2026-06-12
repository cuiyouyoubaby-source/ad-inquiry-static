// 资源位数据
const AD_SLOTS = [
    { id: 'slot_001', name: '开屏广告', media: '移动端', basePrice: 50000 },
    { id: 'slot_002', name: '信息流广告', media: '移动端', basePrice: 20000 },
    { id: 'slot_003', name: '横幅广告', media: 'PC端', basePrice: 15000 },
    { id: 'slot_004', name: '视频广告', media: '移动端', basePrice: 80000 },
    { id: 'slot_005', name: '插屏广告', media: '移动端', basePrice: 30000 },
];

// 城市分级系数
const CITY_TIERS = {
    '11': { name: '一线', coefficient: 1.5 },      // 北京
    '31': { name: '一线', coefficient: 1.5 },      // 上海
    '44': { name: '一线', coefficient: 1.5 },      // 广东（广州、深圳）
    '12': { name: '新一线', coefficient: 1.3 },    // 天津
    '50': { name: '新一线', coefficient: 1.3 },    // 重庆
    '32': { name: '新一线', coefficient: 1.3 },    // 江苏
    '33': { name: '新一线', coefficient: 1.3 },    // 浙江
    '34': { name: '二线', coefficient: 1.1 },      // 安徽
    '35': { name: '二线', coefficient: 1.1 },      // 福建
    '36': { name: '二线', coefficient: 1.1 },      // 江西
    '37': { name: '二线', coefficient: 1.1 },      // 山东
    '41': { name: '二线', coefficient: 1.1 },      // 河南
    '42': { name: '二线', coefficient: 1.1 },      // 湖北
    '43': { name: '二线', coefficient: 1.1 },      // 湖南
    '45': { name: '二线', coefficient: 1.1 },      // 广西
    '46': { name: '三线', coefficient: 1.0 },      // 海南
    '51': { name: '三线', coefficient: 1.0 },      // 四川
    '52': { name: '三线', coefficient: 1.0 },      // 贵州
    '53': { name: '三线', coefficient: 1.0 },      // 云南
    '54': { name: '三线', coefficient: 1.0 },      // 西藏
    '61': { name: '二线', coefficient: 1.1 },      // 陕西
    '62': { name: '三线', coefficient: 1.0 },      // 甘肃
    '63': { name: '三线', coefficient: 1.0 },      // 青海
    '64': { name: '三线', coefficient: 1.0 },      // 宁夏
    '65': { name: '三线', coefficient: 1.0 },      // 新疆
    '13': { name: '二线', coefficient: 1.1 },      // 河北
    '14': { name: '二线', coefficient: 1.1 },      // 山西
    '15': { name: '三线', coefficient: 1.0 },      // 内蒙古
    '21': { name: '二线', coefficient: 1.1 },      // 辽宁
    '22': { name: '三线', coefficient: 1.0 },      // 吉林
    '23': { name: '三线', coefficient: 1.0 },      // 黑龙江
    '71': { name: '其他', coefficient: 0.8 },      // 台湾
    '81': { name: '其他', coefficient: 0.8 },      // 香港
    '82': { name: '其他', coefficient: 0.8 },      // 澳门
};

// 优先级系数
const PRIORITY_COEFFICIENTS = {
    'high': 1.2,
    'medium': 1.0,
    'low': 0.8
};

// 基础设备数量（模拟数据）
const BASE_DEVICE_COUNT = {
    '11': 5000000,   // 北京
    '31': 5000000,   // 上海
    '44': 8000000,   // 广东
    '12': 3000000,   // 天津
    '50': 3000000,   // 重庆
    '32': 6000000,   // 江苏
    '33': 5000000,   // 浙江
    '34': 4000000,   // 安徽
    '35': 3000000,   // 福建
    '36': 2500000,   // 江西
    '37': 5000000,   // 山东
    '41': 4000000,   // 河南
    '42': 3500000,   // 湖北
    '43': 3500000,   // 湖南
    '45': 2500000,   // 广西
    '46': 1000000,   // 海南
    '51': 4500000,   // 四川
    '52': 2000000,   // 贵州
    '53': 2500000,   // 云南
    '54': 500000,    // 西藏
    '61': 3000000,   // 陕西
    '62': 1500000,   // 甘肃
    '63': 1000000,   // 青海
    '64': 800000,    // 宁夏
    '65': 2000000,   // 新疆
    '13': 4000000,   // 河北
    '14': 2500000,   // 山西
    '15': 2000000,   // 内蒙古
    '21': 3500000,   // 辽宁
    '22': 2000000,   // 吉林
    '23': 2500000,   // 黑龙江
    '71': 2000000,   // 台湾
    '81': 1000000,   // 香港
    '82': 500000,    // 澳门
};
