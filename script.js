const YOUR_APPSHEET_ACCESS_KEY = "V2-8izS9-Tkt2d-nc66n-0k1Td-0g8UJ-ZNt5w-zzhfi-MIzv4";
const YOUR_APP_ID = "56806620-c839-4b9f-89a0-8fd877998b62";
const table = "data";

document.addEventListener('DOMContentLoaded', () => {
    // Set default datetime
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('thoi_gian_khao_sat').value = `${year}-${month}-${day}T${hours}:${minutes}`;

    const form = document.getElementById('surveyForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Loading
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.fa-paper-plane');
        const spinner = submitBtn.querySelector('.spinner');

        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnIcon.classList.add('hidden');
        spinner.classList.remove('hidden');

        // Prepare Data
        const formData = {
            ten_nguoi_khao_sat: document.getElementById('ten_nguoi_khao_sat').value,
            thoi_gian_khao_sat: document.getElementById('thoi_gian_khao_sat').value,
            so_dien_thoai: document.getElementById('so_dien_thoai').value,
            dia_chi: document.getElementById('dia_chi').value
        };

        await addData(formData);

        // UI Reset
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnIcon.classList.remove('hidden');
        spinner.classList.add('hidden');
    });
});

async function addData(newRecord) {
    // Cấu hình
    const appId = YOUR_APP_ID;
    const accessKey = YOUR_APPSHEET_ACCESS_KEY;
    const region = 'www';
    const targetUrl = `https://${region}.appsheet.com/api/v2/apps/${appId}/tables/${table}/Action`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    const payload = {
        Action: 'Add',
        Properties: {
            Locale: 'vi-VN',
            Timezone: 'Asia/Ho_Chi_Minh'
        },
        Rows: [newRecord]
    };

    const options = {
        method: 'POST',
        headers: {
            'ApplicationAccessKey': accessKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    let success = false;

    // Lần 1: Thử qua Proxy
    try {
        console.log("Đang gửi qua Proxy...");
        const response = await fetch(proxyUrl, options);
        if (response.ok) {
            console.log("Gửi qua Proxy thành công!");
            await handleSuccess(response);
            success = true;
        } else {
            console.warn(`Proxy phản hồi lỗi: ${response.status}. Chuyển sang gửi trực tiếp...`);
        }
    } catch (proxyError) {
        console.warn("Lỗi kết nối Proxy (CORS/Network). Chuyển sang gửi trực tiếp...", proxyError);
    }

    // Lần 2: Thử gửi trực tiếp (Fallback) nếu Proxy thất bại
    if (!success) {
        try {
            console.log("Đang thử gửi trực tiếp...");
            const response = await fetch(targetUrl, options);
            if (response.ok) {
                console.log("Gửi trực tiếp thành công!");
                await handleSuccess(response);
                success = true;
            } else {
                throw new Error(`Lỗi Server: ${response.status}`);
            }
        } catch (directError) {
            console.error("Gửi trực tiếp thất bại:", directError);
            let msg = 'Không thể kết nối đến AppSheet.';
            if (directError.message.includes('Mg') || directError.message.includes('Fetch') || directError.message.includes('Failed to fetch')) {
                msg = 'Lỗi chặn CORS. Bạn cần cài Extension "Allow CORS" để chạy trên trình duyệt.';
            }
            showToast('error', 'Lỗi Gửi!', msg);
        }
    }
}

async function handleSuccess(response) {
    const data = await response.json();
    console.log("Response Data:", data);
    showToast('success', 'Thành công!', 'Dữ liệu đã được lưu.');
    document.getElementById('surveyForm').reset();

    // Reset thời gian
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('thoi_gian_khao_sat').value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

function showToast(type, title, message) {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('.toast-icon i');

    // Reset classes
    toast.className = 'toast';

    if (type === 'success') {
        toastIcon.className = 'fa-solid fa-check';
        toast.classList.add('show');
    } else {
        toast.classList.add('error');
        toastIcon.className = 'fa-solid fa-triangle-exclamation';
        toast.classList.add('show');
    }

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
