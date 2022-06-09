export class AppConfig {
    public static ApiUrl: string;
    public static SecretKey: string;
    public static SignalrUrl: string;
    public static AccountTokenKey = 'xoera.compare.account';
    public static AdminAccountTokenKey = 'xoera.compare.admin.account';

    public static setEnvironment() {
        let port = document.location.port,
            domain = window.location.hostname;
        switch (domain) {
            case "xoerapartners.com": {
                AppConfig.ApiUrl = "https://api.xoerapartners.com/api";
                AppConfig.SignalrUrl = "https://api.xoerapartners.com/notifyhub";
                AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
            }
                break;
            default: {
                AppConfig.ApiUrl = 'https://localhost:5001/api';
                AppConfig.SignalrUrl = 'https://localhost:5001/notifyhub';
                AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
            }
                break;
        }
    }
}