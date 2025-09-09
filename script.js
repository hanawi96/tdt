// Túi Dâu Tằm Landing Page - JavaScript
// Optimized for mobile-first experience

// Configuration
const CONFIG = {
    GOOGLE_APPS_SCRIPT_URL: 'https://holy-forest-b29c.yendev96.workers.dev',
    PHONE_REGEX: /^(0|\+84)[0-9]{9,10}$/,
    PRICES: {
        1: 39000,
        2: 75000,
        3: 115000,
        4: 150000
    },
    SHIPPING_FEE: 25000 // Phí ship cho 1 túi
};

// DOM Elements
const elements = {
    orderForm: null,
    loadingModal: null,
    successModal: null,
    customerName: null,
    customerPhone: null,
    customerAddress: null,
    quantity: null,
    orderNote: null,
    // Address elements
    province: null,
    district: null,
    ward: null,
    detailAddress: null,
    fullAddressDisplay: null,
    fullAddressText: null,
    // Submit button elements
    submitButton: null,
    loadingSpinner: null,
    cartIcon: null,
    buttonText: null
};

// Address data
let addressData = [];
let selectedProvince = null;
let selectedDistrict = null;
let selectedWard = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadAddressData();
    setupEventListeners();
    setupFormValidation();
    loadSavedFormData(); // Load saved data
    initCountdownTimer(); // Initialize countdown timer

    // Add smooth scrolling for iOS
    if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        document.documentElement.style.webkitOverflowScrolling = 'touch';
    }
});

