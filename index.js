import axios from 'axios';
//const axios = require('axios'); //import와 같은 의미

// axios({
//     method: 'post',
//     url: 'url',
//     data: {
//         firstName: 'Fred',
//         lastName: 'Flintston'
//     },
//     Headers:{},
//     params:{},
//     params: 'json' //document, json, text, stream
// }).then(Response=>{
//     console.log(Response);
// })

//get 요청
const url = "https://naver.com/";
axios.get(url, ).then(response=>{
    console.log(response);
}).catch(err=>{
    console.error(err);
})

async function fetchPageData(){
    const url="https://naver.com/"
    
    try{
        const response = await axios.get(url);
        console.log(response.data);
    } catch(err){
        console.error(err);
    } 
}
fetchPageData();