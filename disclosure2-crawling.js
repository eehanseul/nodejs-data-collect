import * as cheerio from "cheerio";
import axios from "axios";
import iconv from "iconv-lite";

async function fetchData(url) {
    const response = await axios.get(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        responseType: 'arraybuffer',
    });
    const decodedData = iconv.decode(response.data, 'EUC-KR'); // Specify the correct encoding
    return decodedData;
}

async function scrapeData(url) {
    const data = await fetchData(url);
    const $ = cheerio.load(data);

    console.log(url);

    const table = $('table.type6');

    const result = table.find('tr').map((i, el) => {
        const title = $(el).find(".title a").text();
        const date = $(el).find('.date').text();

        return {
            title: title,
            date: date,
        };
    }).get();

    const final = result.filter((item) => item.date);
    console.log(final);
    
}

async function scrapeAllData() {
    let code = '005930';
    const pageCount = 10;
    const urls = Array.from({ length: pageCount }, (_, i) => `https://finance.naver.com/item/news_notice.naver?code=${code}&page=${i + 1}`);

    await Promise.all(urls.map(scrapeData));
}


scrapeAllData();