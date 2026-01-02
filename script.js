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
    // Cấu hình Proxy
    const appId = YOUR_APP_ID;
    const accessKey = YOUR_APPSHEET_ACCESS_KEY;
    const region = 'www'; // hoặc eu, us tùy tài khoản (mặc định www)

    const targetUrl = `https://${region}.appsheet.com/api/v2/apps/${appId}/tables/${table}/Action`;

    // Ưu tiên 1: Dùng corsproxy.io (Ổn định hơn thingproxy)
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

    try {
        console.log("Đang gửi qua Proxy...");
        let response = await fetch(proxyUrl, options);

        // Nếu Proxy lỗi (ví dụ 403, 500...), thử gửi trực tiếp (dành cho người đã cài Extension)
        if (!response.ok) {
            console.warn("Proxy thất bại, thử gửi trực tiếp...");
            response = await fetch(targetUrl, options);
        }

        if (response.ok) {
            const data = await response.json();
            console.log("Success:", data);
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
        } else {
            console.error("Lỗi:", response.status, response.statusText);
            throw new Error(`Server trả về lỗi: ${response.status}`);
        }
    } catch (error) {
        console.error("Fetch Error:", error);

        let msg = 'Không thể kết nối đến AppSheet.';
        if (error.message.includes('Mg') || error.message.includes('Fetch')) {
            msg = 'Lỗi chặn CORS. Hãy cài Extension "Allow CORS" để chạy được trên trình duyệt.';
        }
        showToast('error', 'Lỗi Gửi!', msg);
    }
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
