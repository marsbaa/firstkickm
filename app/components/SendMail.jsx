module.exports = {
  mail: function(to, subject, html) {
    console.log(to)
    console.log(subject)
    console.log(html)
    $.ajax({
      url: '/send',
      type: 'POST',
      data: {
        to,
        subject,
        html
      },
      success: function(data) {
        console.log('success')
      },
      error: function(xhr, status, err) {
        console.log('/send', status, err.toString());
      }
    });
  }
};
