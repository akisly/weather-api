$(function () {
  $("#weather-form").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/weather',
      data: {
        city: $("#city").val()
      },
      dataType: "JSON",
      success: function (weather) {
        let html = '';
        let tabs_caption = '';
        if (weather.cod) {
          html += `Error ${weather.cod}, ${weather.message}`;
        } else {
          html += `<div class="tabs">`;
          tabs_caption += `<ul class="tabs__caption">`;

          for (let i = 0; i < weather.length; i++) {
            let tabs__content = '';
            if (i === 0) {
              tabs_caption += `<li class="active">${weather[i].day_txt}</li>`;
              tabs__content += `<div class="tabs__content active">`;
            } else {
              tabs_caption += `<li>${weather[i].day_txt}</li>`;
              tabs__content += `<div class="tabs__content">`;
            }
            for (let j = 0; j < weather[i].data.length; j++) {
              tabs__content +=
                `<div class="weather-cart">
                <img src="http://openweathermap.org/img/wn/${weather[i].data[j].icon}@2x.png" alt="">
                <p>${weather[i].data[j].day_number}, ${weather[i].data[j].time}</p>
                <p>${weather[i].data[j].temp}&deg;</p>
            </div>`;
            }
            tabs__content += `</div>`;
            html += tabs__content;
          }
          tabs_caption += `</ul>`;
          html += `</div>`;
        }
        $('#weather-block').html(html);
        $('#weather-block .tabs__content.active').before(tabs_caption);
      }
    });
  });

  $(document).on('click', 'ul.tabs__caption li:not(.active)', function () {
    $(this)
      .addClass('active').siblings().removeClass('active')
      .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
  });
});
