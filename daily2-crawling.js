import * as cheerio from "cheerio";
import axios from "axios";

async function fetchData(url) {
    const response = await axios.get(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
    });
    return response.data;
}

async function scrapeData(url) {
    const data = await fetchData(url);
    const $ = cheerio.load(data);

    const table = $('.type2');

    const result = table.find('tr').map((i, el) => {
        const row = $(el);
        return {
            date: row.find('td .p10').text(),
            closingPrice: row.find('td .p11').eq(0).text().trim(),
            comparison: row.find('td .p11').eq(1).text().trim(),
            current: row.find('td .p11').eq(2).text().trim(),
            high: row.find('td .p11').eq(3).text().trim(),
            low: row.find('td .p11').eq(4).text().trim(),
            volume: row.find('td .p11').eq(5).text().trim(),
        };
    }).get();

    const final = result.filter((item) => item.current);

    //console.log(final);
}

async function scrapeAllData() {
    let code = '005930';
    const pageCount = 10;
    const urls = Array.from({ length: pageCount }, (_, i) => `https://finance.naver.com/item/sise_day.naver?code=${code}&page=${i + 1}`);

    await Promise.all(urls.map(scrapeData));
}


scrapeAllData();