import axios from 'axios';
import * as cheerio from "cheerio";
import fs from "fs";

const params = {
    'where': 'news',
    'query': '이차전지'
}

async function fetchNaverSearch(params){
    const baseUrl = 'https://search.naver.com/search.naver';
    
    try{
        const resp = await axios.get(baseUrl, {
            params: params
        })
        const $ = cheerio.load(resp.data);
        const result = await Promise.all($('.list_news .bx').map(async(i, elem)=>{
            const anchor = $(elem).find('a.news_tit');
            const title = anchor.text().trim(); //제목
            const imgTag = $(elem).find('.dsc_thumb img');
            const imgUrl = imgTag.prop('data-lazysrc'); //이미지링크

            // '/' 때문에 이름 저장 안되는거 바꿔줌
            const filtertitle = title.replace(/[/\\?%*:|"<>]/g, '“');
            
            // Download and get base64-encoded image data
            const imageData = await downImage(imgUrl,filtertitle);
            return {
                title: title,
                imgFile: imageData,
            }
            
        }).get());

        const jsonResult = JSON.stringify(result,null,2);
        fs.writeFileSync('./result/news_img_result.json',jsonResult);
        
    } catch(err){
        console.error('이미지 다운 오류 :',err);
    }
}

async function downImage(imageUrl,title){
    try {
        // 이미지를 HTTP GET 요청으로 가져오기
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(`./news_img/${title}.jpg`,response.data);

        const base64Img = Buffer.from(response.data,'binary').toString('base64');
        return base64Img;

      } catch (error) {
        throw new Error('이미지 다운로드 중 오류 발생: ' + error.message);
      }
}

// //이름에 못쓰는 것들 '“'으로 바꿔줌
// function sanitizeTitle(title) {
//     // Replace invalid characters in the title with underscores
//     return title.replace(/[/\\?%*:|"<>]/g, '“');
// }
fetchNaverSearch(params);