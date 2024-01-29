import axios from "axios";

async function fetchData(url) {

    const payload = [{
        operationName: "CommentsQuery",
        variables:{
            commentableId: "UHJvamVjdC0xMTQyMDg5NjU4",
            first: 25,
            last: null,
            nextCursor: null,
            previousCursor: null,
            replyCursor: null,
        },
        query: "query CommentsQuery($commentableId: ID!, $nextCursor: String, $previousCursor: String, $replyCursor: String, $first: Int, $last: Int) {\n  commentable: node(id: $commentableId) {\n    id\n    ... on Project {\n      url\n      __typename\n    }\n    ... on Commentable {\n      canComment\n      canCommentSansRestrictions\n      commentsCount\n      projectRelayId\n      canUserRequestUpdate\n      comments(first: $first, last: $last, after: $nextCursor, before: $previousCursor) {\n        edges {\n          node {\n            ...CommentInfo\n            ...CommentReplies\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          startCursor\n          hasNextPage\n          hasPreviousPage\n          endCursor\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  me {\n    id\n    name\n    imageUrl(width: 200)\n    isKsrAdmin\n    url\n    userRestrictions {\n      restriction\n      releaseAt\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment CommentInfo on Comment {\n  id\n  body\n  createdAt\n  parentId\n  author {\n    id\n    imageUrl(width: 200)\n    name\n    url\n    __typename\n  }\n  removedPerGuidelines\n  authorBadges\n  canReport\n  canDelete\n  canPin\n  hasFlaggings\n  deletedAuthor\n  deleted\n  sustained\n  pinnedAt\n  authorCanceledPledge\n  authorBacking {\n    backingUrl\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment CommentReplies on Comment {\n  replies(last: 3, before: $replyCursor) {\n    totalCount\n    nodes {\n      ...CommentInfo\n      __typename\n    }\n    pageInfo {\n      startCursor\n      hasPreviousPage\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n"
    }];

    const response = await axios.post(url, {data: payload},{
        headers: {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
    });
    return response.data;
}

//리스트에 몇개 가져올건지
const data_list=[];
const NUM = 10;

async function scrapeData(url) {
    
    const response = await fetchData(url);

    console.log(response.data);

  //  const comments = response.data.node[0];

    // const name = comments.author[2];
    // // const text = comments.body;

   
    
    const commnetBlock={
        name: name,
        text: text,
    }

    

    // data_list.push(commnetBlock); 
    // console.log(data_list);
}

async function scrapeAllData() {
  const urls = `https://www.kickstarter.com/graph`;
  await scrapeData(urls);
}
scrapeAllData();
