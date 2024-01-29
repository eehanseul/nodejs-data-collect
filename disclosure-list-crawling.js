import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import iconv from "iconv-lite";

async function fetchPage(url) {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });
        return response;
    } catch (error) {
        console.error(`Error fetching page: ${url}`, error.message);
        return null;
    }
}

async function decodeHTML(response) {
    let contentType = response.headers["content-type"];
    let charset = contentType.includes("charset=")
        ? contentType.split("charset=")[1]
        : "UTF-8";

    let responseData = await response.data;

    return iconv.decode(responseData, charset);
}

async function saveData(dailyPrices) {
    fs.writeFileSync("./disclosure-list.json", JSON.stringify(dailyPrices));
}

// 네이버페이 증권 뉴스 페이지 -> 공시정보
async function fetchMain(url) {
    const response = await fetchPage(url);
    if (response) {
        let data = await decodeHTML(response);

        const $ = cheerio.load(data);
        const title = "공시 리스트영역";
        const name = "notice";
        const dailySrc = $(`iframe[title='${title}'][name=${name}]`).attr("src");

        let results = [];
        const startPage = 1;
        const endPage = 10;
        for (let page = startPage; page <= endPage; page++) {
            const url = baseUrl + dailySrc + `${page}`;
            results = results.concat(await fetchDailyPrice(url));
        }
        await saveData(results);
    }
}

async function fetchDailyPrice(url) {
    const response = await fetchPage(url);
    if (response) {
        console.log(url);
        let data = await decodeHTML(response);
        const $ = cheerio.load(data);
        
        let dailyPrices = [];
        $("table.type6 tr").map((i, el) => {   
            const row = $(el).find("td");
            const list_link = $(el).find("td a").prop("href");
            const link = baseUrl+list_link; 

            if (row.length == 3) {
                const title = $(row[0]).text().trim();
                const date = $(row[2]).text().trim();
                
                
                dailyPrices.push({
                    title: title,
                    link: link,
                    date: date,    
                });
            }
        });

        return dailyPrices;
    }
}

const code = "005930";

const baseUrl = "https://finance.naver.com";
const mainSrc = `/item/news.naver?code=${code}`;
const url = baseUrl + mainSrc;
fetchMain(url);