// 广告库存询量计算器 - 主程序

let selectedProvince = null;
let selectedCity = null;
let selectedSlot = null;
let inquiryRecords = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initProvinceSelect();
    initResourceSlots();
    initAgeSelect();
    initDeviceSizes();
    initTimeTable();
    loadRecords();
});

// 页面切换
function showPage(page) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    
    // 显示目标页面
    document.getElementById(`page-${page}`).style.display = 'block';
    
    // 更新导航栏
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
}

// 初始化省份选择
function initProvinceSelect() {
    const select = document.getElementById('provinceSelect');
    select.innerHTML = '';
    
    for (const [code, data] of Object.entries(REGION_DATA)) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = data.name;
        select.appendChild(option);
    }
    
    // 监听省份选择变化
    select.addEventListener('change', function() {
        const selectedCodes = Array.from(this.selectedOptions).map(opt => opt.value);
        updateCitySelect(selectedCodes);
    });
}

// 更新城市选择
function updateCitySelect(provinceCodes) {
    const select = document.getElementById('citySelect');
    select.innerHTML = '';
    
    provinceCodes.forEach(code => {
        const province = REGION_DATA[code];
        if (province && province.cities) {
            for (const [cityCode, cityData] of Object.entries(province.cities)) {
                const option = document.createElement('option');
                option.value = cityCode;
                option.textContent = cityData.name;
                select.appendChild(option);
            }
        }
    });
}

// 按城市等级选择
function selectByTier(tier) {
    const citySelect = document.getElementById('citySelect');
    const options = citySelect.options;
    
    for (let i = 0; i < options.length; i++) {
        const cityCode = options[i].value;
        const tierInfo = CITY_TIERS[cityCode.substring(0, 2)];
        if (tierInfo && tierInfo.name.includes(getTierName(tier))) {
            options[i].selected = true;
        }
    }
}

function getTierName(tier) {
    const tierNames = {
        '1': '一线',
        '2': '新一线',
        '3': '二线',
        '4': '三线',
        '5': '四线',
        '6': '五线'
    };
    return tierNames[tier] || '';
}

// 初始化资源位
function initResourceSlots() {
    const select = document.getElementById('resourceSlot');
    select.innerHTML = '<option value="">请选择资源位</option>';
    
    AD_SLOTS.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.id;
        option.textContent = slot.name;
        select.appendChild(option);
    });
    
    // 更新搜索下拉
    const searchSlot = document.getElementById('searchSlot');
    if (searchSlot) {
        AD_SLOTS.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.id;
            option.textContent = slot.name;
            searchSlot.appendChild(option);
        });
    }
}

// 初始化年龄选择
function initAgeSelect() {
    const select = document.getElementById('targetAge');
    const ageGroups = [
        { value: '18-24', label: '18-24岁' },
        { value: '25-34', label: '25-34岁' },
        { value: '35-44', label: '35-44岁' },
        { value: '45-54', label: '45-54岁' },
        { value: '55+', label: '55岁以上' }
    ];
    
    ageGroups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.value;
        option.textContent = group.label;
        select.appendChild(option);
    });
}

