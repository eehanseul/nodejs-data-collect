import * as cheerio from "cheerio";
import axios from "axios";

async function fetchData(url) {
    const response = await axios.get(url, {
        //정석은 모든 request를 모두 맞춰주면 response 똑같이 옴 (header, body, id...)
        //네이버는 쿠키, body 등이 알아서 맞춰져 있기 때문에 user-agent만 넣어도 같은 response받을 수 있음 
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

        // const trTags = $('tr');
        // const data = trTags.slice(1, trTags.length-1).map((i, el)=>{
        //     const date = $(el).find('td:nth-child(1)')?.text()?.trim();
        //     const close = $(el).find('td:nth-child(2)')?.text()?.trim();
        //     const ratio = $(el).find('td:nth-child(3)')?.text()?.trim();
        //     const open = $(el).find('td:nth-child(4)')?.text()?.trim();
        //     const high = $(el).find('td:nth-child(5)')?.text()?.trim();
        //     const low = $(el).find('td:nth-child(6)')?.text()?.trim();
        //     const volume = $(el).find('td:nth-child(7)')?.text()?.trim();
        // });
        // tr:nth-child(2n) -> 짝수행 마다 tr:nth-child(2n+1) -> 홀수행 마다
        // tr:first-child -> 첫번째 행만

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
    console.log(final);
}

async function scrapeAllData() {
    let code = '005930';
    const pageCount = 10;
    const urls = Array.from({ length: pageCount }, (_, i) => `https://finance.naver.com/item/sise_day.naver?code=${code}&page=${i + 1}`);

    await Promise.all(urls.map(scrapeData));
}


scrapeAllData();