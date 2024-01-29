import axios from "axios";

async function fetchData(url) {
  const response = await axios.post(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    body: {
      startNum: 0,
      order: "recommend",
      limit: 48,
      categoryCode: "A0030",
      endYn: "",
    },
  });
  return response.data;
}

//리스트에 몇개 가져올건지
const punding_list=[];
const NUM = 200;

async function scrapeData(url) {
    
    const response = await fetchData(url);
    for(let i=0;i<NUM;i++){
        punding_list.push(response.data.list[i]);
    }
    console.log(punding_list);
}

async function scrapeAllData() {
  const urls = `https://service.wadiz.kr/api/search/funding`;
  await scrapeData(urls);
}
scrapeAllData();
