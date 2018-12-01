$(function() {

  $('button.getProductData').click(function(){
    $(this).addClass('loading')
    console.log('get product data 1');

    let getData = {
      product: $('input[name=productId]').val(),
      page: $('select[name=productPage]').val()
    }

    socket.post('/product/getProductData',getData,function(result){
      $('button.getProductData').removeClass('loading')
      console.log('getProductData result', result);
      if(result.status===200){
        $('.showProductData').removeClass('hidden')
        $('.productTitle').text(result.item.name)
        $('.productDescription').text(result.item.shortDescription)

        $.each(result.item.imageEntities,function(index,img){
          $('.loadProductImages').append(`
        <img style="max-width:100px;border:1px solid #ddd" class="itemThumbnail ui bordered" src="${img.largeImage}">`)
        })

        $('.productDetails').append(`
          <div class="ui segment itemBrand"><p><strong>Brand:</strong> <span>${result.item.brandName}</span></p></div>
          <div class="ui segment itemCategory"><p><strong>Category:</strong> <span>${result.item.categoryPath}</span></p></div>
          <div class="ui segment itemUpc"><p><strong>UPC:</strong> <span>${result.item.upc}</span></p></div>
          <div class="ui segment itemPrice"><p><strong>Price:</strong> <span>${result.item.salePrice}</span></p></div>
          <div class="ui segment itemStock"><p><strong>Stock:</strong> <span>${result.item.stock}</span></p></div>
          <div class="ui segment itemSize"><p><strong>Size:</strong> <span>${result.item.size.toString()}</span></p></div>
          <div class="ui segment itemColor"><p><strong>Color:</strong> <span>${result.item.color.toString()}</span></p></div>
        `)
      }
    })
    console.log('getData', getData);
  })


  $('button.quickAddProduct').click(function(){
    $(this).addClass('loading')
    let imageArr = [];
    $('.loadProductImages img').each(function(){
      let image = $(this).attr('src')
      imageArr.push({src:image})
    })
    let postData = {
      title : $('.productTitle').text(),
      description : $('.productDescription').text(),
      brand : $('.productDetails .itemBrand span').text(),
      category : $('.productDetails .itemCategory span').text(),
      upc : $('.productDetails .itemUpc span').text(),
      price : $('.productDetails .itemPrice span').text(),
      stock : $('.productDetails .itemStock span').text(),
      images: imageArr,
      size : $('.productDetails .itemSize span').text().split(','),
      color : $('.productDetails .itemColor span').text().split(','),
      productid: $('input[name=productId]').val()
    }
    if($('.productDetails .itemSize span').text().length === 0) {
      postData.size = []
    }
    if($('.productDetails .itemColor span').text().length === 0) {
      postData.color = []
    }
    socket.post('/product/quickAddProduct',postData,function(result){
      $('button.quickAddProduct').removeClass('loading')
      if(result.error){
        noty({
          text: 'this product is not available, can not add to system',
          type: 'error',
        });
        return false;
      }
      noty({
        text: 'Add product successful',
        type: 'success',
      });
      $('.showProductData').addClass('hidden')
    })
  })

  //pick all product
  $('input.choose-all-product').on('click',function(){
    if(this.checked) {
      console.log('select all')

      $('input.choose-product-id:checkbox').each(function(){
        $(this).parents('tr.tr-product').addClass('product-picked');
        this.checked = true
      })
    } else {
      console.log('select none')

      $('input.choose-product-id:checkbox').each(function(){
        $(this).parents('tr.tr-product').removeClass('product-picked');
        this.checked = false
      })
    }
    let countChecked = $('input.choose-product-id:checked').length;
    console.log('countChecked', countChecked);
    $('button.count-pickup span.update-val').text(countChecked);
    if(countChecked < 1) {$('.show-count-pickup').fadeOut('slow')}
    else {$('.show-count-pickup').fadeIn('slow') }
  });

  //pick up - 1 product
  $('input.choose-product-id').on('click',function(){
    let checked = parseInt($('button.count-pickup span.update-val').text());
    if (this.checked) {
      $('button.count-pickup span.update-val').text(checked+1)
      $(this).parents('tr.tr-product').addClass('product-picked');
    } else {
      $(this).parents('tr.tr-product').removeClass('product-picked');
      $('button.count-pickup span.update-val').text(checked-1)
    }
    let countChecked = $('input.choose-product-id:checked').length;
    console.log('countChecked', countChecked);
    if(countChecked < 1) {$('.show-count-pickup').fadeOut('slow');}
    else {$('.show-count-pickup').fadeIn('slow') }
  });


  //SYNC PRODUCT
  $('div.sync-product').click(function(){
    let type = $(this).attr('data-text');
    let countPushed;
    let countSync;

    let selectedProducts = $('tr.product-picked').map(function() {
      let checkImg = $(this).find('td.product-image img').attr('src').length;
      let checkGtin = $(this).find('td.product-gtin').text().length;
      let checkStore = $(this).find('td.product-store').text().length;
      let checkStatus = $(this).find('td.product-status').text();
      if(checkStore === 0 && checkGtin > 0 && checkImg > 0 && checkStatus !== 'Disabled'){
        return $(this).find('input.choose-product-id').data('product-id');
      }
    }).get();

    countSync = selectedProducts.length;
    console.log('sync product',{countSync,selectedProducts});
  })
});
