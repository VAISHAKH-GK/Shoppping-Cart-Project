function addToCart(proId){
    $.ajax({
        url:"/addtocart?id="+proId,
        method:'get',
        success:(responce )=>{
            if(responce.status){
                let count = $('#cartNum').html()
                count = parseInt(count)+1;
                alert("Added To Cart");
                $('#cartNum').html(count);
            }
            
        }
    });

}