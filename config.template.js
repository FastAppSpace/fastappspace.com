// Configuration template for FastAppSpace
// This file is committed to the repository as a template
// The actual config.js file is generated during build with real secrets

const config = {
    web3forms: {
        accessKey: '${WEB3FORMS_ACCESS_KEY}'
    },
    emailjs: {
        userId: '${EMAILJS_USER_ID}',
        serviceId: '${EMAILJS_SERVICE_ID}',
        templateId: '${EMAILJS_TEMPLATE_ID}'
    }
};