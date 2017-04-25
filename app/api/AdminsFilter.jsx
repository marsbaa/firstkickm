module.exports = {
  filter: function (admins, searchText) {
    var filteredadmins = admins;


    //Filter by searchText
    filteredadmins = filteredadmins.filter((admin) => {
      var text = admin.name.toLowerCase();
      return searchText.length === 0 || text.indexOf(searchText) !== -1;
    });

    return filteredadmins;
  }
};
