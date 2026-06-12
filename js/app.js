// 广告库存询量计算器 - 主程序

let selectedProvince = null;
let selectedCity = null;
let selectedSlot = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initProvinceGrid();
    initSlotGrid();
});

// 初始化省份网格
function initProvinceGrid() {
    const grid = document.getElementById('provinceGrid');
    grid.innerHTML = '';
    
    for (const [code, data] of Object.entries(REGION_DATA)) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.code = code;
        card.innerHTML = `
            <div class="name">${data.name}</div>
            <div class="code">${data.code}</div>
        `;
        card.addEventListener('click', () => selectProvince(code, card));
        grid.appendChild(card);
    }
}

// 选择省份
function selectProvince(code, cardElement) {
    // 移除其他选中状态
    document.querySelectorAll('.province-grid .card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
    
    selectedProvince = code;
    
    // 显示城市选择
    document.getElementById('citySection').style.display = 'block';
    initCityGrid(code);
    
    // 滚动到城市选择
    document.getElementById('citySection').scrollIntoView({ behavior: 'smooth' });
}

// 初始化城市网格
function initCityGrid(provinceCode) {
    const grid = document.getElementById('cityGrid');
    grid.innerHTML = '';
    
    const province = REGION_DATA[provinceCode];
    if (!province || !province.cities) return;
    
    for (const [code, data] of Object.entries(province.cities)) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.code = code;
        card.innerHTML = `
            <div class="name">${data.name}</div>
            <div class="code">${data.code}</div>
        `;
        card.addEventListener('click', () => selectCity(code, card));
        grid.appendChild(card);
    }
}

// 选择城市
function selectCity(code, cardElement) {
    // 移除其他选中状态
    document.querySelectorAll('.city-grid .card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
    
    selectedCity = code;
    
    // 显示资源位选择
    document.getElementById('slotSection').style.display = 'block';
    
    // 滚动到资源位选择
    document.getElementById('slotSection').scrollIntoView({ behavior: 'smooth' });
}

// 初始化资源位网格
function initSlotGrid() {
    const grid = document.getElementById('slotGrid');
    grid.innerHTML = '';
    
    AD_SLOTS.forEach(slot => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = slot.id;
        card.innerHTML = `
            <div class="name">${slot.name}</div>
            <div class="code">${slot.media}</div>
        `;
        card.addEventListener('click', () => selectSlot(slot, card));
        grid.appendChild(card);
    });
}

// 选择资源位
function selectSlot(slot, cardElement) {
    // 移除其他选中状态
    document.querySelectorAll('.slot-grid .card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
    
    selectedSlot = slot;
    
    // 显示参数设置
    document.getElementById('paramsSection').style.display = 'block';
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('calculateBtn').style.display = 'inline-block';
    
    // 滚动到参数设置
    document.getElementById('paramsSection').scrollIntoView({ behavior: 'smooth' });
}

// 计算询量
function calculateInquiry() {
    if (!selectedProvince || !selectedCity || !selectedSlot) {
        alert('请选择省份、城市和资源位');
        return;
    }
    
    const targetImpressions = parseInt(document.getElementById('targetImpressions').value) || 100000;
    const days = parseInt(document.getElementById('days').value) || 7;
    const priority = document.getElementById('priority').value;
    
    // 获取城市系数
    const provinceCode = selectedProvince;
    const cityTier = CITY_TIERS[provinceCode] || { name: '其他', coefficient: 0.8 };
    const priorityCoeff = PRIORITY_COEFFICIENTS[priority] || 1.0;
    const deviceCount = BASE_DEVICE_COUNT[provinceCode] || 1000000;
    
    // 计算理论库存量
    const theoreticalInventory = Math.floor(deviceCount * cityTier.coefficient * priorityCoeff);
    
    // 计算可用库存量（假设 80% 可用）
    const availableInventory = Math.floor(theoreticalInventory * 0.8);
    
    // 计算满足率
    const totalNeeded = targetImpressions * days;
    const fulfillmentRate = Math.min((availableInventory / totalNeeded) * 100, 100).toFixed(2);
    
    // 计算预估成本
    const estimatedCost = (totalNeeded / 1000) * selectedSlot.basePrice * cityTier.coefficient;
    
    // 显示结果
    document.getElementById('theoreticalInventory').textContent = theoreticalInventory.toLocaleString();
    document.getElementById('availableInventory').textContent = availableInventory.toLocaleString();
    document.getElementById('fulfillmentRate').textContent = fulfillmentRate + '%';
    document.getElementById('estimatedCost').textContent = '¥' + estimatedCost.toLocaleString();
    
    // 滚动到结果
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

// 重置表单
function resetForm() {
    selectedProvince = null;
    selectedCity = null;
    selectedSlot = null;
    
    // 隐藏后续部分
    document.getElementById('citySection').style.display = 'none';
    document.getElementById('slotSection').style.display = 'none';
    document.getElementById('paramsSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('calculateBtn').style.display = 'none';
    
    // 清除选中状态
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    
    // 重置输入
    document.getElementById('targetImpressions').value = '100000';
    document.getElementById('days').value = '7';
    document.getElementById('priority').value = 'medium';
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
