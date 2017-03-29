module.exports = {
  sendSMS: function(msg) {
    var URL = process.env.SMS + msg
    $.ajax({
      url: URL,
      cors: true,
      secure: true,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
      success: function(data) {
        console.log('success')
      },
      error: function(xhr, status, err) {
        console.log('SMS', status, err.toString());
      }
    });
  }
};
