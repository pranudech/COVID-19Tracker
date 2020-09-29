module.exports = [
    {
        key: 'th',
        name: 'ภาษาไทย',
        head: 'ภาพรวมของผู้ติดเชื้อโควิด19',
        image: 'image/thFlag.png',
        total: 'รวม',
        timeDisplay: {
            text1: 'อัพเดทล่าสุด...  ',
            text2: 'dd/MM/yyyy hh:mm:ss'
        },
        menuTitle: [
            {
                tltle1: 'ผู้ติดเชื้อรวม',
            },
            {
                tltle2: 'หายแล้ว',
            },
            {
                tltle3: 'ผู้เสียชีวิต',
            },
        ],
        information : 'คดีสดตามประเทศ'
    },
    {
        key: 'en',
        name: 'English',
        head: 'COVID-19 Tracker',
        image: 'image/enFlag.png',
        total: 'Total',
        timeDisplay: {
            text1: 'update...  ',
            text2: 'yyyy/MM/dd hh:mm:ss'
        },
        menuTitle: [
            {
                tltle1: 'Coronavirus Cases',
            },
            {
                tltle2: 'Recovered',
            },
            {
                tltle3: 'Deaths',
            },
        ],
        information : 'Live Cases by Country'
    }
];