// 初始化设备尺寸
function initDeviceSizes() {
    const container = document.getElementById('deviceSizes');
    const sizes = [
        { value: 'phone', label: '手机' },
        { value: 'tablet', label: '平板' },
        { value: 'tv', label: '电视' }
    ];
    
    sizes.forEach(size => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${size.value}">
            <span>${size.label}</span>
        `;
        container.appendChild(label);
    });
}

// 初始化时段表
function initTimeTable() {
    const table = document.getElementById('timeTable');
    if (!table) return;
    
    const timeSlots = [
        { time: '0-1', label: '00:00-01:00' },
        { time: '1-2', label: '01:00-02:00' },
        { time: '2-3', label: '02:00-03:00' },
        { time: '3-4', label: '03:00-04:00' },
        { time: '4-5', label: '04:00-05:00' },
        { time: '5-6', label: '05:00-06:00' },
        { time: '6-7', label: '06:00-07:00' },
        { time: '7-8', label: '07:00-08:00' },
        { time: '8-9', label: '08:00-09:00' },
        { time: '9-10', label: '09:00-10:00' },
        { time: '10-11', label: '10:00-11:00' },
        { time: '11-12', label: '11:00-12:00' },
        { time: '12-13', label: '12:00-13:00' },
        { time: '13-14', label: '13:00-14:00' },
        { time: '14-15', label: '14:00-15:00' },
        { time: '15-16', label: '15:00-16:00' },
        { time: '16-17', label: '16:00-17:00' },
        { time: '17-18', label: '17:00-18:00' },
        { time: '18-19', label: '18:00-19:00' },
        { time: '19-20', label: '19:00-20:00' },
        { time: '20-21', label: '20:00-21:00' },
        { time: '21-22', label: '21:00-22:00' },
        { time: '22-23', label: '22:00-23:00' },
        { time: '23-24', label: '23:00-24:00' }
    ];
    
    let html = '<thead><tr><th>时段</th><th>占比(%)</th></tr></thead><tbody>';
    timeSlots.forEach(slot => {
        html += `
            <tr>
                <td>${slot.label}</td>
                <td><input type="number" class="time-percentage" data-time="${slot.time}" value="${(100/24).toFixed(2)}" step="0.01" min="0" max="100"></td>
            </tr>
        `;
    });
    html += '</tbody>';
    table.innerHTML = html;
    
    // 监听变化
    table.querySelectorAll('.time-percentage').forEach(input => {
        input.addEventListener('change', updateTotalPercentage);
    });
}

// 更新时段总和
function updateTotalPercentage() {
    const inputs = document.querySelectorAll('.time-percentage');
    let total = 0;
    inputs.forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    
    const totalElement = document.getElementById('totalPercentage');
    const warningElement = document.getElementById('percentageWarning');
    
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
    
    if (warningElement) {
        if (Math.abs(total - 100) > 0.01) {
            warningElement.style.display = 'inline';
        } else {
            warningElement.style.display = 'none';
        }
    }
}

// 计算询量
function calculateInquiry() {
    const name = document.getElementById('inquiryName').value;
    const days = parseInt(document.getElementById('days').value) || 7;
    const slotId = document.getElementById('resourceSlot').value;
    
    if (!name || !slotId) {
        alert('请填写必填项');
        return;
    }
    
    const slot = AD_SLOTS.find(s => s.id === slotId);
    if (!slot) return;
    
    // 获取选中的省份和城市
    const provinceSelect = document.getElementById('provinceSelect');
    const citySelect = document.getElementById('citySelect');
    
    const selectedProvinces = Array.from(provinceSelect.selectedOptions).map(opt => opt.value);
    const selectedCities = Array.from(citySelect.selectedOptions).map(opt => opt.value);
    
    // 计算结果
    const results = [];
    let totalInventory = 0;
    
    if (selectedCities.length > 0) {
        selectedCities.forEach(cityCode => {
            const provinceCode = cityCode.substring(0, 2);
            const cityData = REGION_DATA[provinceCode]?.cities[cityCode];
            if (!cityData) return;
            
            const tierInfo = CITY_TIERS[provinceCode] || { name: '其他', coefficient: 0.8 };
            const deviceCount = BASE_DEVICE_COUNT[provinceCode] || 1000000;
            
            // 简化的计算公式
            const theoreticalInventory = Math.floor(deviceCount * tierInfo.coefficient * 0.6 * days);
            const availableInventory = Math.floor(theoreticalInventory * 0.8);
            
            results.push({
                province: REGION_DATA[provinceCode]?.name || '未知',
                city: cityData.name,
                theoreticalInventory: theoreticalInventory,
                availableInventory: availableInventory
            });
            
            totalInventory += availableInventory;
        });
    } else if (selectedProvinces.length > 0) {
        selectedProvinces.forEach(provinceCode => {
            const province = REGION_DATA[provinceCode];
            if (!province) return;
            
            const tierInfo = CITY_TIERS[provinceCode] || { name: '其他', coefficient: 0.8 };
            const deviceCount = BASE_DEVICE_COUNT[provinceCode] || 1000000;
            
            const theoreticalInventory = Math.floor(deviceCount * tierInfo.coefficient * 0.6 * days);
            const availableInventory = Math.floor(theoreticalInventory * 0.8);
            
            results.push({
                province: province.name,
                city: '全省',
                theoreticalInventory: theoreticalInventory,
                availableInventory: availableInventory
            });
            
            totalInventory += availableInventory;
        });
    }
    
    // 显示结果
    displayResults(results, totalInventory);
    
    // 保存记录
    saveRecord({
        id: 'INQ' + Date.now(),
        name: name,
        media: 'banana',
        advertiser: document.getElementById('advertiser').value || '-',
        brand: document.getElementById('brand').value || '-',
        slot: slot.name,
        days: days,
        creator: '当前用户',
        createTime: new Date().toLocaleString(),
        results: results,
        totalInventory: totalInventory
    });
}

// 显示结果
function displayResults(results, totalInventory) {
    const resultArea = document.getElementById('resultArea');
    
    if (results.length === 0) {
        resultArea.innerHTML = '<div class="empty-state"><p>请选择地域后重新计算</p></div>';
        return;
    }
    
    let html = '<table class="result-table">';
    html += '<thead><tr><th>省份</th><th>城市</th><th>理论可售卖量(CPM)</th><th>可用库存量(CPM)</th></tr></thead><tbody>';
    
    results.forEach(result => {
        html += `
            <tr>
                <td>${result.province}</td>
                <td>${result.city}</td>
                <td>${result.theoreticalInventory.toLocaleString()}</td>
                <td>${result.availableInventory.toLocaleString()}</td>
            </tr>
        `;
    });
    
    html += `
        <tr class="total-row">
            <td colspan="3"><strong>合计</strong></td>
            <td><strong>${totalInventory.toLocaleString()}</strong></td>
        </tr>
    </tbody></table>`;
    
    resultArea.innerHTML = html;
}

// 保存记录
function saveRecord(record) {
    inquiryRecords.unshift(record);
    // 保存到本地存储
    localStorage.setItem('inquiryRecords', JSON.stringify(inquiryRecords));
    loadRecords();
}

// 加载记录
function loadRecords() {
    const stored = localStorage.getItem('inquiryRecords');
    if (stored) {
        inquiryRecords = JSON.parse(stored);
    }
    
    const tbody = document.getElementById('recordList');
    if (!tbody) return;
    
    if (inquiryRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #999; padding: 40px;">暂无询量记录</td></tr>';
        return;
    }
    
    tbody.innerHTML = inquiryRecords.map(record => `
        <tr>
            <td>${record.id}</td>
            <td>${record.name}</td>
            <td>${record.media}</td>
            <td>${record.advertiser}</td>
            <td>${record.slot}</td>
            <td>${record.days}</td>
            <td>${record.creator}</td>
            <td>${record.createTime}</td>
            <td><button class="btn btn-small" onclick="viewRecord('${record.id}')">查看</button></td>
        </tr>
    `).join('');n}

// 查看记录
function viewRecord(id) {
    const record = inquiryRecords.find(r => r.id === id);
    if (record) {
        alert(`询量详情：
询量ID：${record.id}
询量名称：${record.name}
媒体：${record.media}
资源位：${record.slot}
有效天数：${record.days}
创建时间：${record.createTime}
总可用库存：${record.totalInventory.toLocaleString()} CPM`);
    }
}

// 搜索记录
function searchRecords() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const slotFilter = document.getElementById('searchSlot').value;
    
    let filtered = inquiryRecords;
    
    if (keyword) {
        filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(keyword) ||
            r.advertiser.toLowerCase().includes(keyword)
        );
    }
    
    if (slotFilter) {
        filtered = filtered.filter(r => r.slot === slotFilter);
    }
    
    // 重新渲染
    const tbody = document.getElementById('recordList');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #999; padding: 40px;">无匹配记录</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(record => `
        <tr>
            <td>${record.id}</td>
            <td>${record.name}</td>
            <td>${record.media}</td>
            <td>${record.advertiser}</td>
            <td>${record.slot}</td>
            <td>${record.days}</td>
            <td>${record.creator}</td>
            <td>${record.createTime}</td>
            <td><button class="btn btn-small" onclick="viewRecord('${record.id}')">查看</button></td>
        </tr>
    `).join('');
}

// 配置页面切换
function showConfigSection(section) {
    // 隐藏所有配置项
    document.querySelectorAll('.config-section').forEach(s => s.style.display = 'none');
    
    // 显示目标配置
    document.getElementById(`config-${section}`).style.display = 'block';
    
    // 更新菜单
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
}

// 保存全局配置
function saveGlobalConfig() {
    const config = {
        driftFactor: parseFloat(document.getElementById('driftFactor').value) || 0.95,
        freqFactor: parseFloat(document.getElementById('freqFactor').value) || 0.80,
        inventoryFactor: parseFloat(document.getElementById('inventoryFactor').value) || 0.60,
        bananaFactor: parseFloat(document.getElementById('bananaFactor').value) || 1.00,
        totalDevices: parseInt(document.getElementById('totalDevices').value) || 14000
    };
    
    localStorage.setItem('globalConfig', JSON.stringify(config));
    alert('配置已保存');
}

// 添加资源位
function addResourceSlot() {
    const name = prompt('请输入资源位名称：');
    if (name) {
        alert('资源位添加功能需要后端支持，当前为静态演示');
    }
}

// 添加定向行
function addTargetingRow() {
    const tbody = document.querySelector('#targetingTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="number" value="0"></td>
        <td><input type="number" value="100"></td>
        <td><input type="number" step="0.01" value="0.23"></td>
        <td><button class="btn btn-small" onclick="deleteRow(this)">删除</button></td>
    `;
    tbody.appendChild(row);
}

// 删除行
function deleteRow(btn) {
    const row = btn.closest('tr');
    row.remove();
}

// 重置表单
function resetForm() {
    document.getElementById('inquiryName').value = '';
    document.getElementById('advertiser').value = '';
    document.getElementById('brand').value = '';
    document.getElementById('days').value = '7';
    document.getElementById('frequency').value = '';
    document.getElementById('dmpSize').value = '';
    document.getElementById('excludeDmpSize').value = '';
    document.getElementById('bananaSize').value = '';
    document.getElementById('excludeBananaSize').value = '';
    document.getElementById('requestRate').value = '';
    
    // 清除选择
    document.getElementById('provinceSelect').selectedIndex = -1;
    document.getElementById('citySelect').innerHTML = '';
    
    // 清除结果
    document.getElementById('resultArea').innerHTML = '<div class="empty-state"><p>请输入条件并点击"开始询量"</p></div>';
}