// Initialize DOM elements
function initializeElements() {
    elements.orderForm = document.getElementById('orderForm');
    elements.loadingModal = document.getElementById('loadingModal');
    elements.successModal = document.getElementById('successModal');
    elements.customerName = document.getElementById('customerName');
    elements.customerPhone = document.getElementById('customerPhone');
    elements.customerAddress = document.getElementById('customerAddress');
    elements.quantity = document.getElementById('quantity');
    elements.orderNote = document.getElementById('orderNote');
    elements.blessingText = document.getElementById('blessingText');

    // Address elements
    elements.province = document.getElementById('province');
    elements.district = document.getElementById('district');
    elements.ward = document.getElementById('ward');
    elements.detailAddress = document.getElementById('detailAddress');
    elements.fullAddressDisplay = document.getElementById('fullAddressDisplay');
    elements.fullAddressText = document.getElementById('fullAddressText');

    // Submit button elements
    elements.submitButton = document.getElementById('submitButton');
    elements.loadingSpinner = document.getElementById('loadingSpinner');
    elements.cartIcon = document.getElementById('cartIcon');
    elements.buttonText = document.getElementById('buttonText');
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    if (elements.orderForm) {
        elements.orderForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Phone number formatting
    if (elements.customerPhone) {
        elements.customerPhone.addEventListener('input', formatPhoneNumber);
        elements.customerPhone.addEventListener('blur', validatePhoneNumber);
        elements.customerPhone.addEventListener('input', debounce(saveFormData, 500));
    }

    // Name validation
    if (elements.customerName) {
        elements.customerName.addEventListener('blur', validateName);
        elements.customerName.addEventListener('input', debounce(saveFormData, 500));
    }

    // Auto-save for other form fields
    if (elements.detailAddress) {
        elements.detailAddress.addEventListener('input', debounce(saveFormData, 500));
    }

    if (elements.blessingText) {
        elements.blessingText.addEventListener('change', saveFormData);
    }

    if (elements.orderNote) {
        elements.orderNote.addEventListener('input', debounce(saveFormData, 1000));
    }
    
    // Address validation
    if (elements.customerAddress) {
        elements.customerAddress.addEventListener('blur', validateAddress);
    }

    // Address dropdown events
    if (elements.province) {
        elements.province.addEventListener('change', handleProvinceChange);
    }
    if (elements.district) {
        elements.district.addEventListener('change', handleDistrictChange);
    }
    if (elements.ward) {
        elements.ward.addEventListener('change', handleWardChange);
    }
    if (elements.detailAddress) {
        elements.detailAddress.addEventListener('input', updateFullAddress);
    }
    
    // Prevent form submission on Enter in text fields (mobile optimization)
    const textInputs = document.querySelectorAll('input[type="text"], input[type="tel"]');
    textInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = getNextInput(input);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
}

// Get next input element for better UX
function getNextInput(currentInput) {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
    const currentIndex = inputs.indexOf(currentInput);
    return inputs[currentIndex + 1] || null;
}

// Setup form validation
function setupFormValidation() {
    // Real-time validation feedback
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(field);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(field);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (!value) {
        isValid = false;
        errorMessage = 'Vui lòng điền thông tin này';
    } else {
        switch (field.type) {
            case 'tel':
                // Loại bỏ dấu cách trước khi validate
                const cleanPhone = value.replace(/\s/g, '');
                if (!CONFIG.PHONE_REGEX.test(cleanPhone)) {
                    isValid = false;
                    errorMessage = 'Số điện thoại không hợp lệ';
                }
                break;
            case 'text':
                if (field.id === 'customerName' && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Tên phải có ít nhất 2 ký tự';
                }
                break;
            case 'textarea':
                if (field.id === 'customerAddress' && value.length < 10) {
                    isValid = false;
                    errorMessage = 'Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn';
                }
                break;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('border-red-500', 'bg-red-50');
    field.classList.remove('border-gray-300');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-xs mt-1 field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    
    // Gentle shake animation
    field.style.animation = 'shake 0.3s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 300);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('border-red-500', 'bg-red-50');
    field.classList.add('border-gray-300');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Format phone number as user types
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limit to 11 digits (including country code)
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    // Format: 0xxx xxx xxx or +84 xxx xxx xxx
    if (value.startsWith('84') && value.length > 2) {
        value = '+84 ' + value.slice(2);
    } else if (value.startsWith('0') && value.length > 3) {
        value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
    }
    
    e.target.value = value;
}

// Validate phone number
function validatePhoneNumber() {
    const phone = elements.customerPhone.value.replace(/\s/g, '');
    return CONFIG.PHONE_REGEX.test(phone);
}

// Validate name
function validateName() {
    const name = elements.customerName.value.trim();
    return name.length >= 2 && /^[a-zA-ZÀ-ỹ\s]+$/.test(name);
}

// Generate order ID
function generateOrderId() {
    const now = new Date();
    const dateStr = now.getFullYear().toString().slice(-2) +
                    String(now.getMonth() + 1).padStart(2, '0') +
                    String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') +
                    String(now.getMinutes()).padStart(2, '0');
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();

    return `TDT${dateStr}${timeStr}${randomStr}`;
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== FORM DATA PERSISTENCE ====================

// Save form data to localStorage
function saveFormData() {
    try {
        const formData = {
            customerName: elements.customerName?.value || '',
            customerPhone: elements.customerPhone?.value || '',
            detailAddress: elements.detailAddress?.value || '',
            blessingText: elements.blessingText?.value || 'Lộc',
            orderNote: elements.orderNote?.value || '',
            // Address selection
            selectedProvince: selectedProvince,
            selectedDistrict: selectedDistrict,
            selectedWard: selectedWard,
            // Timestamp for expiry
            savedAt: Date.now()
        };

        localStorage.setItem('tdt_form_data', JSON.stringify(formData));
    } catch (error) {
        console.log('Không thể lưu dữ liệu form:', error);
    }
}

// Load saved form data
function loadSavedFormData() {
    try {
        const savedData = localStorage.getItem('tdt_form_data');
        if (!savedData) return;

        const formData = JSON.parse(savedData);

        // Check if data is not too old (7 days)
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        if (Date.now() - formData.savedAt > maxAge) {
            localStorage.removeItem('tdt_form_data');
            return;
        }

        // Fill form fields
        if (elements.customerName && formData.customerName) {
            elements.customerName.value = formData.customerName;
        }

        if (elements.customerPhone && formData.customerPhone) {
            elements.customerPhone.value = formData.customerPhone;
        }

        if (elements.detailAddress && formData.detailAddress) {
            elements.detailAddress.value = formData.detailAddress;
        }

        if (elements.blessingText && formData.blessingText) {
            elements.blessingText.value = formData.blessingText;
        }

        if (elements.orderNote && formData.orderNote) {
            elements.orderNote.value = formData.orderNote;
        }

        // Restore address selection (after address data is loaded)
        if (formData.selectedProvince) {
            setTimeout(() => {
                restoreAddressSelection(formData);
            }, 1000); // Wait for address data to load
        }

        console.log('✅ Đã khôi phục thông tin form đã lưu');

    } catch (error) {
        console.log('Không thể tải dữ liệu form đã lưu:', error);
        localStorage.removeItem('tdt_form_data');
    }
}

// Restore address selection
function restoreAddressSelection(formData) {
    try {
        // Restore province
        if (formData.selectedProvince && elements.province) {
            const provinceOption = Array.from(elements.province.options)
                .find(option => option.textContent === formData.selectedProvince.Name);

            if (provinceOption) {
                elements.province.value = provinceOption.value;
                selectedProvince = formData.selectedProvince;
                populateDistricts();
                enableElement(elements.district);

                // Restore district
                setTimeout(() => {
                    if (formData.selectedDistrict && elements.district) {
                        const districtOption = Array.from(elements.district.options)
                            .find(option => option.textContent === formData.selectedDistrict.Name);

                        if (districtOption) {
                            elements.district.value = districtOption.value;
                            selectedDistrict = formData.selectedDistrict;
                            populateWards();
                            enableElement(elements.ward);

                            // Restore ward
                            setTimeout(() => {
                                if (formData.selectedWard && elements.ward) {
                                    const wardOption = Array.from(elements.ward.options)
                                        .find(option => option.textContent === formData.selectedWard.Name);

                                    if (wardOption) {
                                        elements.ward.value = wardOption.value;
                                        selectedWard = formData.selectedWard;
                                        updateFullAddress();
                                    }
                                }
                            }, 200);
                        }
                    }
                }, 200);
            }
        }
    } catch (error) {
        console.log('Không thể khôi phục địa chỉ:', error);
    }
}

// Clear saved form data (after successful order)
function clearSavedFormData() {
    try {
        localStorage.removeItem('tdt_form_data');
        console.log('✅ Đã xóa dữ liệu form đã lưu');
    } catch (error) {
        console.log('Không thể xóa dữ liệu form:', error);
    }
}

// Validate address
function validateAddress() {
    const address = elements.customerAddress.value.trim();
    return address.length >= 10;
}

// Load address data from JavaScript file
function loadAddressData() {
    try {
        // Use data from vietnamAddressFull.js
        if (window.VIETNAM_ADDRESS_DATA_FULL) {
            addressData = window.VIETNAM_ADDRESS_DATA_FULL;
            populateProvinces();
            console.log('✅ Loaded', addressData.length, 'provinces');
        } else {
            // Fallback: wait a bit and try again
            setTimeout(() => {
                if (window.VIETNAM_ADDRESS_DATA_FULL) {
                    addressData = window.VIETNAM_ADDRESS_DATA_FULL;
                    populateProvinces();
                    console.log('✅ Loaded', addressData.length, 'provinces (delayed)');
                } else {
                    console.error('Address data not available');
                    showToast('Không thể tải dữ liệu địa chỉ', 'error');
                }
            }, 100);
        }
    } catch (error) {
        console.error('Error loading address data:', error);
        showToast('Không thể tải dữ liệu địa chỉ', 'error');
    }
}

// Populate provinces dropdown
function populateProvinces() {
    if (!elements.province || !addressData.length) return;

    // Clear existing options except the first one
    elements.province.innerHTML = '<option value="">- Chọn Tỉnh/Thành phố -</option>';

    // Add provinces
    addressData.forEach(province => {
        const option = document.createElement('option');
        option.value = province.Id;
        option.textContent = province.Name;
        elements.province.appendChild(option);
    });
}

// Handle province change
function handleProvinceChange() {
    const provinceId = elements.province.value;
    selectedProvince = addressData.find(p => p.Id === provinceId);

    // Reset district and ward
    resetDistrict();
    resetWard();

    if (selectedProvince) {
        populateDistricts();
        enableElement(elements.district);
    } else {
        disableElement(elements.district);
    }

    updateFullAddress();
    saveFormData(); // Save when address changes
}

// Populate districts dropdown
function populateDistricts() {
    if (!elements.district || !selectedProvince) return;

    elements.district.innerHTML = '<option value="">- Chọn Quận/Huyện -</option>';

    selectedProvince.Districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district.Id;
        option.textContent = district.Name;
        elements.district.appendChild(option);
    });
}

// Handle district change
function handleDistrictChange() {
    const districtId = elements.district.value;
    selectedDistrict = selectedProvince?.Districts.find(d => d.Id === districtId);

    // Reset ward
    resetWard();

    if (selectedDistrict) {
        populateWards();
        enableElement(elements.ward);
    } else {
        disableElement(elements.ward);
    }

    updateFullAddress();
    saveFormData(); // Save when address changes
}

// Populate wards dropdown
function populateWards() {
    if (!elements.ward || !selectedDistrict) return;

    elements.ward.innerHTML = '<option value="">-Chọn Phường/Xã -</option>';

    selectedDistrict.Wards.forEach(ward => {
        const option = document.createElement('option');
        option.value = ward.Id;
        option.textContent = ward.Name;
        elements.ward.appendChild(option);
    });
}

// Handle ward change
function handleWardChange() {
    const wardId = elements.ward.value;
    selectedWard = selectedDistrict?.Wards.find(w => w.Id === wardId);

    updateFullAddress();
    saveFormData(); // Save when address changes
}

// Update full address display
function updateFullAddress() {
    if (!elements.fullAddressDisplay || !elements.fullAddressText) return;

    const parts = [];

    // Add detail address if exists
    if (elements.detailAddress.value.trim()) {
        parts.push(elements.detailAddress.value.trim());
    }

    // Add ward
    if (selectedWard) {
        parts.push(selectedWard.Name);
    }

    // Add district
    if (selectedDistrict) {
        parts.push(selectedDistrict.Name);
    }

    // Add province
    if (selectedProvince) {
        parts.push(selectedProvince.Name);
    }

    if (parts.length > 1) {
        elements.fullAddressText.textContent = parts.join(', ');
        elements.fullAddressDisplay.classList.remove('hidden');
    } else {
        elements.fullAddressDisplay.classList.add('hidden');
    }
}

// Reset district dropdown
function resetDistrict() {
    if (elements.district) {
        elements.district.innerHTML = '<option value="">-Chọn Quận/Huyện</option>';
        disableElement(elements.district);
    }
    selectedDistrict = null;
}

// Reset ward dropdown
function resetWard() {
    if (elements.ward) {
        elements.ward.innerHTML = '<option value="">- Chọn Phường/Xã</option>';
        disableElement(elements.ward);
    }
    selectedWard = null;
}

// Enable dropdown element
function enableElement(element) {
    if (element) {
        element.disabled = false;
        element.classList.remove('bg-gray-50');
        element.classList.add('bg-white');
    }
}

// Disable dropdown element
function disableElement(element) {
    if (element) {
        element.disabled = true;
        element.classList.remove('bg-white');
        element.classList.add('bg-gray-50');
    }
}

// Get full address string for form submission
function getFullAddressString() {
    const parts = [];

    if (elements.detailAddress.value.trim()) {
        parts.push(elements.detailAddress.value.trim());
    }

    if (selectedWard) {
        parts.push(selectedWard.Name);
    }

    if (selectedDistrict) {
        parts.push(selectedDistrict.Name);
    }

    if (selectedProvince) {
        parts.push(selectedProvince.Name);
    }

    return parts.join(', ');
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateAllFields();
    if (!isValid) {
        showToast('Vui lòng kiểm tra lại thông tin', 'error');
        return;
    }
    
    // Show loading state
    showButtonLoading();
    showLoadingModal();
    
    try {
        // Calculate total price including shipping
        const quantity = parseInt(elements.quantity.value);
        let totalPrice = CONFIG.PRICES[quantity];

        // Add shipping fee for single item only
        if (quantity === 1) {
            totalPrice += CONFIG.SHIPPING_FEE;
        }

        // Generate order ID
        const orderId = generateOrderId();

        // Prepare order data in format expected by Google Apps Script
        const orderData = {
            orderId: orderId,
            orderDate: new Date().toISOString(),
            customer: {
                name: elements.customerName.value.trim(),
                phone: elements.customerPhone.value.replace(/\s/g, ''),
                address: getFullAddressString(),
                notes: elements.orderNote.value.trim()
            },
            cart: [{
                name: "Túi Dâu Tằm Đực",
                quantity: quantity,
                price: CONFIG.PRICES[quantity],
                weight: "Không có",
                notes: `Chữ: ${elements.blessingText.value}`
            }],
            total: `${totalPrice.toLocaleString('vi-VN')}đ`,
            paymentMethod: 'cod',
            telegramNotification: 'VDT_SECRET_2025_ANHIEN' // Secret key for Telegram
        };
        
        // Submit to Google Apps Script
        const success = await submitOrder(orderData);
        
        if (success) {
            hideButtonLoading();
            hideLoadingModal();
            showSuccessModal(orderData);
            resetForm();
            
            // Track conversion (if analytics is set up)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'purchase', {
                    transaction_id: Date.now().toString(),
                    value: orderData.price,
                    currency: 'VND',
                    items: [{
                        item_id: 'tui-dau-tam',
                        item_name: 'Túi Dâu Tằm',
                        quantity: orderData.quantity,
                        price: orderData.price
                    }]
                });
            }
        } else {
            throw new Error('Không thể gửi đơn hàng');
        }
        
    } catch (error) {
        console.error('Order submission error:', error);
        hideButtonLoading();
        hideLoadingModal();
        showToast('Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline', 'error');
    }
}

