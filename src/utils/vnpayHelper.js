const crypto = require('crypto');
const querystring = require('querystring');

class VNPayHelper {
    constructor() {
        this.vnpTmnCode = process.env.vnp_TmnCode;
        this.vnpHashSecret = process.env.vnp_HashSecret;
        this.vnpUrl = process.env.vnp_Url;
        this.vnpReturnUrl = process.env.vnp_Return_Url;
    }


    sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                str.push(key);
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

    createPaymentUrl(params) {
        const { amount, orderInfo, orderId, ipAddr } = params;

        const createDate = this.formatDate(new Date());

        let vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.vnpTmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: this.vnpReturnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        };

        vnpParams = this.sortObject(vnpParams);

        let signData = Object.keys(vnpParams).map(key => key + "=" + vnpParams[key]).join("&");
        let hmac = crypto.createHmac("sha512", this.vnpHashSecret);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        // Không gán SecureHash vào vnpParams trước để tránh bị sort lại hoặc lẫn lộn
        let paymentUrl = this.vnpUrl + '?' + signData + '&vnp_SecureHash=' + signed;

        return paymentUrl;
    }

    verifyCallback(vnpParams) {
        const secureHash = vnpParams['vnp_SecureHash'];

        delete vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHashType'];

        vnpParams = this.sortObject(vnpParams);

        let signData = Object.keys(vnpParams).map(key => key + "=" + vnpParams[key]).join("&");
        let hmac = crypto.createHmac("sha512", this.vnpHashSecret);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        return {
            isValid: secureHash === signed,
            data: {
                orderId: vnpParams['vnp_TxnRef'],
                amount: vnpParams['vnp_Amount'] / 100,
                responseCode: vnpParams['vnp_ResponseCode'],
                transactionNo: vnpParams['vnp_TransactionNo'],
                bankCode: vnpParams['vnp_BankCode'],
                payDate: vnpParams['vnp_PayDate']
            }
        };
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
}

module.exports = new VNPayHelper();
