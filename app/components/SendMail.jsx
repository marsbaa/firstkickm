

module.exports = {
  mail: function(to, subject, html) {
     $.get('/send', {to:to, subject:subject, html:html});
}
};
