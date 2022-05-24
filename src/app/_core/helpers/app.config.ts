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
            case "xoera.compare.co.uk": {
                AppConfig.ApiUrl = "https://api.xoera.compare.co.uk/api";
                AppConfig.SignalrUrl = "https://api.xoera.compare.co.uk/notifyhub";
                AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
            }
                break;
            case "192.168.50.50": {
                if (port && port == '82') {
                    AppConfig.ApiUrl = 'http://192.168.50.50:9092/api';
                    AppConfig.SignalrUrl = 'http://192.168.50.50:9092/notifyhub';
                    AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                } else {
                    AppConfig.ApiUrl = 'http://192.168.50.50:9090/api';
                    AppConfig.SignalrUrl = 'http://192.168.50.50:9090/notifyhub';
                    AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                }
            }
                break;
            default: {
                if (domain.indexOf('bngserver') >= 0) {
                    if (port && port == '82') {
                        AppConfig.ApiUrl = 'http://192.168.50.50:9092/api';
                        AppConfig.SignalrUrl = 'http://192.168.50.50:9092/notifyhub';
                        AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                    } else {
                        AppConfig.ApiUrl = 'http://192.168.50.50:9090/api';
                        AppConfig.SignalrUrl = 'http://192.168.50.50:9090/notifyhub';
                        AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                    }
                } else {
                    if (port && port == '8080') {
                        AppConfig.ApiUrl = 'https://localhost:5001/api';
                        AppConfig.SignalrUrl = 'https://localhost:5001/notifyhub';
                        AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                    } else {
                        AppConfig.ApiUrl = 'https://localhost:5001/api';
                        AppConfig.SignalrUrl = 'https://localhost:5001/notifyhub';
                        AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                    }
                }
            }
                break;
        }
    }
}