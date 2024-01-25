import * as cheerio from 'cheerio';
import axios from 'axios';
//const axios = require('axios'); //import와 같은 의미

const url = `https://quotes.toscrape.com/`;
// https://quotes.toscrape.com/page/(숫자) 로 페이지 넘어감

axios.get(url, ).then(response=>{
    const html = response.data;
    const $ = cheerio.load(html);

    const quotes=[];
    $('.quote').map((index,element)=>{
        const quote = $(element).find('.text').text().trim();
        const author = $(element).find('.author').text().trim();
        const authorUrl = $(element).find('a').attr('href');
        const tags=[];
        $(element).find('.tag').map((i,tagElement)=>{
            tags.push($(tagElement).text().trim());
        });
        
        quotes.push({
            quote: quote,
            author:author,
            authorUrl: `https://quotes.toscrape.com${authorUrl}`,
            tags: tags
        });
    });

    console.log(quotes);

}).catch(err=>{
    console.error(err);
})