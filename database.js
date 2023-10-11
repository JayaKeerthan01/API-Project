const books=[
    {
        ISBN:"1234Book",
        title:"Tesla!!",
        pubDate:"2023-10-03",
        language:"en",
        numPage:250,
        author:[1,2],
        publications:[1],
        category:["tech","space","education"]
    }
]
const author=[
    {
        id:1,
        name:"xxx",
        books:["1234Book","aaaa"]
    },   
    {
        id:2,
        name:"yyy",
        books:["1234Book","bbbb"]
    }
]

const publication=[
    {
        id:1,
        name:"writex",
        books:["1234Book"]
    },
    {
        id:2,
        name:"writey",
        books:[]
    }
]

module.exports={books, author,publication};








