import axios from "axios";
import fs from "fs";

//받아올 list 개수
const NUM = 10;

// post는 body까지 지정해줘야함 -> 페이로드에 있음
async function fetchData(url) {
  const response = await axios.post(url,{
    startNum: 0,
    order: "recommend",
    limit: NUM,
    categoryCode: "A0030", //뷰티 카테고리
    endYn: "",
  });
  return response.data;
}

async function mainData() {
    const url = "https://service.wadiz.kr/api/search/funding";
    const response = await fetchData(url);
    const punding_list = response.data.list;

    const title = punding_list[0].title;
    console.log(title);
    
    //console.log(punding_list);
    //fs.writeFileSync("./result/wadiz-list.json", JSON.stringify(punding_list));
}
mainData();