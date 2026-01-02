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
    // Thử dùng ThingProxy để bypass CORS
    const targetUrl = `https://api.appsheet.com/api/v2/apps/${YOUR_APP_ID}/tables/${table}/Action`;
    const appsheetUrl = `https://thingproxy.freeboard.io/fetch/${targetUrl}`;

    const payload = {
        Action: 'Add',
        Properties: {
            Locale: 'vi-VN',
            Timezone: 'Asia/Ho_Chi_Minh'
        },
        Rows: [newRecord]
    };

    try {
        const response = await fetch(appsheetUrl, {
            method: 'POST',
            headers: {
                'ApplicationAccessKey': YOUR_APPSHEET_ACCESS_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("info:", data);
            showToast('success', 'Thành công!', 'Dữ liệu đã được gửi lên hệ thống.');
            document.getElementById('surveyForm').reset();
            // Reset date after form reset
            const now = new Date(); // Re-calc time
            // ... (Simple fix: just let user pick again or reload, but let's keep it simple)
        } else {
            console.error("Error status:", response.status);
            showToast('error', 'Lỗi!', `Lỗi gửi dữ liệu: ${response.status}`);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        showToast('error', 'Lỗi kết nối!', 'Có thể do chặn CORS hoặc lỗi mạng.');
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
