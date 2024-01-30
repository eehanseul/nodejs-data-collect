import * as cheerio from "cheerio";
import axios from "axios";

const baseUrl = `https://search.naver.com/search.naver?where=news&sm=tab_jum&query=이차전지`;

const newsList = [];

async function fetchNews(){
    const response = await axios.get(baseUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    $(".news_area").map((index,element)=>{
        const newsTitle = $(element).find(".news_tit").text().trim();
        const newsPress = $(element).find(".info.press").contents().filter(function() {
            return this.nodeType === 3; // 3은 텍스트 노드를 나타냅니다.
        }).text().trim();
        const newsSummary = $(element).find(".dsc_wrap a").text().trim();
        const newsImage = $(element).find(".dsc_thumb img").attr("data-lazysrc");
        //이미지의 src가 아니라 응답으로 들어온 data-lazysrc를 넣어야 링크나옴
        const newsDetail = $(element).find(".dsc_wrap a").attr("href"); 
        
        const data={
            title: newsTitle,
            press: newsPress,
            summary: newsSummary,
            img: newsImage,
            detailUrl:newsDetail,
        };

        newsList.push(data);
    });

    console.log(newsList);
}
fetchNews();