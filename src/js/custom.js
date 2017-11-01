$(function() {

function nextproperty(Nid) {
  $.getJSON("/js/properties.json", function(result){
    var alldata = result;
    $("#ptitle").html(result[Nid].title);
    $("#psubtitle").html(result[Nid].title+','+ result[Nid].location);
    $("#pdesc").html(result[Nid].description);
    // Configure/customize these variables.
    var showChar = 250;  // How many characters are shown by default
    var ellipsestext = "...";
    var moretext = "&darr; Read more";
    var lesstext = "&uarr; Show less";
    $('.more').each(function() {
        var content = $(this).html();
        if(content.length > showChar) {

            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);

            var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

            $(this).html(html);
        }
    });
    $("#pbed").html(result[Nid].bedrooms);
    $("#pbath").html(result[Nid].bathrooms);
    $("#pprice").html(result[Nid].price);
    $("#brokername").html(result[Nid].broker.name);
    $('#brokerPhoto').attr('src', 'https://images.realforce.ch/static/images/websites/'+result[Nid].broker.photo);
    $('#mailto').attr('href', 'mailto:'+result[Nid].broker.emails);
    $('#callto').attr('href', 'tel:'+result[Nid].broker.phones);
    $("#silderContent").html('');
    $("#lightboxlarge").html("");
    $("#lightboxSmall").html("");
      $.each(result[Nid].photos, function(i, field){
        if(i == 0) {
          $("#silderContent").append('<div class="carousel-item active"><a href="'+field.url+'" data-toggle="lightbox"><img class="img-fluid" src="'+field.url+'" alt="" style="max-height:35.57291666666667vw"></a></div>');
        }else{
          $("#silderContent").append('<div class="carousel-item"><a href="'+field.url+'" data-toggle="lightbox"><img class="img-fluid" src="'+field.url+'" alt="" style="max-height:35.57291666666667vw"></a></div>');
        }
        addcontentlight (i, field.url);
      });
      similarContent (alldata,Nid);
      $(".morelink").click(function(){
          if($(this).hasClass("less")) {
              $(this).removeClass("less");
              $(this).html(moretext);
          } else {
              $(this).addClass("less");
              $(this).html(lesstext);
          }
          $(this).parent().prev().toggle();
          $(this).prev().toggle();
          return false;
      });
  });
}

function similarContent (alldata, Nid) {
  $('.similar').html("");
  $content = "";
  $firstcount = 0;
  $singlerow = 1;
  $.each(alldata, function(j, value){

      if(value.photos[0])
      {
        var photURL =   value.photos[0].url;
      } else {
        var photURL = "/assets/similar.jpg";
      }
      if(j != Nid){
        $content += '<div class="col-md-4"><div class="card"><img class="card-img-top" src="'+photURL+'" alt="Card image cap"><div class="card-block"><a href="#" data-id="'+j+'" class="nextProperty"><h4 class="card-title">'+value.title+'</h4></a><p class="card-text">TYP <span>'+value.main_category+'</span></p><p class="card-text2">Apartment <span>'+value.habitable+'</span></p></div></div></div>';
        $singlerow++;
      }

      if(j != Nid && $singlerow > 3) {
          if($firstcount == 0){
            $('.similar').append('<div class="row row-equal carousel-item active m-t-0">'+$content+'</div>');
            $content = "";
            $firstcount = 1;
            $singlerow = 1;
          }else {
            $('.similar').append('<div class="row row-equal carousel-item m-t-0">'+$content+'</div>');
            $content = "";
            $singlerow = 1;
          }

      }
  });
}
function addcontentlight (counter, url) {

if(counter < 2){
    $("#lightboxlarge").append('<div class="col-lg-6"><a href="'+url+'" data-toggle="lightbox"><img src="'+url+'" class="img-fluid"></a></div>');
  }else {
    $("#lightboxSmall").append('<div class="col-lg-3"><a href="'+url+'" data-toggle="lightbox"><img src="'+url+'" class="img-fluid"></a></div>');
  }
}


  $(document).on('click', '[data-toggle="lightbox"]', function(event) {
                  event.preventDefault();
                  $(this).ekkoLightbox();
              });
  $(document).on('click', '.nextProperty', function(event) {
                  event.preventDefault();
                  nextproperty($(this).attr('data-id'));
                  $(document).scrollTop(0);
              });
  // manual carousel controls
    $('.next').click(function(){ $('.carousel').carousel('next');return false; });
    $('.prev').click(function(){ $('.carousel').carousel('prev');return false; });

    var init = 0;
    nextproperty(init);

  });
