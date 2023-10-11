require("dotenv").config();//dotenv is for some confedential data

const express=require("express");
const mongoose=require("mongoose");


var bodyParser=require("body-parser");
//DATABASE
const database= require("./database");
//INITIALIZE EXPRESS
 
const booky= express();
booky.use(bodyParser.urlencoded({extended:true}));//body parser is used to make the expressfile to read the body and change to json format
// urlencoded({extended:true} this is used for bcoz we use many requests like(req,res) so they can be object,string,int etc...
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Connection Established"));








/*
Route          /
Description    Get all the books
Access         PUBLIC
Parameter      NONE
Methods        Get

*/
booky.get("/",(req,res) => {
 return res.json({books:database.books});
});


/*
Route          /is
Description    Get specific book on ISBN
Access         PUBLIC
Parameter      isbn
Methods        Get


*/
booky.get("/is/:isbn",(req,res)=>{
    const getSpecificBook=database.books.filter(
        (book)=> book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length===0){
        return res.json({error:`No book  found for the ISBN of ${req.params.isbn}`});
    }
    return res.json({book: getSpecificBook})
})

/*
Route          /is
Description    Get specific book on category
Access         PUBLIC
Parameter      category
Methods        Get

*/

booky.get("/c/:category",(req,res)=>{
    const getSpecificBook=database.books.filter(
        (book)=> book.category.includes(req.params.category)
    );

    if(getSpecificBook.length===0){
        return res.json({error:`No book found for the category of ${req.params.category}`})
    }
    return res.json({book: getSpecificBook})
});

/*
Route          /is
Description    Get specific book on languages
Access         PUBLIC
Parameter      language
Methods        Get

*/

booky.get("/l/:language",(req,res)=>{
        const getSpecificBook=database.books.filter(
            (book)=>book.language===req.params.language
        );
        if(getSpecificBook.length===0){
            return res.json({error:`No book found for the language of ${req.params.language}`})
        }
        return res.json({book:getSpecificBook})
});



/*
Route          /
Description    Get all the authors
Access         PUBLIC
Parameter      NONE
Methods        Get


*/
 booky.get("/author",(req,res)=>{
    return res.json({authors:database.author});
 });

  /*
Route          /author
Description    Get specific author
Access         PUBLIC
Parameter      id
Methods        Get


*/

booky.get("/author/:id",(req,res)=>{
    const getSpecificAuthor=database.author.filter(
        (authors)=>authors.id===parseInt(req.params.id));

    if(getSpecificAuthor.length===0){
        return res.json({error:`No author found for the book of id ${req.params.id}`})
    }
    return res.json({book:getSpecificAuthor})
});


 /*
Route          /author
Description    Get all book based on author
Access         PUBLIC
Parameter      isbn
Methods        Get


*/
booky.get("/author/book/:isbn",(req,res)=>{
    const getSpecificAuthor=database.author.filter(
        (author)=>author.books.includes(req.params.isbn)
    )
    if(getSpecificAuthor.length===0){
        return res.json({error:`No author found for the book of ${req.params.isbn}`})
    }
    return res.json({book:getSpecificAuthor})
});

 /*
Route          /publication
Description    Get all the publications
Access         PUBLIC
Parameter      none
Methods        Get


*/

booky.get("/publication",(req,res)=>{
    return res.json({publications:database.publication})
});

 /*
Route          /is
Description    Get the specific publications
Access         PUBLIC
Parameter      id
Methods        Get


*/

booky.get("/publication/:id",(req,res)=>{
    const getSpecificPublication=database.publication.filter(
        (publication)=>publication.id===req.params.id
    )
    if(getSpecificPublicationr.length===0){
        return res.json({error:`No author found for the book of id ${req.params.id}`})
    }
    return res.json({book:getSpecificPublication})
});



 /*
Route          /author
Description    Get all book based on publication
Access         PUBLIC
Parameter      isbn
Methods        Get


*/

booky.get("/publication/book/:isbn",(req,res)=>{
    const getSpecificPublication=database.publication.filter(
        (publication)=>publication.books.includes(req.params.isbn)
    )
    if(getSpecificPublication.length===0){
        return res.json({error:`No author found for the book of ${req.params.language}`})
    }
    return res.json({book:getSpecificPublication})
});

//POST REQUEST

 /*
Route          /book/new
Description    add new book
Access         PUBLIC
Parameter      none
Methods        Post


*/

booky.post("/book/new",(req,res)=>{
    const newBook=req.body;
    database.books.push(newBook);
    return res.json({updatedBooks:database.books})
});



 /*
Route          /author/new
Description    add new author
Access         PUBLIC
Parameter      none
Methods        Post


*/


booky.post("/author/new",(req,res)=>{
    const newAuthor=req.body;
    database.author.push(newAuthor);

    return res.json({updatedAuthor:database.author})
});

 /*
Route          /publication/new
Description    add new publication
Access         PUBLIC
Parameter      none
Methods        Post


*/

booky.post("/publication/new",(req,res)=>{
    if( newPublication=req.body){
        database.publication.push(newPublication);
    }
else{
    return res.json({updatedPublication:database.publication})}
});

 /*
Route          /publication/update/book/
Description    update /add new publication
Access         PUBLIC
Parameter      isbn
Methods        Put


*/

booky.put("/publication/update/book/:isbn",(req,res)=>{
    //update the publication database
    database.publication.forEach((pub)=>{
    if(pub.id===req.body.pubId){
        return pub.books.push(req.params.isbn);
    }
    });

       //update the book database
       database.books.forEach((book)=>{
       if(book.ISBN===req.params.isbn){
        book.publications=req.body.pubId;
        return;
       }
      } );
       return res.json({
        books:database.books,
        publications:database.publication,
        messade:"successfully updated publications"
       });

});


 /*
Route         /book/delete
Description    delete a book
Access         PUBLIC
Parameter      isbn
Methods       DELETE


*/
booky.delete("/book/delete/:isbn",(req,res)=>{
    const updatedBookDatabase = database.books.filter(
        (book)=> book.ISBN!==req.params.isbn
   ) 
   database.books=updatedBookDatabase;
   return res.json({books:database.books})
});


/*
Route         /book/delete/author
Description    delete a author from book and viceversa
Access         PUBLIC
Parameter      isbn,authorId
Methods       DELETE


*/

booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
    //UPDATE BOOK DATABASE
    database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn){
    const newAuthorList=book.author.filter((eachAuthor)=>
        eachAuthor!==parseInt(req.params.authorId)
);
        book.author=newAuthorList;
        return;
}
}); 

//UPDATE THE AUTHOR DATABASE

    database.author.forEach((eachAuthor)=>{
    if(eachAuthor.id===parseInt(req.params.authorId)){
        const newBookList=eachAuthor.books.filter(
        (book)=> book!==req.params.isbn

        );
        eachAuthor.books=newBookList;
            return;
    }

})

    return res.json({
        book:database.books,
        author:database.author,
        message:"author was deleted!!!"
    })

});

booky.listen(3000,()=>{
    console.log("server is up an running");
});
