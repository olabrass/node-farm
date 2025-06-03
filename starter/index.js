// To import file module into node
const fs = require('fs');
// To import http module
const http = require('http');
// To import url module
const url = require('url');
// This is an imported module, files are treated as modules in node js
const replaceTemplate = require('../starter/modules/replaceTemplate');
// To import slugify dependency
const slugify =require('slugify');
const { dirname } = require('path');

// console.log(`Hello World`);

// console.log(`Let me hear you clearly`)

//////////////////////////////////////////////////////////////
//// FOR FILE

// Blocking Synchronous way of reading and writing file
// To read from a file
const fileReader = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(fileReader);

// To write into a file
const fileWritter = `This is what we know about Avocado ${fileReader} .\n Created on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', fileWritter);
// console.log('File Created Successfully, check the new file in the part you specified');


// Non-Blocking Asynchronous way of reading and writing file
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
    //console.log(data);
});

// console.log('This would be read first before the file finish reading in the background and excute the callback function');


//  Still on assynchronous way of reading data from file, where the result of a file depend on the other file
// one file reads for the other one to read, one step
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        // console.log(data2);
    });
});

// Reading data1, store data1 in data2, then read data3 and write data2 and data3 into final.txt
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if(err) return console.log('ERROR!');
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
            // console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2} \n ${data3}`, 'utf-8', err => {
                
                // console.log('Your data was written successfully');
            } )

        });
    });
});

// This is the top level code that reads the file once, the code that sends the data is written somewhere in this code
// Chech for the variable "productDataSync" to know the exact place the data was sent
// Note that this code does not block event loop, because it is a top level code, it exists before server starts
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const productDataSync = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(productDataSync);

// For slugify, to create slugs
// The "el" below can be anything holding the value
const slug = productData.map(el=>slugify(el.productName, {lower: true}) );
console.log(slug);

//////////////////////////////////////////////////////////////
//// FOR SERVER
const server = http.createServer((req, res) =>{ 
    // console.log(req.url);
    // console.log(url.parse(req.url, true));
    const{query, pathname} = (url.parse(req.url, true));
    
    if(pathname === '/' || pathname === '/overview'){
      res.writeHead(200, {'content-type': 'text/html'});
      const cardHtml = productData.map(el => replaceTemplate(tempCard, el)).join();
      const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
      res.end(output);
    }
    else if(pathname == "/path"){
        res.end(__dirname);
    }else if(pathname == '/api'){
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            const productData = JSON.parse(data);
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(data);
        });
        //   Compare with the API endpoint above, the code that reads the file has been copied to the top
        // therefore, it would be read one, and therefore send to user at anytime a user request for it
        // this will not block the I/O because it is going to be read at the begining ot the code before the server starts
    }else if(pathname === '/apisync'){
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(productDataSync);
        ;
    }
    else if(pathname === '/aboutus'){
  res.end("This is about us page");
        //console.log(req.url);
    } else if(pathname === '/products'){
        res.writeHead(200, {'content-type': 'text/html'});
        const product = productData[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
        //console.log(req.url);
    }else{
        res.writeHead('404', {
            "content-type": "text/html",
            'my-own-head': "Hello world"
        });
        res.end('<h1>ERROR! : 404, Page Not Found</h1>');
    };

});

server.listen(8000, '127.0.0.1', () =>{
console.log('Listening to request on port 8000');
});