// Validate all form fields
function validateAllFields() {
    const fields = [
        elements.customerName,
        elements.customerPhone
    ];

    let allValid = true;

    // Validate basic fields
    fields.forEach(field => {
        if (!validateField(field)) {
            allValid = false;
        }
    });

    // Validate address components
    if (!selectedProvince) {
        showFieldError(elements.province, 'Vui lòng chọn tỉnh/thành phố');
        allValid = false;
    }

    if (!selectedDistrict) {
        showFieldError(elements.district, 'Vui lòng chọn quận/huyện');
        allValid = false;
    }

    if (!selectedWard) {
        showFieldError(elements.ward, 'Vui lòng chọn phường/xã');
        allValid = false;
    }

    if (!elements.detailAddress.value.trim()) {
        showFieldError(elements.detailAddress, 'Vui lòng nhập số nhà, tên đường');
        allValid = false;
    } else if (elements.detailAddress.value.trim().length < 5) {
        showFieldError(elements.detailAddress, 'Địa chỉ chi tiết quá ngắn');
        allValid = false;
    }

    // Validate quantity selection
    if (!elements.quantity.value || elements.quantity.value === '') {
        showFieldError(elements.quantity, 'Vui lòng chọn số lượng sản phẩm');
        allValid = false;
    }

    return allValid;
}

