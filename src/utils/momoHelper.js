const crypto = require('crypto');
const axios = require('axios');

class MoMoHelper {
    constructor() {
        this.partnerCode = process.env.MOMO_PARTNER_CODE;
        this.accessKey = process.env.MOMO_ACCESS_KEY;
        this.secretKey = process.env.MOMO_SECRET_KEY;
        this.apiUrl = process.env.MOMO_API_URL;
        this.returnUrl = process.env.MOMO_RETURN_URL;
        this.ipnUrl = process.env.MOMO_IPN_URL;
    }

    async createPaymentUrl(params) {
        const { amount, orderInfo, returnUrl, ipnUrl } = params;

        const orderId = `${this.partnerCode}-${new Date().getTime()}-${params.orderId}`;

        const requestId = this.partnerCode + new Date().getTime();
        const requestType = "captureWallet";
        const extraData = ""; // pass empty value if your merchant does not have stores
        
        const finalReturnUrl = returnUrl || this.returnUrl;
        const finalIpnUrl = ipnUrl || this.ipnUrl;

        // before sign HMAC SHA256 with format
        const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${finalIpnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${finalReturnUrl}&requestId=${requestId}&requestType=${requestType}`;

        const signature = crypto.createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: this.partnerCode,
            accessKey: this.accessKey,
            requestId: requestId,
            amount: String(amount),
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: finalReturnUrl,
            ipnUrl: finalIpnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'vi'
        };

        try {
            const response = await axios.post(this.apiUrl, requestBody);
            if (response.data && response.data.payUrl) {
                return response.data.payUrl;
            } else {
                console.error("MoMo API Error:", response.data);
                throw new Error("Không thể tạo URL thanh toán MoMo.");
            }
        } catch (error) {
            console.error("MoMo Request Error:", error.message);
            throw new Error("Lỗi kết nối tới MoMo.");
        }
    }

    verifySignature(momoParams) {
        const signature = momoParams['signature'];
        
        // Extract fields to verify
        const accessKey = this.accessKey;
        const amount = momoParams['amount'];
        const extraData = momoParams['extraData'];
        const message = momoParams['message'];
        const orderId = momoParams['orderId'];
        const orderInfo = momoParams['orderInfo'];
        const orderType = momoParams['orderType'];
        const partnerCode = momoParams['partnerCode'];
        const payType = momoParams['payType'];
        const requestId = momoParams['requestId'];
        const responseTime = momoParams['responseTime'];
        const resultCode = momoParams['resultCode'];
        const transId = momoParams['transId'];

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

        const signed = crypto.createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        return {
            isValid: signature === signed,
            data: {
                orderId: orderId.split('-').pop(),
                amount: parseInt(amount),
                resultCode: parseInt(resultCode),
                transId: transId,
                message: message,
                payType: payType,
                responseTime: responseTime
            }
        };
    }
}

module.exports = new MoMoHelper();
