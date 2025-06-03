
module.exports = (temp, product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
        output = output.replace(/{%IMAGE%}/g, product.image);
        output = output.replace(/{%PLACE%}/g, product.from);
        output = output.replace(/{%NUTRIENT%}/g, product.nutrients);
        output = output.replace(/{%QUANTITY%}/g, product.quantity);
        output = output.replace(/{%PRICE%}/g, product.price);
        output = output.replace(/{%DESCRIPTION%}/g, product.description);
        output = output.replace(/{%ID%}/g, product.id);
       
       if(!product.organic) output = output.replace(/{%NOTORGANIC%}/g, "not-organic");
       return output;
}