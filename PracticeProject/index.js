const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./USER-DATA/modules/replaceTemplate');

const tempOverview =  fs.readFileSync(__dirname+'/USER-DATA/templates/overview.html','utf-8');
const tempCard =  fs.readFileSync(__dirname+'/USER-DATA/templates/card.html','utf-8');
const tempProduct =  fs.readFileSync(__dirname+'/USER-DATA/templates/product.html','utf-8');

const data =  fs.readFileSync(__dirname+'/USER-DATA/data.json','utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res)=>
{
    console.log(req.url);    

    const {query, pathname}= url.parse(req.url, true);   

    // Overview page
    if(pathname == "/" || pathname == "/overview")
    {
        res.writeHead(200,{'Content-type':'text/html'});

        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardHtml);        
        res.end(output);
    }
    // Product page
    else if(pathname == "/product")  
    {
        res.writeHead(200,{'Content-type':'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product); 
        res.end(output);
    }
    // API
    else if(pathname == '/api')
    {
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(data);
    }
    // Not found
    else               
    {       
        res.writeHead(404, {
            'Content-type':'text/html',
            'my-own-header':'hello-world'
        }); 
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(3000, "127.0.0.1", () => {
    console.log('Listening to requests on port 3000');
});