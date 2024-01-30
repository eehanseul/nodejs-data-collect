import * as cheerio from "cheerio";
import axios from "axios";
import fs from "fs/promises";
//const axios = require('axios'); //import와 같은 의미

const baseUrl = `https://quotes.toscrape.com/`;
let currentPage = 1; //처음엔 1페이지
let isNext = true; //다음 페이지가 있는지 없는지

const quotes = [];

//재귀함수로 페이지 반복하기
//async 안쓰면 .then으로 받아야함
const fetchQuote = async (url) => {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const quotePromises = [];

  $(".quote").map((index, element) => {
    const quote = $(element).find(".text").text().trim();
    const author = $(element).find(".author").text().trim();
    const authorUrl = $(element).find("a").attr("href"); // /author/{author} 형태
    const tags = [];
    $(element)
      .find(".tag")
      .map((i, tagElement) => {
        tags.push($(tagElement).text().trim());
      });

    const data = {
      quote: quote,
      author: author,
      authorUrl: `https://quotes.toscrape.com${authorUrl}`,
      tags: tags,
      authorDetail: "",
    };

    const detailUrl = baseUrl + authorUrl; //작가별 상세페이지url
    quotePromises.push(fetchQuoteDetails(detailUrl,data));
    quotes.push(data);
  });

  //promise 객체들을 다 연산하고 반환하겠다.
  await Promise.all(quotePromises);

  //다음 페이지 확인
  const nextPageLink = $(".next a").attr("href"); // /page/숫자
  if (nextPageLink) {
    currentPage++;
    const nextUrl = baseUrl + nextPageLink;
    // https://quotes.toscrape.com/page/(숫자) 로 페이지 넘어감
    await fetchQuote(nextUrl);
  } else {
    isNext = false; //다음 페이지 없으면 isNext=false 시키고 멈춤
    
    //파일로 저장
    await fs.writeFile('./result/quotes.json', JSON.stringify(quotes));
    console.log('Quotes saved to quotes.json');
  }
};

//디테일 페이지 들어가서 내용 가져오기
const fetchQuoteDetails = async (url, data) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // 상세 내용을 가져와서 리턴
    const quoteDetails = $(".author-description").text().trim();
    data.authorDetail = quoteDetails;
  } catch (error) {
    console.error("Error fetching quote details:", error);
  }
};

fetchQuote(baseUrl);
