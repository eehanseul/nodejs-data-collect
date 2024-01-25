import * as cheerio from "cheerio";
import axios from "axios";
//const axios = require('axios'); //import와 같은 의미

const baseUrl = `https://quotes.toscrape.com/`;
let currentPage = 1; //처음엔 1페이지
let isNext = true; //다음 페이지가 있는지 없는지

const quotes = [];

//재귀함수로 페이지 반복하기
const fetchQuote = (url) => {
  axios.get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $(".quote").map((index, element) => {
        const quote = $(element).find(".text").text().trim();
        const author = $(element).find(".author").text().trim();
        const authorUrl = $(element).find("a").attr("href");
        const tags = [];
        $(element)
          .find(".tag")
          .map((i, tagElement) => {
            tags.push($(tagElement).text().trim());
          });

        quotes.push({
          quote: quote,
          author: author,
          authorUrl: `https://quotes.toscrape.com${authorUrl}`,
          tags: tags,
        });
      });

      //다음 페이지 확인
      const nextPageLink = $('.next a').attr('href'); // /page/숫자
      if(nextPageLink){
        currentPage++;
        const nextUrl=baseUrl+nextPageLink;
        
        // https://quotes.toscrape.com/page/(숫자) 로 페이지 넘어감
        fetchQuote(nextUrl);
      }else{
        isNext=false; //다음 페이지 없으면 isNext=false 시키고 멈춤
        console.log(quotes);
      }
    })
    .catch((err) => {
      console.error("ERROR: ",err);
    });
};
fetchQuote(baseUrl);