// Submit order to Google Apps Script
async function submitOrder(orderData) {
    console.log('🚀 Frontend: Starting order submission...');
    console.log('📋 Frontend: Order data to send:', orderData);
    console.log('🎯 Frontend: Target URL:', CONFIG.GOOGLE_APPS_SCRIPT_URL);

    try {
        console.log('📤 Frontend: Sending POST request...');
        const startTime = Date.now();

        const response = await fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        const endTime = Date.now();
        console.log(`⏱️ Frontend: Request completed in ${endTime - startTime}ms`);
        console.log('📈 Frontend: Response status:', response.status);
        console.log('📋 Frontend: Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error('❌ Frontend: HTTP error response');
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('✅ Frontend: Response OK, parsing JSON...');
        const result = await response.json();
        console.log('📊 Frontend: Parsed result:', result);

        const success = result.success === true;
        console.log(`🎯 Frontend: Final success status: ${success}`);
        return success;
        
    } catch (error) {
        console.error('💥 Frontend: Submit order error:', error);
        console.error('📍 Frontend: Error stack:', error.stack);
        console.error('🔍 Frontend: Error name:', error.name);
        console.error('📝 Frontend: Error message:', error.message);

        // Fallback: Try to submit via form data
        console.log('🔄 Frontend: Attempting fallback with FormData...');
        try {
            const formData = new FormData();
            Object.keys(orderData).forEach(key => {
                if (typeof orderData[key] === 'object') {
                    formData.append(key, JSON.stringify(orderData[key]));
                } else {
                    formData.append(key, orderData[key]);
                }
            });

            console.log('📤 Frontend: Sending fallback request...');
            const fallbackResponse = await fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            console.log('📈 Frontend: Fallback response status:', fallbackResponse.status);
            const fallbackSuccess = fallbackResponse.ok;
            console.log(`🎯 Frontend: Fallback success: ${fallbackSuccess}`);
            return fallbackSuccess;
        } catch (fallbackError) {
            console.error('💥 Frontend: Fallback submit error:', fallbackError);
            return false;
        }
    }
}

// Show button loading state
function showButtonLoading() {
    if (elements.submitButton && elements.loadingSpinner && elements.cartIcon && elements.buttonText) {
        // Disable button
        elements.submitButton.disabled = true;
        elements.submitButton.classList.add('opacity-75', 'cursor-not-allowed');
        elements.submitButton.classList.remove('hover:scale-105');

        // Hide cart icon, show spinner
        elements.cartIcon.classList.add('hidden');
        elements.loadingSpinner.classList.remove('hidden');

        // Change text
        elements.buttonText.textContent = 'ĐANG XỬ LÝ...';

        console.log('✅ Button loading state activated');
    }
}

// Hide button loading state
function hideButtonLoading() {
    if (elements.submitButton && elements.loadingSpinner && elements.cartIcon && elements.buttonText) {
        // Enable button
        elements.submitButton.disabled = false;
        elements.submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
        elements.submitButton.classList.add('hover:scale-105');

        // Show cart icon, hide spinner
        elements.cartIcon.classList.remove('hidden');
        elements.loadingSpinner.classList.add('hidden');

        // Reset text
        elements.buttonText.textContent = 'XÁC NHẬN ĐẶT HÀNG NGAY';

        console.log('✅ Button loading state deactivated');
    }
}

// Show loading modal
function showLoadingModal() {
    if (elements.loadingModal) {
        elements.loadingModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Hide loading modal
function hideLoadingModal() {
    if (elements.loadingModal) {
        elements.loadingModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Show success modal
function showSuccessModal(orderData) {
    if (elements.successModal) {
        // Update order information
        updateSuccessModalContent(orderData);

        elements.successModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Update success modal content with order data
function updateSuccessModalContent(orderData) {
    try {
        console.log('Updating modal with orderData:', orderData);

        // Order ID
        const orderIdEl = document.getElementById('orderIdDisplay');
        if (orderIdEl) {
            orderIdEl.textContent = `#${orderData.orderId}`;
        }

        // Order time
        const orderTimeEl = document.getElementById('orderTimeDisplay');
        if (orderTimeEl) {
            const now = new Date();
            const timeString = now.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            orderTimeEl.textContent = timeString;
        }

        // Product info - get from cart array
        const productEl = document.getElementById('productDisplay');
        if (productEl && orderData.cart && orderData.cart[0]) {
            const quantity = orderData.cart[0].quantity;
            let productText = `${quantity} túi dâu tằm`;
            if (quantity === 1) productText += ' (dùng thử)';
            else if (quantity === 2) productText += ' (phổ biến)';
            else if (quantity === 3) productText += ' (có quà)';
            else if (quantity === 4) productText += ' = 5 túi (tặng 1)';
            productEl.textContent = productText;
        }

        // Blessing text - get from cart notes
        const blessingEl = document.getElementById('blessingDisplay');
        if (blessingEl && orderData.cart && orderData.cart[0]) {
            const cartNotes = orderData.cart[0].notes || '';
            const blessingMatch = cartNotes.match(/Chữ:\s*(.+)/);
            const blessingText = blessingMatch ? blessingMatch[1].trim() : 'Không có';
            blessingEl.textContent = blessingText;
            if (blessingText !== 'Không có' && blessingText !== '') {
                blessingEl.classList.add('font-semibold');
            }
        }

        // Total price - use the formatted total from orderData
        const totalEl = document.getElementById('totalDisplay');
        if (totalEl) {
            totalEl.textContent = orderData.total;
        }

        // Customer name - get from customer object
        const nameEl = document.getElementById('customerNameDisplay');
        if (nameEl && orderData.customer) {
            nameEl.textContent = orderData.customer.name;
        }

        // Customer phone - get from customer object
        const phoneEl = document.getElementById('customerPhoneDisplay');
        if (phoneEl && orderData.customer) {
            phoneEl.textContent = orderData.customer.phone;
        }

        // Customer address - get from customer object
        const addressEl = document.getElementById('customerAddressDisplay');
        if (addressEl && orderData.customer) {
            addressEl.textContent = orderData.customer.address;
        }

        // Order note - get from customer notes
        const orderNoteEl = document.getElementById('orderNoteDisplay');
        const orderNoteSection = document.getElementById('orderNoteSection');
        if (orderNoteEl && orderNoteSection && orderData.customer) {
            const orderNote = orderData.customer.notes;
            if (orderNote && orderNote.trim()) {
                orderNoteEl.textContent = orderNote;
                orderNoteSection.classList.remove('hidden');
            } else {
                orderNoteSection.classList.add('hidden');
            }
        }

    } catch (error) {
        console.error('Error updating success modal:', error);
        console.error('OrderData structure:', orderData);
    }
}

// Format price to Vietnamese currency
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

// Close success modal
function closeSuccessModal() {
    if (elements.successModal) {
        elements.successModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Reset form after successful submission
function resetForm() {
    if (elements.orderForm) {
        elements.orderForm.reset();

        // Reset address selections
        selectedProvince = null;
        selectedDistrict = null;
        selectedWard = null;

        // Reset address dropdowns
        if (elements.province) {
            populateProvinces();
        }
        resetDistrict();
        resetWard();

        // Hide full address display
        if (elements.fullAddressDisplay) {
            elements.fullAddressDisplay.classList.add('hidden');
        }

        // Clear saved form data after successful order
        clearSavedFormData();

        // Clear any error states
        const errorElements = document.querySelectorAll('.field-error');
        errorElements.forEach(el => el.remove());

        const errorFields = document.querySelectorAll('.border-red-500');
        errorFields.forEach(field => {
            field.classList.remove('border-red-500', 'bg-red-50');
            field.classList.add('border-gray-300');
        });
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -20px)';
    
    setTimeout(() => {
        toast.style.transition = 'all 0.3s ease';
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, 0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Smooth scroll to order section
function scrollToOrder() {
    const orderSection = document.getElementById('order-section');
    if (orderSection) {
        orderSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Focus on first input after scroll
        setTimeout(() => {
            if (elements.customerName) {
                elements.customerName.focus();
            }
        }, 500);
    }
}

// Add CSS for shake animation
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
}
`;

// Inject shake animation CSS
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Performance optimization: Preload critical resources
function preloadResources() {
    // Preload Google Apps Script URL
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = 'https://script.google.com';
    document.head.appendChild(link);
}

// Initialize preloading
preloadResources();

// Countdown Timer
function initCountdownTimer() {
    // Set countdown to 2 hours from now
    let endTime;

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            // Update display for both countdown timers
            // Timer 1
            const hours1El = document.getElementById('hours1');
            const minutes1El = document.getElementById('minutes1');
            const seconds1El = document.getElementById('seconds1');

            if (hours1El) hours1El.textContent = hours.toString().padStart(2, '0');
            if (minutes1El) minutes1El.textContent = minutes.toString().padStart(2, '0');
            if (seconds1El) seconds1El.textContent = seconds.toString().padStart(2, '0');

            // Timer 2
            const hours2El = document.getElementById('hours2');
            const minutes2El = document.getElementById('minutes2');
            const seconds2El = document.getElementById('seconds2');

            if (hours2El) hours2El.textContent = hours.toString().padStart(2, '0');
            if (minutes2El) minutes2El.textContent = minutes.toString().padStart(2, '0');
            if (seconds2El) seconds2El.textContent = seconds.toString().padStart(2, '0');
        } else {
            // Timer expired - reset to 2 hours
            const newEndTime = new Date().getTime() + (2 * 60 * 60 * 1000);
            localStorage.setItem('countdownEndTime', newEndTime.toString());
            location.reload(); // Refresh to restart countdown
        }
    }

    // Check if there's a saved end time
    const savedEndTime = localStorage.getItem('countdownEndTime');
    if (savedEndTime) {
        const savedTime = parseInt(savedEndTime);
        const now = new Date().getTime();

        if (savedTime > now) {
            // Use saved time if it's still valid
            endTime = savedTime;
        } else {
            // Create new end time if saved time expired
            endTime = now + (2 * 60 * 60 * 1000);
            localStorage.setItem('countdownEndTime', endTime.toString());
        }
    } else {
        // Create and save new end time
        endTime = new Date().getTime() + (2 * 60 * 60 * 1000);
        localStorage.setItem('countdownEndTime', endTime.toString());
    }

    // Update immediately
    updateCountdown();

    // Update every second
    setInterval(updateCountdown, 1000);
}



// Note Preset Function
function setNotePreset(text) {
    const noteTextarea = document.getElementById('orderNote');
    if (noteTextarea) {
        noteTextarea.value = text;
        noteTextarea.focus();

        // Add a subtle animation to show the text was set
        noteTextarea.style.backgroundColor = '#fef3cd';
        setTimeout(() => {
            noteTextarea.style.backgroundColor = '';
        }, 500);
    }
}

// Export functions for global access
window.scrollToOrder = scrollToOrder;
window.closeSuccessModal = closeSuccessModal;
window.setNotePreset = setNotePreset;
