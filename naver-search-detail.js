import axios from 'axios';
import * as cheerio from "cheerio";
import https from "https";
import crypto from "crypto";

const params = {
    'where': 'news',
    'query': '이차전지'
}

async function fetchNaverSearch(params){
    const baseUrl = 'https://search.naver.com/search.naver';
    
    const resp = await axios.get(baseUrl, {
        params: params
    })
    const $ = cheerio.load(resp.data);
    const result = $('.list_news .bx').map((i, elem)=>{
        const press = $(elem).find('a.info.press').text(); //신문사
        const anchor = $(elem).find('a.news_tit');
        const title = anchor.text().trim(); //제목
        const url = anchor.prop('href'); //링크
        const dsc = $(elem).find('.news_dsc').text().trim(); //내용 요약
        const imgTag = $(elem).find('.dsc_thumb img')
        // const imgUrl = imgTag.prop('src');
        const imgUrl = imgTag.prop('data-lazysrc'); //이미지링크
        
        return {
            press: press,
            title: title,
            url: url,
            dsc: dsc,
            imgUrl: imgUrl
        }
    }).get();
    console.log(result);

    // + 상세페이지
    for (let item of result){
        try{
            const resp = await axios.get(item.url, {
                httpsAgent: new https.Agent({
                    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
                }),
            });
            item.html = resp.data;
        } catch (err){
            // console.error(err);
        }
    }
    console.log(result);
}
fetchNaverSearch(params);