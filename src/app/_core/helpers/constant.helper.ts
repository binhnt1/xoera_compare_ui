import { Dictionary } from '../domains/data/dictionnary';

export class ConstantHelper {
    public static ICONS = [
        'socicon-modelmayhem',
        'socicon-mixcloud', 'socicon-drupal',
        'socicon-swarm', 'socicon-istock', 'socicon-yammer',
        'socicon-ello', 'socicon-stackoverflow', 'socicon-persona', 'socicon-triplej',
        'socicon-houzz', 'socicon-rss', 'socicon-paypal', 'socicon-odnoklassniki', 'socicon-airbnb',
        'socicon-periscope', 'socicon-outlook', 'socicon-coderwall', 'socicon-tripadvisor', 'socicon-appnet',
        'socicon-goodreads', 'socicon-tripit', 'socicon-lanyrd', 'socicon-slideshare', 'socicon-buffer', 'socicon-disqus',
        'socicon-vkontakte', 'socicon-whatsapp', 'socicon-patreon', 'socicon-storehouse', 'socicon-pocket', 'socicon-mail', 'socicon-blogger',
        'socicon-technorati', 'socicon-reddit', 'socicon-dribbble', 'socicon-stumbleupon', 'socicon-digg', 'socicon-envato', 'socicon-behance',
        'socicon-delicious', 'socicon-deviantart', 'socicon-forrst', 'socicon-play', 'socicon-zerply', 'socicon-wikipedia', 'socicon-apple', 'socicon-flattr',
        'socicon-github', 'socicon-renren', 'socicon-friendfeed', 'socicon-newsvine', 'socicon-identica', 'socicon-bebo', 'socicon-zynga', 'socicon-steam', 'socicon-xbox',
        'socicon-windows', 'socicon-qq', 'socicon-douban', 'socicon-meetup', 'socicon-playstation', 'socicon-android', 'socicon-snapchat', 'socicon-twitter', 'socicon-facebook',
        'socicon-yahoo', 'socicon-skype', 'socicon-yelp', 'socicon-feedburner', 'socicon-linkedin', 'socicon-viadeo', 'socicon-xing', 'socicon-myspace', 'socicon-soundcloud', 'socicon-spotify',
        'socicon-grooveshark', 'socicon-lastfm', 'socicon-youtube', 'socicon-vimeo', 'socicon-dailymotion', 'socicon-vine', 'socicon-flickr', 'socicon-500px', 'socicon-wordpress', 'socicon-tumblr',
        'socicon-twitch', 'socicon-8tracks', 'socicon-amazon', 'socicon-icq', 'socicon-smugmug', 'socicon-ravelry', 'socicon-weibo', 'socicon-baidu', 'socicon-angellist', 'socicon-ebay', 'socicon-imdb',
        'socicon-stayfriends', 'socicon-residentadvisor', 'socicon-google', 'socicon-yandex', 'socicon-sharethis', 'socicon-bandcamp', 'socicon-itunes', 'socicon-deezer', 'socicon-telegram', 'socicon-openid',
        'socicon-amplement', 'socicon-viber', 'socicon-zomato', 'socicon-draugiem', 'socicon-endomodo', 'socicon-filmweb', 'socicon-stackexchange', 'socicon-wykop', 'socicon-teamspeak', 'socicon-teamviewer', 'socicon-ventrilo',
        'socicon-younow', 'socicon-raidcall', 'socicon-mumble', 'socicon-medium', 'socicon-bebee', 'socicon-hitbox', 'socicon-reverbnation', 'socicon-formulr', 'socicon-instagram', 'socicon-battlenet', 'socicon-chrome', 'socicon-discord',
        'socicon-issuu', 'socicon-macos', 'socicon-firefox', 'socicon-opera', 'socicon-keybase', 'socicon-alliance', 'socicon-livejournal', 'socicon-googlephotos', 'socicon-horde', 'socicon-etsy', 'socicon-zapier', 'socicon-google-scholar',
        'socicon-researchgate', 'socicon-wechat', 'socicon-strava', 'socicon-line', 'socicon-lyft', 'socicon-uber', 'socicon-songkick', 'socicon-viewbug', 'socicon-googlegroups', 'socicon-quora', 'socicon-diablo', 'socicon-blizzard', 'socicon-hearthstone',
        'socicon-heroes', 'socicon-overwatch', 'socicon-warcraft', 'socicon-starcraft', 'socicon-beam', 'socicon-curse', 'socicon-player', 'socicon-streamjar', 'socicon-nintendo', 'socicon-hellocoton', 'socicon-googleplus', 'socicon-pinterest', 'socicon-foursquare',
    ];
    public static COLORS = [
        '#8877a9',
        '#e1e5ec', '#2f353b',
        '#3598dc', '#578ebe', '#2C3E50',
        '#22313F', '#67809F', '#4B77BE', '#4c87b9',
        '#5e738b', '#5C9BD1', '#32c5d2', '#1BBC9B', '#1BA39C',
        '#36D7B7', '#44b6ae', '#26C281', '#3faba4', '#4DB3A2', '#2ab4c0',
        '#E5E5E5', '#e9edef', '#fafafa', '#555555', '#95A5A6', '#BFBFBF', '#ACB5C3',
        '#bfcad1', '#525e64', '#e7505a', '#E08283', '#E26A6A', '#e35b5a', '#D91E18', '#EF4836',
        '#d05454', '#f36a5a', '#e43a45', '#c49f47', '#E87E04', '#f2784b', '#f3c200', '#F7CA18', '#F4D03F',
        '#c8d046', '#c5bf66', '#c5b96b', '#8E44AD', '#8775a7', '#BF55EC', '#8E44AD', '#9B59B6', '#9A12B3', '#8775a7', '#796799'
    ];
    public static LA_ICONS = [
        'la la-500px',
        'la la-adjust', 'la la-adn',
        'la la-align-center', 'la la-align-justify',
        'la la-align-left', 'la la-align-right', 'la la-amazon',
        'la la-ambulance', 'la la-anchor', 'la la-android', 'la la-angellist',
        'la la-angle-double-down', 'la la-angle-double-left', 'la la-angle-double-right',
        'la la-angle-double-up', 'la la-angle-down', 'la la-angle-left', 'la la-angle-right',
        'la la-angle-up', 'la la-apple', 'la la-archive', 'la la-area-chart', 'la la-arrow-circle-down',
        'la la-arrow-circle-left', 'la la-arrow-circle-o-down', 'la la-arrow-circle-o-left', 'la la-arrow-circle-o-right',
        'la la-arrow-circle-o-up', 'la la-arrow-circle-right', 'la la-arrow-circle-up', 'la la-arrow-down', 'la la-arrow-left',
        'la la-arrow-right', 'la la-arrow-up', 'la la-arrows', 'la la-arrows-alt', 'la la-arrows-h', 'la la-arrows-v', 'la la-asterisk',
        'la la-at', 'la la-automobile', 'la la-backward', 'la la-balance-scale', 'la la-ban', 'la la-bank', 'la la-bar-chart', 'la la-bar-chart-o',
        'la la-barcode', 'la la-bars', 'la la-battery-0', 'la la-battery-1', 'la la-battery-2', 'la la-battery-3', 'la la-battery-4', 'la la-battery-empty',
        'la la-battery-full', 'la la-battery-half', 'la la-battery-quarter', 'la la-battery-three-quarters', 'la la-bed', 'la la-beer', 'la la-behance', 'la la-behance-square',
        'la la-bell', 'la la-bell-o', 'la la-bell-slash', 'la la-bell-slash-o', 'la la-bicycle', 'la la-binoculars', 'la la-birthday-cake', 'la la-bitbucket', 'la la-bitbucket-square',
        'la la-bitcoin', 'la la-black-tie', 'la la-bold', 'la la-bolt', 'la la-bomb', 'la la-book', 'la la-bookmark', 'la la-bookmark-o', 'la la-briefcase', 'la la-btc', 'la la-bug', 'la la-building',
        'la la-building-o', 'la la-bullhorn', 'la la-bullseye', 'la la-bus', 'la la-buysellads', 'la la-cab', 'la la-calculator', 'la la-calendar', 'la la-calendar-check-o', 'la la-calendar-minus-o',
        'la la-calendar-o', 'la la-calendar-plus-o', 'la la-calendar-times-o', 'la la-camera', 'la la-camera-retro', 'la la-car', 'la la-caret-down', 'la la-caret-left', 'la la-caret-right', 'la la-caret-square-o-down',
        'la la-toggle-down', 'la la-caret-square-o-left', 'la la-toggle-left', 'la la-caret-square-o-right', 'la la-toggle-right', 'la la-caret-square-o-up', 'la la-toggle-up', 'la la-caret-up', 'la la-cart-arrow-down',
        'la la-cart-plus', 'la la-cc', 'la la-cc-amex', 'la la-cc-diners-club', 'la la-cc-discover', 'la la-cc-jcb', 'la la-cc-mastercard', 'la la-cc-paypal', 'la la-cc-stripe', 'la la-cc-visa', 'la la-certificate', 'la la-chain',
        'la la-chain-broken', 'la la-check', 'la la-check-circle', 'la la-check-circle-o', 'la la-check-square', 'la la-check-square-o', 'la la-chevron-circle-down', 'la la-chevron-circle-left', 'la la-chevron-circle-right', 'la la-chevron-circle-up',
        'la la-chevron-down', 'la la-chevron-left', 'la la-chevron-right', 'la la-chevron-up', 'la la-child', 'la la-chrome', 'la la-circle', 'la la-circle-o', 'la la-circle-o-notch', 'la la-circle-thin', 'la la-clipboard', 'la la-clock-o', 'la la-clone',
        'la la-close', 'la la-cloud', 'la la-cloud-download', 'la la-cloud-upload', 'la la-cny', 'la la-code', 'la la-code-fork', 'la la-codepen', 'la la-coffee', 'la la-cog', 'la la-cogs', 'la la-columns', 'la la-comment', 'la la-comment-o', 'la la-commenting',
        'la la-commenting-o', 'la la-comments', 'la la-comments-o', 'la la-compass', 'la la-compress', 'la la-connectdevelop', 'la la-contao', 'la la-copy', 'la la-copyright', 'la la-creative-commons', 'la la-credit-card', 'la la-crop', 'la la-crosshairs', 'la la-css3',
        'la la-cube', 'la la-cubes', 'la la-cut', 'la la-cutlery', 'la la-dashboard', 'la la-dashcube', 'la la-database', 'la la-dedent', 'la la-delicious', 'la la-desktop', 'la la-deviantart', 'la la-diamond', 'la la-digg', 'la la-dollar', 'la la-dot-circle-o', 'la la-download',
        'la la-dribbble', 'la la-dropbox', 'la la-drupal', 'la la-edit', 'la la-eject', 'la la-ellipsis-h', 'la la-ellipsis-v', 'la la-empire', 'la la-ge', 'la la-envelope', 'la la-envelope-o', 'la la-envelope-square', 'la la-eraser', 'la la-eur', 'la la-euro', 'la la-exchange', 'la la-exclamation',
        'la la-exclamation-circle', 'la la-exclamation-triangle', 'la la-expand', 'la la-expeditedssl', 'la la-external-link', 'la la-external-link-square', 'la la-eye', 'la la-eye-slash', 'la la-eyedropper', 'la la-facebook', 'la la-facebook-f', 'la la-facebook-official', 'la la-facebook-square', 'la la-fast-backward',
        'la la-fast-forward', 'la la-fax', 'la la-female', 'la la-fighter-jet', 'la la-file', 'la la-file-archive-o', 'la la-file-audio-o', 'la la-file-code-o', 'la la-file-excel-o', 'la la-file-image-o', 'la la-file-movie-o', 'la la-file-o', 'la la-file-pdf-o', 'la la-file-photo-o', 'la la-file-picture-o', 'la la-file-powerpoint-o',
        'la la-file-sound-o', 'la la-file-text', 'la la-file-text-o', 'la la-file-video-o', 'la la-file-word-o', 'la la-file-zip-o', 'la la-files-o', 'la la-film', 'la la-filter', 'la la-fire', 'la la-fire-extinguisher', 'la la-firefox', 'la la-flag', 'la la-flag-checkered', 'la la-flag-o', 'la la-flash', 'la la-flask', 'la la-flickr', 'la la-floppy-o',
        'la la-folder', 'la la-folder-o', 'la la-folder-open', 'la la-folder-open-o', 'la la-font', 'la la-fonticons', 'la la-forumbee', 'la la-forward', 'la la-foursquare', 'la la-frown-o', 'la la-futbol-o', 'la la-soccer-ball-o', 'la la-gamepad', 'la la-gavel', 'la la-gbp', 'la la-gear', 'la la-gears', 'la la-genderless', 'la la-get-pocket', 'la la-gg', 'la la-gg-circle',
        'la la-gift', 'la la-git', 'la la-git-square', 'la la-github', 'la la-github-alt', 'la la-github-square', 'la la-glass', 'la la-globe', 'la la-google', 'la la-google-plus', 'la la-google-plus-square', 'la la-google-wallet', 'la la-graduation-cap', 'la la-gratipay', 'la la-gittip', 'la la-group', 'la la-h-square', 'la la-hacker-news', 'la la-hand-grab-o', 'la la-hand-lizard-o',
        'la la-hand-o-down', 'la la-hand-o-left', 'la la-hand-o-right', 'la la-hand-o-up', 'la la-hand-paper-o', 'la la-hand-peace-o', 'la la-hand-pointer-o', 'la la-hand-rock-o', 'la la-hand-scissors-o', 'la la-hand-spock-o', 'la la-hand-stop-o', 'la la-hdd-o', 'la la-header', 'la la-headphones', 'la la-heart', 'la la-heart-o', 'la la-heartbeat', 'la la-history', 'la la-home', 'la la-hospital-o',
        'la la-hotel', 'la la-hourglass', 'la la-hourglass-1', 'la la-hourglass-2', 'la la-hourglass-3', 'la la-hourglass-end', 'la la-hourglass-half', 'la la-hourglass-o', 'la la-hourglass-start', 'la la-houzz', 'la la-html5', 'la la-i-cursor', 'la la-ils', 'la la-image', 'la la-inbox', 'la la-indent', 'la la-industry', 'la la-info', 'la la-info-circle', 'la la-inr', 'la la-instagram', 'la la-institution',
        'la la-internet-explorer', 'la la-ioxhost', 'la la-italic', 'la la-joomla', 'la la-jpy', 'la la-jsfiddle', 'la la-key', 'la la-keyboard-o', 'la la-krw', 'la la-language', 'la la-laptop', 'la la-lastfm', 'la la-lastfm-square', 'la la-leaf', 'la la-leanpub', 'la la-legal', 'la la-lemon-o', 'la la-level-down', 'la la-level-up', 'la la-life-bouy', 'la la-life-buoy', 'la la-life-ring', 'la la-support', 'la la-life-saver',
        'la la-lightbulb-o', 'la la-line-chart', 'la la-link', 'la la-linkedin', 'la la-linkedin-square', 'la la-linux', 'la la-list', 'la la-list-alt', 'la la-list-ol', 'la la-list-ul', 'la la-location-arrow', 'la la-lock', 'la la-long-arrow-down', 'la la-long-arrow-left', 'la la-long-arrow-right', 'la la-long-arrow-up', 'la la-magic', 'la la-magnet', 'la la-mail-forward', 'la la-mail-reply', 'la la-mail-reply-all', 'la la-male',
        'la la-map', 'la la-map-marker', 'la la-map-o', 'la la-map-pin', 'la la-map-signs', 'la la-mars', 'la la-mars-double', 'la la-mars-stroke', 'la la-mars-stroke-h', 'la la-mars-stroke-v', 'la la-maxcdn', 'la la-meanpath', 'la la-medium', 'la la-medkit', 'la la-meh-o', 'la la-mercury', 'la la-microphone', 'la la-microphone-slash', 'la la-minus', 'la la-minus-circle', 'la la-minus-square', 'la la-minus-square-o', 'la la-mobile', 'la la-mobile-phone',
        'la la-money', 'la la-moon-o', 'la la-mortar-board', 'la la-motorcycle', 'la la-mouse-pointer', 'la la-music', 'la la-navicon', 'la la-neuter', 'la la-newspaper-o', 'la la-object-group', 'la la-object-ungroup', 'la la-odnoklassniki', 'la la-odnoklassniki-square', 'la la-opencart', 'la la-openid', 'la la-opera', 'la la-optin-monster', 'la la-outdent', 'la la-pagelines', 'la la-paint-brush', 'la la-paper-plane', 'la la-send', 'la la-paper-plane-o', 'la la-send-o',
        'la la-paperclip', 'la la-paragraph', 'la la-paste', 'la la-pause', 'la la-paw', 'la la-paypal', 'la la-pencil', 'la la-pencil-square', 'la la-pencil-square-o', 'la la-phone', 'la la-phone-square', 'la la-photo', 'la la-picture-o', 'la la-pie-chart', 'la la-pied-piper', 'la la-pied-piper-alt', 'la la-pinterest', 'la la-pinterest-p', 'la la-pinterest-square', 'la la-plane', 'la la-play', 'la la-play-circle', 'la la-play-circle-o', 'la la-plug', 'la la-plus', 'la la-plus-circle',
        'la la-plus-square', 'la la-plus-square-o', 'la la-power-off', 'la la-print', 'la la-puzzle-piece', 'la la-qq', 'la la-qrcode', 'la la-question', 'la la-question-circle', 'la la-quote-left', 'la la-quote-right', 'la la-ra', 'la la-random', 'la la-rebel', 'la la-recycle', 'la la-reddit', 'la la-reddit-square', 'la la-refresh', 'la la-registered', 'la la-renren', 'la la-reorder', 'la la-repeat', 'la la-reply', 'la la-reply-all', 'la la-retweet', 'la la-rmb', 'la la-road', 'la la-rocket',
        'la la-rotate-left', 'la la-rotate-right', 'la la-rouble', 'la la-rss', 'la la-feed', 'la la-rss-square', 'la la-rub', 'la la-ruble', 'la la-rupee', 'la la-safari', 'la la-save', 'la la-scissors', 'la la-search', 'la la-search-minus', 'la la-search-plus', 'la la-sellsy', 'la la-server', 'la la-share', 'la la-share-alt', 'la la-share-alt-square', 'la la-share-square', 'la la-share-square-o', 'la la-shekel', 'la la-sheqel', 'la la-shield', 'la la-ship', 'la la-shirtsinbulk', 'la la-shopping-cart',
        'la la-sign-in', 'la la-sign-out', 'la la-signal', 'la la-simplybuilt', 'la la-sitemap', 'la la-skyatlas', 'la la-skype', 'la la-slack', 'la la-sliders', 'la la-slideshare', 'la la-smile-o', 'la la-sort', 'la la-unsorted', 'la la-sort-alpha-asc', 'la la-sort-alpha-desc', 'la la-sort-amount-asc', 'la la-sort-amount-desc', 'la la-sort-asc', 'la la-sort-up', 'la la-sort-desc', 'la la-sort-down', 'la la-sort-numeric-asc', 'la la-sort-numeric-desc', 'la la-soundcloud', 'la la-space-shuttle', 'la la-spinner',
        'la la-spoon', 'la la-spotify', 'la la-square', 'la la-square-o', 'la la-stack-exchange', 'la la-stack-overflow', 'la la-star', 'la la-star-half', 'la la-star-half-o', 'la la-star-half-full', 'la la-star-half-empty', 'la la-star-o', 'la la-steam', 'la la-steam-square', 'la la-step-backward', 'la la-step-forward', 'la la-stethoscope', 'la la-sticky-note', 'la la-sticky-note-o', 'la la-stop', 'la la-street-view', 'la la-strikethrough', 'la la-stumbleupon', 'la la-stumbleupon-circle', 'la la-subscript', 'la la-subway',
        'la la-suitcase', 'la la-sun-o', 'la la-superscript', 'la la-table', 'la la-tablet', 'la la-tachometer', 'la la-tag', 'la la-tags', 'la la-tasks', 'la la-taxi', 'la la-television', 'la la-tv', 'la la-tencent-weibo', 'la la-terminal', 'la la-text-height', 'la la-text-width', 'la la-th', 'la la-th-large', 'la la-th-list', 'la la-thumb-tack', 'la la-thumbs-down', 'la la-thumbs-o-down', 'la la-thumbs-o-up', 'la la-thumbs-up', 'la la-ticket', 'la la-times', 'la la-remove', 'la la-times-circle', 'la la-times-circle-o', 'la la-tint',
        'la la-toggle-off', 'la la-toggle-on', 'la la-trademark', 'la la-train', 'la la-transgender', 'la la-intersex', 'la la-transgender-alt', 'la la-trash', 'la la-trash-o', 'la la-tree', 'la la-trello', 'la la-tripadvisor', 'la la-trophy', 'la la-truck', 'la la-try', 'la la-tty', 'la la-tumblr', 'la la-tumblr-square', 'la la-turkish-lira', 'la la-twitch', 'la la-twitter', 'la la-twitter-square', 'la la-umbrella', 'la la-underline', 'la la-undo', 'la la-university', 'la la-unlink', 'la la-unlock', 'la la-unlock-alt', 'la la-upload', 'la la-usd',
        'la la-user', 'la la-user-md', 'la la-user-plus', 'la la-user-secret', 'la la-user-times', 'la la-users', 'la la-venus', 'la la-venus-double', 'la la-venus-mars', 'la la-viacoin', 'la la-video-camera', 'la la-vimeo', 'la la-vimeo-square', 'la la-vine', 'la la-vk', 'la la-volume-down', 'la la-volume-off', 'la la-volume-up', 'la la-warning', 'la la-wechat', 'la la-weibo', 'la la-weixin', 'la la-whatsapp', 'la la-wheelchair', 'la la-wifi', 'la la-wikipedia-w', 'la la-windows', 'la la-won', 'la la-wordpress', 'la la-wrench', 'la la-xing', 'la la-xing-square',
        'la la-y-combinator', 'la la-y-combinator-square', 'la la-yahoo', 'la la-yc', 'la la-yc-square', 'la la-yelp', 'la la-yen', 'la la-youtube', 'la la-youtube-play', 'la la-youtube-square'
    ];
    public static LINKS = [
        '/admin',
        '/admin/ccl',
        '/admin/site',
        '/admin/notice',
        '/admin/broker',
        '/admin/hubfile',
        '/admin/sendemail',
        '/admin/site/test',
        '/admin/helpcenter',
        '/admin/brokerlead',
        '/admin/crawwebsite',
        '/admin/crawkeyword',
        '/admin/smtpaccount',
        '/admin/hubfile/test',
        '/admin/helpquestion',
        '/admin/emailtemplate',
        '/admin/crawrunhistory',
        '/admin/brokerleadtemp',
        '/admin/consumptioncurve',
        '/admin/hubfilevalidation',
        '/admin/sendemail/sentitem',
        '/admin/sendemail/emaillog',
        '/admin/hubfile/confirmreports',
        '/admin/hubfile/lostsitereports',
        '/admin/hubfile/exceptionreports',
        '/admin/hubfile/rejectionreports',
        '/admin/hubfile/allrejectionreports',
        '/admin/hubfile/dailyobjectinonreports',
        '/admin/hubfile/dailygainedsitereports',
        '/admin/hubfile/lostnotificationreports',
        '/admin/hubfile/dailyconfirmationreports',
    ];
    public static NODEIDS = [
        { nodeId: 1, id: 'shape23' },
        { nodeId: 2, id: 'shape24' },
        { nodeId: 3, id: 'shape25' },
        { nodeId: 4, id: 'shape28' },
        { nodeId: 5, id: 'shape29' },
        { nodeId: 6, id: 'shape30' },
        { nodeId: 7, id: 'shape31' },
        { nodeId: 8, id: 'shape32' },
        { nodeId: 9, id: 'shape33' },
        { nodeId: 10, id: 'shape37' },
        { nodeId: 11, id: 'shape34' },
        { nodeId: 12, id: 'shape35' },
        { nodeId: 13, id: 'shape38' },
        { nodeId: 14, id: 'shape503' },
        { nodeId: 15, id: 'shape36' },
        { nodeId: 16, id: 'shape39' },
        { nodeId: 17, id: 'shape40' },
        { nodeId: 18, id: 'shape142' },
        { nodeId: 19, id: 'shape144' },
        { nodeId: 20, id: 'shape143' },
        { nodeId: 21, id: 'shape145' },
        { nodeId: 22, id: 'shape146' },
        { nodeId: 23, id: 'shape147' },
        { nodeId: 24, id: 'shape154' },
        { nodeId: 25, id: 'shape155' },
        { nodeId: 26, id: 'shape156' },
        { nodeId: 27, id: 'shape157' },
        { nodeId: 28, id: 'shape158' },
        { nodeId: 29, id: 'shape159' },
        { nodeId: 30, id: 'shape160' },
        { nodeId: 31, id: 'shape161' },
        { nodeId: 32, id: 'shape162' },
        { nodeId: 33, id: 'shape163' },
        { nodeId: 34, id: 'shape164' },
        { nodeId: 35, id: 'shape165' },
        { nodeId: 36, id: 'shape166' },
        { nodeId: 37, id: 'shape167' },
        { nodeId: 38, id: 'shape168' },
        { nodeId: 39, id: 'shape485' },
        { nodeId: 40, id: 'shape486' },
        { nodeId: 41, id: 'shape76' },
        { nodeId: 42, id: 'shape193' },
        { nodeId: 43, id: 'shape794' },
        { nodeId: 44, id: '' },
        { nodeId: 45, id: '' },
        { nodeId: 46, id: '' },
        { nodeId: 47, id: '' },
        { nodeId: 48, id: '' },
        { nodeId: 49, id: 'shape195' },
        { nodeId: 50, id: 'shape204' },
        { nodeId: 51, id: 'shape207' },
        { nodeId: 52, id: '' },
        { nodeId: 53, id: 'shape208' },
        { nodeId: 54, id: 'shape282' },
        { nodeId: 55, id: 'shape284' },
        { nodeId: 56, id: '' },
        { nodeId: 57, id: '' },
        { nodeId: 58, id: '' },
        { nodeId: 59, id: 'shape731' },
        { nodeId: 60, id: 'shape732' },
        { nodeId: 61, id: 'shape733' },
        { nodeId: 62, id: 'shape354' },
        { nodeId: 63, id: 'shape331' },
        { nodeId: 64, id: 'shape355' },
        { nodeId: 65, id: 'shape406' },
        { nodeId: 66, id: 'shape403' },
        { nodeId: 67, id: 'shape407' },
        { nodeId: 68, id: 'shape209' },
        { nodeId: 69, id: 'shape210' },
        { nodeId: 70, id: 'shape211' },
        { nodeId: 71, id: 'shape333' },
        { nodeId: 72, id: 'shape334' },
        { nodeId: 73, id: 'shape335' },
        { nodeId: 74, id: 'shape467' },
        { nodeId: 75, id: 'shape468' },
        { nodeId: 76, id: 'shape469' },
        { nodeId: 77, id: 'shape41' },
        { nodeId: 78, id: 'shape42' },
        { nodeId: 79, id: 'shape43' },
        { nodeId: 80, id: 'shape44' },
        { nodeId: 81, id: 'shape505' },
        { nodeId: 82, id: 'shape45' },
        { nodeId: 83, id: 'shape507' },
        { nodeId: 84, id: 'shape46' },
        { nodeId: 85, id: 'shape121' },
        { nodeId: 86, id: 'shape122' },
        { nodeId: 87, id: 'shape588' },
        { nodeId: 88, id: 'shape589' },
        { nodeId: 89, id: 'shape590' },
        { nodeId: 90, id: 'shape88' },
        { nodeId: 91, id: 'shape87' },
        { nodeId: 92, id: 'shape97' },
        { nodeId: 93, id: 'shape89' },
        { nodeId: 94, id: 'shape94' },
        { nodeId: 95, id: 'shape101' },
        { nodeId: 96, id: 'shape100' },
        { nodeId: 97, id: 'shape127' },
        { nodeId: 98, id: 'shape126' },
        { nodeId: 99, id: 'shape125' },
        { nodeId: 100, id: 'shape137' },
        { nodeId: 101, id: 'shape138' },
        { nodeId: 102, id: 'shape139' },
        { nodeId: 103, id: 'shape387' },
        { nodeId: 104, id: 'shape395' },
        { nodeId: 105, id: 'shape440' },
        { nodeId: 106, id: 'shape741' },
        { nodeId: 107, id: 'shape742' },
        { nodeId: 108, id: 'shape743' },
    ]
    public static MAM_TYPES = [
        { value: "GTM", label: "GTM" },
        { value: "ECA", label: "ECA" },
        { value: "SGM", label: "SGM" },
        { value: "EAL", label: "EAL" },
    ];
    public static ROLE_CODES = [
        { value: "ASP", label: "AMR Service Provider" },
        { value: "ASSPR", label: "Asset Provider" },
        { value: "C", label: "Gas Act Owner – Consumer" },
        { value: "CONS", label: "Consumer" },
        { value: "CONT", label: "Contact" },
        { value: "GT", label: "Gas Transporter" },
        { value: "MAM", label: "Meter Asset Manager" },
        { value: "MTWK", label: "Meter Worker" },
        { value: "MDDFR", label: "MDD Forum" },
        { value: "None", label: "Gas Act Owner – None" },
        { value: "S", label: "Gas Act Owner – Supplier" },
        { value: "SMO", label: "Smart Metering System Operator" },
        { value: "SUP", label: "Supplier" },
        { value: "SHIP", label: "Shipper" },
        { value: "T", label: "Gas Act Owner – GT" },
        { value: "TIOWN", label: "Title Owner" },
    ];
    public static PERMISSIONS = [
        'viewCcl', 'addCcl',
        'viewSite', 'addSite',
        'viewLead', 'addLead',
        'viewAgent', 'addAgent',
        'viewAgency', 'addAgency',
        'viewNotice', 'addNotice',
        'viewContract', 'viewDraft',
        'viewPayment', 'addPayment',
        'viewFlatFile', 'addFlatFile',
        'viewEmployee', 'addEmployee',
        'viewSupplier', 'addSupplier',
        'viewMtcLookUp', 'editMtcLookUp',
        'viewBrokerLead', 'addBrokerLead',
        'viewFutureFile', 'addFutureFile',
        'viewEmailTemplate', 'addEmailTemplate',
        'viewConsumptionCurve', 'addConsumptionCurve',
        'viewQuotation', 'newQuotation', 'bespokeQuotation',
        'salesReport', 'selfBillInvoice', 'commissionReport', 'contractStatusReport',
        'admin', 'editSystemSetting', 'sendBulkEmail', 'mprnLookUp',
        'runCrawl', 'viewResultCrawl',
        'addCrawKeyword', 'viewCrawKeyword', 'editCrawKeyword', 'deleteCrawKeyword',
        'addCrawWebsite', 'viewCrawWebsite', 'editCrawWebsite', 'deleteCrawWebsite',
        'createFileFlow', 'viewFileFlowHub', 'viewFileFlowTest', 'viewFileFlowReport', 'viewFileFlowContentTest', 'viewFileFlowValidationTest',
    ];
    public static REASON_CODES = [
        { value: 1, label: "Debt" },
        { value: 2, label: "Contract" },
        { value: 3, label: "Customer Requested Objection" },
    ];
    public static LOCATION_CODES = [
        { value: 0, label: "Unknown" },
        { value: 1, label: "Cellar" },
        { value: 2, label: "Under Stairs" },
        { value: 3, label: "Hall" },
        { value: 4, label: "Kitchen" },
        { value: 5, label: "Bathroom" },
        { value: 6, label: "Garage" },
        { value: 7, label: "Canteen" },
        { value: 8, label: "Cloakroom" },
        { value: 9, label: "Cupboard" },
        { value: 10, label: "Domestic Science" },
        { value: 11, label: "Front Door" },
        { value: 12, label: "Hall Cupboard" },
        { value: 13, label: "Kitchen Cupboard" },
        { value: 14, label: "Kitchen under the sink" },
        { value: 15, label: "Landing" },
        { value: 16, label: "Office" },
        { value: 17, label: "Office Cupboard" },
        { value: 18, label: "Outside WC" },
        { value: 19, label: "Pantry" },
        { value: 20, label: "Porch" },
        { value: 21, label: "Public Bar" },
        { value: 22, label: "Rear of Shop" },
        { value: 23, label: "Saloon Bar" },
        { value: 24, label: "Shed" },
        { value: 25, label: "Shop Front" },
        { value: 26, label: "Shop Window" },
        { value: 27, label: "Staff Room" },
        { value: 28, label: "Store Room" },
        { value: 29, label: "Toilet" },
        { value: 30, label: "Under Counter" },
        { value: 31, label: "Waiting Room" },
        { value: 32, label: "Meter box" },
        { value: 98, label: "Other" },
        { value: 99, label: "Outside" }
    ];
    public static METER_MRF_TYPES = [
        { value: "D", label: "Daily" },
        { value: "M", label: "Monthly" },
        { value: "6", label: "Six-monthly" },
        { value: "A", label: "Annually" }
    ];
    public static METER_READING_SOURCES = [
        { value: "M", label: "Meter Read Organisation" },
        { value: "E", label: "Supplied by the End User" },
        { value: "A", label: "Agreed Opening Read" },
        { value: "R", label: "Remote Reading Equipment Read" },
        { value: "Q", label: "Shipper Provided Estimated Read" },
        { value: "G", label: "Gas Card Read" },
        { value: "P", label: "Point of Sale Read" },
    ];
    public static METER_READING_REASONS = [
        { value: "O", label: "Opening Read" },
        { value: "R", label: "Replacement Read" },
        { value: "N", label: "Non Opening Read" },
    ];
    public static METER_READING_REASONS_SENT = [
        { value: "N", label: "Non Opening Read" },
        { value: "R", label: "Replacement Read" },
    ];
    public static METER_TYPE_CODES = [
        { value: "D", label: "Diaphragm of unknown material" },
        { value: "L", label: "Leather diaphragm" },
        { value: "R", label: "Rotary" },
        { value: "S", label: "Synthetic diaphragm" },
        { value: "T", label: "Turbine" },
        { value: "U", label: "Ultrasonic" },
        { value: "Z", label: "Unknown" },
    ];
    public static METER_STATUS_TYPES = [
        { value: "LI", label: "Live" },
        { value: "FA", label: "Faulty" },
        { value: "IN", label: "Inactive" },
        { value: "CU", label: "Cut off Meter" },
        { value: "CL", label: "Clamped" },
        { value: "CA", label: "Capped" },
        { value: "SP", label: "Spin Cap" },
        { value: "RE", label: "Removed" },
        { value: "OT", label: "Other" },
        { value: "UN", label: "Unknown" },
        { value: "NI", label: "Not Installed" }
    ];
    public static ASSET_CLASS_CODES = [
        { value: "METER", label: "Meter" },
        { value: "CONVR", label: "Converter" },
    ];
    public static ASSET_STATUS_CODES = [
        { value: "AC", label: "Active" },
        { value: "CA", label: "Capped" },
        { value: "CD", label: "Closed (Bypass)" },
        { value: "CL", label: "Clamped" },
        { value: "DM", label: "Damaged" },
        { value: "FA", label: "Faulty" },
        { value: "IN", label: "Inactive" },
        { value: "LI", label: "Live" },
        { value: "OP", label: "Open (Bypass)" },
        { value: "PD", label: "Phone Line Down" },
        { value: "RE", label: "Removed" },
        { value: "UN", label: "Unknown" },
    ];
    public static UNIT_OF_MEASURES = [
        { value: "SCFH", label: "Standard Cubic Feet per hour" },
        { value: "SCMH", label: "Standard Cubic Meters per hour" },
    ];
    public static METER_MECHANISM_CODES = [
        { value: "CM", label: "Coin meter" },
        { value: "CR", label: "Credit" },
        { value: "ET", label: "Electronic token meter" },
        { value: "MT", label: "Mechanical token meter" },
        { value: "TH", label: "Thrift" },
        { value: "U", label: "Unknown" },
        { value: "PP", label: "Prepayment" }
    ]
    public static PAYMENT_METHOD_CODES = [
        { value: "CR", label: "Credit" },
        { value: "PP", label: "Prepayment" },
    ];
    public static REGISTER_TYPE_CODES = [
        { value: "CORR", label: "Corrected Converter Register" },
        { value: "METER", label: "Meter Register" },
        { value: "UNCOR", label: "Uncorrected Converter Register" },
    ];
    public static METER_CANCELLATION_REASON_CODES = [
        { value: 1, label: "Customers Change of Mind" },
        { value: 2, label: "Erroneous Transaction" },
    ];
    public static LABELS: Dictionary<string> = new Dictionary<string>([

    ]);
}