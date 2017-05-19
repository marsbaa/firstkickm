module.exports = {
  filter: function (admins, searchText) {

    //Filter by searchText
    var filteredadmins = []
    Object.keys(admins).map((adminId) => {
      var text =admins[adminId].name.toLowerCase();
      if (searchText.length === 0 || text.indexOf(searchText) !== -1) {
        filteredadmins.push(admins[adminId])
      }
    });

    return filteredadmins;
  }
};
