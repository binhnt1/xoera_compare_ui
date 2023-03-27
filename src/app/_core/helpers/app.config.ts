export class AppConfig {
    public static ApiUrl: string;
    public static SecretKey: string;
    public static SignalrUrl: string;
    public static AdminAccountTokenKey = 'xoera.compare.admin.account';

    public static getDomain() {
        let domain = '';
        if (document.location.ancestorOrigins && document.location.ancestorOrigins.length > 0) {
            domain = document.location.ancestorOrigins[0];
        }
        if (!domain) domain = document.location.href || document.referrer || document.location.origin;
        domain = domain.replace('https://', '')
            .replace('http://', '')
            .replace('www.', '')
            .split('/')[0];
        return domain.toLowerCase();
    }

    public static getProtocol() {
        return window.location.protocol.replace(':', '');
    }

    public static setEnvironment() {
        let domain = AppConfig.getDomain();
        if (domain.indexOf('localhost') >= 0) {
            AppConfig.ApiUrl = 'https://localhost:44323/api';
            AppConfig.SignalrUrl = 'https://localhost:44323/notifyhub';
            AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
        } else {
            switch (domain) {
                case "xoerapartners.com":
                case "admin.xoerapartners.com":
                case "dashboard.xoerapartners.com": {
                    AppConfig.ApiUrl = "https://api.xoerapartners.com/api";
                    AppConfig.SignalrUrl = "https://api.xoerapartners.com/notifyhub";
                    AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                }
                    break;
                default: {
                    let domainUI = domain.replace('9001', '9000'),
                        protocol = this.getProtocol();
                    AppConfig.ApiUrl = protocol + '://' + domainUI + '/api';
                    AppConfig.SignalrUrl = protocol + '://' + domainUI + '/notifyhub';
                    AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                }
                    break;
            }
        }
    }
}