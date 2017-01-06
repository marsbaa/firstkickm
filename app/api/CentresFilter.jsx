module.exports = {
  filter: function (centres, searchText) {
    var filteredCentres = centres;

    //Filter by searchText
    filteredCentres = filteredCentres.filter((centre) => {
      var text = centre.name.toLowerCase();
      return searchText.length === 0 || text.indexOf(searchText) !== -1;
    });

    return filteredCentres;
  }
};
