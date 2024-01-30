import axios from "axios";

// post는 body까지 지정해줘야함
async function fetchData(url) {
  const response = await axios.post(url,{
    startNum: 0,
    order: "recommend",
    limit: 50,
    categoryCode: "",
    endYn: "",
    
    headers: {
      "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  return response.data;
}

const punding_list = [];

async function scrapeData(url) {
  const response = await fetchData(url);
  punding_list.push(response.data.list);
  console.log(punding_list);
}

async function scrapeAllData() {
  const urls = "https://service.wadiz.kr/api/search/funding";
  await scrapeData(urls);
}
scrapeAllData();
