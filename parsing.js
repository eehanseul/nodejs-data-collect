import * as cheerio from 'cheerio';

const data = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root">
        <div class="content">
            <ul class="profile">
                <li class="other">윤수</li>
                <li class="me">
                    <a href="/profile/me">민수</a>
                </li>
                <li clase="other">수지</li>
            </ul>
        </div>
    </div>
</body>
</html>`

const $ = cheerio.load(data);
//console.log($.html());

//console.log($('a')); //a 속성만 찾고싶어
//console.log($("#root")); //id가 root인 태그 찾을거야, id 태그는 #
//console.log($(".other")); //클래스가 other인 태그 찾을거야, class 태그는 . 

//li 태그 가져올건데 me라는 class만 가져오고 싶어 (li.me)
//root 안에 있는 애 중에서 li중에 class가 me인 애 가져오고 싶어 -> #root li.me, 띄어쓰기는 모든 자손 >는 바로 밑에 자손

console.log($('a').text()); //a태그안의 text만 가져옴

const names = $('li').map((i,el)=>{
    return $(el).text().trim();
}).get();
console.log(names);